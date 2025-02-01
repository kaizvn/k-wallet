import { Router } from 'express';
import jwtBlacklist from 'express-jwt-blacklist';
import passport from 'passport';
import i18n from 'i18n';
import { SYS_ADMIN } from '../graphql/enums/userRoles.js';
import {
  SystemUsers,
  EMAIL,
  SMS,
  Users,
  Transactions,
  PartnerUsers,
  Partners,
  Coins
} from '../services';
import { getCryptoLibExistsByCoinId } from '../services/cryptoLibs';
import { U_ACTIVE, U_PENDING, U_BANNED } from '../graphql/enums/userStatus';
import { TRANSACTION_FINISHED } from '../graphql/enums/transactionStatus';
import {
  TYPE_TX_DEPOSIT,
  TYPE_TX_WITHDRAW
} from '../graphql/enums/transactionType';
import { saveSession } from '../middlewares/session';
import auth from '../authentications';
import { findUser } from '../utils';
import { restApisHandler } from './rest.handlers';

import { getBillTemplate } from '../bill-templates';
import pdf from 'html-pdf';

const env = process.env.NODE_ENV || 'development';
const { CLIENT_SERVER_URL, TOP_SECRET_KEY } = process.env;

const router = Router();

router.post('/partner-signin', async (req, res) => {
  const { origin } = req.headers;
  const { username, password } = req.body;
  const user = await PartnerUsers.findOne({ username });

  if (!user) {
    return res.status(401).json({
      success: false,
      msg: i18n.__('partnerUser.query.error.incorrect.login')
    });
  }

  const { setting = { callback_url: '' } } = await Partners.findOne({
    id: user.partner_id
  });

  if (setting.callback_url.indexOf(origin) < 0) {
    return res.status(403).json({
      success: false,
      msg: i18n.__('partnerUser.query.error.permission')
    });
  }

  switch (user.status) {
    case U_BANNED:
      return res.status(401).json({
        success: false,
        msg: i18n.__('partnerUser.query.error.action.banned')
      });

    case U_PENDING:
      return res.status(401).json({
        success: false,
        msg: i18n.__('partnerUser.query.error.action.pending_approval')
      });

    case U_ACTIVE:
      if (await user.comparePassword(password)) {
        const jwt = auth.sign(user);
        saveSession(req.session, jwt);

        return res.status(200).json({
          success: true,
          token: 'bearer ' + jwt
        });
      }
      break;

    default:
      break;
  }

  return res.status(401).json({
    success: false,
    msg: i18n.__('partnerUser.query.error.incorrect.login')
  });
});

router.post('/api/:type/:action', (req, res, next) => {
  try {
    restApisHandler({ req, res, next });
  } catch (error) {
    next(error);
  }
});

const htmlPopUp = ({ status, data, referer }) => {
  return `<html>
      <body onload="closePopup()">
      <script>
      function closePopup()
        {
            let status = "${status}"
            let payload = "${data}";

            window.opener.postMessage({status, payload}, '${referer}');
            window.close();
        }
      </script>
      </body>
      </html>`;
};

const htmlPopUpLoginFail = () => `<html>
  <body onload="closePopup()">
  <script>
  function closePopup()
    {
        window.close();
    }
  </script>
  </body>
  </html>`;

const callbackPassportForLoginSocial = async (req, res, referer) => {
  let currentUser = req.user;

  if (currentUser.email.length < 1) {
    const msgError = i18n.__(
      'routers.apis.callback_passport_login_social.not_setting_email'
    );
    res.send(htmlPopUp({ status: 'fail', data: msgError, referer }));
    return;
  }

  let user = await findUser({
    email: currentUser.email
  });

  if (user) {
    const jwt = auth.sign(user);
    const token = 'bearer ' + jwt;

    saveSession(req.session, jwt);
    res.send(htmlPopUp({ status: 'success', data: token, referer }));
  } else {
    const msgError = i18n.__(
      'routers.apis.callback_passport_login_social.email_not_exists'
    );
    res.send(htmlPopUp({ status: 'fail', data: msgError, referer }));
  }
};

router.get('/login-fail', (req, res) => {
  res.send(htmlPopUpLoginFail());
});

router.get(
  '/client/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/client/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login-fail'
  }),
  (req, res) => {
    const referer = `${CLIENT_SERVER_URL}/login`;
    callbackPassportForLoginSocial(req, res, referer);
  }
);

router.get(
  '/client/auth/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);

router.get(
  '/client/auth/facebook/callback',
  passport.authenticate('facebook', {
    failureRedirect: '/login-fail'
  }),
  (req, res) => {
    const referer = `${CLIENT_SERVER_URL}/login`;
    callbackPassportForLoginSocial(req, res, referer);
  }
);

router.post('/diro_callback', async (req, res, next) => {
  try {
    //"bearer "  length = 7
    const payload = req.body;

    // TODO: remove when find a way to final verify by diro
    // if (!payload.kycstatus) {
    //   return res.json({
    //     firstName: payload.first_name,
    //     mobile: payload.mobile,
    //     status: payload.kycstatus,
    //     message: payload.message
    //   });
    // }

    if (payload.filestatus === 'rejected') {
      // send email
      return res.json({
        status: false
      });
    }

    const user = await Users.findOne({
      phone: payload.mobile,
      mcc_code: payload.mcc,
      status: U_PENDING
    });

    if (user) {
      user.status = U_ACTIVE;
      await user.save();

      const html_content = EMAIL.ReplaceParamsMailContent(
        EMAIL.VerifiedTemplate,
        user
      );

      const mail = {
        to: user.email,
        subject: i18n.__('routers.apis.diro_callback.subject'),
        html: html_content,
        from: 'info@revpayment.io'
      };

      EMAIL.Transporter.sendMail(mail);

      SMS.SendSMS({
        body: EMAIL.ReplaceParamsMailContent(SMS.VerifiedTemplate, user),
        to: payload.mcc + payload.mobile
      });
    }

    return res.json(
      Object.assign(
        {
          status: payload.kycstatus === 'verified' || !!user
        },
        payload
      )
    );
  } catch (error) {
    next(error);
  }
});

router.use('/signout', async (req, res, next) => {
  try {
    jwtBlacklist.revoke(req.user);
    if (req.session.key) {
      await req.session.destroy();
    }

    return res.json({
      success: true,
      message: i18n.__('routers.apis.signout.message')
    });
  } catch (error) {
    next(error);
  }
});

router.post('/refresh_token', async (req, res, next) => {
  try {
    //"bearer "  length = 7
    const currentToken = (req.headers.authorization || '').substr(7);
    const payload = await auth.verify(currentToken, {
      ignoreExpiration: true
    });

    const newToken = await auth.refresh(payload);

    if (!currentToken || !payload || !newToken) {
      return res.json({
        success: false,
        message: i18n.__('routers.apis.refresh_token.message')
      });
    }

    jwtBlacklist.revoke(payload);

    saveSession(req.session, newToken);

    return res.json({ success: true, token: 'bearer ' + newToken });
  } catch (error) {
    next(error);
  }
});

if (env === 'development') {
  router.get('/admin_token', async (req, res, next) => {
    try {
      //TODO : generate truly mock data for admin
      let admin = await SystemUsers.findOne({
        username: 'admin'
      });

      if (!admin) {
        const admin = new SystemUsers({
          id: 123456789,
          password: '12345678',
          username: 'admin',
          first_name: 'Admin',
          last_name: 'Account',
          email: 'admin@revpayment.io',
          role: SYS_ADMIN,
          status: 1
        });

        await admin.save();
      }

      const expiresIn = 60 * 60 * 24 * 365; // 1 year
      const token = await auth.sign(admin, { expiresIn });
      return res.json({ success: true, token: 'bearer ' + token });
    } catch (error) {
      next(error);
    }
  });
}

router.get('/generate-bill/:language/:idTrans', async (req, res) => {
  const options = {
    type: 'pdf',
    height: '7.5in',
    width: '5in'
  };

  const { idTrans, language } = req.params;
  const transaction = await Transactions.findOne({ id: idTrans });

  if (transaction && transaction.status === TRANSACTION_FINISHED) {
    const coin = await Coins.findOne({ id: transaction.coin_id });
    const cryptoLib = getCryptoLibExistsByCoinId(coin.id);

    const amountLargestUnit = cryptoLib.fromSmallestToLargestUnit(
      transaction.amount
    );
    const feeLargestUnit = cryptoLib.fromSmallestToLargestUnit(transaction.fee);

    const billData = {
      type: transaction.type,
      coin: coin.symbol,
      hash: transaction.hash,
      amount: amountLargestUnit,
      fee: feeLargestUnit,
      paymentDate: new Date(transaction.created_at).toUTCString()
    };

    if (transaction.type === TYPE_TX_DEPOSIT) {
      billData.receiver = transaction.received_address;
      billData.actualAmount = amountLargestUnit - feeLargestUnit;
    } else if (transaction.type === TYPE_TX_WITHDRAW) {
      billData.receiver = transaction.to_wallet_owner_id;
      billData.actualAmount = amountLargestUnit + feeLargestUnit;
    }

    pdf
      .create(getBillTemplate(language, billData), options)
      .toStream((err, stream) => {
        if (err) res.status(200).send(err);
        stream.pipe(res);
      });
  } else {
    res.sendStatus(404);
  }
});

router.post('/manual-transfer/:key/:coinId', async (req, res) => {
  const data = req.body;
  const { key, coinId } = req.params;

  if (!key || !TOP_SECRET_KEY || key !== TOP_SECRET_KEY) {
    res.send({ status: 'ok' });
  }

  const cryptoLib = getCryptoLibExistsByCoinId(coinId);
  /*
  {
    fromAddress: depositAddressInfo.depositAddress,
    toAddress: depositAddressInfo.destination,
    amount: depositInfo.value,
    privateKey: depositAddressInfo.privateKey
  }*/
  const newTx = await cryptoLib.createNewTx(data);

  res.send({ newTx });
});
export default router;

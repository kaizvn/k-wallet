import { getTransactionQuery, loginQuery } from './queries';
import { graphQLClientCreator, makeGqlRequest } from './request';

const loginVariables = {
  username: 'lamcv',
  password: '123456'
};

const transactionVariables = {
  id: '7829d254-6dd3-46ed-88b7-b1e3d10a20dd'
};

const doLogin = async () =>
  makeGqlRequest({
    query: loginQuery,
    variables: loginVariables
  });

const doGetTransactionDetails = () =>
  makeGqlRequest({
    query: getTransactionQuery,
    variables: transactionVariables
  });

const sampleCallRevPaymentAPI = async () => {
  try {
    const user = await doLogin();
    console.log('user', user);
    if (user.login_partner_user.token) {
      graphQLClientCreator({ token: user.login_partner_user.token });
      const transaction = await doGetTransactionDetails();
      console.log('trans', transaction);
    }
  } catch (err) {
    throw err;
  }
};

sampleCallRevPaymentAPI().catch(error => console.error(error));

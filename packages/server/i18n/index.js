import i18n from 'i18n';
import { Router } from 'express';

const router = Router();

router.use((req, res, next) => {
  i18n.configure({
    locales: ['en', 'jp'],
    directory: __dirname + '/locales',
    objectNotation: true,
    logWarnFn: function(msg) {
      console.log('warn', msg);
    }
  });
  i18n.setLocale(req.headers['accept-language'] || 'en');
  next();
});

module.exports = router;

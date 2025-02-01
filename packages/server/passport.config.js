import passport from 'passport';
import passportFacebookOauth from 'passport-facebook';
import passportGoogleOauth from 'passport-google-oauth';
import i18n from 'i18n';

const GoogleStrategy = passportGoogleOauth.OAuth2Strategy;
const FacbookStrategy = passportFacebookOauth.Strategy;

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  FACEBOOK_CLIENT_ID,
  FACEBOOK_CLIENT_SECRET,
  DOMAIN_NAME
} = process.env;

const defaultCallbackURL = {
  Google: `${DOMAIN_NAME}/client/auth/google/callback`,
  Facebook: `${DOMAIN_NAME}/client/auth/facebook/callback`
};

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
});

const createGoogleStrategy = callbackUrl =>
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: callbackUrl || defaultCallbackURL.Google
    },
    (accessToken, refreshToken, profile, done) => {
      if (!profile)
        return done(null, { error: i18n.__('passport.not_found.google_user') });

      const user = {
        family_name: profile.name.familyName,
        given_name: profile.name.givenName,
        email: profile.emails ? profile.emails[0].value : '',
        access_token: accessToken
      };

      done(null, user);
    }
  );

const createFacebookStrategy = callbackURL =>
  new FacbookStrategy(
    {
      clientID: FACEBOOK_CLIENT_ID,
      clientSecret: FACEBOOK_CLIENT_SECRET,
      callbackURL: callbackURL || defaultCallbackURL.Facebook,
      profileFields: ['id', 'emails', 'name']
    },
    (accessToken, refreshToken, profile, done) => {
      if (!profile)
        return done(null, {
          error: i18n.__('passport.not_found.facebook_user')
        });

      const user = {
        family_name: profile.name.familyName,
        given_name: profile.name.givenName,
        email: profile.emails ? profile.emails[0].value : '',
        access_token: accessToken
      };
      done(null, user);
    }
  );

passport.use(createGoogleStrategy());

passport.use(createFacebookStrategy());

module.exports = passport;

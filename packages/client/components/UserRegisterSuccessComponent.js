import React from 'react';
import { withTranslation } from '@revtech/rev-shared/i18n';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const UserRegisterSuccessComponent = ({ t }) => (
  <div className="container-register-success">
    <div className="col-lg-12 centering">
      <div className="card-block col-lg-6 shadow text-center ">
        <img src="static/kosmo/coin/eth.png" alt="Logo" width="50%" />
        <h2>
          <span>{t('register_success.title')} </span>
          <span className="ks-icon text-success">
            <FontAwesomeIcon icon={['fa', 'check-circle']} />
          </span>
        </h2>
        <div className="title">
          <div>{t('register_success.label.send_confirmation')} </div>
          <div>
            {t('register_success.label.back_to_home')}{' '}
            <a href="/">{t('register_success.label.click_here')}</a>
          </div>
        </div>
      </div>
    </div>
    <style jsx>{`
      .text-success {
        display: inline-block;
        width: 24px;
        height: 24px;
      }
      .title {
        font-size: 20px;
      }
      .centering {
        display: flex;
        justify-content: center;
        padding-top: 30px;
      }
      .shadow {
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05),
          0 6px 6px rgba(0, 0, 0, 0.05);
      }
      .container-register-success {
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
        margin-right: auto;
        margin-left: auto;
      }
      img {
        margin-left: -15%;
      }
    `}</style>
  </div>
);

export default withTranslation('login-register')(UserRegisterSuccessComponent);

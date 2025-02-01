import { withState, compose } from 'recompose';
import React from 'react';

import Button from '../layouts/Button';
import InputText from '../layouts/InputText';
import { withTranslation } from '@revtech/rev-shared/i18n';

const withEmailState = withState('email', 'changeEmail', '');

const enhance = compose(withTranslation('react-table'), withEmailState);

const InviteComponent = ({ title, onClick, email, changeEmail, t }) => (
  <React.Fragment>
    <span className="ks-text">{title}</span>
    <span className="flex-grow" />
    <InputText customClass="col-lg-3" onChange={changeEmail} />
    <Button onClick={() => onClick(email)}>{t('invite')}</Button>
    <style jsx>{`
      .flex-grow {
        flex-grow: 1;
      }
    `}</style>
  </React.Fragment>
);

export default enhance(InviteComponent);

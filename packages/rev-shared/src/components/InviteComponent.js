import { Button } from '../../layouts';
import React from 'react';
import { withState, compose } from 'recompose';
import { withTranslation } from '../i18n';
import { doFunctionWithEnter } from '../utils';
import { makeStyles, InputBase, Divider, Grid } from '@material-ui/core';

const withEmailState = withState('email', 'setInvitedEmail', '');
const enhance = compose(withEmailState, withTranslation('common'));

const useStyles = makeStyles(theme => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 400,
    boxShadow: '0 2px 6px rgba(28, 35, 43, 0.23)'
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1
  },
  divider: {
    height: 28,
    margin: 4
  }
}));

function InviteComponent({ onClick, email, setInvitedEmail, t }) {
  const classes = useStyles();

  return (
    <Grid className={classes.root}>
      <InputBase
        onKeyPress={event => doFunctionWithEnter(event, () => onClick(email))}
        onChange={event => setInvitedEmail(event.target.value)}
        className={classes.input}
      />
      <Divider className={classes.divider} orientation="vertical" />
      <Button onClick={() => onClick(email)}>
        {t('rev_shared.button.invite')}
      </Button>
    </Grid>
  );
}
export default enhance(InviteComponent);

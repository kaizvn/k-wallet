import React from 'react';
import { withTranslation } from '../../i18n';

import ReactPasswordStrengthComponent from '../ReactPasswordStrengthComponent';
import { Grid, makeStyles } from '@material-ui/core';
const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    flexGrow: 1
  }
}));
const RenderPasswordFieldComponent = ({ meta, input: { onChange }, t }) => {
  const classes = useStyles();
  return (
    <Grid className={classes.root} item sm={6} xs={12}>
      <Grid container alignItems="center">
        <ReactPasswordStrengthComponent
          minLength={8}
          inputProps={{
            placeholder: t('rev_shared.placeholder.password'),
            autoComplete: 'new-password'
          }}
          changeCallback={e => {
            onChange(e.password);
          }}
        />
        {meta.touched && meta.error && (
          <span style={{ color: 'red' }}>{meta.error}</span>
        )}
      </Grid>
    </Grid>
  );
};
export default withTranslation('common')(RenderPasswordFieldComponent);

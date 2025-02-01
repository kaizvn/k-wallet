import React from 'react';
import Switch from 'react-switch';
import { withTranslation } from '../../i18n';
import { Typography, Grid, makeStyles } from '@material-ui/core';
const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    flexGrow: 1
  },
  switch: {
    marginLeft: theme.spacing(1),
    marginTop: 4
  }
}));
const RenderSwitchFieldComponent = ({
  meta,
  input: { value, onChange },
  t,
  label,
  col = 4
}) => {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Grid item sm={col} xs={12} className={classes.root}>
        <Typography variant="subtitle2" style={{ fontWeight: 'bold' }}>
          {label || t('rev_shared.label.service_status')}
        </Typography>
        <Grid className={classes.switch}>
          <Switch onChange={onChange} checked={value || false} />
          {meta.touched && meta.error && (
            <span style={{ color: 'red' }}>{meta.error}</span>
          )}
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default withTranslation('common')(RenderSwitchFieldComponent);

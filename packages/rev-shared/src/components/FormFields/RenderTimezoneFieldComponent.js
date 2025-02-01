import React from 'react';
import { withTranslation } from '../../i18n';
import TimezonePickerComponent from '../../components/TimezonePickerComponent';
import { Grid, makeStyles } from '@material-ui/core';
const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    flexGrow: 1
  }
}));
const RenderTimezoneFieldComponent = timezone => {
  const classes = useStyles();
  return (
    <Grid className={classes.root}>
      <label>{timezone.t('rev_shared.label.time_zone')}</label>
      <Grid item sm={12}>
        <div>
          <TimezonePickerComponent
            value={timezone.input.value}
            onChange={timezone.input.onChange}
            label={timezone.t('rev_shared.label.select_timezone')}
          />
          {timezone.meta.touched && timezone.meta.error && (
            <span style={{ color: 'red' }}>{timezone.meta.error}</span>
          )}
        </div>
      </Grid>
    </Grid>
  );
};
export default withTranslation('common')(RenderTimezoneFieldComponent);

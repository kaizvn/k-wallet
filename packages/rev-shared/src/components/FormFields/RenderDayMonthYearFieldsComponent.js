import { Days, Months, Years } from '@revtech/rev-shared/utils';
import React from 'react';
import { withTranslation } from '../../i18n';
import { Grid, TextField, MenuItem, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    flexGrow: 1
  },
  label: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  }
}));
const RenderDayMonthYearFieldsComponent = ({
  year = {},
  month = {},
  day = {},
  t
}) => {
  const classes = useStyles();
  const { input: inputYear, meta: metaYear } = year || {};
  const { input: inputMonth, meta: metaMonth } = month || {};
  const { input: inputDay, meta: metaDay } = day || {};
  return (
    <Grid container>
      <label className={classes.label}>
        {t('rev_shared.label.birth_date')}
      </label>
      <Grid container>
        <Grid item sm={4} xs={12} className={classes.root}>
          <TextField
            SelectProps={{
              displayEmpty: true
            }}
            fullWidth
            margin="dense"
            select
            helperText={metaYear.touched && metaYear.error && metaYear.error}
            variant="outlined"
            error={metaYear.touched && (metaYear.error ? true : false)}
            {...inputYear}
          >
            <MenuItem key={''} value={''}>
              --YYYY--
            </MenuItem>
            {Years().map(item => (
              <MenuItem key={item.value} value={item.value}>
                {item.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item sm={4} xs={12} className={classes.root}>
          <TextField
            SelectProps={{
              displayEmpty: true
            }}
            fullWidth
            margin="dense"
            select
            helperText={metaMonth.touched && metaMonth.error && metaMonth.error}
            variant="outlined"
            error={metaMonth.touched && (metaMonth.error ? true : false)}
            {...inputMonth}
          >
            <MenuItem key={''} value={''}>
              --MM--
            </MenuItem>
            {Months().map(item => (
              <MenuItem key={item.value} value={item.value}>
                {item.name < 10 ? `0${item.name}` : item.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item sm={4} xs={12} className={classes.root}>
          <TextField
            SelectProps={{
              displayEmpty: true
            }}
            fullWidth
            margin="dense"
            select
            helperText={metaDay.touched && metaDay.error && metaDay.error}
            variant="outlined"
            error={metaDay.touched && (metaDay.error ? true : false)}
            {...inputDay}
          >
            <MenuItem key={''} value={''}>
              --DD--
            </MenuItem>
            {Days(inputMonth.value, inputYear.value).map(item => (
              <MenuItem key={item.value} value={item.value}>
                {item.name < 10 ? `0${item.name}` : item.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default withTranslation('common')(RenderDayMonthYearFieldsComponent);

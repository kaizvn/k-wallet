import { CountryRegionData } from 'react-country-region-selector';
import React from 'react';
import { withTranslation } from '../i18n';
import { Grid, makeStyles, TextField, MenuItem } from '@material-ui/core';
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
const CountrySelectorComponent = ({ country, region, label, t }) => {
  const classes = useStyles();
  const getRegions = countryName => {
    const regions =
      CountryRegionData.find(country => country[0] === countryName) || [];
    if (regions.length === 0) {
      return [];
    }
    return regions[2]
      ? regions[2].split('|').map(regionPair => {
          let [regionName] = regionPair.split('~');
          return regionName;
        })
      : [];
  };

  const regionsData = getRegions(country.input.value) || [];

  return (
    <Grid container>
      {label && <label className={classes.label}>{label}</label>}
      <Grid container>
        <Grid item sm={6} xs={12} className={classes.root}>
          <TextField
            fullWidth
            variant="outlined"
            margin="dense"
            id="country"
            label={t('rev_shared.label.select_country')}
            select
            helperText={
              country.meta.touched && country.meta.error && country.meta.error
            }
            error={country.meta.touched && country.meta.error ? true : false}
            {...country.input}
          >
            {CountryRegionData.map(option => (
              <MenuItem key={option[0]} value={option[0]}>
                {option[0]}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item sm={6} xs={12} className={classes.root}>
          <TextField
            disabled={!!country.input.value ? false : true}
            fullWidth
            variant="outlined"
            margin="dense"
            id="region"
            select
            helperText={
              region.meta.touched && region.meta.error && region.meta.error
            }
            error={region.meta.touched && region.meta.error ? true : false}
            {...region.input}
            value={
              regionsData.includes(region.input.value) ? region.input.value : ''
            }
          >
            {regionsData.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default withTranslation('common')(CountrySelectorComponent);

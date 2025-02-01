import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { get } from 'lodash/fp';
import SelectLayout from '../../layouts/SelectLayout';
import { i18n } from '@revtech/rev-shared/i18n';
import { parseBoolean } from '@revtech/rev-shared/utils';
import { AvatarComponent } from '@revtech/rev-shared/components';
import { getLanguage, saveLanguage } from '@revtech/rev-shared/libs';
import { CHANGE_LANGUAGE } from '@revtech/rev-shared/apis/names';
import { makeStyles, Grid, FormLabel } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  selectLayout: {
    border: 'none',
    background: '#ebebeb',
    outline: 'none',
    borderRadius: 5,
    '&:hover': {
      border: 'none'
    }
  },
  langLabel: {
    paddingLeft: theme.spacing(1),
    color: '#000',
    [theme.breakpoints.down('xs')]: {
      display: 'none'
    }
  },
  appBarGroupRight: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      margin: 'auto'
    }
  },
  iconShadow: {
    boxShadow: '0 2px 4px 0 rgba(0,0,0,0.2)'
  }
}));

const connectToRedux = connect(
  createStructuredSelector({
    availableLanguages: get('availableLanguages'),
    currentLanguage: get('currentLanguage')
  }),
  dispatch => ({
    onChangeLanguage: ({ id, symbol }) =>
      dispatch({
        type: CHANGE_LANGUAGE,
        payload: {
          id: id,
          symbol: symbol
        }
      })
  })
);
const enhance = compose(connectToRedux);

const LanguageSelectListComponent = ({ classes, lang }) => (
  <Grid className={classes.appBarGroupRight}>
    <AvatarComponent
      url={`/static/images/lan_${lang.symbol}.png`}
      className={classes.iconShadow}
      small
    />
    <FormLabel className={classes.langLabel} component="span">
      {lang.label}
    </FormLabel>
  </Grid>
);

const LanguageSelectComponent = ({
  handleClose,
  availableLanguages,
  onChangeLanguage,
  currentLanguage = {}
}) => {
  const classes = useStyles();
  const [isMounted, setIsMounted] = useState(false);
  const [arraySelectLanguage, setArraySelectLanguage] = useState([]);

  useEffect(() => {
    if (!isMounted) {
      const formatSelectLanguage = availableLanguages => {
        return availableLanguages.map(lang => ({
          value: lang.symbol,
          label: <LanguageSelectListComponent classes={classes} lang={lang} />
        }));
      };

      const currentClientSymbol = parseBoolean(getLanguage())
        ? getLanguage()
        : i18n.options.defaultLanguage;
      const currentClientLanguage =
        availableLanguages.find(lang => lang.symbol === currentClientSymbol) ||
        availableLanguages[0];
      onChangeLanguage({ id: currentClientLanguage.id });
      i18n.changeLanguage(currentClientLanguage.symbol);
      setArraySelectLanguage(formatSelectLanguage(availableLanguages));
      setIsMounted(true);
    }
  }, [
    isMounted,
    setIsMounted,
    onChangeLanguage,
    classes,
    setArraySelectLanguage,
    availableLanguages
  ]);

  return (
    <SelectLayout
      className={classes.selectLayout}
      options={arraySelectLanguage}
      value={currentLanguage.symbol}
      onChange={event => {
        const symbol = event.target.value;
        i18n.changeLanguage(symbol);
        saveLanguage(symbol);
        onChangeLanguage({ symbol });
        handleClose && handleClose();
      }}
    />
  );
};

export default enhance(LanguageSelectComponent);

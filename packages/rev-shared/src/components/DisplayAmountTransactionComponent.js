import React from 'react';
import {
  TRANSACTION_DEPOSIT,
  TRANSACTION_WITHDRAW
} from '../enums/transactionType';
import { makeStyles } from '@material-ui/core';
const useStyles = makeStyles(() => ({
  textSuccess: {
    color: '#28a745'
  },
  textDanger: {
    color: '#dc3545'
  }
}));

const DisplayAmountTransactionComponent = ({ type, amount }) => {
  const classes = useStyles();
  let classObject = {};

  switch (type) {
    case TRANSACTION_DEPOSIT:
      classObject = classes.textSuccess;
      break;
    case TRANSACTION_WITHDRAW:
      classObject = classes.textDanger;
      break;
    default:
      break;
  }
  return <span className={classObject}> {amount}</span>;
};

export default DisplayAmountTransactionComponent;

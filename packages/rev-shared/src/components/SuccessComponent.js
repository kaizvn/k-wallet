import React from 'react';
import { capitalize } from 'lodash/fp';
import { Alert } from '@material-ui/lab';

const SuccessComponent = ({ title }) => {
  if (!title) {
    return null;
  }
  return (
    <Alert style={{ marginTop: 4, marginBottom: 4 }} severity="success">
      {capitalize(title)}
    </Alert>
  );
};

export default SuccessComponent;

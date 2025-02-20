import React from 'react';
import { Grid, makeStyles } from '@material-ui/core';

const InfoRow = ({ display, classes }) => (
  <span className={classes.text}>
    {typeof display === 'function' ? display() : display}
  </span>
);

const useStyles = makeStyles(theme => ({
  label: { fontSize: 14, color: 'gray' },
  text: {
    fontSize: theme.spacing(2)
  }
}));
const InfoLayout = ({ rows, displays, children }) => {
  const classes = useStyles();
  return (
    <Grid container spacing={3}>
      {rows.map((row, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Grid container direction="column">
            <span className={classes.label}>{row.label}</span>
            <InfoRow
              key={index}
              label={row.label}
              display={displays[row.key]}
              classes={classes}
            />
          </Grid>
        </Grid>
      ))}
      {children}
    </Grid>
  );
};

export default InfoLayout;

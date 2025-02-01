import React from 'react';
import { makeStyles } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
const PAGE_SIZE_DEFAULT = 10;

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(2)
  }
}));

const PaginationComponent = ({
  totalCount,
  t,
  actions,
  color = 'primary',
  showFirstButton = true,
  showLastButton = true,
  page = 0,
  ...others
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Pagination
        color={color}
        count={Math.ceil(totalCount / PAGE_SIZE_DEFAULT)}
        onChange={(event, page) => {
          if (event.currentTarget.tabIndex === page - 1) {
            return;
          }
          actions(--page);
        }}
        showFirstButton={showFirstButton}
        showLastButton={showLastButton}
        page={++page}
        {...others}
      />
    </div>
  );
};

export default PaginationComponent;

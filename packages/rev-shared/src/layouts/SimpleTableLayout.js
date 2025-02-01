import {
  makeStyles,
  Table,
  TableBody,
  TableCell as MuiTableCell,
  TableHead,
  TableRow,
  withStyles
} from '@material-ui/core';
import React, { Fragment } from 'react';
const TableCell = withStyles({
  root: {
    borderBottom: 'none'
  }
})(MuiTableCell);

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto'
  },
  table: {
    minWidth: 650
  }
}));
const SimpleTableLayout = ({
  columns = [],
  data = [],
  headerRowStyles = {},
  headerCellStyles = {},
  bodyRowStyles = {},
  bodyCellStyles = {},
  noBorderHeader = false,
  noBorderBody = false
}) => {
  const classes = useStyles();
  return (
    <Table className={classes.table}>
      <TableHead>
        <TableRow style={headerRowStyles}>
          {columns.map(({ title, styles = {}, ...others }, index) => (
            <Fragment key={index}>
              {noBorderHeader ? (
                <TableCell
                  style={Object.assign(
                    {
                      fontWeight: 'bold'
                    },
                    headerCellStyles,
                    styles
                  )}
                  {...others}
                >
                  {title}
                </TableCell>
              ) : (
                <MuiTableCell
                  style={Object.assign(
                    {
                      fontWeight: 'bold'
                    },
                    headerCellStyles,
                    styles
                  )}
                  {...others}
                >
                  {title}
                </MuiTableCell>
              )}
            </Fragment>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((row, index) => {
          return (
            <TableRow style={bodyRowStyles} key={index}>
              {columns.map(({ field, ...others }, index) => {
                return (
                  <Fragment key={index}>
                    {noBorderBody ? (
                      <TableCell
                        style={bodyCellStyles}
                        // component="th"
                        // scope="row"
                        {...others}
                      >
                        {row[field]}
                      </TableCell>
                    ) : (
                      <MuiTableCell
                        style={bodyCellStyles}
                        // component="th"
                        // scope="row"
                        {...others}
                      >
                        {row[field]}
                      </MuiTableCell>
                    )}
                  </Fragment>
                );
              })}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default SimpleTableLayout;

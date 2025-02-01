import React, { useState, Fragment } from 'react';
import {
  Grid,
  IconButton,
  InputBase,
  Divider,
  makeStyles,
  Button
} from '@material-ui/core';
import { Search, FilterList } from '@material-ui/icons';
import cx from 'classnames';
import AlertDialog from '../layouts/AlertDialog';
import DateRangePickerComponent from './DateRangePickerComponent';
import { doFunctionWithEnter } from '@revtech/rev-shared/utils';
import { DEFAULT_PAGING_INFO } from '../utils';
import { isArray } from 'lodash';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    flexGrow: 1
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1
  },
  iconButton: {
    padding: 10,
    display: 'flex'
  },
  divider: {
    height: 28,
    margin: 4
  },
  dialog: {
    minHeight: theme.spacing(40)
  },
  btnApply: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  }
}));

const emptyFunction = () => {};

function SearchTableComponent({
  placeholder,
  searchMessage,
  setSearchMessage = emptyFunction,
  dateRange,
  setDateRange = emptyFunction,
  t,
  contentAdvance,
  dispatchAction = emptyFunction,
  inputSearchProps,
  pagingInfo = DEFAULT_PAGING_INFO,
  externalParams = [],
  advanceSearch = true
}) {
  const classes = useStyles();

  if (!isArray(externalParams)) {
    externalParams = [externalParams];
  }

  const [openAdvanceSearch, setOpenAdvanceSearch] = useState(false);

  return (
    <Grid className={cx(classes.root, 'shadow')}>
      <InputBase
        value={searchMessage}
        onChange={(event) => setSearchMessage(event.target.value)}
        placeholder={placeholder}
        className={classes.input}
        onKeyPress={(event) =>
          doFunctionWithEnter(event, () => {
            event.preventDefault();
            dispatchAction(
              pagingInfo.page,
              pagingInfo.pageSize,
              searchMessage,
              dateRange,
              ...externalParams
            );
          })
        }
        {...inputSearchProps}
      />
      <IconButton
        onClick={() =>
          dispatchAction(
            pagingInfo.page,
            pagingInfo.pageSize,
            searchMessage,
            dateRange,
            ...externalParams
          )
        }
        color="primary"
        className={classes.iconButton}
      >
        <Search />
      </IconButton>
      {advanceSearch && (
        <Fragment>
          <Divider className={classes.divider} orientation="vertical" />
          <IconButton
            onClick={() => setOpenAdvanceSearch(true)}
            color="primary"
            className={classes.iconButton}
          >
            <FilterList />
          </IconButton>
          <AlertDialog
            onClose={() => setOpenAdvanceSearch(false)}
            fullWidth
            size="sm"
            isFooter={false}
            isOpenDialog={openAdvanceSearch}
            setIsOpenDialog={setOpenAdvanceSearch}
            content={
              <Grid container justify="center" alignItems="center">
                <DateRangePickerComponent
                  t={t}
                  small
                  setDateRange={setDateRange}
                />
                {contentAdvance}
                <Grid container justify="flex-end">
                  <Button
                    onClick={() => {
                      dispatchAction(
                        pagingInfo.page,
                        pagingInfo.pageSize,
                        searchMessage,
                        dateRange,
                        ...externalParams
                      );
                      setOpenAdvanceSearch(false);
                    }}
                    className={classes.btnApply}
                    color="primary"
                    variant="contained"
                  >
                    {t('common:rev_shared.button.apply')}
                  </Button>
                </Grid>
              </Grid>
            }
          />
        </Fragment>
      )}
    </Grid>
  );
}
export default SearchTableComponent;

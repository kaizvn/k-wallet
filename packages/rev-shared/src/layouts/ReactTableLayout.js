import React, { forwardRef, useState, useEffect } from 'react';
import { doDispatchAction } from '../utils';
import { withTranslation } from '../i18n';
import MaterialTable from 'material-table';
import cx from 'classnames';
import SearchTableComponent from '../components/SearchTableComponent';
import {
  AddBox,
  ArrowDownward,
  Check,
  ChevronLeft,
  ChevronRight,
  Clear,
  DeleteOutline,
  Edit,
  FilterList,
  FirstPage,
  LastPage,
  Remove,
  SaveAlt,
  Search,
  ViewColumn
} from '@material-ui/icons';
import { Divider, Grid, makeStyles } from '@material-ui/core';
import DateRangePickerComponent from '../../dist/components/DateRangePickerComponent';

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

const PAGE_SIZE_DEFAULT = 10,
  PAGE_DEFAULT = 0;

const useStyles = makeStyles((theme) => ({
  searchSection: {
    paddingTop: theme.spacing(1),
    background: 'white'
  },
  dateRangeMobile: {
    [theme.breakpoints.down('xs')]: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2)
    }
  },
  dateRange: {
    padding: `0px ${theme.spacing(1)}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  searchMobile: {
    [theme.breakpoints.down('xs')]: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  },
  dividerMobile: {
    display: 'block',
    [theme.breakpoints.up('sm')]: {
      display: 'none'
    }
  }
}));

const ReactTableLayout = ({
  data = [],
  columns = [],
  dispatchAction,
  totalCount,
  pageSize = PAGE_SIZE_DEFAULT,
  t,
  page = PAGE_DEFAULT,
  style = {},
  options = {},
  components = {},
  searchProps = {},
  dateRangeProps = {},
  hasAction = true,
  hasPaging = true,
  ...others
}) => {
  const {
    searchMessage,
    setSearchMessage,
    placeholder,
    exCondition
  } = searchProps;
  const { dateRange, setDateRange } = dateRangeProps;
  const classes = useStyles();
  const [pageSizeTable, setPageSizeTable] = useState(pageSize);
  const [pageIndex, setPageIndex] = useState(page);
  const [isFetchPaging, setIsFetchPaging] = useState(true);

  useEffect(() => {
    if (hasPaging && !hasAction && isFetchPaging) {
      doDispatchAction(dispatchAction());
      setIsFetchPaging(false);
    }
  }, [hasAction, hasPaging, dispatchAction, isFetchPaging]);

  useEffect(() => {
    if (hasAction && hasPaging) {
      doDispatchAction(
        dispatchAction(
          pageIndex,
          pageSizeTable,
          searchMessage,
          dateRange,
          exCondition
        )
      );
    }
  }, [
    pageSizeTable,
    pageIndex,
    dateRange,
    searchMessage,
    dispatchAction,
    exCondition,
    hasAction,
    hasPaging
  ]);

  return (
    <Grid>
      {hasAction && (
        <Grid
          container
          direction="column"
          className={cx(classes.searchSection, 'shadow')}
        >
          <Grid container justify="center">
            <Grid className={classes.searchMobile} item xs={12} sm={6} lg={7}>
              <SearchTableComponent
                searchMessage={searchMessage}
                setSearchMessage={setSearchMessage}
                placeholder={placeholder}
                dispatchAction={dispatchAction}
                t={t}
                dateRange={dateRange}
                setDateRange={setDateRange}
              />
            </Grid>
            <Grid className={classes.dividerMobile} item xs={12}>
              <Divider />
            </Grid>
            <Grid
              className={cx(classes.dateRangeMobile, classes.dateRange)}
              item
              xs={12}
              sm={6}
              lg={5}
            >
              <DateRangePickerComponent
                t={t}
                small
                setDateRange={setDateRange}
              />
            </Grid>
          </Grid>
          <Divider />
        </Grid>
      )}
      <MaterialTable
        {...others}
        style={Object.assign(
          {},
          {
            width: '100%',
            boxShadow:
              '0 10px 20px rgba(0, 0, 0, 0.1), 0 6px 6px rgba(0, 0, 0, 0.1)'
          },
          style
        )}
        options={Object.assign(
          {},
          {
            search: false,
            showTitle: false,
            paginationType: 'stepped',
            pageSize: pageSize,
            padding: 'dense',
            paging: hasPaging ? true : false
          },
          options
        )}
        components={Object.assign(
          {},
          {
            Toolbar: () => <div></div>
          },
          components
        )}
        localization={{
          pagination: {
            labelDisplayedRows: t('table.pagination.of_text'),
            labelRowsSelect: t('table.pagination.rows'),
            labelRowsPerPage: t('table.pagination.row_per_page'),
            firstAriaLabel: t('table.pagination.first_page'),
            firstTooltip: t('table.pagination.first_page'),
            previousAriaLabel: t('table.pagination.previous_page'),
            previousTooltip: t('table.pagination.previous_page'),
            lastAriaLabel: t('table.pagination.last_page'),
            lastTooltip: t('table.pagination.last_page'),
            nextAriaLabel: t('table.pagination.next_page'),
            nextTooltip: t('table.pagination.next_page')
          },
          body: {
            emptyDataSourceMessage: t('table.body.no_row'),
            addTooltip: t('table.body.add'),
            deleteTooltip: t('table.body.delete'),
            editTooltip: t('table.body.edit'),
            filterRow: {
              filterTooltip: t('table.body.filter')
            },
            editRow: {
              deleteText: t('table.body.confirm'),
              cancelTooltip: t('table.body.cancel'),
              saveTooltip: t('table.body.save')
            }
          },
          grouping: {
            placeholder: t('table.grouping.placeholder'),
            groupedBy: t('table.grouping.placeholder')
          },
          toolbar: {
            addRemoveColumns: t('table.toolbar.add_or_remove'),
            nRowsSelected: t('table.toolbar.row_selected'),
            showColumnsTitle: t('table.toolbar.show_columns'),
            showColumnsAriaLabel: t('table.toolbar.show_columns'),
            exportTitle: t('table.toolbar.export'),
            exportAriaLabel: t('table.toolbar.export'),
            exportName: t('table.toolbar.export as CSV'),
            searchTooltip: t('table.toolbar.search'),
            searchPlaceholder: t('table.toolbar.search')
          }
        }}
        totalCount={totalCount}
        page={pageIndex}
        onChangePage={(pageIndex) => {
          setPageIndex(pageIndex);
        }}
        onChangeRowsPerPage={(pageSize) => {
          setPageSizeTable(pageSize);
        }}
        icons={tableIcons}
        columns={columns.map(
          ({ headerStyle = {}, cellStyle = {}, ...others }) => ({
            headerStyle: Object.assign(
              {},
              {
                textTransform: 'uppercase',
                fontWeight: 'bold'
              },
              headerStyle
            ),
            cellStyle: Object.assign({}, { whiteSpace: 'nowrap' }, cellStyle),
            ...others
          })
        )}
        data={data}
      />
    </Grid>
  );
};

export default withTranslation('react-table')(ReactTableLayout);

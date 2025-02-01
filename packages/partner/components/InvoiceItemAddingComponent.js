import {
  Button,
  CardSimpleLayout,
  ReactTableLayout
} from '@revtech/rev-shared/layouts';
import { compose } from 'recompose';
import { withTranslation } from '@revtech/rev-shared/i18n';
import React from 'react';

import { Grid, Typography, makeStyles, TextField } from '@material-ui/core';
import cx from 'classnames';
import { Add, DeleteOutlined } from '@material-ui/icons';

const enhance = compose(withTranslation('invoice'));

const useStyles = makeStyles(theme => ({
  title: {
    fontWeight: 600,
    fontSize: 18,
    paddingTop: theme.spacing(2)
  },
  invoiceItems: {
    margin: theme.spacing(2, 0),
    overflow: 'hidden',
    overflowX: 'scroll'
  },
  titleTable: {
    fontWeight: 600,
    fontSize: 14,
    fontStyle: 'normal',
    textTransform: 'capitalize'
  }
}));

const defaultItemObject = {
  id: new Date().getTime(),
  name: '',
  desc: '',
  quantity: 0,
  price: 0,
  amount: 0
};
function handleSearchChange({ event, id, itemData, setItemData }) {
  const { value, name } = event.target;

  if (!value.trim()) {
    return;
  }

  const indexItemChanging = itemData
    .map(function(e) {
      return e.id;
    })
    .indexOf(id);
  if (indexItemChanging < 0) {
    return;
  }
  const newItemData = [...itemData];
  if (name === quantityName) {
    const quantity = parseInt(value) || 0;
    const price = parseFloat(newItemData[indexItemChanging][priceName]) || 0;
    newItemData[indexItemChanging][name] = quantity;
    newItemData[indexItemChanging][amountName] = quantity * price;
  } else if (name === priceName) {
    const price = parseFloat(value) || 0;
    const quantity =
      parseInt(newItemData[indexItemChanging][quantityName]) || 0;
    newItemData[indexItemChanging][name] = price;
    newItemData[indexItemChanging][amountName] = quantity * price;
  } else {
    newItemData[indexItemChanging][name] = value.trim();
  }
  setItemData(newItemData);
}

const getItemDataTable = ({ itemData = [], setItemData, t }) =>
  itemData.map(item => {
    return {
      name: (
        <TextField
          error={!item.name}
          onChange={event =>
            handleSearchChange({ event, id: item.id, itemData, setItemData })
          }
          variant="outlined"
          name="name"
          size="small"
          value={item.name}
        />
      ),
      desc: (
        <TextField
          onChange={event =>
            handleSearchChange({ event, id: item.id, itemData, setItemData })
          }
          variant="outlined"
          name="desc"
          size="small"
          value={item.desc}
        />
      ),
      quantity: (
        <TextField
          error={!item.quantity}
          onChange={event =>
            handleSearchChange({ event, id: item.id, itemData, setItemData })
          }
          inputProps={{
            min: 0
          }}
          variant="outlined"
          name={quantityName}
          size="small"
          value={item.quantity}
          type="number"
        />
      ),
      price: (
        <TextField
          onChange={event =>
            handleSearchChange({ event, id: item.id, itemData, setItemData })
          }
          inputProps={{
            min: 0
          }}
          error={!item.price}
          variant="outlined"
          name={priceName}
          size="small"
          type="number"
          value={item.price}
        />
      ),
      amount: (
        <TextField
          InputProps={{ endAdornment: '$' }}
          variant="outlined"
          disabled
          name={amountName}
          size="small"
          value={item.quantity * item.price}
        />
      ),
      action:
        itemData.length > 1 ? (
          <Button
            onClick={() => {
              const newItemData = itemData.filter(
                record => record.id !== item.id
              );
              setItemData(newItemData);
            }}
            startIcon={<DeleteOutlined />}
            color="secondary"
          >
            {t('invoice.button.delete')}
          </Button>
        ) : null
    };
  });

const amountName = 'amount',
  quantityName = 'quantity',
  priceName = 'price';

const InvoiceItemAddingComponent = ({
  itemData = [],
  setItemData,
  totalAmount,
  t
}) => {
  const classes = useStyles();
  const COLUMNS = [
    {
      field: 'name',
      title: (
        <div className={classes.titleTable}>
          {t('invoice.table.item.name')} *
        </div>
      )
    },
    {
      field: 'desc',
      title: (
        <div className={classes.titleTable}>
          {t('invoice.table.item.item_description')}
        </div>
      )
    },
    {
      field: 'quantity',
      title: (
        <div className={classes.titleTable}>
          {t('invoice.table.item.quantity')} *
        </div>
      )
    },
    {
      field: 'price',
      title: (
        <div className={classes.titleTable}>
          {t('invoice.table.item.price')} *
        </div>
      )
    },
    {
      field: 'amount',
      title: (
        <div className={classes.titleTable}>
          {t('invoice.table.item.amount')}
        </div>
      )
    },
    {
      field: 'action',
      title: ''
    }
  ];

  return (
    <Grid
      xl={10}
      lg={12}
      md={12}
      sm={12}
      item
      className={cx('shadow', classes.invoiceItems)}
    >
      <CardSimpleLayout
        bodyStyle={{
          padding: '24px 40px'
        }}
        body={
          <Grid>
            <div className={classes.title}>
              {t('invoice.title.invoice_items')}
            </div>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <ReactTableLayout
                  data={getItemDataTable({ itemData, setItemData, t })}
                  columns={COLUMNS}
                  hasPaging={false}
                  hasAction={false}
                  style={{ padding: 0, boxShadow: 'none' }}
                />
              </Grid>
            </Grid>
            <Grid style={{ marginTop: 24 }} container justify="space-between">
              <Button
                onClick={() => {
                  const currentTime = new Date();
                  const newObject = {
                    ...defaultItemObject,
                    id: currentTime.getTime()
                  };
                  setItemData(prev => [...prev, newObject]);
                }}
                startIcon={<Add />}
                size="large"
              >
                {t('invoice.button.add_new_item')}
              </Button>
              <Typography color="primary">
                {t('invoice.label.total')}: $ {totalAmount}.00
              </Typography>
            </Grid>
          </Grid>
        }
      />
    </Grid>
  );
};

export default enhance(React.memo(InvoiceItemAddingComponent));

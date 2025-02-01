import { isArray } from 'lodash/fp';
import {
  getTransactionDetails,
  createDepositAddress,
  createWithdrawTransaction
} from './query';

const Apis = [
  {
    action: 'transaction',
    query: getTransactionDetails,
    bodyFields: ['id']
  },
  {
    action: 'create_deposit_address',
    query: createDepositAddress,
    bodyFields: ['trackingId', 'coinId']
  },
  {
    action: 'create_withdraw_transaction',
    query: createWithdrawTransaction,
    bodyFields: ['amount', 'coinId', 'recipientAddress', 'trackingId']
  }
];

const GRAPHQL_PATH = process.env.GRAPHQL_PATH || '/graphql';

function generateQuery({ type, currentAPI, body }) {
  let query = '';
  if (type === 'mutation') {
    query = 'mutation ';
  }
  if (currentAPI) {
    query = query + `{${currentAPI.query({ ...body })}}`;
  }
  return query;
}

export const restApisHandler = ({ req, res, next }) => {
  const body = req.body;
  const { type, action } = req.params;
  const currentAPI = Apis.find((api) => api.action === action);

  if (!currentAPI) {
    return res.json({ message: `API {${action}} not supported` });
  }

  if (isArray(currentAPI.bodyFields)) {
    for (let field of currentAPI.bodyFields) {
      if (!body[field]) {
        return res.json({
          message: `You missing field {${field}} of query ${currentAPI.action}`
        });
      }
    }
  }

  body.query = generateQuery({ type, currentAPI, body });
  req.url = GRAPHQL_PATH;
  next();
};

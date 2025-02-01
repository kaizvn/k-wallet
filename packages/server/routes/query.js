const SWITCH_TRANSACTION_FROM_TO_DATA = `
... on Partner {
  id
  name
}
... on User {
  id
  fullName
}
... on OutsiderWallet {
  address
}
`;

export const getTransactionDetails = ({ id }) => `get_transaction(id: "${id}") {
  id
  trackingId
  hash
  from {
    ${SWITCH_TRANSACTION_FROM_TO_DATA}
  }
  to {
    ${SWITCH_TRANSACTION_FROM_TO_DATA}
  }
  amount
  status
  type
  fee
  coin {
    id
    symbol
  }
  description
  createdAt
  receivedAddress
}`;

export const createDepositAddress = ({ trackingId, coinId }) => `
create_deposit_address(trackingId: "${trackingId}", coinId: "${coinId}") {
    trackingId
    address
    coin {
      id
      symbol
    }
}
`;

export const createWithdrawTransaction = ({
  amount,
  coinId,
  recipientAddress,
  trackingId
}) => `
create_withdraw_transaction(
    amount: ${amount}
    coinId: "${coinId}"
    recipientAddress: "${recipientAddress}"
    trackingId: "${trackingId}"
) {
    id
    hash
    status
}
`;

export const loginQuery = `
    mutation ($username: String!, $password: String!  ) {
      login_partner_user(username: $username, password: $password) {
        id
        fullName
        token
      }
    }

`;

const SWITCH_TRANSACTION_FROM_TO_DATA = `
... on Partner {
  id
  name
}
... on User {
  id
  fullName
}
...on OutsiderWallet {
  address
}
`;

export const getTransactionQuery = `
  query($id: ID!) {
    get_payment(id: $id) {
      id
      from {
        ${SWITCH_TRANSACTION_FROM_TO_DATA}
      }
      to {
        ${SWITCH_TRANSACTION_FROM_TO_DATA}
      }
      amount
      status
      coin {
        symbol
      }
      createdAt
      updatedAt
    }
  }
`;

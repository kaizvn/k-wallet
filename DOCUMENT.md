# RevPayment

###### about Us

> RevPayment is a project for ...

## Registration

To use all of the our services, you must have an account. Register [here](https://partner.revpayment.io/register)

## Setting WebHook

Go to [Partner setting](https://partner.revpayment.io/settings/partner-setting) and pass your `URL_Callback` into `Callback URL Input Field`

#### Please follow these conventions when creating callback URL:

```bash
- Create a Rest API.
- API method should be POST.
- Accept request should be jsonstring.
- Example Request :
    {
        transaction_id: "11d04fd3-d463-41d9-886f-403b36eae735", // string
        error // boolean
    }
```

## RESTful Resources

#### Partner Login:

| Resource        | Type | Request Header                | Request Body                        | Return Object                             |
| :-------------- | :--: | :---------------------------- | :---------------------------------- | :---------------------------------------- |
| /partner-signin | POST | [Header](/DOCUMENT.md#header) | [Body](/DOCUMENT.md#partner-signin) | [Response](/DOCUMENT.md#partner-signin-1) |

```bash
Remember: You have to login with a origin in request header as you saved with `callback_url` inside `partner-setting`. Otherwise, you will receive a message error is "Permission denied!".

With test postman case, add Origin key in Header: { Origin: "your origin" }
Example: { Origin : https://your_domain }
```

#### Get Transaction Details:

| Resource               | Type | Request Header                | Request Body                     | Return Object                                |
| :--------------------- | :--: | :---------------------------- | :------------------------------- | :------------------------------------------- |
| /api/query/transaction | POST | [Header](/DOCUMENT.md#header) | [Body](/DOCUMENT.md#transaction) | [Response](/DOCUMENT.md#apiquerytransaction) |

#### Create new Deposit Address:

| Resource                             | Type | Request Header                | Request Body                                | Return Object                                              |
| :----------------------------------- | :--: | :---------------------------- | :------------------------------------------ | :--------------------------------------------------------- |
| /api/mutation/create_deposit_address | POST | [Header](/DOCUMENT.md#header) | [Body](/DOCUMENT.md#create_deposit_address) | [Response](/DOCUMENT.md#apimutationcreate_deposit_address) |

#### Create new Withdraw Transaction:

| Resource                                  | Type | Request Header                | Request Body                                     | Return Object                                                   |
| :---------------------------------------- | :--: | :---------------------------- | :----------------------------------------------- | :-------------------------------------------------------------- |
| /api/mutation/create_withdraw_transaction | POST | [Header](/DOCUMENT.md#header) | [Body](/DOCUMENT.md#create_withdraw_transaction) | [Response](/DOCUMENT.md#apimutationcreate_withdraw_transaction) |

## Request Objects

#### header:

| Attribute         | Type     | Description                                        |
| :---------------- | :------- | :------------------------------------------------- |
| **Authorization** | _string_ | The access token to Authorize (_Ex: "bearer ..."_) |

#### /partner-signin:

| Attribute    | Type     | Description             |
| :----------- | :------- | :---------------------- |
| **username** | _string_ | The username of partner |
| **password** | _string_ | The password of partner |

#### /transaction:

| Attribute | Type     | Description           |
| :-------- | :------- | :-------------------- |
| **id**    | _string_ | The id of transaction |

#### /create_deposit_address:

| Attribute      | Type     | Description                         |
| :------------- | :------- | :---------------------------------- |
| **trackingId** | _string_ | The owner's username of transaction |
| **coinId**     | _string_ | The id of coin ( _Ex: btc/eth_ )    |

#### /create_withdraw_transaction:

| Attribute            | Type     | Description                                    |
| :------------------- | :------- | :--------------------------------------------- |
| **amount**           | _float_  | The amount of withdraw transaction             |
| **coinId**           | _string_ | The id of coin ( _Ex: btc/eth_ )               |
| **recipientAddress** | _string_ | The wallet's address that you want to withdraw |
| **trackingId**       | _string_ | The owner's username of transaction            |

## Response Objects From URL

#### /partner-signin:

| Attribute   | Type      | Description                                             |
| :---------- | :-------- | :------------------------------------------------------ |
| **success** | _boolean_ | The status of login API                                 |
| **msg**     | _string_  | The message of login API (Only appear when login fail)  |
| **token**   | _string_  | The token of login API (Only appear when login success) |

- Example response object for login success:

```javascript
{
    "success": true,
    "token": "bearer eyJhbGciOiJIUzI1NiIsIn..."
}
```

- Example response object for login fail:

```javascript
{
    "success": false,
    "msg": "Incorrect username or password."
}
```

#### /api/query/transaction:

| Attribute           | Type                                        | Description                     |
| :------------------ | :------------------------------------------ | :------------------------------ |
| **id**              | _string_                                    | The id of transaction           |
| **trackingId**      | _string_                                    | The tracking Id of transaction  |
| **hash**            | _string_                                    | The hash of transaction         |
| **from**            | _[From](/DOCUMENT.md#from)_                 | The wallet's owner object       |
| **to**              | _[To](/DOCUMENT.md#to)_                     | The wallet's owner object       |
| **amount**          | _float_                                     | The amount of transaction       |
| **status**          | _[Status](/DOCUMENT.md#transaction-status)_ | The status of transaction       |
| **type**            | _[Type](/DOCUMENT.md#transaction-type)_     | The type of transaction         |
| **fee**             | _float_                                     | The fee of transaction          |
| **coin**            | _[Coin](/DOCUMENT.md#coin)_                 | The requested coin object       |
| **description**     | _string_                                    | The description of transaction  |
| **createdAt**       | _string_                                    | The time created of transaction |
| **receivedAddress** | _string_                                    | The destination of transaction  |

- Example response object for get transaction details:

```javascript
"data": {
    "get_transaction": {
        "id": "1e513350-9e7a-477c-a88f-c87b47927493",
        "trackingId": "user1",
        "hash": "0c4fc89ae7f609e1f9e50954da80b64cfec811a8aa7c146563cfda6f7c559fa8",
        "from": {
            "address": "Multi Wallet Addresses"
        },
        "to": {
            "id": "43ec0750-99f8-4194-9fe2-95bbdef64cc3",
            "name": "Rev Payment"
        },
        "amount": 0.0499,
        "status": "FINISHED",
        "type": "DEPOSIT",
        "fee": 0,
        "coin": {
            "id": "bcy",
            "symbol": "BCY"
        },
        "description": null,
        "createdAt": "2019-12-04T09:07:51.746Z",
        "receivedAddress": "ByzmJWRWDSkBpZbYfYiCYjFczU6B8cpcpl"
    }
}
```

#### /api/mutation/create_deposit_address:

| Attribute      | Type                        | Description                       |
| :------------- | :-------------------------- | :-------------------------------- |
| **trackingId** | _string_                    | The username of transaction owner |
| **address**    | _string_                    | The destination of transaction    |
| **coin**       | _[Coin](/DOCUMENT.md#coin)_ | The requested coin object         |

- Example response object for create deposit address:

```javascript
"data": {
    "create_deposit_address": {
        "trackingId": "user1",
        "address": "mhmMzyjUFDYBqX3iEVkapH3NLEafZtFrol",
        "coin": {
            "id": "btc",
            "symbol": "BTC"
        }
    }
}
```

#### /api/mutation/create_withdraw_transaction:

| Attribute  | Type                                      | Description               |
| :--------- | :---------------------------------------- | :------------------------ |
| **id**     | _string_                                  | The id of transaction     |
| **hash**   | _string_                                  | The hash of transaction   |
| **status** | [Status](/DOCUMENT.md#transaction-status) | The status of transaction |

- Example response object for create withdraw transaction:

```javascript
"data": {
    "create_withdraw_transaction": {
        "id": "ea6d4de8-4d1b-4403-a5ac-01fbebab4ea5",
        "hash": "183a1fced793dc1f93a68c775d1473b11d6d7821cc3225e35b50ec0815181875",
        "status": "PENDING"
    }
}
```

## Other Objects

#### From:

| Attribute   | Type     | Description                                                                                                                              |
| :---------- | :------- | :--------------------------------------------------------------------------------------------------------------------------------------- |
| **id**      | _string_ | (_*only WITHDRAW*_) The owner's id of transaction                                                                                        |
| **name**    | _string_ | (_*only WITHDRAW*_) The owner's name of transaction                                                                                      |
| **address** | _string_ | (_*only DEPOSIT*_) The `outside wallet's address` if deposit from one wallet or `"Multi Wallet Addresses"` if deposit from multi wallets |

#### To:

| Attribute   | Type     | Description                                        |
| :---------- | :------- | :------------------------------------------------- |
| **id**      | _string_ | (_*only DEPOSIT*_) The owner's id of transaction   |
| **name**    | _string_ | (_*only DEPOSIT*_) The owner's name of transaction |
| **address** | _string_ | (_*only WITHDRAW*_) The `outside wallet's address` |

#### Coin:

| Attribute  | Type     | Description                          |
| :--------- | :------- | :----------------------------------- |
| **id**     | _string_ | The id of coin ( _Ex: btc/eth_ )     |
| **symbol** | _string_ | The symbol of coin ( _Ex: BTC/ETH_ ) |

## Enums

#### Transaction Status:

```javascript
'FAILED';
'PENDING';
'FINISHED';
'CANCELLED';
'REJECTED';
'REVERTED';
'PENDING_ADMIN_APPROVAL';
'PENDING_PARTNER_APPROVAL';
```

#### Transaction Type:

```javascript
'DEPOSIT';
'WITHDRAW';
```

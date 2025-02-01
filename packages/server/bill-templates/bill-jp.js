import {
  TYPE_TX_DEPOSIT,
  TYPE_TX_WITHDRAW
} from '../graphql/enums/transactionType';

export default ({
  type,
  coin,
  hash,
  amount,
  fee,
  actualAmount,
  paymentDate,
  receiver
}) => {
  let typeString, typeColor;
  if (type === TYPE_TX_DEPOSIT) {
    typeString = 'Deposit-jp';
    typeColor = `#00bd13`;
  } else if (type === TYPE_TX_WITHDRAW) {
    typeString = 'Withdraw-jp';
    typeColor = `red`;
  }

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          .invoice-box {
            margin: auto;
            padding: 10px 20px;
            border: 1px solid #eee;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
            font-size: 10px;
            line-height: 24px;
            font-family: 'Helvetica Neue', 'Helvetica';
          }
          .invoice-logo {
            text-transform: uppercase;
            font-size: 14px;
            font-weight: 800;
            background: #6e00db;
            color: white;
            padding: 8px 10px;
          }
          .invoice-date-info {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
          }
          .label {
            text-transform: capitalize;
            color: gray;
          }
          .invoice-content {
            background: #f4f6f7;
            margin: 10px 0px;
            padding: 10px 20px;
          }
          .invoice-content .title {
            text-transform: capitalize;
            font-size: 12px;
            font-weight: bold;
            text-align: center;
          }
          .invoice-content .content {
            display: flex;
          }
          .invoice-content .left-content {
            width: 70%;
          }
          .invoice-content .right-content {
            background: #fdfefe;
            border: 0.5px solid #979a9a;
            display: flex;
            flex-direction: column;
            border-radius: 7px;
          }
          .margin-content {
            margin: 10px 10px;
            margin-top: 5px;
          }
          .border-content {
            border-bottom: 1px dashed #979a9a;
          }
          .bold-text{
            font-weight: bold;
          }
          .invoice-footer {
            margin-top: 10px;
            border-top: 1px dashed #979a9a;
            padding: 10px 0px;
            text-align: center;
          }
          .float-right{
             float: right;
          }
          .hash-content{
            -ms-word-break: break-all;
            word-break: break-all;
            width: 250px;
          }
        </style>
      </head>
      <body>
        <div class="invoice-box">
          <div class="invoice-logo">
            revpayment
          </div>
          <div class="invoice-date-info">
           <span class="label"> payment date-jp:</span> ${paymentDate}
          </div>
    
          <div class="invoice-content">
            <div class="title">
              bill details-jp
            </div>
            <div class="content">
              <div class="left-content">
                 <div class="row-left-content">
                  <span class="label">type-jp:</span> <span style="color:${typeColor};" class="bold-text"> ${typeString} </span>
                  <span class="float-right"><span class="label">coin-jp: </span>${coin}</span>
                </div>
                <div class="row-left-content">
                  <span class="label">receiver-jp:</span> ${receiver}
                </div>
                <div class="row-left-content">
                  <span class="label">hash-jp:</span>
                  <div class="hash-content"> ${hash} </div> 
                </div>        
              </div>
              <div class="right-content">
                <div class="border-content margin-content">
                  <span class="label">details-jp</span>
                  <span class="label float-right">amount-jp</span>
                </div>
                <div class="border-content margin-content">
                  <div>
                    <span>Amount-jp </span>
                    <span style="color:${typeColor};" class="bold-text float-right">${amount}</span>
                  </div>
                  <div>
                    <span>Fee-jp </span>
                    <span style="color:red;" class="bold-text float-right">${fee}</span>
                  </div>
                </div>
                <div class="margin-content">
                  <div class="bold-text">
                    <span >Actual Amount-jp </span>
                    <span class="float-right">${actualAmount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="invoice-footer">
            <div class="label">203 Fake St. Mountain View, San Francisco, California, USA</div>
            <div class="label">+2 392 3929 210</div>
          </div>
        </div>
      </body>
    </html>
      `;
};

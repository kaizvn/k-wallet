import withLayout from './layout';

const content = `
<div class="text" style="padding: 0 3em; text-align: justify;">
	<h2>Transfer sent-jp</h2>
	<p>Dear {{senderName}},</p>
	<p>You have sent a transfer of <b>{{amount}} {{coinSymbol}}</b> to <b>{{receiverName}}</b>. You can check your transactions' history and balance <a href="https://partner.revpayment.io/transaction/transactions" target="_blank">here</a>.</p>
	<p>In case you need more information, don't hesitate to reach us at <a href="mailto:support@revpayment.io">support@revpayment.io</a>.</p>
</div>`;

export default withLayout(content);

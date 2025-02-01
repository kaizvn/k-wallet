import withLayout from './layout';

const content = `
<div class="text" style="padding: 0 3em; text-align: justify;">
	<h2>Transfer received-jp</h2>
	<p>Dear {{receiverName}},</p>
	<p>You have received a transfer of <b>{{amount}} {{coinSymbol}}</b> from <b>{{senderName}}</b>. You can check your transactions' history and balance <a href="https://partner.revpayment.io/transaction/transactions" target="_blank">here</a>.</p>
	<p>In case you need more information, don't hesitate to reach us at <a href="mailto:support@revpayment.io">support@revpayment.io</a>.</p>
</div>`;

export default withLayout(content);

import withLayout from './layout';

const content = `
<div class="text" style="padding: 0 3em; text-align: justify;">
	<h2>New successful withdrawal</h2>
	<p>Dear {{name}},</p>
	<p>Your withdrawal from your <b>{{coinSymbol}} Wallet</b> has been finished successfully. You can check your transactions and balance <a href="https://partner.revpayment.io/transaction/transactions" target="_blank">here</a>.</p>
	<p>In case you need more information, don't hesitate to reach us at <a href="mailto:support@revpayment.io">support@revpayment.io</a>.</p>
</div>`;

export default withLayout(content);

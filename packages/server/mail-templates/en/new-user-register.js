import withLayout from './layout';

const content = `
<div class="text" style="padding: 0 3em; text-align: justify;">
	<h2>Thank you for your registration</h2>
	<p>Dear {{name}},</p>
	<p>Please <a href="https://submitkyc.dirolabs.com/{{mcc}}/{{phone}}" target="_blank">click here</a> to submit your KYC to  verify your account.</p>
	<p>In case you need more information, don't hesitate to reach us at <a href="mailto:support@revpayment.io">support@revpayment.io</a>.</p>
</div>`;

export default withLayout(content);

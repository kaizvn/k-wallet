import withLayout from './layout';

const content = `
<div class="text" style="padding: 0 3em; text-align: justify;">
	<h2>Successful Registration</h2>
	<p>Dear {{memberName}},</p>
	<p>You are now a member of <b>{{partnerName}}</b>, you can start using your services now by <a href="https://partner.revpayment.io/login">login here</a></p>
	<p>In case you need more information, don't hesitate to reach us at <a href="mailto:support@revpayment.io">support@revpayment.io</a>.</p>
</div>`;

export default withLayout(content);

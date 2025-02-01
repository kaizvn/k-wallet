import withLayout from './layout';

const content = `
<div class="text" style="padding: 0 3em; text-align: justify;">
	<h2>New member registered</h2>
	<p>Dear {{ownerName}},</p>
	<p>User <b>{{memberName}}</b> has become your member, <a href="https://partner.revpayment.io/member/manage" target="_blank">click here</a> to go to your dashboard and start managing.</p>
	<p>In case you need more information, don't hesitate to reach us at <a href="mailto:support@revpayment.io">support@revpayment.io</a>.</p>
</div>`;

export default withLayout(content);

import withLayout from './layout';

const content = `
<div class="text" style="padding: 0 3em; text-align: justify;">
	<h2>Reset your password-jp</h2>
    <p>Dear {{email}},</p>
	<p>Please go to the following link to reset your password.</p>    
	<p>Here is your link {{tokenLink}}</p>
	<p>In case you need more information, don't hesitate to reach us at <a href="mailto:support@revpayment.io">support@revpayment.io</a>.</p>
</div>`;

export default withLayout(content);

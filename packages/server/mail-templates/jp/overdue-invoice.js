import withLayout from './layout';

const content = `
<div class="text" style="padding: 0 3em; text-align: justify;">
	<h3>Invoice {{invoiceCode}} due {{dueDate}}</h3>
  <p>Hi {{recipientName}},</p>
  <p>I hope you’re well! We’re yet to receive payment for invoice number {{invoiceCode}}, which was due on {{dueDate}}. Please let us know when we can expect to receive payment</p>
  <p>Kind regards, {{partnerName}}</p>
	<p>In case you need more information, don't hesitate to reach us at <a href="mailto:support@revpayment.io">support@revpayment.io</a>.</p>
</div>`;

export default withLayout(content);

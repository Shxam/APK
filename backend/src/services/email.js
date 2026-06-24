/* =============================================================================
   Email Service (Resend)
   Sends transactional emails for:
   - Order confirmation to customer
   - New order alert to restaurant owner
   
   If RESEND_API_KEY is not set, emails are logged to console (dev mode).
   ============================================================================= */
'use strict';

let resendClient = null;

// Lazy-init Resend only if API key is present
function getResend() {
  if (!resendClient && process.env.RESEND_API_KEY) {
    const { Resend } = require('resend');
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

const RESTAURANT_EMAIL = process.env.RESTAURANT_EMAIL || 'owner@ipldhaba.com';
const FROM_EMAIL = 'IPL Dhaba <orders@ipldhaba.com>';

// ─── Order Confirmation to Customer ──────────────────────────────────────────
async function sendOrderConfirmationEmail({ order, customer_name, items, total_amount }) {
  const resend = getResend();
  if (!resend) {
    console.log('[Email] DEV MODE — Order confirmation would be sent to customer');
    console.log(`  Order #${order.order_number}, Customer: ${customer_name}, Total: ₹${total_amount}`);
    return;
  }

  const itemsList = items
    .map(i => `<tr>
      <td style="padding:6px 0;">${i.name}</td>
      <td style="padding:6px 0; text-align:right;">${i.quantity}x</td>
      <td style="padding:6px 0; text-align:right;">₹${i.unit_price * i.quantity}</td>
    </tr>`)
    .join('');

  await resend.emails.send({
    from: FROM_EMAIL,
    to: [], // Customer email not collected in v1 (phone-based ordering)
    subject: `✅ Order Confirmed — #${order.order_number} | IPL Dhaba`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; background: #FFF8F0; padding: 24px; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #FF6B00; font-size: 2rem; margin: 0;">IPL Dhaba</h1>
          <p style="color: #6B6B6B; margin: 4px 0;">Indian Prime Line — Tasty & Healthy</p>
        </div>
        <div style="background: #fff; padding: 24px; border-radius: 8px; border: 1.5px solid #E8E0D5;">
          <h2 style="margin-top: 0; color: #1C1C1C;">🎉 Order Placed!</h2>
          <p style="color: #6B6B6B;">Hi <strong>${customer_name}</strong>, your order has been received and is being confirmed.</p>
          <p><strong>Order ID:</strong> #${order.order_number}</p>
          <p><strong>Estimated Delivery:</strong> 30–45 minutes</p>
          <table style="width:100%; border-collapse: collapse; margin: 16px 0;">
            <thead><tr>
              <th style="text-align:left; font-size: 0.8rem; color: #6B6B6B; border-bottom: 1px solid #E8E0D5; padding-bottom: 6px;">Item</th>
              <th style="text-align:right; font-size: 0.8rem; color: #6B6B6B; border-bottom: 1px solid #E8E0D5; padding-bottom: 6px;">Qty</th>
              <th style="text-align:right; font-size: 0.8rem; color: #6B6B6B; border-bottom: 1px solid #E8E0D5; padding-bottom: 6px;">Amount</th>
            </tr></thead>
            <tbody>${itemsList}</tbody>
            <tfoot><tr>
              <td colspan="2" style="padding-top: 12px; font-weight: 700; border-top: 2px solid #E8E0D5;">Total (Cash on Delivery)</td>
              <td style="padding-top: 12px; font-weight: 700; border-top: 2px solid #E8E0D5; text-align:right; color: #FF6B00;">₹${total_amount}</td>
            </tr></tfoot>
          </table>
          <p style="color: #6B6B6B; font-size: 0.85rem;">Questions? Call us: <a href="tel:+919876543210" style="color: #FF6B00;">+91 98765 43210</a></p>
        </div>
      </div>
    `
  });
}

// ─── New Order Alert to Restaurant Owner ─────────────────────────────────────
async function sendNewOrderAlertEmail({ order, customer_name, phone, delivery_address, items, total_amount }) {
  const resend = getResend();
  if (!resend) {
    console.log('[Email] DEV MODE — New order alert would be sent to restaurant');
    console.log(`  Order #${order.order_number} from ${customer_name} (${phone}) — ₹${total_amount}`);
    return;
  }

  const itemsList = items.map(i => `• ${i.name} ×${i.quantity} — ₹${i.unit_price * i.quantity}`).join('\n');

  await resend.emails.send({
    from: FROM_EMAIL,
    to: [RESTAURANT_EMAIL],
    subject: `🔔 New Order #${order.order_number} — ₹${total_amount} | IPL Dhaba`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #FF6B00; margin-top: 0;">🔔 New Order Received!</h2>
        <p><strong>Order #${order.order_number}</strong> — ₹${total_amount} (Cash on Delivery)</p>
        <hr style="border: 1px solid #E8E0D5;">
        <p><strong>Customer:</strong> ${customer_name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Address:</strong> ${delivery_address?.address_line || 'N/A'}</p>
        <hr style="border: 1px solid #E8E0D5;">
        <p><strong>Items:</strong></p>
        <pre style="background:#FFF8F0; padding:12px; border-radius:6px;">${itemsList}</pre>
        <a href="http://localhost:8080/#/admin" style="display:inline-block; background:#FF6B00; color:#fff; padding:12px 24px; border-radius:8px; text-decoration:none; font-weight:700; margin-top:12px;">
          View in Dashboard
        </a>
      </div>
    `
  });
}

module.exports = { sendOrderConfirmationEmail, sendNewOrderAlertEmail };

// const express = require('express');
// const axios = require('axios');
// const path = require('path');
// const app = express();
// const port = 3000;

// // PayPal credentials (replace with your sandbox or live credentials)
// const CLIENT_ID = 'YOUR_CLIENT_ID';
// const CLIENT_SECRET = 'YOUR_CLIENT_SECRET';
// const PAYPAL_API = 'https://api-m.sandbox.paypal.com'; // Use api-m.paypal.com for live

// // Middleware
// app.use(express.json());
// app.use(express.static(path.join(__dirname, 'public')));

// // Get PayPal access token
// async function getAccessToken() {
//   const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
//   const response = await axios.post(`${PAYPAL_API}/v1/oauth2/token`, 'grant_type=client_credentials', {
//     headers: {
//       Authorization: `Basic ${auth}`,
//       'Content-Type': 'application/x-www-form-urlencoded',
//     },
//   });
//   return response.data.access_token;
// }

// // Create a product
// async function createProduct() {
//   const accessToken = await getAccessToken();
//   const response = await axios.post(
//     `${PAYPAL_API}/v1/catalogs/products`,
//     {
//       name: 'Monthly Subscription',
//       description: 'Monthly subscription for premium services',
//       type: 'SERVICE',
//       category: 'SOFTWARE',
//       image_url: 'https://example.com/image.jpg',
//       home_url: 'https://example.com',
//     },
//     {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         'Content-Type': 'application/json',
//         'PayPal-Request-Id': `PRODUCT-${Date.now()}`,
//       },
//     }
//   );
//   return response.data.id;
// }

// // Create a subscription plan
// async function createPlan(productId) {
//   const accessToken = await getAccessToken();
//   const response = await axios.post(
//     `${PAYPAL_API}/v1/billing/plans`,
//     {
//       product_id: productId,
//       name: 'Basic Monthly Plan',
//       description: 'Monthly subscription plan for $10',
//       status: 'ACTIVE',
//       billing_cycles: [
//         {
//           frequency: {
//             interval_unit: 'MONTH',
//             interval_count: 1,
//           },
//           tenure_type: 'REGULAR',
//           sequence: 1,
//           total_cycles: 0, // Infinite
//           pricing_scheme: {
//             fixed_price: {
//               value: '10',
//               currency_code: 'USD',
//             },
//           },
//         },
//       ],
//       payment_preferences: {
//         auto_bill_outstanding: true,
//         setup_fee: {
//           value: '0',
//           currency_code: 'USD',
//         },
//         setup_fee_failure_action: 'CONTINUE',
//         payment_failure_threshold: 3,
//       },
//     },
//     {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         'Content-Type': 'application/json',
//         'PayPal-Request-Id': `PLAN-${Date.now()}`,
//       },
//     }
//   );
//   return response.data.id;
// }

// // Route to serve the front-end
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// // Route to create product and plan
// app.post('/create-subscription', async (req, res) => {
//   try {
//     const productId = await createProduct();
//     const planId = await createPlan(productId);
//     res.json({ planId });
//   } catch (error) {
//     console.error(error.response ? error.response.data : error.message);
//     res.status(500).json({ error: 'Failed to create subscription plan' });
//   }
// });

// // Route to verify subscription status
// app.post('/verify-subscription', async (req, res) => {
//   const { subscriptionId } = req.body;
//   try {
//     const accessToken = await getAccessToken();
//     const response = await axios.get(`${PAYPAL_API}/v1/billing/subscriptions/${subscriptionId}`, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         'Content-Type': 'application/json',
//       },
//     });
//     const { status } = response.data;
//     res.json({ active: status === 'ACTIVE' });
//   } catch (error) {
//     console.error(error.response ? error.response.data : error.message);
//     res.status(500).json({ error: 'Failed to verify subscription' });
//   }
// });

// // Webhook handler for subscription events
// app.post('/webhook', (req, res) => {
//   const event = req.body;
//   console.log('Webhook event:', event);
//   if (event.event_type === 'PAYMENT.SALE.COMPLETED') {
//     const subscriptionId = event.resource.billing_agreement_id;
//     console.log(`Subscription ${subscriptionId} payment completed`);
//     // Update your database or perform other actions
//   }
//   res.status(200).send('Webhook received');
// });

// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });

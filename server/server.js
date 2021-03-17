const express = require('express');
const app = express();
const stripe = require('stripe')('sk_test_51ITSy5J44jiWqwK1TChjmZU7ppPh99tkO4pPqxf8sqgXzGKnw8H9q9iztPLUBYe7BzdE1CQZTYW5OaPsC4DQ8T1f00vQ4gNw1i');
const braintree = require('braintree');

app.use(express.urlencoded({extended: true})); 
app.use(express.json());   

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: "598r5zgwmgfv667v",
  publicKey: "5jcnb53bjbxyvfks",
  privateKey: "c0326b38fca00d429547f586acd89936"
});

app.get('/braintree_client_token', async (req, res) => {
  try {
    const clientToken = await gateway.clientToken.generate({});
    res.send(clientToken);
  } catch (error) {
    console.log('error with getting clientToken');
  }
});

app.get('/price', async (req, res) => {
  try {
    const price = await stripe.prices.retrieve('price_1IVavXJ44jiWqwK1aUe51ym6');
    res.send({
      currency: price.currency,
      amount: price.unit_amount
    });  
  } catch (error) {
    res.status(500).send(error);
  }
})

app.post("/braintree_purchase", async (req, res) => {
  const nonceFromTheClient = req.body.nonce;
  const amount = req.body.amount;
  const result = await gateway.transaction.sale({
    amount: amount,
    paymentMethodNonce: nonceFromTheClient,
    options: {
      submitForSettlement: true
    }
  }); 
  res.send({
    success: result.success,
    amount: result.transaction.amount,
    currency: result.transaction.currencyIsoCode,
    shopName: result.transaction.merchantAccountId,
    date: result.transaction.createdAt,
    paymentType: result.paymentInstrumentType
  });
});


app.post('/create-checkout-session', async (req, res) => {
  const {quantity, locale} = req.body;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    locale: locale,
    line_items: [
      {
        price: 'price_1IVavXJ44jiWqwK1aUe51ym6',
        quantity: quantity
      },
    ],
    mode: 'payment',
    success_url: 'http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: 'http://localhost:3000/cancel',
  });

  res.json({ id: session.id });
});

app.listen(4242, () => console.log(`Listening on port ${4242}!`));
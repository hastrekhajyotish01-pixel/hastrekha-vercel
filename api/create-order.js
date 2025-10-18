import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { customer_name, customer_email, customer_phone } = req.body;

    const appId = process.env.CASHFREE_APP_ID;
    const secretKey = process.env.CASHFREE_SECRET_KEY;

    const response = await fetch("https://sandbox.cashfree.com/pg/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-id": appId,
        "x-client-secret": secretKey,
        "x-api-version": "2022-09-01",
      },
      body: JSON.stringify({
        order_id: "order_" + Date.now(),
        order_amount: 199,
        order_currency: "INR",
        customer_details: {
          customer_id: "cust_" + Date.now(),
          customer_name,
          customer_email,
          customer_phone,
        },
        order_meta: {
          return_url: "https://www.hastrekhajyotish.info/thank-you"
        }
      }),
    });

    const data = await response.json();

    if (data.payment_link) {
      return res.status(200).json({ payment_link: data.payment_link });
    } else {
      return res.status(400).json({ error: data.message || "Failed to create order" });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}

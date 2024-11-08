import express from "express";
import cors from "cors";
import { sql } from '@vercel/postgres';

const app = express();

app.use(cors());
app.use(express.json());

app.post("/webhook", async (request, response) => {
  try {
    console.log("Request Headers:", request.headers);
    console.log("Request Body:", request.body);

    const { contact_id, plan_order_id } = request.body.data;

    const result = await sql`
      INSERT INTO subscriptions_wix (contact_id, plan_order_id)
      VALUES (${contact_id}, ${plan_order_id})
      RETURNING *;
    `;

    console.log("Data saved to database:", result);

  } catch (err) {
    console.error(err);
    response
      .status(500)
      .send(`Webhook error: ${err instanceof Error ? err.message : err}`);
    return;
  }

  response.status(200).send();
});

app.get("/api/test", async (request, response) => {
  console.log("test");

  response.status(200).send();
});

app.listen(3000, () => console.log("Server started on port 3000"));

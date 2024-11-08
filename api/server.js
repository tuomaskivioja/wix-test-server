import express from "express";
import cors from "cors";
import { OAuthStrategy, createClient } from "@wix/sdk";
import { orders } from "@wix/pricing-plans";
const app = express();

app.use(cors());

const client = createClient({
    auth: OAuthStrategy({
        clientId: `52e4ff0a-299a-4fe1-94b3-ec9212364b7d`,
      }),
  modules: { orders },
});

client.orders.onOrderCreated((event) => {
  console.log(`onOrderCreated event received with data:`, event);
  //
  // Handle your event here
  //
});

app.post("/webhook", express.text(), async (request, response) => {
  try {
    await client.webhooks.process(request.body);
  } catch (err) {
    console.error(err);
    response
      .status(500)
      .send(`Webhook error: ${err instanceof Error ? err.message : err}`);
    return;
  }

  response.status(200).send();
});

app.post("/api/test", async (request, response) => {
  console.log("test");

  response.status(200).send();
});

app.listen(3000, () => console.log("Server started on port 3000"));

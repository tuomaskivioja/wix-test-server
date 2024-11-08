import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();

app.use(cors());
app.use(express.json());

const subscriptionsFilePath = path.join(__dirname, "subscriptions.json");

// Helper function to read subscriptions from the JSON file
function readSubscriptions() {
  try {
    const data = fs.readFileSync(subscriptionsFilePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading subscriptions file:", err);
    return [];
  }
}

// Helper function to write subscriptions to the JSON file
function writeSubscriptions(subscriptions) {
  try {
    fs.writeFileSync(subscriptionsFilePath, JSON.stringify(subscriptions, null, 2));
  } catch (err) {
    console.error("Error writing to subscriptions file:", err);
  }
}

app.post("/webhook", (request, response) => {
  try {
    console.log("Request Headers:", request.headers);
    console.log("Request Body:", request.body);

    const { contact_id, plan_order_id } = request.body.data;

    // Read existing subscriptions
    const subscriptions = readSubscriptions();

    // Add new subscription
    subscriptions.push({ contact_id, plan_order_id, timestamp: new Date().toISOString() });

    // Write updated subscriptions back to the file
    writeSubscriptions(subscriptions);

    console.log("Subscription saved:", { contact_id, plan_order_id });

  } catch (err) {
    console.error(err);
    response
      .status(500)
      .send(`Webhook error: ${err instanceof Error ? err.message : err}`);
    return;
  }

  response.status(200).send();
});

app.get("/api/test", (request, response) => {
  console.log("test");

  response.status(200).send();
});

app.listen(3000, () => console.log("Server started on port 3000"));

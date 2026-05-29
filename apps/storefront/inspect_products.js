const { Client } = require('pg');

const client = new Client({
  host: "52.4.160.253",
  port: 5432,
  user: "neondb_owner",
  password: "npg_t62ajzRmpfGA",
  database: "neondb",
  ssl: {
    rejectUnauthorized: false,
    servername: "ep-floral-butterfly-aplmjkuq-pooler.c-7.us-east-1.aws.neon.tech" // Sends correct SNI hostname over direct IP!
  }
});

async function main() {
  await client.connect();
  console.log("Connected to database successfully!");

  // Inspect sales channels
  const scRes = await client.query("SELECT id, name, description FROM sales_channel;");
  console.log("\n=== SALES CHANNELS ===");
  console.log(scRes.rows);

  // Inspect products count and sample
  const prodRes = await client.query("SELECT id, title, handle, status FROM product LIMIT 50;");
  console.log("\n=== PRODUCTS (SAMPLE) ===");
  console.log(prodRes.rows);

  // Inspect product_sales_channel mapping
  const pscRes = await client.query("SELECT * FROM product_sales_channel;");
  console.log("\n=== PRODUCT SALES CHANNEL MAPPINGS ===");
  console.log(pscRes.rows);

  await client.end();
}

main().catch(console.error);

const mongoose = require('mongoose');
require('dotenv').config({ path: './server/.env' });

async function test() {
  try {
    console.log("Connecting to", process.env.DATABASE_URL);
    await mongoose.connect(process.env.DATABASE_URL, { dbName: process.env.DATABASE_NAME });
    console.log("Connected. Testing find...");
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("Collections:", collections.map(c => c.name));
    console.log("Done.");
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}
test();

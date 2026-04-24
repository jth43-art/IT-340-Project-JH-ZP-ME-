const {MongoClient} = require("mongodb"); // run: mongodb://100.84.183.114:27017/tunevault
const client = new MongoClient("mongodb://100.84.183.114:27017");

async function test90 {
  await client.connect();
  console.log("Connected to DB");

  const db = client.db("tunevault");
  const users = db.collection("users");

  const allUsers = await users.find().toArray();
  console.log(allUsers);

  await client.close();
}

test().catch(console.error);

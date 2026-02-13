export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message required" });
  }

  const BOT_TOKEN = process.env.BOT_TOKEN;
  const FIREBASE_DB = "https://cgt-trader-default-rtdb.firebaseio.com";

  try {

    const usersRes = await fetch(`${FIREBASE_DB}/users.json`);
    const users = await usersRes.json();

    if (!users) {
      return res.status(400).json({ error: "No users found" });
    }

    let sent = 0;

    for (let userId in users) {

      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: userId,
          text: message
        })
      });

      sent++;
    }

    return res.status(200).json({
      success: true,
      sent
    });

  } catch (error) {
    return res.status(500).json({
      error: "Server error",
      details: error.message
    });
  }
} 

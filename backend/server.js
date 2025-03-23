const http = require("http");
const url = require("url");
const client = require("./db");

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);

  console.log(`📢 Received request: ${req.method} ${parsedUrl.pathname}`);

  // 📌 GET: Retrieve all users
  if (parsedUrl.pathname === "/users" && req.method === "GET") {
    try {
      const result = await client.query("SELECT * FROM users");
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(result.rows));
    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({ error: "Database query failed", details: err.message })
      );
    }
  }

// 📌 POST: Add a new user
else if (parsedUrl.pathname === "/users" && req.method === "POST") {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });
  req.on("end", async () => {
    console.log("📡 Received data:", body);
    try {
      const { name, email } = JSON.parse(body);
      const result = await client.query(
        "INSERT INTO public.users (name, email) VALUES ($1, $2) RETURNING *", // ✅ Corrected SQL
        [name, email]
      );
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify(result.rows[0]));
    } catch (err) {
      console.error("❌ Failed to insert user:", err);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          error: "Failed to insert user",
          details: err.message,
        })
      );
    }
  });
}

  
  

  // 📌 404: Not Found
  else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Not Found" }));
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

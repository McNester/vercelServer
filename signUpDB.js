const http = require('http');
const { Pool } = require('pg');
const url = require('url');
const queryString = require('querystring');

const pool = new Pool({
  connectionString: "postgres://default:IdCSa1vmw4ZW@ep-twilight-forest-10679423-pooler.ap-southeast-1.postgres.vercel-storage.com/verceldb",
  ssl: {
    rejectUnauthorized: false
  }
});

const server = http.createServer((req, res) => {
  if (req.method === 'POST') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      const parsedBody = queryString.parse(body);
      const { email, password } = parsedBody; // Extract data

      try {
        await pool.query('INSERT INTO profile (email, password) VALUES ($1, $2)', [email, password]);
        res.writeHead(201);
        res.end('User registered');
      } catch (err) {
        console.error(err);
        res.writeHead(500);
        res.end('Server error');
      }
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

const port = "https://vercel-server-iota-murex.vercel.app"
server.listen(port, () => {
  console.log(`Server is running on ${port}`);
});

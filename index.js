const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const app = express();
const port = 4000;

// Database configuration
const pool = new Pool({
  connectionString: "postgres://default:IdCSa1vmw4ZW@ep-twilight-forest-10679423-pooler.ap-southeast-1.postgres.vercel-storage.com/verceldb",
  ssl: {
    rejectUnauthorized: false
  }
});

app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies

function validateEmail(email) {
  var regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return regex.test(email);
}
function validatePassword(password) {
  var regex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{6,}$/;
  return regex.test(password);
}

// Route to handle registration
app.post('/', async (req, res) => {
  const { email, password } = req.body; // Get data from request body
  try {
    const result = await pool.query('SELECT * FROM profile WHERE email = $1', [email]);
    if (result.rows.length > 0) {
      res.status(401).send('User already exists');
    } else {
      //registration
      if(validateEmail(email) && validatePassword(password)){

        await pool.query('INSERT INTO profile (email, password) VALUES ($1, $2)', [email, password]);
        res.status(201).send('User registered');
      }else{
        res.status(403).send('email or password are invalid');
      }
    }


  
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});

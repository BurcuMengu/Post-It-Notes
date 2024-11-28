import express from "express";
import cors from 'cors';
import pkg from 'pg'; // Default import of the pg module
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import env from "dotenv";

env.config();

const { Pool } = pkg;  
const app = express();
const port = process.env.PORT;
const saltRounds = 10;

// PostgreSQL Pool connection
const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});

pool.connect();

// Get the directory name in ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Serve React build folder statically
app.use(express.static(path.join(__dirname, '..','client','build')));
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..','client','build', 'index.html'));
});

// CORS settings
app.use(cors({
    origin: 'http://localhost:3000', 
    methods: ['GET','POST','PUT','DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'] // Include any custom headers you may need
}));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Express session configuration
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: process.env.NODE_ENV,  // Secure cookie in production
        httpOnly: true,
        maxAge: 60 * 60 * 1000  // 1 hour validity
    }
}));

// Passport settings
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static("public"));

passport.use(new LocalStrategy({
    usernameField: "email", // The email field in the form
    passwordField: "password" // The password field in the form
}, async (email, password, done) => {
    try {
        const client = await pool.connect();
        const result = await client.query("SELECT * FROM users WHERE email = $1", [email]);

        if (result.rows.length === 0) {
            return done(null, false, { message: "Invalid credentials" });
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return done(null, false, { message: "Invalid credentials" });
        }

        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

/*
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/google/callback",
}, async (accessToken, refreshToken, profile, done) => {
    const { id, displayName, emails } = profile;
    const firstName = profile.given_name;
    const lastName = profile.family_name;

    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM users WHERE google_id = $1', [id]);

        if (result.rows.length > 0) {
            return done(null, result.rows[0]);
        } else {
            const newUser = await client.query(
                'INSERT INTO users (google_id, first_name, last_name, email, registration_date) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
                [id, firstName, lastName, emails[0].value]
            );
            return done(null, newUser.rows[0]);
        }
    } catch (err) {
        return done(err);
    }
}));
*/

// Serialize user
passport.serializeUser((user, done) => done(null, user.id));

// Deserialize user
passport.deserializeUser((id, done) => {
    pool.query('SELECT * FROM users WHERE id = $1', [id], (err, result) => {
        if (err) return done(err);
        done(null, result.rows[0]);
    });
});

/*
// Google OAuth login route
app.get('/auth/google', passport.authenticate('google', {
    scope: ['email', 'profile'],
}));

// Google OAuth callback route
app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        res.redirect('http://localhost:3000/notes');
    }
);
*/

// API endpoints

// Register endpoint
app.post('/api/register', async (req, res) => {
    const { email, password, firstName, lastName } = req.body;

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Add user to the database
        const client = await pool.connect();
        const result = await client.query(
            'INSERT INTO users (email, password, first_name, last_name, registration_date) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
            [email, hashedPassword, firstName, lastName]
        );
        client.release(); // Don't forget to release the client back to the pool

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error registering user' });
    }
});

// Login endpoint using LocalStrategy
app.post("/api/login", passport.authenticate("local", {
    successRedirect: "/notes",
    failureRedirect: "/login",
    failureFlash: true
}));

// Login endpoint with custom logic
app.post('/api/login', async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);

        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        req.login(user, (err) => {
            if (err) {
                return next(err);
            }
            res.json({ message: 'Login successful' });
        });

        client.release(); // Don't forget to release the client back to the pool
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error logging in' });
    }
});

/*
// CORS settings for the /api/login route (in case you want to handle it separately)
app.get('/api/login', cors({
    origin: process.env.REACT_APP_URL, // Ensure this matches your frontend URL
    methods: ['GET', 'POST'],
    credentials: true
}), (req, res) => {
    res.redirect('http://localhost:5000/notes'); // Redirect after successful login
});
*/

// Get notes
app.get('/api/notes', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM notes WHERE user_id = $1', [req.user.id]);
        res.json(result.rows);
        client.release();
    } catch (err) {
        return res.status(500).json({ message: 'Error retrieving notes' });
    }
});

// Add new note
app.post('/api/notes', async (req, res) => {
    const { content } = req.body;

    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const client = await pool.connect();
        const result = await client.query(
            'INSERT INTO notes (content, user_id) VALUES ($1, $2) RETURNING *',
            [content, req.user.id]
        );
        res.json(result.rows[0]);
        client.release();
    } catch (err) {
        return res.status(500).json({ message: 'Error adding note' });
    }
});

// Delete note
app.delete('/api/notes/:id', async (req, res) => {
    const { id } = req.params;

    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const client = await pool.connect();
        await client.query('DELETE FROM notes WHERE id = $1 AND user_id = $2', [id, req.user.id]);
        res.status(204).send();
        client.release();
    } catch (err) {
        return res.status(500).json({ message: 'Error deleting note' });
    }
});


// Check session endpoint
app.get('/api/check-session', (req, res) => {
    if (req.isAuthenticated()) {  // Check login status with Passport.js
        res.json({ user: req.user });  // Send user info
    } else {
        res.status(401).json({ message: "User not logged in" });  // Return error if not logged in
    }
});


// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


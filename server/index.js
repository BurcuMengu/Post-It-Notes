import express from "express";
import axios from "axios";
import cors from 'cors';
import pkg from 'pg'; // pg modülünü default import edin
import bodyParser from "body-parser";
import path from "path";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import env from "dotenv";

// .env dosyasındaki ortam değişkenlerini yükle
env.config();

const { Pool } = pkg;  // Pool'u pkg üzerinden alıyoruz
const app = express();
const port = process.env.REACT_APP_PORT;
const saltRounds = 10;

// PostgreSQL Pool bağlantısı
const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});

// Get the directory name in ES modules
const __dirname = new URL('.', import.meta.url).pathname;

// React build klasörünü statik olarak sunma
app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// CORS ayarları
app.use(cors({
    origin: process.env.REACT_APP_PORT, // React uygulamasının çalıştığı port
    methods: 'GET,POST',
    credentials: true
}));

// Express session yapılandırması
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));

// Passport ayarları
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Google OAuth stratejisi ile login işlemi
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/google/callback",
}, (accessToken, refreshToken, profile, done) => {
    const { id, displayName, emails } = profile;
    pool.query('SELECT * FROM users WHERE google_id = $1', [id], (err, result) => {
        if (err) return done(err);
        if (result.rows.length > 0) {
            return done(null, result.rows[0]);
        } else {
            pool.query(
                'INSERT INTO users (google_id, email, name) VALUES ($1, $2, $3) RETURNING *',
                [id, emails[0].value, displayName],
                (err, result) => {
                    if (err) return done(err);
                    return done(null, result.rows[0]);
                }
            );
        }
    });
}));

// Kullanıcıyı serialize etme
passport.serializeUser((user, done) => done(null, user.id));

// Kullanıcıyı deserialize etme
passport.deserializeUser((id, done) => {
    pool.query('SELECT * FROM users WHERE id = $1', [id], (err, result) => {
        if (err) return done(err);
        done(null, result.rows[0]);
    });
});

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

// API endpointleri

// Notları alma
app.get('/api/notes', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    pool.query('SELECT * FROM notes WHERE user_id = $1', [req.user.id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error retrieving notes' });
        }
        res.json(result.rows);
    });
});

// Yeni not ekleme
app.post('/api/notes', (req, res) => {
    const { content } = req.body;
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    pool.query(
        'INSERT INTO notes (content, user_id) VALUES ($1, $2) RETURNING *',
        [content, req.user.id],
        (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Error adding note' });
            }
            res.json(result.rows[0]);
        }
    );
});

// Notu silme
app.delete('/api/notes/:id', (req, res) => {
    const { id } = req.params;
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    pool.query('DELETE FROM notes WHERE id = $1 AND user_id = $2', [id, req.user.id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error deleting note' });
        }
        res.status(204).send();
    });
});

// Sunucuyu başlatma
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

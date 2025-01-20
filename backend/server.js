import express from "express";
import cors from "cors"; // for api
import env from "dotenv"; // env
import passport from "passport"; // for auth
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import session from "express-session"; // session handling

// Load env
env.config({
    path: "../envs/.env"
});

// Ensure SESSION_SECRET is defined
if (!process.env.SESSION_SECRET) {
    throw new Error("SESSION_SECRET is not defined in environment variables.");
}

// TODO: (Ishita) implement mongodb as session-store
const app = express();
const port = process.env.APP_PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
// for api
app.use(cors());

app.use(session({
    secret: process.env.SESSION_SECRET,  // Ensure a secure key
    resave: false,
    saveUninitialized: false,
    // TODO: (Ishita) Use Mongodb for session store here
}));

// Initialize passport and session handling
app.use(passport.initialize());
app.use(passport.session());

// Google auth strategy middleware
passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.APPURL}/auth/google/callback`
    },
    function (accessToken, refreshToken, profile, cb) {
        User.findOrCreate({ googleId: profile.id }, function (err, user) {
            return cb(err, user);
        });
    }));

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/public/index.html'); // Example for sending a file
});

app.get("/dashboard", (req, res) => {
    res.send("Dashboard page"); // Placeholder response
});

// TODO: (Ishita) Connect socket.io to client

app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('/dashboard');
        console.log("Login successful: ", req.user);
    });

passport.serializeUser((user, done) => {
    done(null, user.id);  // Serialize user by their ID
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {  // Find user by ID
        done(err, user);
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

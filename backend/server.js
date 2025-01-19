import express from "express";
import cors from "cors"; // for api
import env from "dotenv"; // env
import passport from "passport"; // for auth
import {Strategy as SpotifyStrategy} from "passport-spotify";
import session from "express-session"; // session handling

//TODO: (Ishita) implement mongodb as session-store

const app = express();
const port = process.env.APP_PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
//for api
app.use(cors());

app.use(session({
    secret: process.env.SESSION_SECRET,  // Replace with a secure key
    resave: false,
    saveUninitialized: false,
    // TODO: (Ishita) Use Mongodb for session store here
}));

// TODO: (Rehmatjot) Get passportjs auth working
app.use(passport.initialize());
app.use(passport.session());

//env file is in repo root
env.config({
    path: "../.env"
})

//spotify auth strategy middleware
passport.use(new SpotifyStrategy({
    clientID: process.env.SPOTFIY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    callbackURL: `${process.env.APPURL}/auth/spotify/callback`
}, function (accessToken, refreshToken, expires_in, profile, done) {
    User.findOrCreate({spotifyId: profile.id}, function (err, user) {
        return done(err, user);
    });
}));

app.get("/", (req, res) => {
    //TODO: (Ishita) send landing page (check frontend directory)
});

app.get("/dashboard", (req, res) => {
    //TODO: (Ishita) send dashboard page
});


app.get(
    '/auth/spotify',
    passport.authenticate('spotify', {
        //https://developer.spotify.com/documentation/web-api/concepts/scopes#user-modify-playback-state
        scope: ['user-read-email', 'user-read-private']
    })
);

// TODO: (Rehmatjot) Add spotify callback endpoint get and set success and failiure redirect

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
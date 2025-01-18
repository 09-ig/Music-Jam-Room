import express from "express";
import cors from "cors";
import {Strategy as SpotifyStrategy} from "passport-spotify";
import env from "dotenv";
import passport from "passport";

const app = express();
const port = process.env.APP_PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(cors());

env.config({
    path: "../.env"
})

//Spotify Auth Middleware
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
    //send landing page
});

app.get("/dashboard", (req, res) => {
    //send dashboard page
});

app.get("/dashboard", (req, res) => {
    //send dashboard page
});


//Spotify auth page
app.get(
    '/auth/spotify',
    passport.authenticate('spotify', {
        scope: ['user-read-email', 'user-read-private']
    })
);

app.get('/auth/spotify/callback', passport.authenticate('spotify',
        {failureRedirect: '/login'}),
    function (req, res) {
        // successful authentication, redirect to dashboard.
        res.redirect('/dashboard');
    });


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})

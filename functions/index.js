const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// const express = require("express");
// const app = express();
// app.get("*", (req, res) => {
//   res.send("Hello from the API");
// });
// exports.api = functions.https.onRequest(app);

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mysql = require("mysql");
const cors = require("cors");


let config = {
    user: process.env.SQL_USER,
    database: process.env.SQL_DATABASE,
    password: process.env.SQL_PASSWORD,
}

if (process.env.INSTANCE_CONNECTION_NAME && process.env.NODE_ENV === 'production') {
  config.socketPath = `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`;
}

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.post("/api/search", (require, response) => {
    console.log("Searching");

    songName = require.body.songName;
    year = require.body.year;
    genre = require.body.genre;
    length = require.body.length;
    isExplicit = require.body.explicit;
    artist = require.body.artist;
    var i = isExplicit ? 1 : 0;
    explicit = " s.Explicit =" + i.toString();

    if (songName.length) {
        songName = " LOWER(s.Song_Name) LIKE '%" + songName + "%'";
    }
    
    if (year.length) {
        year = " s.Release_year = " + year;
    }
    if (genre.length) {
        genre = " LOWER(s.Genre_Name) LIKE '%" + genre + "%'";
    }
    if (length.length) {
        length = " s.Length =" + length;
    }
    if (artist.length) {
        artist = " LOWER(a.Name) LIKE '%" + artist + "%'";
    }
    
    if (songName.length && (year.length ||genre.length || length.length || artist.length ||explicit.length)) {
        songName = songName + " AND ";
    }
    if (year.length && (genre.length || length.length || artist.length || explicit.length)) {
        year = year + " AND ";
    }
    if (genre.length && (length.length || artist.length || explicit.length)) {
        genre = genre + " AND ";
    }
    if (length.length && (explicit.length || artist.length)) {
        length = length + " AND ";
    }
    if (artist.length && explicit.length) {
        artist = artist + " AND ";
    }
    const sqlSearch = "SELECT s.Song_Name, a.Name AS Artist_Name, s.Release_year, s.length/1000 AS Length_in_Sec, s.genre_name AS Genre, s.explicit AS Explicit" + 
    " FROM Song s JOIN artist a ON s.ArtistID = a.Name "+
    " WHERE " + songName + year + genre + length +  artist + explicit;
    // console.log(sqlSearch)
    db.query(sqlSearch, function (err, rows) {
        if (err) throw err;
        response.send(rows);
        console.log(rows)
        
      });
      console.log("Clicked Search ");
});
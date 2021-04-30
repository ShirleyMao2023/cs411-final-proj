const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mysql = require("mysql");
const cors = require("cors");


var db = mysql.createConnection({
    host:'35.226.42.138',
    user: 'root',
    password:'Mhz1KjwHvseamjt7',
    database:'SongSearch',
})

db.connect(function(err) {
    if (err) throw err;
    var sql = "SELECT Count(*) FROM artist";
    db.query(sql, function (err, rows) {
      if (err) throw err;
      console.log(JSON.stringify(rows) + " Things in Artist Table");
    });
    console.log("connection success");
  });

app.get('/', (require, response) => {
    response.send("Hello world!!!");
})

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.get("/api/get", (require, response) => {
    var sql = "Select DISTINCT COUNT(Song.SongId) SongNum, Song.Genre_Name "+
    "FROM Query JOIN Song on Query.SongId = Song.SongId " + 
    "GROUP BY Song.Genre_Name " +
    "ORDER BY SongNum ASC " +
    "LIMIT 15;";
    db.query(sql, function (err, rows) {
      if (err) throw err;
      response.send(rows);
    });
    console.log("Clicked AdvSearch");
});
app.get("/api/popular", (require, response) => {
    var sql = "Select * FROM NewTable1 "+
    "WHERE year_popularity LIKE 'Popular' " + 
    "LIMIT 5;";
    db.query(sql, function (err, rows) {
      if (err) throw err;
      response.send(rows);
    });
    console.log("Clicked AdvSearch");
});
app.get("/api/popular2", (require, response) => {
    var sql = "Select * FROM NewTable2 "+
    "WHERE artist_popularity LIKE 'Popular' " + 
    "LIMIT 5;";
    db.query(sql, function (err, rows) {
      if (err) throw err;
      response.send(rows);
    });
    console.log("Clicked AdvSearch");
});
app.get("/api/popular3", (require, response) => {
    var sql = "Select * FROM NewTable3 "+
    "WHERE genre_popularity LIKE 'Popular' " +
    "ORDER BY genre_name DESC "+ 
    "LIMIT 5;";
    db.query(sql, function (err, rows) {
      if (err) throw err;
      response.send(rows);
    });
    console.log("Clicked AdvSearch");
});

app.post("/api/insert", (require, response) => {
    const songName = require.body.songName;
    const year = require.body.year;
    const genre = require.body.genre;
    const length = require.body.length;
    const explicit = require.body.explicit;
    const artistID = require.body.artistID;
    const mode = require.body.mode;
    var exp = explicit ? 1 : 0;
    strMssg = "";

    const sqlInsert = "INSERT INTO Song (SongId, Song_Name, ArtistID,Release_year, Length, Explicit, Mode, Genre_Name) VALUES (?,?,?,?,?,?,?,?)";
    const tableCount = "SELECT Count(*) FROM Song";
    db.query(sqlInsert, ["",songName,artistID, parseInt(year), parseInt(length), exp, parseInt(mode), genre], function (err, rows) {
        if (err) throw err;
        console.log("Success! " + JSON.stringify(rows));
      });
    // db.query(tableCount, function (err, rows) {
    //     if (err) throw err;
    //     response.send(strMssg + "After => " +JSON.stringify(rows));
    //     console.log("After => " + JSON.stringify(rows));
    // });    
});

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
app.post("/api/lookup", (require, response) => {
    console.log("Lookup");
    artist = require.body.artist;
    
    const sqlSearch = "SELECT  ArtistId, Name FROM artist WHERE Name LIKE '%" + artist+"%'";
    // console.log(sqlSearch)
    db.query(sqlSearch, function (err, rows) {
        if (err) throw err;
        response.send(rows);
        
      });
      console.log("Clicked Lookup ");
});
app.post("/api/delete", (require, response) => {
    console.log("deleteUser");
    userID = require.body.userID;

    const sqlDelete = "DELETE FROM Account "+
    " WHERE UserID LIKE '" + userID + "'";
    console.log(sqlDelete);
    db.query(sqlDelete, function (err, rows) {
        if (err) throw err;
        console.log("DELETE Success! " + JSON.stringify(rows));
      });
});

app.put("/api/update/", (require, response) => {
    const artistId = require.body.artistId;
    const songNum = require.body.songNum;
    const artistName = require.body.artistName;
    strMssg = "";
    const sqlQUERY = "SELECT * FROM artist WHERE ArtistId LIKE ?";
    db.query(sqlQUERY, [artistId], (err, rows) => {
        if (err) 
        console.log(error);
        strMssg += "Before => " +JSON.stringify(rows);
    })
    const sqlUpdate = "UPDATE artist SET song_num = ? WHERE ArtistId LIKE ? OR Name LIKE ?";
    db.query(sqlUpdate, [songNum, artistId, artistName], (err, result) => {
        if (err) 
        console.log(error);
    })
    db.query(sqlQUERY, [artistId], (err, rows) => {
        if (err) 
        console.log(error);
        response.send(strMssg + "After => " +JSON.stringify(rows));
    })
});

app.post("/api/newUser", (require, response) => {
    const name = require.body.name;
    const email = require.body.email;
    const password = require.body.password;
    strMssg = "";

    const sqlInsert = "INSERT INTO Account (UserID, Name, Email, Password) VALUES (?,?,?,?)";
    db.query(sqlInsert, ['',name, email, password], function (err, rows) {
        if (err) throw err;
        console.log("Success! " + JSON.stringify(rows));
      });  
    const sqlQUERY = "SELECT * FROM Account WHERE email LIKE '"+email +"'";
    db.query(sqlQUERY,(err, rows) => {
        if (err) 
        console.log(rows);
        response.send(rows);
    })
});

app.post("/api/checkUser", (require, response) => {
    email = require.body.email;
    password = require.body.password;
    
    const sqlSearch = "SELECT * FROM Account WHERE Email LIKE '" + email+"'" + "AND Password LIKE '" + password+"'";
    db.query(sqlSearch, function (err, rows) {
        if (err) throw err;
        response.send(rows);
        
      });
      console.log("Clicked Lookup ");
});

app.listen(3002, () => {
    console.log("running on port 3002");
})


// DELIMITER //
// create TRIGGER uniqueSafeInsert
//     before insert on Song
//     for each row
//     begin
//     if 0 < (select count(*) from Song where Song.Song_Name = NEW.Song_Name and Song.ArtistID = New.ArtistID) then
//         SIGNAL SQLSTATE '45000'
//         SET message_text  = 'Song with same name and artist already exists, update existing records instead.';
//     end if;
//     if 0 < (select count(*) from Song where Song.ArtistID = New.ArtistID) then
//         set NEW.SongId = (SELECT UUID());
//         update artist set song_num = song_num + 1
//         where artist.Name = NEW.ArtistId;
//     else  
//         set NEW.SongId = (SELECT UUID());
//         Insert into artist values((SELECT UUID()), new.ArtistID, 1);
//     end if;
// end;
// DELIMITER //
// create TRIGGER newAccount
//     before insert on Account
//     for each row
//     begin

//     if 0 < (select count(*) from Account where Account.Email = NEW.Email) then
//         SIGNAL SQLSTATE '45000'
//         SET message_text  = 'Email Already in use.';
//     end if;
//     set NEW.UserID = (SELECT UUID());
// end;
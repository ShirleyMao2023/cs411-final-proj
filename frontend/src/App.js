import './App.css';
import React, {useState, useEffect, Component} from "react";
import Axios from 'axios';
// import styled, { css } from 'styled-components';
// import ReactTable from "react-table"; 
// import 'react-table/react-table.css'

function App() {
  const [songName, setSongName] = useState('');
  const [year, setYear] = useState('');
  const [genre, setGenre] = useState('');
  const [artist, setArtist] = useState('');
  const [length, setLength] = useState('');
  const [mode, setMode] = useState('');
  const [artistID, setArtistID] = useState('');
  const [explicit, setExplicit] = useState(false);

  const [email, setEmail] = useState('');
  var userID = '';
  const [password, setPassword] = useState('');
  var userName = '';
  const [name, setName] = useState('');
  
  var isLoggedIn =false;

  const InsertNewSong = () => { 
    Axios.post('http://localhost:3002/api/insert', {
      songName: songName,
      year: year,
      genre: genre,
      length: length,
      explicit: explicit,
      artistID: artistID,
      mode:mode

    }).then((response) => {
      document.getElementById("DisplayDivAddSong").innerHTML = "New Song Added! \n";
    });
  };

  const SearchDB = () => { 
    Axios.post('http://localhost:3002/api/search', {
      songName: songName,
      year: year,
      genre: genre,
      length: length,
      explicit: explicit,
      artist: artist

    }).then((response) => {
      
      var retStr = "<p>Song_Name   Artist_Name  Release_year  Length_in_Sec   Genre   Explicit</p>"
      response.data.forEach((obj, index, array) => {
        retStr += "<p>"+ obj.Song_Name + "  "+ obj.Artist_Name + "  " +
        obj.Release_year + "  " + obj.Length_in_Sec + "  " + 
        obj.Genre + " " + obj.Explicit + "</p>";
      });
      console.log(retStr);
      document.getElementById("DisplayDiv").innerHTML = retStr;
    });

  };
  // const UpdateDB = () => { 
  //   Axios.put(`http://localhost:3002/api/update`, {
  //     artistId: artistId,
  //     songNum: songNum,
  //     artistName: artistName
  //   }).then((response) => {
  //     console.log(response.data)
  //     document.getElementById("DisplayDiv").innerHTML =  "Updated!\n" + JSON.stringify(response.data);
  //   });
  // //   setNewReview("")
  //   // document.getElementById("DisplayDiv").innerHTML = "Updated!";
  // };
  // const DeleteRow = () => { 
  //   Axios.post('http://localhost:3002/api/delete', {
  //     artistId: artistId,
  //     songNum: songNum,
  //     artistName: artistName

  //   }).then((response) => {
  //     console.log(response.data)
  //     document.getElementById("DisplayDiv").innerHTML = "Deleted!\n" + JSON.stringify(response.data);
  //   });
  // };

  const Lookup = () => { 
    Axios.post('http://localhost:3002/api/lookup', {
      artist: artist
    }).then((response) => {
      var retStr = "<p>ArtistId Name</p>"
      response.data.forEach((obj, index, array) => {
        retStr += "<p>"+ obj.ArtistId + "  "+ obj.Name + "</p>";
      });
      console.log(retStr);
      document.getElementById("DisplayDivArtistID").innerHTML = retStr;
    });
  };

  const createAccount= () => { 
    console.log(checkFilled());
    if (checkFilled()) {
      document.getElementById("requireMessage").style.visibility = "hidden";

      isLoggedIn = true;
      Axios.post('http://localhost:3002/api/newUser', {
      name: name,
      email: email,
      password: password
      }).then((response) => {
        userID = response.data[0].UserID;
        loginView();
      });

    } else {
      document.getElementById("requireMessage").style.visibility = "visible";
    }
  };

  const deleteAccount= () => {

    
    Axios.post('http://localhost:3002/api/delete', {
      userID:userID
    }).then((response) => {
      var retStr = "<p>ArtistId Name</p>"
      response.data.forEach((obj, index, array) => {
        retStr += "<p>"+ obj.ArtistId + "  "+ obj.Name + "</p>";
      });
      console.log(retStr);
      document.getElementById("DisplayDivArtistID").innerHTML = retStr;
    });
    logOutView();
    console.log("deleteAccount");
  };

  const Login= () => { 
    console.log(checkFilled());
    if (checkFilled()) {
      document.getElementById("requireMessage2").style.visibility = "hidden";
      Axios.post('http://localhost:3002/api/checkUser', {
      email: email,
      password: password
      }).then((response) => {
        
        console.log(response.data.length);
        if (response.data.length > 0) {
          userName = response.data[0].Name;
          userID = response.data[0].UserID;
          loginView();
        } else {
          document.getElementById("requireMessage2").innerHTML = "Incorrect email or password!";
          document.getElementById("requireMessage2").style.visibility = "visible";
        }
        // isLoggedIn = true;
        console.log("TRY LOGGING IN");
        // loginView();
      });

    } else {
      document.getElementById("requireMessage2").style.visibility = "visible";
    }
    console.log("returning User")
  };

  function viewSearch() {
    document.getElementById("search").style.display = "block";
    document.getElementById("login").style.display = "none";
    document.getElementById("signUp").style.display = "none";
    document.getElementById("addNew").style.display = "none";
    document.getElementById("popular").style.display = "none";
    document.getElementById("accountInfo").style.display = "none";
    setSongName("");
    setYear("");
    setGenre("");
    setArtist("");
    setLength("");
    var x = document.getElementsByTagName("INPUT");
    for(var i=0; i < x.length; i++) {
      x[i].value = '';
    }
    document.getElementById("check").checked = false;
    setExplicit(false);
    
    console.log("Search");
    document.getElementById("DisplayDiv").innerHTML = "";
  }
  function viewLogin() {
    document.getElementById("search").style.display = "none";
    document.getElementById("login").style.display = "block";
    document.getElementById("signUp").style.display = "none";
    document.getElementById("addNew").style.display = "none";
    document.getElementById("popular").style.display = "none";
    document.getElementById("accountInfo").style.display = "none";
    var x = document.getElementsByTagName("INPUT");
    for(var i=0; i < x.length; i++) {
      x[i].value = '';
    }
    document.getElementById("check").checked = false;
    setExplicit(false);
    console.log("Login");
  }
  function viewSignUp() {
    document.getElementById("search").style.display = "none";
    document.getElementById("login").style.display = "none";
    document.getElementById("signUp").style.display = "block";
    document.getElementById("addNew").style.display = "none";
    document.getElementById("popular").style.display = "none";
    document.getElementById("accountInfo").style.display = "none";
    var x = document.getElementsByTagName("INPUT");
    for(var i=0; i < x.length; i++) {
      x[i].value = '';
    }
    document.getElementById("check").checked = false;
    setExplicit(false);
    console.log("Login");
  }
  function viewNewAdd() {
    document.getElementById("search").style.display = "none";
    document.getElementById("login").style.display = "none";
    document.getElementById("signUp").style.display = "none";
    document.getElementById("addNew").style.display = "block";
    document.getElementById("popular").style.display = "none";
    document.getElementById("accountInfo").style.display = "none";
    var x = document.getElementsByTagName("INPUT");
    for(var i=0; i < x.length; i++) {
      x[i].value = '';
    }
    document.getElementById("check").checked = false;
    setExplicit(false);
    console.log("Add");
  }
  function viewAccount() {
    document.getElementById("search").style.display = "none";
    document.getElementById("login").style.display = "none";
    document.getElementById("signUp").style.display = "none";
    document.getElementById("addNew").style.display = "none";
    document.getElementById("popular").style.display = "none";
    document.getElementById("accountInfo").style.display = "block";
    var x = document.getElementsByTagName("INPUT");
    for(var i=0; i < x.length; i++) {
      x[i].value = '';
    }
    document.getElementById("check").checked = false;
    setExplicit(false);
    console.log("Add");
  }
function loginView() {
  toggle("beforeLogin", "none");
  toggle("afterLogin", "block");
  console.log(userID);
  if (userName.length == 0) {
    userName = name;
  }
  document.getElementById("greeting").innerHTML = "Hi " + userName + "!";
  viewAccount();

}
function logOutView() {
  toggle("beforeLogin", "block");
  toggle("afterLogin", "none");
  console.log(userID);
  if (userName.length == 0) {
    userName = name;
  }
  userID = "";
  userName = "";
  setName("");
  setEmail("");
  setPassword("");
  // document.getElementById("greeting").innerHTML = "Hi " + userName + "!";
  viewSearch();

}
function checkFilled() {
  var a = document.getElementById('requireName').value.split(" ").join("")
  var b = document.getElementById('requireEmail').value.split(" ").join("")
  var c = document.getElementById('requirePassword').value.split(" ").join("")
  var d = document.getElementById('requireEmail2').value.split(" ").join("");
  var e = document.getElementById('requirePassword2').value.split(" ").join("");
  return ( a != ""
    && b != ""
    && c != "") || (d && e);
}
function toggle(className, displayState){
  var elements = document.getElementsByClassName(className)

  for (var i = 0; i < elements.length; i++){
      elements[i].style.display = displayState;
  }
}
function viewPopular() {
  document.getElementById("search").style.display = "none";
  document.getElementById("login").style.display = "none";
  document.getElementById("signUp").style.display = "none";
  document.getElementById("addNew").style.display = "none";
  document.getElementById("accountInfo").style.display = "none";
  document.getElementById("popular").style.display = "block";
  Axios.get('http://localhost:3002/api/popular').then((response) => {
    document.getElementById("showPopular").innerHTML = JSON.stringify(response.data);
  });
  Axios.get('http://localhost:3002/api/popular2').then((response) => {
    document.getElementById("showPopular2").innerHTML = JSON.stringify(response.data);
  });
  Axios.get('http://localhost:3002/api/popular3').then((response) => {
    document.getElementById("showPopular3").innerHTML = JSON.stringify(response.data);
  });
  // Axios.get('http://localhost:3002/api/popular3').then((response) => {
  //   document.getElementById("showPopular3").innerHTML = JSON.stringify(response.data);
  // });
}
  return (
    <div className="App">

      <h1> S.S.S.T ~ Similar Song Search Tool</h1>
      <div className="navBar"> 
      <ul>
        <li><button className="alwaysVisible" onClick={viewSearch}>Search</button></li>
        <li><button className="alwaysVisible" onClick={viewPopular}>Popularity View</button></li>
        <li><button className="afterLogin" onClick={viewNewAdd}>Add New Song</button></li>
        <li><button className="beforeLogin"onClick={viewLogin}>Login</button></li>
        <li><button className="beforeLogin" onClick={viewSignUp}>Sign Up</button></li>
        <li><button className="afterLogin" onClick={viewAccount}>Account</button></li>
        <li><button className="afterLogin" onClick={logOutView}>Log Out</button></li>
      </ul>
      </div>
      <div id = "popular" className="toHide">
        <h3>Popular Year</h3>
        <div id="showPopular"> </div>
        <h3>Popular Artist</h3>
        <div id="showPopular2"> </div>
        <h3>Popular Genre</h3>
        <div id="showPopular3"> </div>
        </div>
      <div id = "accountInfo" className="signUp, toHide">
      <div className="form">
      <div className="container">
        <h1>Account Info</h1> 
        <h2 id="greeting"></h2>
        <button className = "searchButton" onClick={deleteAccount}> Delete Account!</button>
        </div>
        </div>
        </div>
      <div id = "signUp" className="signUp, toHide"> 

      <div className="form">
      <div className="container">
       
      <h1>Sign Up</h1> 
      <input id="requireName" type="text" name="Name" placeholder="Name" onChange={(e) => {
          var str = e.target.value.split(" ").join("");
          setName(str.toLowerCase())
        }}/>
        <input id="requireEmail" type="text" name="Email" placeholder="Email" onChange={(e) => {
          var str = e.target.value.split(" ").join("");
          setEmail(str.toLowerCase())
        }} />
        <input id="requirePassword" type="text" name="Password" placeholder="Password" onChange={(e) => {
          var str = e.target.value.split(" ").join("");
          setPassword(str.toLowerCase())
        }}/>
        <div>
        <h3 id= "requireMessage" className="notVisible"> Missing Fields! </h3>
        <button id="createAccount" className = "searchButton" onClick={createAccount}> Create Account!</button>
        </div>
      </div>
      </div>
      </div>
      <div id = "login" className="logIn, toHide">
        
        <div className="form">
      <div className="container">
      <h1>Login</h1>
        <input id="requireEmail2" type="text" name="Email" placeholder="Email" onChange={(e) => {
          var str = e.target.value.split(" ").join("");
          setEmail(str.toLowerCase())
        }}/>
        <input id = "requirePassword2" type="text" name="Password" placeholder="Password" onChange={(e) => {
          var str = e.target.value.split(" ").join("");
          setPassword(str.toLowerCase())
        }}/>
        <h3 id= "requireMessage2" className="notVisible"> Missing Fields! </h3>
        <button className = "searchButton" onClick={Login}> Login!</button>
      </div>
      </div>
        </div>
      <div id = "addNew"  className="addNew, toHide"> <div className="form">
      <div className="container">
        <h1>Add New Song!</h1>
      <div className="col">
        <input type="text" name="Song Name" placeholder="Song Name" onChange={(e) => {
          var str = e.target.value.split(" ").join("");
          setSongName(str.toLowerCase());
        }}/>
        <input type="text" name="Release_Year" placeholder="Release Year" onChange={(e) => {
          var str = e.target.value.split(" ").join("");
          setYear(str);
        }}/>
        <input type="text" name="Genre" placeholder="Genre" onChange={(e) => {
          var str = e.target.value.split(" ").join("");
          setGenre(str.toLowerCase());
        }}/>
        </div>
        <div className="col">
        <input type="text" name="ArtistID" placeholder="Artist Name" onChange={(e) => {
          var str = e.target.value.split(" ").join("");
          setArtistID(str.toLowerCase());
        }}/>
        <input type="text" name="Song Length" placeholder="Song Length in Sec" onChange={(e) => {
          var str = e.target.value.split(" ").join("");
          setLength(str);
        }}/>
        <input type="text" name="Song Mode" placeholder="Rating Out of 10" onChange={(e) => {
          var str = e.target.value.split(" ").join("");
          setMode(str);
        }}/>
        
        </div>
        <div className = "col">
        <div id = "addCheckDiv">
        <label>Explicit</label>
        <input id = "check" type="checkbox" name="Explicit" placeholder="Explicit" onChange={(e) => {
          setExplicit(document.getElementById('check').checked);
        }}/>
        </div>
        </div>
        </div>
      
        <button className = "searchButton" onClick={InsertNewSong}> Add Song</button>
        <div >
        <br></br>
        <p id= "DisplayDivAddSong"></p>
      </div>
        {/* <br></br>
        <h1 className="temp">Search ArtistID</h1>
        <input type="text" name="ArtistName" placeholder="ArtistName" onChange={(e) => {
          var str = e.target.value.split(" ").join("");
          setArtist(str.toLowerCase())
        }}/>
        <button className = "searchButton" onClick={Lookup}> Look Up ArtistID</button> */}
        <div >
        <br></br>
        <p id= "DisplayDivArtistID"></p>
      </div>
        
      
      </div></div>
      <div id = "search" className ="Search, currentView">
      <div className="form">
      <div className="container">
        <h1>Search</h1>
      <div className="col">
        <input type="text" name="Keyword(title)" placeholder="Keyword(title)" onChange={(e) => {
          var str = e.target.value.split(" ").join("");
          setSongName(str.toLowerCase())
        }}/>
        <input type="text" name="Year" placeholder="Year" onChange={(e) => {
          var str = e.target.value.split(" ").join("");
          setYear(str)
        }}/>
        <input type="text" name="Genre" placeholder="Genre" onChange={(e) => {
          var str = e.target.value.split(" ").join("");
          setGenre(str.toLowerCase())
        }}/>
        </div>
        <div className="col">
        <input type="text" name="Artist" placeholder="Artist" onChange={(e) => {
          var str = e.target.value.split(" ").join("");
          setArtist(str.toLowerCase())
        }}/>
        <input type="text" name="Song Length" placeholder="Song Length" onChange={(e) => {
          var str = e.target.value.split(" ").join("");
          setLength(str)
        }}/>
        <div id = "checkDiv">
        <label>Explicit</label>
        <input id = "check" type="checkbox" name="Explicit" placeholder="Explicit" onChange={(e) => {
          setExplicit(document.getElementById('check').checked);
        }}/>
        
        </div>
        </div>
        </div>
        <button className = "searchButton" onClick={SearchDB}> Search</button>
  
        
      
      <div >
        <br></br>
        <p id= "DisplayDiv"></p>
      </div>
      </div>
    </div>
    </div>
  );
}

export default App;
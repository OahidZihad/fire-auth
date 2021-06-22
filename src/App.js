import "./App.css";
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from "./firebase.config";
import { useState } from "react";

firebase.initializeApp(firebaseConfig);

function App() {
  const [user, setUser] = useState({
    isSignedIn: false,
    name: "",
    email: "",
    photo: "",
  });

  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSignIn = () => {
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((res) => {
        const { displayName, photoURL, email } = res.user;
        const signedInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL,
        };
        setUser(signedInUser);
        console.log(displayName, email, photoURL);
      })
      .catch((err) => {
        console.log(err);
        console.log(err.message);
      });
  };
  const handleSignOut = () => {
    firebase
      .auth()
      .signOut()
      .then((res) => {
        // Sign-out successful.
        const signedOutUser = {
          isSignedIn: false,
          name: "",
          photo: "",
          email: "",
        };
        setUser(signedOutUser);
      })
      .catch((err) => {
        // An error happened.
        console.log(err.message);
      });
  };
  const handleBlur = (event) => {
    console.log(event.target.name, event.target.value);
    if (event.target.name === "email") {
      const isEmailValid = /\S+@\S+\.\S+/.test(event.target.value);
      console.log(isEmailValid);
    }
    if (event.target.name === "password") {
      const isPasswordValid = event.target.value.length > 6;
      const passwordHasNumber = /\d{1}/.test(event.target.value);
      console.log(isPasswordValid && passwordHasNumber);
    }
  };
  const handleSubmit = () => {
    console.log();
  };
  return (
    <div className="App">
      {user.isSignedIn ? (
        <button onClick={handleSignOut}>Sign Out</button>
      ) : (
        <button onClick={handleSignIn}>Sign in</button>
      )}
      {user.isSignedIn && (
        <div>
          <img src={user.photo} alt=""></img>
          <p>Welcome {user.name}</p>
          <p>Email: {user.email}</p>
        </div>
      )}

      <h1>Our own Authentication</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="email"
          // onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Email"
          required
        />
        <br />
        <input
          type="password"
          name="password"
          // onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Password"
          required
        />
        <br />
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}

export default App;

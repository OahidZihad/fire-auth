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
    password: "",
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
          error: "",
          success: false,
        };
        setUser(signedOutUser);
      })
      .catch((err) => {
        // An error happened.
        console.log(err.message);
      });
  };
  const handleBlur = (event) => {
    let isFormValid = true;
    if (event.target.name === "email") {
      isFormValid = /\S+@\S+\.\S+/.test(event.target.value);
    }
    if (event.target.name === "password") {
      const isPasswordValid = event.target.value.length > 6;
      const passwordHasNumber = /\d{1}/.test(event.target.value);
      isFormValid = isPasswordValid && passwordHasNumber;
    }
    if (isFormValid) {
      const newUserInfo = { ...user };
      newUserInfo[event.target.name] = event.target.value;
      setUser(newUserInfo);
    }
  };
  const handleSubmit = (event) => {
    console.log(user.email, user.password);
    if (user.email && user.password) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(user.email, user.password)
        .then((res) => {
          console.log(res);
          const newUserInfo = { ...user };
          newUserInfo.error = "";
          newUserInfo.success = true;
          setUser(newUserInfo);
          // var user = userCredential.user;
        })
        .catch((error) => {
          const newUserInfo = { ...user };
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo);
          // var errorCode = error.code;
          // var errorMessage = error.message;
          // console.log(errorCode, errorMessage);
        });
    }
    event.preventDefault(); // submit korar por page reload hoy...
    // sei reload k bondho kortei preventDefault() function use kora hoy
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
          name="name"
          type="text"
          placeholder="Name"
          onBlur={handleBlur}
          required
        />
        <br />
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
      <p style={{ color: "red" }}>{user.error}</p>
      {user.success && (
        <p style={{ color: "green" }}>User Created Successfully</p>
      )}
    </div>
  );
}

export default App;

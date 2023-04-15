
import { GoogleAuthProvider, getAuth, signInWithPopup, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, FacebookAuthProvider } from "firebase/auth";
import "./App.css";
import { useState } from 'react';
import Tasks from "./components/Tasks.js";
import { Link } from "react-router-dom";
import XOGame from "./xoGame";
function Home() {

  const googleProvider = new GoogleAuthProvider();
  const facebookProvider = new FacebookAuthProvider();
  googleProvider.addScope("https://www.googleapis.com/auth/contacts.readonly");
  facebookProvider.addScope("user_birthday");
  const auth = getAuth();

  const [authorizedUser, setAuthorizedUser] = useState(false || sessionStorage.getItem("accessToken"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function signInwithGoogle() {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        // This gives you a Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        // Access token of user
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        if (user) {
          user.getIdToken().then((tkn) => {
            // set access token in session storage
            sessionStorage.setItem("accessToken", tkn);
            setAuthorizedUser(true);
          })
        }
        console.log(user);
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  }

  function signInwithFacebook() {
    signInWithPopup(auth, facebookProvider)
      .then((result) => {
        // The signed-in user info.
        const user = result.user;

        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        const credential = FacebookAuthProvider.credentialFromResult(result);
        const accessToken = credential.accessToken;
        if (user) {
          user.getIdToken().then((tkn) => {
            // set access token in session storage
            sessionStorage.setItem("accessToken", tkn);
            setAuthorizedUser(true);
          })
        }
        console.log(user);

        // IdP data available using getAdditionalUserInfo(result)
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        console.log(error)
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = FacebookAuthProvider.credentialFromError(error);
        console.log(errorCode, errorMessage)

        // ...
      });
  }

  function signInWithEmail() {
    console.log(`signInWithEmail`)
    console.log(email, password)
    createUserWithEmailAndPassword(auth, email, password).catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
    });
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        // sessionStorage.setItem("accessToken", user.accessToken);
        // setAuthorizedUser(true);
        // console.log(user)
        if (user) {
          user.getIdToken().then((tkn) => {
            // set access token in session storage
            sessionStorage.setItem("accessToken", tkn);
            setAuthorizedUser(true);
          })
        }
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage)
      });
  }
  function logoutUser() {
    signOut(auth).then(() => {
      // clear session storage
      sessionStorage.clear();
      setAuthorizedUser(false);
      // window.location.replace("/");
      alert('Logged Out Successfully');
    }).catch((error) => {
      // An error happened.
      alert(error);
    });
  }


  return (
    <div className="App">
      {authorizedUser ? (
        <>
          <p>Authorized user</p>
          <h1>Tasks</h1>
          <Tasks token={sessionStorage.getItem("accessToken")} />
          <div style={{ paddingBottom: "20px" }}>
          <Link to="/xoGame">toXOGame</Link>
          </div>
          <button onClick={logoutUser}>Logout Button</button>
        </>
      ) : (
        <>
          <div style={{ paddingBottom: "20px" }}>
            <div>
              <input placeholder="email" type="text" onChange={(e) => { setEmail(e.target.value) }} />
            </div>
            <div>
              <input placeholder="password" type="password" onChange={(e) => { setPassword(e.target.value) }} />
            </div>
            <button onClick={signInWithEmail}>signInWithEmail</button>
          </div>
          <button onClick={signInwithGoogle}>SignWithGoogle</button>
          <button onClick={signInwithFacebook}>SignWithFacebook</button>
        </>
      )}
    </div>
  );
}

export default Home;
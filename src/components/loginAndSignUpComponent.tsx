import React, { useState } from "react";
import ReactDOM from "react-dom/client";

import Login from "./login";
import SignUp from "./signUp";

function loginAndSignUp() {
  let [showSignUp, setShowSignUp] = useState(false);

  function changeShowSignUpFlag() {
    setShowSignUp(!showSignUp);
  }

  return (
    <>
      <h1>Movie Vault</h1>
      {showSignUp ? (
        <>
          <h2>Sign Up</h2>
          <SignUp />
          <button onClick={changeShowSignUpFlag}>Go to Login</button>
        </>
      ) : (
        <>
          <h2>Login</h2>
          <Login />
          <button onClick={changeShowSignUpFlag}>Sign Up</button>
        </>
      )}
    </>
  );
}

export default loginAndSignUp;

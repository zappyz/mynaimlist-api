// src/OAuth.js
import React, { useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const OAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if 'code' and 'state' parameters exist in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code"); // Extract the 'code' parameter
    const state = urlParams.get("state"); // Extract the 'state' parameter

    if (code && state) {
      // Store the 'code' and 'state' in cookies
      Cookies.set("CodeVerifier", code, { expires: 1 }); // Store code in cookie
      Cookies.set("state", state, { expires: 1 }); // Store state in cookie

      // Redirect to the homepage or any other page you want
      navigate("/"); // Redirect to homepage after successful authentication
    } else {
      console.error("Missing code or state in the URL");
    }
  }, [navigate]);

  return (
    <div>
      <h2>Processing OAuth Callback...</h2>
    </div>
  );
};

export default OAuth;

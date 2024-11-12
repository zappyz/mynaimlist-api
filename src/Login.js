import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom"; // Assuming you're using react-router for navigation

const Login = () => {
  const [code, setCode] = useState(null);
  const [state, setState] = useState(null);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    // Check if the URL has the 'code' and 'state' parameters (after the user is redirected back)
    const urlParams = new URLSearchParams(window.location.search);
    const codeFromUrl = urlParams.get('code');
    const stateFromUrl = urlParams.get('state');

    // If code is available in the URL, process the response
    if (codeFromUrl && stateFromUrl) {
      setCode(codeFromUrl);  // Store the code
      setState(stateFromUrl);  // Store the state

      // Optionally, store them in cookies or session storage
      Cookies.set("auth_code", codeFromUrl, { expires: 1 });
      Cookies.set("auth_state", stateFromUrl, { expires: 1 });

      // Exchange the code for an access token
      exchangeCodeForToken(codeFromUrl, stateFromUrl);

      // Clean the URL by replacing it to remove code and state query parameters
      window.history.replaceState({}, document.title, window.location.pathname);

      // After processing, navigate to the homepage or login page
      navigate("/");  // Redirect to homepage or desired page without the code in the URL
    }
  }, [navigate]); // Empty dependency array to run only once

  const initiateOAuthFlow = async () => {
    const codeVerifier = getNewCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    // Store the code verifier in a cookie (expires in 1 day)
    Cookies.set("code_verifier", codeVerifier, { expires: 1 });

    // Generate a random state string for security
    const state = Math.random().toString(36).substring(7);

    const clientId = "7bd032cc1d95266575d8530bed6a1263";  // Replace with your actual client ID
    const redirectUri = "http://localhost/auth"; // Correct redirect URI

    const authUrl = `https://myanimelist.net/v1/oauth2/authorize?response_type=code&client_id=${clientId}&code_challenge=${codeChallenge}&state=${state}&redirect_uri=${encodeURIComponent(redirectUri)}`;

    window.location.href = authUrl; // Redirect to the authorization URL
  };

  const exchangeCodeForToken = async (code, state) => {
    const codeVerifier = Cookies.get("code_verifier"); // Retrieve code verifier from cookie

    const tokenEndpoint = "https://myanimelist.net/v1/oauth2/token";  // Replace with actual token endpoint
    const params = new URLSearchParams();
    params.append("code", code);
    params.append("code_verifier", codeVerifier);
    params.append("redirect_uri", "http://localhost/auth");  // Same as used for authorization
    params.append("grant_type", "authorization_code");

    const response = await fetch(tokenEndpoint, {
      method: "POST",
      body: params,
    });

    const data = await response.json();
    if (data.access_token) {
      Cookies.set("access_token", data.access_token, { expires: 1 }); // Store access token
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <button onClick={initiateOAuthFlow}>Login with MyAnimeList</button>

      {/* Optionally, you can display the code and state values after capture */}
      {code && (
        <div>
          <h3>Authorization Code: {code}</h3>
          <h3>State: {state}</h3>
        </div>
      )}
    </div>
  );
};

const getNewCodeVerifier = () => {
  const array = new Uint8Array(100); 
  window.crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array)).substring(0, 128); 
};

const generateCodeChallenge = async (codeVerifier) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  const base64url = btoa(String.fromCharCode(...hashArray))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  return base64url;
};

export default Login;

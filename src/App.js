// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Login from "./Login";
import OAuth from "./Auth"; // OAuth component for handling the callback

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<h2>Welcome to the Homepage</h2>} />
          <Route path="/login" element={<Login />} />
          <Route path="/oauth" element={<OAuth />} /> {/* OAuth callback route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;

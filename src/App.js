// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";

import Navbar         from "./components/Navbar";
import Chatbot        from "./components/Chatbot";
// import Footer         from "./components/Footer";       // if you have one
import Home           from "./pages/Home";
import Login          from "./pages/Login";
import Register       from "./pages/Register";
import Dashboard      from "./pages/Dashboard";
import Staff          from "./pages/Staff";
import AlumniConnect  from "./pages/AlumniConnect";
import Elsoc          from "./pages/Elsoc";
import Achievement    from "./pages/Achievements";
import Stories        from "./pages/Stories";

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/"               element={<Home />} />
        <Route path="/login"          element={<Login />} />
        <Route path="/register"       element={<Register />} />
        <Route path="/dashboard"      element={<Dashboard />} />
        <Route path="/staff"          element={<Staff />} />
        <Route path="/alumni-connect" element={<AlumniConnect />} />
        <Route path="/elsoc"          element={<Elsoc />} />
        <Route path="/achievements"   element={<Achievement />} />
        <Route path="/stories"        element={<Stories />} />
      </Routes>

      {/* Floating chatbot—always mounted */}
      <Chatbot />

      {/* Optional footer */}
      {/* <Footer /> */}
    </Router>
  );
}

export default App;

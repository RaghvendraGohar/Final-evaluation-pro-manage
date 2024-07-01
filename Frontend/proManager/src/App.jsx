import { useState } from "react";
import { Routes, Route, BrowserRouter,Navigate } from "react-router-dom";
import Register from "./components/Register/Register";
import LogIn from "./components/Login/Login";
import Dashboard from "./components/Dashboard/Dashboard";
import PublicLink from "./components/PublicLink/PublicLink";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/dashboard" element={<ProtectedRoute Component={Dashboard} />} />
          <Route path="/public/:id" element={<PublicLink />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

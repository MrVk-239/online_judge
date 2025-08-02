// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import HomePage from "./pages/HomePage";
import ProblemList from "./pages/ProblemList";
import AddProblemPage from "./pages/AddProblemPage";
import ProblemDetailPage from "./pages/ProblemDetailPage";
import EditProblemPage from "./pages/EditProblemPage";




const App = () => {
  return (

    <Router>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route path="/add-problem" element={<AddProblemPage />} />
        <Route
          path="/problems/:id"
          element={
            <PrivateRoute>
              <ProblemDetailPage />
            </PrivateRoute>
          }
        />


        <Route path="/problems/:id/edit" element={<EditProblemPage />} />
        <Route
          path="/problems"
          element={
            <PrivateRoute>
              <ProblemList />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<HomePage />} />

      </Routes>
    </Router>
  );
};

export default App;

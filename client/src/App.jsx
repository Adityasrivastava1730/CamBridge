import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

import ProtectedRoute from "./components/ProtectedRoute";

import LiveCamera from "./pages/LiveCamera";
import PhoneCamera from "./pages/PhoneCamera";
import ConnectCamera from "./pages/ConnectCamera"; // IMPORTANT

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Home */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* Auth */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Live Camera */}
        <Route
          path="/camera/:id"
          element={
            <ProtectedRoute>
              <LiveCamera />
            </ProtectedRoute>
          }
        />

        {/* Phone Camera */}
        <Route
          path="/phone-camera/:id"
          element={<PhoneCamera />}
        />

        <Route
          path="/phone/:id"
          element={<PhoneCamera />}
        />

        {/* Connect Camera */}
        <Route
          path="/connect-camera"
          element={<ConnectCamera />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
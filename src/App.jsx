import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./context/ThemeContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ScanDetail from "./pages/ScanDetail";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import data from "./data/mockData.json";

function App() {
  const [scans, setScans] = useState(data.scans);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: { borderRadius: "10px", fontSize: "13px", fontWeight: 500 },
          }}
          containerStyle={{ top: "72px", zIndex: 9999 }}
        />
        <Routes>
          {/* Auth */}
          <Route path="/" element={<PublicRoute><Signup /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

          {/* App */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard scans={scans} setScans={setScans} /></ProtectedRoute>} />
          <Route path="/projects" element={<ProtectedRoute><Dashboard scans={scans} setScans={setScans} /></ProtectedRoute>} />
          <Route path="/scans" element={<ProtectedRoute><Dashboard scans={scans} setScans={setScans} /></ProtectedRoute>} />
          <Route path="/schedule" element={<ProtectedRoute><Dashboard scans={scans} setScans={setScans} /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Dashboard scans={scans} setScans={setScans} /></ProtectedRoute>} />
          <Route path="/support" element={<ProtectedRoute><Dashboard scans={scans} setScans={setScans} /></ProtectedRoute>} />
          <Route path="/scan/:id" element={<ProtectedRoute><ScanDetail scans={scans} /></ProtectedRoute>} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

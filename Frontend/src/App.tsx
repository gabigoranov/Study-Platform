import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import ProtectedRoute from "./routes/ProtectedRoute";

import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import DashboardLayout from "./components/Dashboard/DashboardLayout";
import Flashcards from "./pages/Flashcards";
import SettingsLayout from "./components/Settings/SettingsLayout";
import GeneralSettings from "./pages/Settings/GeneralSettings";
import AccountSettings from "./pages/Settings/AccountSettings";
import ThemeSettings from "./pages/Settings/ThemeSettings";
import ErrorPage from "./pages/ErrorPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
            errorElement={<ErrorPage />}
          >
            {/* Nested inside Dashboard */}
            <Route index element={<Flashcards />} />
            
          </Route>

          <Route path="settings" element={
            <ProtectedRoute>
              <SettingsLayout />
            </ProtectedRoute>
          }>
            <Route index element={<GeneralSettings />} />
            <Route path="account" element={<AccountSettings />} />
            <Route path="theme" element={<ThemeSettings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

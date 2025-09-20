import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import ProtectedRoute from "./routes/ProtectedRoute";

import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import HomeDashboard from "./pages/Home/HomeDashboard";
import DashboardLayout from "./components/Dashboard/DashboardLayout";
import SettingsLayout from "./components/Settings/SettingsLayout";
import GeneralSettings from "./pages/Settings/GeneralSettings";
import AccountSettings from "./pages/Settings/AccountSettings";
import ThemeSettings from "./pages/Settings/ThemeSettings";
import ErrorPage from "./pages/ErrorPage";
import { ThemeProvider } from "./hooks/useThemeProvider";
import FlashcardsDashboard from "./pages/Flashcards/FlashcardsDashboard";
import { VariableProvider } from "./context/VariableContext";

export function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <VariableProvider>
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
                <Route index element={<HomeDashboard />} />
                <Route path="flashcards" element={<FlashcardsDashboard />} />
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
      </VariableProvider>
    </ThemeProvider>
  );
}

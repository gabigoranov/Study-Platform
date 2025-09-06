import { BrowserRouter as Router, Routes, Route, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { router } from "./routes";

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
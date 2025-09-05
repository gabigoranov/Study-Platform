import { BrowserRouter as Router, Routes, Route, RouterProvider } from "react-router-dom";
import { useEffect, useState } from "react";
import { AuthProvider } from "./hooks/useAuth";
import { router } from "./routes";

export default function App() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import { useEffect, useState } from "react";
import Flashcards from "./pages/Flashcards";

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
    <Router>
      <Routes>
        <Route path="/" element={
            <DashboardLayout>
                <Flashcards />
            </DashboardLayout>
        } />
      </Routes>
    </Router>
  );
}
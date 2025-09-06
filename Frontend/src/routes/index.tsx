import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import Flashcards from "../pages/Flashcards";
import DashboardLayout from "../components/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";
import ErrorPage from "../pages/ErrorPage";
import SignUp from "../pages/SignUp";

export const router = createBrowserRouter(
  [
    {
      path: "/signup",
      element: <SignUp />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/login",
      element: <Login />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/",
      element: <ProtectedRoute children={
        <DashboardLayout>
          <Flashcards />
        </DashboardLayout>
      } />,
      errorElement: <ErrorPage />,
    },
  ],
  {
    // @ts-ignore
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    } as any,
  }
);

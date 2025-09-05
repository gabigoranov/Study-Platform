import { createBrowserRouter } from "react-router-dom";
import SignUp from "../pages/SignIn";
import Flashcards from "../pages/Flashcards";
import DashboardLayout from "../components/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";
import ErrorPage from "../pages/ErrorPage";

export const router = createBrowserRouter(
  [
    {
      path: "/signin",
      element: <SignUp />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/",
      element: <DashboardLayout>
        <ProtectedRoute children={<Flashcards />} />
      </DashboardLayout>,
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

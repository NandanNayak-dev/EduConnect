import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Registration from "../pages/Registration";
import Profile from "../pages/Profile";
import ForgotPassword from "../pages/ForgotPassword";
import Classes from "../pages/Classes";
import ClassDetails from "../pages/ClassDetails";
import UserSideBar from "../layouts/UserSideBar";
import TaskManager from "../pages/TaskManager";
import CalendarPage from "../pages/Calendar";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import AdminSideBar from "../layouts/AdminSideBar";
import AuthLayout from "../layouts/AuthLayout";
import NotFound from "../pages/NotFound";
import Setting from "../pages/Setting";
import Users from "../pages/dashboard/Users";
import Dashboard from "../pages/dashboard/Dashboard";
import PublicRoute from "../layouts/PublicRoute";
import Subscription from "../pages/Subscription";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/registration",
        element: <Registration />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
    ],
  },
  {
    path: "/profile",
    element: (
      <UserSideBar>
        <Profile />
      </UserSideBar>
    ),
  },
  {
    path: "/classes",
    element: (
      <UserSideBar>
        <Classes />
      </UserSideBar>
    ),
  },
  {
    path: "/classes/:classId",
    element: (
      <UserSideBar>
        <ClassDetails />
      </UserSideBar>
    ),
  },
  {
    path: "/task-management",
    element: (
      <>
        <UserSideBar>
          <DndProvider backend={HTML5Backend}>
            <TaskManager />
          </DndProvider>
        </UserSideBar>
      </>
    ),
  },
  {
    path: "/calendar",
    element: (
      <UserSideBar>
        <CalendarPage />
      </UserSideBar>
    ),
  },
  {
    path: "/setting",
    element: (
      <UserSideBar>
        <Setting />
      </UserSideBar>
    ),
  },
  {
    path: "/subscription",
    element: <PublicRoute><Subscription /></PublicRoute>
  },{
    path: "/dashboard",
    element: <AdminSideBar />,
    children: [
      {
        path: "",
        element: <Dashboard />,
      },
      {
        path: "users",
        element: <Users />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;

import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Parent from "./Components/Parent";
import Home from "./Pages/Home";
import RequestSummary from "./Pages/RequestSummary";
import Book from "./Pages/Book";
import CreatePost from "./Pages/CreatePost";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import PrivateRoute from "./Components/PrivateRoute";
import Privacy from "./Pages/Privacy";
import EditPrivacy from "./Pages/EditPrivacy";
import Profile from "./Pages/Profile";
import ErrorPage from "./Pages/ErrorPage";
import NotFound from "./Pages/NotFound";
import Category from "./Pages/Category";
import AdminUpload from "./Pages/AdminUpload";
import Pricing from "./Pages/Pricing";
import TagManager from "react-gtm-module";
import { useEffect } from "react";
import SubscriptionSuccess from "./Components/SubscriptionSuccess";
// import SubscriptionSuccess from ".C";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Parent />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <Home />,
      },

      {
        path: "book-summary/:urlSlug",
        element: <Book />,
        errorElement: <ErrorPage />,
      },
      {
        path: "request",
        element: <RequestSummary />,
      },
      {
        path: "privacypolicy",
        element: <Privacy />,
      },
      {
        path: "book-categories",
        element: <Category />,
      },
      {
        path: "book-categories/:categorySlug",
        element: <Category />,
      },
      {
            path: "pricing",
            element: <Pricing />,
          },
             {
            path: "subscription-success",
            element: <SubscriptionSuccess/>,
          },
      {
        path: "",
        element: <PrivateRoute />,
        children: [
          {
            path: "edit/:urlSlug",
            element: <CreatePost />,
          },
             
          {
            path: "generate-summary",
            element: <AdminUpload />,
          },
          {
            path: "create",
            element: <CreatePost />,
          },
          {
            path: "editprivacy",
            element: <EditPrivacy />,
          },
          {
            path: "profile",
            element: <Profile />,
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
   {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/NotFound",
    element: <NotFound />,
  },
]);

function App() {
  useEffect(() => {
    const tagManagerArgs = {
      gtmId: "AW-16716253520",
    };
    TagManager.initialize(tagManagerArgs);
  }, []);

  return <RouterProvider router={router} />;
}

export default App;

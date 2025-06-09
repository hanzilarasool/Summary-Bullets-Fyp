import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { signoutSuccess } from "../redux/user/userSlice";
import config from "../config";




const PrivateRoute = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [access, setAccess] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await fetch(`${config.API_URL}/api/v1/protectedRoute`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!response.ok) throw new Error("Unauthorized");

        const userData = currentUser;

        if (userData?.user?.role === "admin") {
          setAccess("admin");
        } else {
          setAccess("user");
        }
      } catch (error) {
        dispatch(signoutSuccess());
        localStorage.clear();
        setAccess("unauthenticated");
      }
    };

    if (currentUser) {
      verifyToken();
    } else {
      setAccess("unauthenticated");
    }
  }, [currentUser, dispatch]);

  if (access === null) return null;

  if (access == "admin") return <Outlet />;
  if (access == "user") return <Navigate to="/pricing" />;
  return <Navigate to="/login" />;
};

export default PrivateRoute;

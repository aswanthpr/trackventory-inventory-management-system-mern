
import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactElement;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {

  const isAuthenticated = !!localStorage.getItem("login");
  console.log(isAuthenticated,'isauthenticated')

  if (!isAuthenticated) {
  
    return <Navigate to="/login" replace />;
  }


  return children;
};


export const ProtectedLogin: React.FC<ProtectedRouteProps> = ({ children }) => {

  const isAuthenticated = !!localStorage.getItem("login");
  

  if (isAuthenticated) {
  
    return <Navigate to="/" replace />;
  }
  
  return children;

};


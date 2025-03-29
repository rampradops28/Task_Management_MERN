import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../authContext";
import "bootstrap/dist/css/bootstrap.min.css";

const Navbar = () => {
  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/login-user");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to={user?.role === "admin" ? "/admin-dashboard" : "/user-dashboard"}>
          Task Manager
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {user?.role === "admin" ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin">Manage Users</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin-dashboard">Assign Tasks</Link>
                </li>
              </>
            ) : user ? (
              <li className="nav-item">
                <Link className="nav-link" to="/user-dashboard">My Tasks</Link>
              </li>
            ) : null}

            {user ? (
              <li className="nav-item">
                <button className="btn btn-danger ms-3" onClick={handleLogout}>Logout</button>
              </li>
            ) : (
              <li className="nav-item">
                <Link className="nav-link" to="/login-user">Login</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

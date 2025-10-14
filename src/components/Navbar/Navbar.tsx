import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "./Navbar.css";

import logo from "../../assets/disc-golf-basket-svgrepo-com.svg";

export function Navbar() {
  const { isStaff } = useAuth();
  return (
    <>
      <nav className="navbar" role="navigation">
        <div className="navbar-left">
          <Link to="/" className="logo-container">
            <img src={logo} alt="chains & dates logo" className="logo" />
            <span className="logo-text">Chains & Dates</span>
          </Link>
        </div>
        <div className="navbar-center">
          <ul className="nav-links">
            <li>
              <Link to="events">Events</Link>
            </li>
            <li>
              <Link to="/">About Us</Link>
            </li>

            <li>
              <Link to="/">Contact</Link>
            </li>
          </ul>
        </div>
        <div className="navbar-right">
          {isStaff && (
            <Link to="create-event" className="create-event-icon">
              <i className="fa-solid fa-person-circle-plus"></i>
            </Link>
          )}
          <Link to="account" className="user-icon">
            <i className="fa-solid fa-circle-user"></i>
          </Link>
        </div>
      </nav>
    </>
  );
}

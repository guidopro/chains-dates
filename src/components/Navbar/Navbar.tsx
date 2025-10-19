import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

import "./Navbar.css";

import logo from "../../assets/disc-golf-basket-svgrepo-com.svg";
import HamburgerMenu from "./HamburgerMenu";

export function Navbar() {
  const { isStaff, user } = useAuth();

  return (
    <>
      <nav className="navbar" role="navigation">
        <div className="navbar-left">
          <Link to="/" className="logo-container">
            <img src={logo} alt="chains & dates logo" className="logo" />
            <span className="logo-text">chains&dates</span>
          </Link>
        </div>
        <div className="navbar-center">
          <ul className="nav-links">
            <li>
              <Link to="events">Events</Link>
            </li>
            <li>
              <Link to="about-us">About Us</Link>
            </li>
          </ul>
        </div>
        <div className="navbar-right">
          {!user ? (
            <Link to="login">
              <button id="login-button">
                <i className="fa-solid fa-circle-user"></i> Log in
              </button>
            </Link>
          ) : (
            <HamburgerMenu isStaff={isStaff} />
          )}
        </div>
      </nav>
    </>
  );
}

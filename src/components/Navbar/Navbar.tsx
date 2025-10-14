import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "./Navbar.css";

export function Navbar() {
  const { isStaff } = useAuth();
  return (
    <>
      <nav className="navbar" role="navigation">
        <div className="navbar-left">
          <Link to="/" className="logo">
            <p>Chains & Dates</p>
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

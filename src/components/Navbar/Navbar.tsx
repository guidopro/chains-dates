import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "./Navbar.css";

export function Navbar() {
  const { isStaff } = useAuth();
  return (
    <>
      <nav className="navbar">
        <Link to="/">
          <h1>Chains & Dates</h1>
        </Link>
        <Link to="" className="links">
          Home
        </Link>{" "}
        |{" "}
        <Link to="events" className="links">
          Events
        </Link>{" "}
        |{" "}
        {isStaff && (
          <Link to="create-event" className="links">
            Create an Event
          </Link>
        )}
      </nav>
    </>
  );
}

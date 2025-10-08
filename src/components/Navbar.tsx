import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function Navbar() {
  const { isStaff } = useAuth();
  return (
    <>
      <nav>
        <Link to="">Home</Link> | <Link to="list-events">Events</Link> |{" "}
        {isStaff && <Link to="create-event">Create an Event</Link>}
      </nav>
    </>
  );
}

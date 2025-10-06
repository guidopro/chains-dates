import { Link } from "react-router-dom";

export function Navbar() {
  return (
    <>
      <nav>
        <Link to="">Home</Link> | <Link to="list-events">Events</Link> |{" "}
        <Link to="test-events">Manage</Link>
      </nav>
    </>
  );
}

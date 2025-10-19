import Hamburger from "hamburger-react";
import { logout } from "../../firebase";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useClickAway } from "@uidotdev/usehooks";

interface HamburgerMenuProps {
  isStaff: boolean;
}

export default function HamburgerMenu({ isStaff }: HamburgerMenuProps) {
  const [isOpen, setOpen] = useState(false);

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/"); // ✅ navigate after successful logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const ref = useClickAway<HTMLDivElement>(() => setOpen(false));

  return (
    <div ref={ref}>
      <Hamburger toggled={isOpen} toggle={setOpen} size={20} />
      {isOpen && (
        <div className="hamburger-container">
          <ul className="hamburger-links">
            <li>
              {isStaff && (
                <Link to="create-event" onClick={() => setOpen(false)}>
                  <i className="fa-solid fa-calendar-plus"></i> Create event
                </Link>
              )}
            </li>
            <hr className="dashed" />
            <li>
              <Link to="settings">
                {" "}
                <i className="fa-solid fa-gear"></i> Settings
              </Link>
            </li>
            <li>
              <Link to="" onClick={handleLogout}>
                <i className="fa-solid fa-right-from-bracket"> </i> Log out
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

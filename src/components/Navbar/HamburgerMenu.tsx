import Hamburger from "hamburger-react";
import { logout } from "../../firebase";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useClickAway } from "@uidotdev/usehooks";

interface HamburgerMenuProps {
  isStaff: boolean;
}

export default function HamburgerMenu({ isStaff }: HamburgerMenuProps) {
  const [isOpen, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    <div ref={ref} id="dropdown-menu">
      <Hamburger toggled={isOpen} toggle={setOpen} size={20} />
      {isOpen && (
        <div className="hamburger-container">
          <ul className="hamburger-links">
            {isMobile && (
              <>
                <li>
                  <Link to="events" onClick={() => setOpen(false)}>
                    <i className="fa-solid fa-calendar"></i> Events
                  </Link>
                </li>
                <li>
                  <Link to="about-us" onClick={() => setOpen(false)}>
                    <i className="fa-solid fa-address-card"></i> About Us
                  </Link>
                </li>
              </>
            )}
            {isMobile && <hr className="dashed" />}
            <li>
              {isStaff && (
                <Link to="create-event" onClick={() => setOpen(false)}>
                  <i className="fa-solid fa-calendar-plus"></i> Create event
                </Link>
              )}
            </li>

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

import { Routes, Route } from "react-router-dom";
import { CreateEventForm } from "./components/CreateEventForm/CreateEventForm";
import { Navbar } from "./components/Navbar/Navbar";
import EventList from "./components/EventList/EventList";
import { useAuth } from "./hooks/useAuth";
import EventPage from "./components/EventPage/EventPage";
import AboutUs from "./components/AboutUs";
import { Login } from "./components/Login/Login";
import { Settings } from "./components/Settings";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";

function App() {
  const { isStaff } = useAuth();
  return (
    <>
      <Navbar />
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<EventList />} />
          {isStaff && (
            <Route path="/create-event" element={<CreateEventForm />} />
          )}

          <Route path="/events" element={<EventList />} />
          <Route path="/events/:id" element={<EventPage />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
        <ToastContainer />
      </div>
      <Footer />
    </>
  );
}

export default App;

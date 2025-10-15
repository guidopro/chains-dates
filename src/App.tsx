import { Routes, Route } from "react-router-dom";
import { Login } from "./components/Login";
import { CreateEventForm } from "./components/CreateEventForm/CreateEventForm";
import { Navbar } from "./components/Navbar/Navbar";
import EventList from "./components/EventList/EventList";
import { useAuth } from "./hooks/useAuth";
import EventPage from "./components/EventPage/EventPage";
import AboutUs from "./components/AboutUs";

function App() {
  const { isStaff } = useAuth();
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<EventList />} />
        {isStaff && (
          <Route path="/create-event" element={<CreateEventForm />} />
        )}

        <Route path="/events" element={<EventList />} />
        <Route path="/events/:id" element={<EventPage />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/account" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;

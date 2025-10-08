import { Routes, Route } from "react-router-dom";
import { Login } from "./components/Login";
import { TestEvents } from "./components/TestEvents";
import { CreateEventForm } from "./components/CreateEventForm/CreateEventForm";
import { Navbar } from "./components/Navbar";
import EventList from "./components/EventList";
import { useAuth } from "./hooks/useAuth";

function App() {
  const { isStaff } = useAuth();
  return (
    <>
      <h1>Chains & Dates</h1>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/test-events" element={<TestEvents />} />
        {isStaff && (
          <Route path="/create-event" element={<CreateEventForm />} />
        )}

        <Route path="/list-events" element={<EventList />} />
      </Routes>
    </>
  );
}

export default App;

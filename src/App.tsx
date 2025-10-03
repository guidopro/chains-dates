import { Routes, Route } from "react-router-dom";
import { Login } from "./components/Login";
import { TestEvents } from "./components/TestEvents";
import "./App.css";
import EventList from "./components/EventList";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/test-events" element={<TestEvents />} />
        <Route path="/list-events" element={<EventList />} />
      </Routes>
    </>
  );
}

export default App;

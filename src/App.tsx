import { Routes, Route } from "react-router-dom";
import { Login } from "./components/Login";
import { TestEvents } from "./components/TestEvents";
import "./App.css";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/test-events" element={<TestEvents />} />
      </Routes>
    </>
  );
}

export default App;

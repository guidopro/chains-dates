import "./EventList.css";

export default function ToggleViewButton({ toggleView, setToggleView }) {
  return (
    <>
      <div className="toggle-button-container">
        {" "}
        <button onClick={() => setToggleView(!toggleView)}>
          {" "}
          {toggleView ? (
            <i className="fa-solid fa-list"></i>
          ) : (
            <i className="fa-solid fa-grip"></i>
          )}
        </button>
      </div>
    </>
  );
}

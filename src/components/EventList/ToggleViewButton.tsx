import "./EventList.css";

interface ToggleViewButtonProps {
  toggleView: boolean;
  setToggleView: (value: boolean) => void;
}

export default function ToggleViewButton({
  toggleView,
  setToggleView,
}: ToggleViewButtonProps) {
  return (
    <>
      <div className="toggle-button-container">
        {" "}
        <button onClick={() => setToggleView(!toggleView)} className="tool-tip">
          {" "}
          {toggleView ? (
            <>
              <span className="tool-tip-text">L</span>
              <i className="fa-solid fa-list"></i>
            </>
          ) : (
            <>
              <span className="tool-tip-text">G</span>
              <i className="fa-solid fa-grip"></i>
            </>
          )}
        </button>
      </div>
    </>
  );
}

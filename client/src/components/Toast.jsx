import "./Toast.css";

function Toast({ message, type = "error" }) {
  if (!message) {
    return null;
  }

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-icon">
        {type === "success" ? "✓" : "!"}
      </div>

      <span>{message}</span>
    </div>
  );
}

export default Toast;
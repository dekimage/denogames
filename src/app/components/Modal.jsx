const Modal = ({ children, onClose, showClose = true, fullscreen = false }) => {
  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`${
          fullscreen ? "w-screen h-screen" : "rounded-lg max-w-2xl w-full mx-4"
        }`}
      >
        <div
          className={`relative border-2 border-foreground bg-background ${
            fullscreen ? "w-full h-screen" : ""
          }`}
        >
          {showClose && (
            <button
              onClick={onClose}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;

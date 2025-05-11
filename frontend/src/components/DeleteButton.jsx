import React, { useState } from "react";
import { Trash2Icon } from "lucide-react";

const DeleteButton = ({
  onConfirm,
  message = "¿Seguro de que quieres eliminar este cliente?",
  className = "font-regular-text",
}) => {
  const [showToast, setShowToast] = useState(null);

  const handleDelete = async () => {
    try {
      console.log("Attempting to delete...");
      await onConfirm();
      console.log("Deletion successful");
      console.log("Setting showToast to 'success'");
      setShowToast("success");
    } catch (error) {
      console.error("Error during deletion:", error);
      setShowToast("error");
    }
    setTimeout(() => {
      setShowToast(null);
    }, 3000);
  };

  const handleCancel = () => {
    console.log("Deletion cancelled");
    setShowToast("cancelled");
    setTimeout(() => {
      setShowToast(null);
    }, 3000);
  };

  return (
    <>
      <button
        onClick={() => {
          console.log("Showing confirmation toast");
          setShowToast("confirm");
        }}
        className={`flex items-center gap-1 cursor-pointer bg-red-500 text-white font-bold px-3 py-1 rounded-lg shadow-md hover:bg-red-600 transition ${className}`}
      >
        <Trash2Icon className="w-4 h-4" /> Eliminar
                </button>

      {showToast === "confirm" && (
        <div className="fixed top-4 right-4 z-50">
          <div className="toast">
            <div className="alert shadow-lg bg-white border-error font-regular-text">
              <span>{message}</span>
              <div className="flex gap-2">
                <button onClick={handleCancel} className="btn btn-sm">
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  className="btn btn-sm btn-error text-white"
                >
                  Sí, eliminar
                </button>
        </div>
            </div>
          </div>
        </div>
      )}

      {showToast === "success" && (
        <div className="fixed top-4 right-4 z-50">
          <div className="toast">
            <div className="alert alert-success shadow-lg">
              <span>El cliente ha sido eliminado con éxito.</span>
            </div>
          </div>
        </div>
      )}

      {showToast === "cancelled" && (
        <div className="fixed top-4 right-4 z-50">
          <div className="toast">
            <div className="alert alert-warning shadow-lg">
              <span>La eliminación ha sido cancelada.</span>
            </div>
          </div>
        </div>
      )}

      {showToast === "error" && (
        <div className="fixed top-4 right-4 z-50">
          <div className="toast">
            <div className="alert alert-error shadow-lg">
              <span>Hubo un error al eliminar el cliente.</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteButton;
import { Outlet } from "react-router";
import Navbar from "/src/components/Navbar";
import { ConfirmPopup } from "primereact/confirmpopup";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";

import "./App.css";

function App() {
  return (
    <>
      <ConfirmPopup />
      <Navbar />
      <div className="flex-grow">
        <Outlet />
      </div>
    </>
  );
}

export default App;

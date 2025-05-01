import { Outlet } from "react-router";
import Navbar from "/src/components/Navbar";

import "./App.css";

function App() {
  return (
    <>
      <Navbar />
      <div className="flex-grow">
        <Outlet />
      </div>
    </>
  );
}

export default App;

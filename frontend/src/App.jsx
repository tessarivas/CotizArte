import { Outlet } from "react-router";
import Navbar from "./components/Navbar.jsx";
import { Footer } from "./components/Footer.jsx";
import "./App.css";

function App() {
  return (
    <>
      <Navbar />
      <div className="flex-grow">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}

export default App;

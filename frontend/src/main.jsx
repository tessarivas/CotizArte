import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css'
import App from './App.jsx'
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Account from './pages/Account.jsx';
import Quotes from './pages/Quotes.jsx';
import Projects from './pages/Projects';
import CreateProject from './pages/CreateProject.jsx';
import CreateQuote from './pages/CreateQuote';
import Clients from './pages/Clients.jsx';
import AddClient from './pages/AddClient';

const root = document.getElementById("root");

createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="account" element={<Account />} />
          <Route path="quotes" element={<Quotes />} />
          <Route path="projects" element={<Projects />} />
          <Route path="create-project" element={<CreateProject />} />
          <Route path="create-quote/:projectId" element={<CreateQuote />} />
          <Route path="clients" element={<Clients />} />
          <Route path="add-client" element={<AddClient />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
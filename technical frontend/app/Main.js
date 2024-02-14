import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import axios from "axios";

import Home from "./Home";

function Main() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
    // <Home />
  );
}

const root = ReactDOM.createRoot(document.querySelector("#app"));
root.render(<Main />);

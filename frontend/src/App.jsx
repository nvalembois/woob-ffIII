import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Error from "./components/Error";
import Login from "./components/Login";
import Secure from "./components/Secure";
import Categories from "./components/Categories";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} errorElement={<Error />} />
        <Route path="/secure" element={<Secure />} errorElement={<Error />}>
          <Route path="categories" element={<Categories />} errorElement={<Error />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

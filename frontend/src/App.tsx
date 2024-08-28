
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ErrorPage from './components/ErrorPage'
import Login from './components/Login'
import Secure from './components/Secure'
import Categories from './components/Categories'

import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} errorElement={<ErrorPage />} />
        <Route path="/secure" element={<Secure />} errorElement={<ErrorPage />}>
          <Route path="categories" element={<Categories />} errorElement={<ErrorPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

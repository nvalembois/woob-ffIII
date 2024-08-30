
import { FC } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ErrorPage from './components/ErrorPage'
import Login from './components/Login'
import Secure from './components/Secure'
import ACategoriser from './components/ACategoriser'

import './App.css'

const App: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} errorElement={<ErrorPage />} />
        <Route path="/secure" element={<Secure />} errorElement={<ErrorPage />}>
          <Route path="categories" element={<ACategoriser />} errorElement={<ErrorPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

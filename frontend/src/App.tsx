
import { FC } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Main from './components/Main'
import ErrorPage from './components/ErrorPage'
import ACategoriser from './components/ACategoriser'

import './App.css'

const App: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} errorElement={<ErrorPage />}>
          <Route path="categories" element={<ACategoriser />} errorElement={<ErrorPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

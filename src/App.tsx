import { Route, Routes } from 'react-router-dom'

import IndexPage from '@/pages/index'
import InvalidPage from './pages/invalid'

const routes = [
  { path: '/', element: <IndexPage /> },
  { path: '/invalid', element: <InvalidPage /> }
]

function App() {
  return (
    <Routes>
      {routes.map(({ path, element }, index) => (
        <Route key={index} path={path} element={element} />
      ))}
    </Routes>
  )
}

export default App

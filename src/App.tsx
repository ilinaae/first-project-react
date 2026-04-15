import { RouterProvider } from 'react-router-dom'
import { appRouter } from '@/app/router/router.tsx'

function App() {
  return <RouterProvider router={appRouter} />
}

export default App

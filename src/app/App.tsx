import { BrowserRouter } from 'react-router-dom'
import { AppProviders } from '@/app/providers/AppProviders.tsx'
import { AppRouter } from '@/app/router/AppRouter.tsx'
import { AuthWrapper } from '@/app/router/AuthWrapper.tsx'
import { CommonWrapper } from '@/app/router/CommonWrapper.tsx'

function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <CommonWrapper>
          <AuthWrapper>
            <AppRouter />
          </AuthWrapper>
        </CommonWrapper>
      </BrowserRouter>
    </AppProviders>
  )
}

export default App

import { Route, Routes } from "react-router"
import { LayoutPage } from '@/pages/auth/layout'
import { Login } from "./pages/auth/login"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Home } from "./pages/home"

// eslint-disable-next-line react-refresh/only-export-components
export const queryClient = new QueryClient()

export const App = () => {

  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="auth" element={<LayoutPage />}>
          <Route index element={<Login />} />
        </Route>

        <Route path="/" element={<Home />} />
      </Routes>
    </QueryClientProvider>
  )
}

import { QueryClientProvider } from '@tanstack/react-query'
import { AppRouter } from '@/routes'
import { ToastProvider } from '@/components/feedback/ToastProvider'
import { ThemeProvider } from '@/contexts/ThemeProvider'
import { queryClient } from '@/services/queryClient'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AppRouter />
        <ToastProvider />
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App

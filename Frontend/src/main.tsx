import { StrictMode } from 'react'
import { createRoot, Root } from 'react-dom/client'
import './index.css'
import './i18n'
import { App } from './App'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export const queryClient = new QueryClient();

const container = document.getElementById('root')!;

// Define a type-safe way to store the root on the element
interface RootElement extends HTMLElement {
  _reactRoot?: Root;
}

const rootElement = container as RootElement;

// If the root doesn't exist, create it; otherwise, reuse it
if (!rootElement._reactRoot) {
  rootElement._reactRoot = createRoot(rootElement);
}

rootElement._reactRoot.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
)
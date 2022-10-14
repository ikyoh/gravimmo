import React from 'react';
import './assets/tailwind.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { LoginPage } from './pages/LoginPage';

const queryClient = new QueryClient()

export default function App() {
  return (
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route path={'/'} element={<LoginPage />} />
          </Routes>
        </Router>
        <ReactQueryDevtools initialIsOpen={false} position='bottom-right' />
      </QueryClientProvider>
  );
}

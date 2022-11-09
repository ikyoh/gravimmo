import React from 'react';
import './assets/tailwind.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ThemeProvider } from './context/ThemeContext';
import { LoginPage } from './pages/LoginPage';
import {PropertiesPage} from './pages/PropertiesPage';
import {ServicesPage} from './pages/ServicesPage';
import {OrdersPage} from './pages/OrdersPage';
import {TrusteesPage} from './pages/TrusteesPage';
import {InvoicesPage} from './pages/InvoicesPage';
import {DashboardPage} from './pages/DashboardPage';


const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider initialTheme="dark">
        <Router>
          <Routes>
            <Route path={'/'} element={<LoginPage />} />
            <Route path={'/dashboard'} element={<DashboardPage title="Tableau de bord" />} />
            <Route path={'/properties'} element={<PropertiesPage title="Copropriétés" />} />
            <Route path={'/services'} element={<ServicesPage title="Prestations" />} />
            <Route path={'/orders'} element={<OrdersPage title="Commandes" />} />
            <Route path={'/invoices'} element={<InvoicesPage title="Factures" />} />
            <Route path={'/trustees'} element={<TrusteesPage title="Syndics" />} />
          </Routes>
        </Router>
        <ReactQueryDevtools initialIsOpen={false} position='bottom-right' />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

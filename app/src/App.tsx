import React from 'react';
import './assets/tailwind.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ThemeProvider } from './context/ThemeContext';
import { Layout } from 'components/templates/layout/Layout';
import { LoginPage } from './pages/LoginPage';
import { PropertyPage } from './pages/PropertyPage';
import { PropertiesPage } from './pages/PropertiesPage';
import { ServicesPage } from './pages/ServicesPage';
import { OrderPage } from './pages/OrderPage';
import { OrdersPage } from './pages/OrdersPage';
import { TrusteePage } from './pages/TrusteePage';
import { TrusteesPage } from './pages/TrusteesPage';
import { InvoicesPage } from './pages/InvoicesPage';
import { DashboardPage } from './pages/DashboardPage';
import { ContactsPage } from './pages/ContactsPage';
import { ResetPasswordPage } from 'pages/ResetPasswordPage';
import { ForgotPasswordPage } from 'pages/ForgotPasswordPage';


const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider initialTheme="dark">
        <Router>
          <Routes>
            <Route path={'/'} element={<LoginPage />} />
            <Route path={'/contacts'} element={<Layout><ContactsPage title="Contacts" /></Layout>} />
            <Route path={'/dashboard'} element={<Layout><DashboardPage title="Tableau de bord" /></Layout>} />
            <Route path='/properties/:id' element={<Layout><PropertyPage /></Layout>} />
            <Route path={'/properties'} element={<Layout><PropertiesPage title="Copropriétés" /></Layout>} />
            <Route path={'/services'} element={<Layout><ServicesPage title="Prestations" /></Layout>} />
            <Route path={'/orders'} element={<Layout><OrdersPage title="Commandes" /></Layout>} />
            <Route path={'/orders/:id'} element={<Layout><OrderPage title="Commande #" /></Layout>} />
            <Route path={'/invoices'} element={<Layout><InvoicesPage title="Factures" /></Layout>} />
            <Route path={'/trustees/:id'} element={<Layout><TrusteePage /></Layout>} />
            <Route path={'/trustees'} element={<Layout><TrusteesPage title="Syndics" /></Layout>} />
            <Route path={'/reset-password/:token'} element={<ResetPasswordPage />} />
            <Route path={'/forgot-password'} element={<ForgotPasswordPage />} />
          </Routes>
        </Router>
        <ReactQueryDevtools initialIsOpen={false} position='bottom-right' />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Layout } from "components/templates/layout/Layout";
import * as dayjs from "dayjs";
import { ForgotPasswordPage } from "pages/ForgotPasswordPage";
import { LetterboxPage } from "pages/LetterboxPage";
import { ReportsPage } from "pages/ReportsPage";
import { ResetPasswordPage } from "pages/ResetPasswordPage";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./assets/tailwind.css";
import { ThemeProvider } from "./context/ThemeContext";
import { CommandPage } from "./pages/CommandPage";
import { CommandsPage } from "./pages/CommandsPage";
import { ContactsPage } from "./pages/ContactsPage";
import { CustomersPage } from "./pages/CustomersPage";
import { DashboardPage } from "./pages/DashboardPage";
import { InvoicePage } from "./pages/InvoicePage";
import { InvoicesPage } from "./pages/InvoicesPage";
import { LoginPage } from "./pages/LoginPage";
import { PropertiesPage } from "./pages/PropertiesPage";
import { PropertyPage } from "./pages/PropertyPage";
import { QuotePage } from "./pages/QuotePage";
import { QuotesPage } from "./pages/QuotesPage";
import { ServicesPage } from "./pages/ServicesPage";
import { SettingsPage } from "./pages/SettingsPage";
import { TourPage } from "./pages/TourPage";
import { ToursPage } from "./pages/ToursPage";
import { TrusteePage } from "./pages/TrusteePage";
import { TrusteesPage } from "./pages/TrusteesPage";
import { UsersPage } from "./pages/UsersPage";

require("dayjs/locale/fr");
dayjs.locale("fr");
let weekOfYear = require("dayjs/plugin/weekOfYear");
dayjs.extend(weekOfYear);
let isBetween = require("dayjs/plugin/isBetween");
dayjs.extend(isBetween);
let localizedFormat = require("dayjs/plugin/localizedFormat");
dayjs.extend(localizedFormat);
let utc = require("dayjs/plugin/utc");
dayjs.extend(utc);

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false, // default: true
        },
    },
})

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider initialTheme="dark">
                <Router>
                    <Routes>
                        <Route path={"/"} element={<LoginPage />} />
                        <Route
                            path={"/contacts"}
                            element={
                                <Layout roles={["ROLE_WORKSHOP"]}>
                                    <ContactsPage title="Contacts" />
                                </Layout>
                            }
                        />
                        <Route
                            path={"/customers"}
                            element={
                                <Layout roles={["ROLE_WORKSHOP"]}>
                                    <CustomersPage title="Clients" />
                                </Layout>
                            }
                        />
                        <Route
                            path={"/dashboard"}
                            element={
                                <Layout
                                    roles={["ROLE_WORKSHOP", "ROLE_INSTALLER"]}
                                >
                                    <DashboardPage title="Tableau de bord" />
                                </Layout>
                            }
                        />
                        <Route
                            path={"/letterboxes/:id"}
                            element={
                                <Layout
                                    roles={["ROLE_WORKSHOP", "ROLE_INSTALLER"]}
                                >
                                    <LetterboxPage />
                                </Layout>
                            }
                        />
                        <Route
                            path="/properties/:id"
                            element={
                                <Layout roles={["ROLE_WORKSHOP"]}>
                                    <PropertyPage />
                                </Layout>
                            }
                        />
                        <Route
                            path={"/properties"}
                            element={
                                <Layout roles={["ROLE_WORKSHOP"]}>
                                    <PropertiesPage title="Copropriétés" />
                                </Layout>
                            }
                        />
                        <Route
                            path={"/services"}
                            element={
                                <Layout roles={["ROLE_WORKSHOP"]}>
                                    <ServicesPage title="Prestations" />
                                </Layout>
                            }
                        />
                        <Route
                            path={"/commands"}
                            element={
                                <Layout
                                    roles={["ROLE_WORKSHOP", "ROLE_INSTALLER"]}
                                >
                                    <CommandsPage title="Commandes" />
                                </Layout>
                            }
                        />
                        <Route
                            path={"/commands/:id"}
                            element={
                                <Layout
                                    roles={["ROLE_WORKSHOP", "ROLE_INSTALLER"]}
                                >
                                    <CommandPage title="Commande #" />
                                </Layout>
                            }
                        />
                        <Route
                            path={"/quotes"}
                            element={
                                <Layout roles={["ROLE_WORKSHOP"]}>
                                    <QuotesPage title="Devis" />
                                </Layout>
                            }
                        />
                        <Route
                            path={"/quotes/:id"}
                            element={
                                <Layout roles={["ROLE_WORKSHOP"]}>
                                    <QuotePage title="Devis #" />
                                </Layout>
                            }
                        />
                        <Route
                            path={"/invoices"}
                            element={
                                <Layout roles={["ROLE_WORKSHOP"]}>
                                    <InvoicesPage title="Factures" />
                                </Layout>
                            }
                        />
                        <Route
                            path={"/invoices/:id"}
                            element={
                                <Layout roles={["ROLE_WORKSHOP"]}>
                                    <InvoicePage title="Facture #" />
                                </Layout>
                            }
                        />
                        <Route
                            path={"/trustees/:id"}
                            element={
                                <Layout roles={["ROLE_WORKSHOP"]}>
                                    <TrusteePage />
                                </Layout>
                            }
                        />
                        <Route
                            path={"/trustees"}
                            element={
                                <Layout roles={["ROLE_WORKSHOP"]}>
                                    <TrusteesPage title="Syndics" />
                                </Layout>
                            }
                        />
                        <Route
                            path={"/tours/:id"}
                            element={
                                <Layout roles={["ROLE_WORKSHOP"]}>
                                    <TourPage />
                                </Layout>
                            }
                        />
                        <Route
                            path={"/tours"}
                            element={
                                <Layout
                                    roles={["ROLE_WORKSHOP", "ROLE_INSTALLER"]}
                                >
                                    <ToursPage title="Tournées" />
                                </Layout>
                            }
                        />
                        <Route
                            path={"/reports"}
                            element={
                                <Layout roles={["ROLE_WORKSHOP"]}>
                                    <ReportsPage title="Incidents" />
                                </Layout>
                            }
                        />
                        <Route
                            path={"/settings"}
                            element={
                                <Layout roles={["ROLE_WORKSHOP"]}>
                                    <SettingsPage title="Configuration" />
                                </Layout>
                            }
                        />
                        <Route
                            path={"/users"}
                            element={
                                <Layout roles={["ROLE_ADMINISTRATOR"]}>
                                    <UsersPage title="Utilisateurs" />
                                </Layout>
                            }
                        />
                        <Route
                            path={"/reset-password/:token"}
                            element={<ResetPasswordPage />}
                        />
                        <Route
                            path={"/forgot-password"}
                            element={<ForgotPasswordPage />}
                        />
                    </Routes>
                </Router>
                <ReactQueryDevtools
                    initialIsOpen={false}
                    position="bottom-right"
                />
            </ThemeProvider>
        </QueryClientProvider>
    );
}

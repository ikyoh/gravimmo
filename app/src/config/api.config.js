export const API_URL =
    process.env.REACT_APP_ENV === "prod" ? "/api" : "https://localhost/api";

export const IRI = "/api";

export const API_LOGIN = "/login";
export const API_LOGOUT = "/logout";
export const API_CURRENT_USER = "/current_user";
export const API_PASSWORD = "/forgot_password";
export const API_MEDIAS = "/media_objects";
export const API_LETTERBOXES = "/letterboxes";
export const API_COMMANDS = "/commands";
export const API_CUSTOM_SERVICES = "/command_custom_services";
export const API_EXTRA_SERVICES = "/command_extra_services";
export const API_CUSTOMERS = "/customers";
export const API_INVOICES = "/invoices";
export const API_PROPERTIES = "/properties";
export const API_PROPERTY_SERVICES = "/property_services";
export const API_QUOTES = "/quotes";
export const API_REPORTS = "/reports";
export const API_COMMAND_REPORTS = "/command_reports";
export const API_USERS = "/users";
export const API_SERVICES = "/services";
export const API_TRUSTEES = "/trustees";
export const API_TOURS = "/tours";

export const itemsPerPage = 40;

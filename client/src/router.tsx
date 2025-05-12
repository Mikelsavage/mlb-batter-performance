import { createBrowserRouter } from "react-router-dom";
import { PlayersPage } from "./pages/Players/PlayersPage.js";
import { PageNotFound } from "./pages/Utils/PageNotFound.jsx";

export const router = createBrowserRouter([
    { path: "/", element: <PlayersPage />, errorElement: <PageNotFound /> },

    // Catch-all route for 404 pages
    { path: "*", element: <PageNotFound /> },
]);

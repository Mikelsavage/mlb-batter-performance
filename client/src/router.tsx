import { createBrowserRouter } from "react-router-dom";
import { PlayersPage } from "./pages/Players/PlayersPage.js";
import { PageNotFound } from "./pages/Utils/PageNotFound.jsx";
import { SinglePlayerPage } from "./pages/Players/SinglePlayerPage.js";

export const router = createBrowserRouter([
    { path: "/", element: <PlayersPage /> },
    { path: "/player/:playerId", element: <SinglePlayerPage /> },

    // Catch-all route for 404 pages
    { path: "*", element: <PageNotFound /> },
]);

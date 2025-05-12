import { RouterProvider } from "react-router-dom";
import { router } from "../../router.jsx";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import "../../utils/i18next";

export const App = () => {
    const { i18n } = useTranslation();

    // Change translations to the language specified by the browser
    useEffect(() => {
        const lng = navigator.language;
        i18n.changeLanguage(lng);
    }, [i18n]);

    return <RouterProvider router={router} />;
};

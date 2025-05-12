import { Link } from "react-router-dom";

export const PageNotFound = () => {
    return (
        <div>
            <h1>404 Page Not Found</h1>

            <Link to="/">Back to Home</Link>
        </div>
    );
};

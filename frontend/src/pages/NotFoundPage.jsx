import { Link } from "react-router";
import { AlertTriangle } from "lucide-react";

const NotFoundPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center bg-base-100">
            <AlertTriangle className="w-16 h-16 text-error mb-4 animate-bounce" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                404 - Page Not Found
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                Sorry, the page you are looking for doesn't exist or has been moved.
            </p>
            <Link
                to="/"
                className="btn btn-primary"
            >
                Go back home
            </Link>
        </div>
    );
};

export default NotFoundPage;

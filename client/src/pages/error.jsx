import { useRouteError, Link } from "react-router-dom";

export default function Error() {
    const previousPage = document.referrer;
    const error = useRouteError();

    return (
        <div>
            <h2>{error.status || "Sorry!" }</h2>
            <p>We've encountered a problem trying to access the requested resource. We recommend <Link to={previousPage || "/"}>going back</Link> and trying again.</p>
            <p>{error.message}</p>
        </div>
    );
}
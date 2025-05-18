import { useContext } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";

import { AppContext } from "../../Context/AppContext.jsx";

function RequireCourseAccess()
{
    const location = useLocation();
    const {userDetails} = useContext(AppContext);

    return(
        (Object.keys(userDetails).length > 0 && 
        (userDetails.lectures.includes(location.pathname.split("/").at(-1)) === true ||
        userDetails.quizzes.includes(location.pathname.split("/").at(-1)) === true)) ?
            <Outlet></Outlet>
        :
            <Navigate to="/dashboard" state={{ requireAccess: true, from: location }} replace>
            </Navigate>
    );
}

export default RequireCourseAccess;
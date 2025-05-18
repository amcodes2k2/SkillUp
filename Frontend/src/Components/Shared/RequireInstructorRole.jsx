import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { AppContext } from "../../Context/AppContext.jsx";

function RequireInstructorRole()
{
    const location = useLocation();
    const {userDetails} = useContext(AppContext);

    return(
        (userDetails.role === "instructor") ? 
        <Outlet></Outlet>
        :
        <Navigate to="/dashboard" state={{ requireInstructorRole: true, from: location }} replace>
        </Navigate>
    );
}

export default RequireInstructorRole;
import { useLocation, Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import { AppContext } from "../Context/AppContext.jsx";
import CourseCard from "../Components/Shared/CourseCard.jsx";

function Dashboard()
{
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    
    const {state} = useLocation();
    const {userDetails, refreshTokens} = useContext(AppContext);

    useEffect(function(){
        if(state && state.requireAccess === true)
            toast.error("You do not have access to the course.");
        else if(state && state.requireInstructorRole === true)
            toast.error("You must be an instructor to access this page.");
    }, []);

    async function getCourses()
    {
        try
        {
            setIsLoading(true);
    
            const response = await fetch(`${import.meta.env.VITE_REACT_APP_BASE_URL}/api/v1/get-user-courses`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${userDetails.accessToken}`
                }
            });
    
            const data = await response.json();

            if(data.success === true)
            {
                setIsLoading(false);
                setCourses(data.courses);
            }
            else
            {
                setIsLoading(false);

                if(response.status === 401)
                    await refreshTokens();
                else if(response.status !== 500)
                    toast.error(data.message);
                else
                    toast.error("Something went wrong with the server.");
            }
        }
        catch(error)
        {
            setIsLoading(false);

            if(!error?.response)
                toast.error("No response from server.");
        }
    }

    useEffect(function(){
        getCourses();
    }, [userDetails.accessToken]);

    return(
        <div className="min-h-[calc(100dvh-4.5rem)] px-[2rem] md:px-[1rem] py-[2rem] mt-[4.5rem] flex justify-center">
            <div className="max-w-[1000px] md:max-w-[650px] w-[100%] px-[2rem] md:px-[0rem] py-[2rem] text-white flex-col justify-items-start">
                <h3 className="text-sm font-semibold md:m-auto md:text-center md:mb-[2rem]">
                    Welcome Back, {userDetails.name}
                </h3>
                
                <h2 className="font-bold text-3xl md:m-auto md:text-center mt-[2rem]">
                    My Courses
                </h2>
                
                {
                    (userDetails.role === "instructor") ?
                    <div className="w-[100%] flex justify-end md:justify-center md:mt-[2rem] gap-2">
                        <Link to="/earnings" onClick={() => window.scrollTo(0, 0)}>
                            <button className="bg-green-500 rounded font-semibold text-sm sm:text-sm px-[1rem] py-[0.4rem] cursor-pointer">
                                View Earnings
                            </button>
                        </Link>

                        <Link to="/create-course" onClick={() => window.scrollTo(0, 0)}>
                            <button className="bg-green-500 rounded font-semibold text-sm sm:text-sm px-[1rem] py-[0.4rem] cursor-pointer">
                                Create Course
                            </button>
                        </Link>
                    </div>
                    :
                    <></>
                }
                
                {
                    (isLoading === false) ?
                    <div className="w-[100%] mt-[2rem]">
                        {
                            courses.map(function(course){
                                return (
                                    <CourseCard key={course._id} 
                                        course={course} 
                                        showSales={false} 
                                        showTransaction={true}>
                                    </CourseCard>
                                );
                            })
                        }

                        {
                            (courses.length === 0) ? 
                            <p className="flex items-center justify-center text-center text-lg font-semibold text-red-500 h-[45vh] md:px-[2rem]">
                                You have not bought/published any course yet!
                            </p>
                            :
                            <></>
                        }
                    </div>
                    :
                    <div className="w-[100%] mt-[4rem] flex justify-center">
                        <ClipLoader color="white" size="50px"></ClipLoader>
                    </div>
                }
            </div>
        </div>
    );
}

export default Dashboard;
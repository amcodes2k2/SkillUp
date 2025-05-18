import { useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import { AppContext } from "../Context/AppContext.jsx";
import Reviews from "../Components/Course/Reviews.jsx";
import Content from "../Components/Course/Content.jsx";
import Objectives from "../Components/Course/Objectives.jsx";
import Description from "../Components/Course/Description.jsx";

function Course()
{
    const location = useLocation();
    const {userDetails} = useContext(AppContext);

    const [course, setCourse] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    async function fetchCourse()
    {
        try
        {   
            setIsLoading(true);

            const response = await fetch(`${import.meta.env.VITE_REACT_APP_BASE_URL}/api/v1/course/${location.pathname.split("/").at(-1)}`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                }
            });

            const data = await response.json();

            if(data.success === true)
            {
                setIsLoading(false);
                setCourse(data.course);
            }
            else
            {
                setIsLoading(false);

                if(response.status != 500)
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
        fetchCourse();
    }, []);

    return(
        <div className="min-h-[calc(100dvh-4.5rem)] px-[2rem] md:px-[1rem] py-[2rem] mt-[4.5rem] flex justify-center">
            <div className="max-w-[1000px] md:max-w-[650px] w-[100%] px-[2rem] md:px-[1rem] py-[2rem] text-white flex-col">
                {
                    (isLoading === false && Object.keys(course).length > 0) ?
                    <div className="flex-col">
                        <Description course={course} userDetails={userDetails}></Description>

                        <Objectives course={course}></Objectives>

                        <Content course={course}></Content>

                        <Reviews reviews={course.reviews} course_id={course._id}></Reviews>
                    </div>
                    :
                    <div className="w-[100%] flex justify-center">
                        <ClipLoader color="white" size="50px"></ClipLoader>
                    </div>
                }
            </div>
        </div>
    );
}

export default Course;
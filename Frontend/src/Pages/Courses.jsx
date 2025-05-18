import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import toast from "react-hot-toast";
import categories from "../Data/Categories";
import { ClipLoader } from "react-spinners";
import CourseCard from "../Components/Shared/CourseCard.jsx";

function Catalog()
{
    const location = useLocation();
    const category = categories.filter(function(category){
        return category._id === location.pathname.split("/").at(-1);
    }).at(0);

    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    
    async function getCourses()
    {
        try
        {
            setIsLoading(true);

            const response = await fetch(`${import.meta.env.VITE_REACT_APP_BASE_URL}/api/v1/courses/${location.pathname.split("/").at(-1)}`, {
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
                setCourses(data.courses);
            }
            else
            {
                setCourses([]);
                setIsLoading(false);

                if(response.status != 500)
                    toast.error(data.message);
                else
                    toast.error("Something went wrong with the server.");
            }  
        }
        catch(error)
        {
            setCourses([]);
            setIsLoading(false);

            if(!error?.response)
                toast.error("No response from server.");
        }
    }
    
    useEffect(function(){
        getCourses();
    }, [location.pathname]);

    return(
        <div className="min-h-[calc(100dvh-4.5rem)] px-[2rem] md:px-[1rem] py-[2rem] mt-[4.5rem] flex justify-center">
            <div className="max-w-[1000px] md:max-w-[650px] w-[100%] px-[2rem] md:px-[1rem] py-[2rem] text-white flex-col justify-items-start">
                <h2 className="font-bold text-3xl">
                    {category.title} Courses
                </h2>

                <p className="mt-[0.5rem] mb-[1.5rem] font-semibold text-base text-[#a4a5ab]">
                    {category.description}
                </p>

                {
                    (isLoading === false) ?
                    <div className="w-[100%] mt-[2rem]">
                        {
                            courses.map(function(course){
                                return( 
                                    <CourseCard 
                                        key={course._id} 
                                        course={course} 
                                        showSales={false}
                                        showTransaction={false}>
                                    </CourseCard>
                                );
                            })
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

export default Catalog;
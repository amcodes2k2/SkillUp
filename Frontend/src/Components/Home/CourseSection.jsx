import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

import toast from "react-hot-toast";
import CourseCard from "./CourseCard.jsx";
import { ClipLoader } from "react-spinners";
import categories from "../../Data/Categories.js";
import CategoriesTab from "../Shared/CategoriesTab.jsx";

function CourseSection()
{   
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [activeCategory, setActiveCategory] = useState(categories[0]._id);
    
    async function fetchCourses()
    {
        try
        {
            setIsLoading(true);

            const response = await fetch(`${import.meta.env.VITE_REACT_APP_BASE_URL}/api/v1/courses/${activeCategory}`, {
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
                setCourses(data.courses.slice(0, 3));
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
        fetchCourses();
    }, [activeCategory]);

    return(
        <section className="px-[2rem] py-[3rem] flex-col justify-items-center">
            <CategoriesTab categories={categories} activeCategory={activeCategory} setActiveCategory={setActiveCategory}></CategoriesTab>

            <div className="flex flex-wrap md:flex-col justify-center gap-[2rem] mb-[3rem]">
                {
                    (isLoading === false) ? 
                    courses.map(function(course){
                        return <CourseCard key={course._id} course={course}></CourseCard>;
                    })
                    :
                    <div className="w-[100%] h-[511.6px] my-[1rem] flex justify-center">
                        <ClipLoader color="white" size="50px"></ClipLoader>
                    </div>
                }

                {
                    (isLoading === false && courses.length === 0) ?
                    <div className="w-[100%] h-[511.6px] my-[1rem] flex justify-center items-center text-white font-semibold">
                        No courses found
                    </div>
                    :
                    <></>
                }
            </div>

            <Link to={`/catalog/${activeCategory}`} onClick={() => window.scrollTo(0, 0)}>
                <button className="bg-[#CDA954] rounded-xl font-semibold text-base px-[2rem] py-[0.7rem] cursor-pointer">
                    View more
                </button>
            </Link>
        </section>
    );
}

export default CourseSection;
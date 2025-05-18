import { useContext, useState, useEffect } from "react";

import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import { AppContext } from "../Context/AppContext.jsx";
import CourseCard from "../Components/Shared/CourseCard.jsx";

function Earnings()
{
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [monthlyEarnings, setMonthlyEarnings] = useState(0);
    const [lifetimeEarnings, setLifetimeEarnings] = useState(0);

    const {userDetails, refreshTokens} = useContext(AppContext);

    async function getCourses()
    {
        try
        {
            setIsLoading(true);
    
            const response = await fetch(`${import.meta.env.VITE_REACT_APP_BASE_URL}/api/v1/get-earnings`, {
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
                setMonthlyEarnings(data.monthlyEarnings);
                setLifetimeEarnings(data.lifetimeEarnings); 
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

                <h2 className="font-bold text-3xl md:m-auto md:text-center mt-[2rem]">
                    My Earnings
                </h2>

                {
                    (isLoading === false) ?
                    <div className="w-[100%] mt-[2rem] flex justify-center">
                        <div className="w-[60%] md:w-[80%] sm:w-[95%] bg-[#1B1E2D] py-[1rem] flex-col text-center">
                            <p className="font-semibold text-base">
                                Lifetime Earnings :  &#8377; {lifetimeEarnings}
                            </p>

                            <p className="font-semibold text-base">
                                Earnings this month :  &#8377; {monthlyEarnings}
                            </p>

                            <p className="font-semibold text-sm text-[#a4a5ab] mt-[1rem]">
                                Note - Earnings are shown after deducting platform fees and taxes.
                            </p>

                            <p className="font-semibold text-sm text-[#a4a5ab]">
                                You will be paid within the 10th of every month, initiated via an email.
                            </p>
                        </div>
                    </div>
                    :
                    <></>
                }

                {
                    (isLoading === false) ?
                    <div className="w-[100%] mt-[1rem]">
                        {
                            courses.map(function(course){
                                return( 
                                    <CourseCard 
                                        key={course._id} 
                                        course={course} 
                                        showSales={true}
                                        showTransaction={false}>
                                    </CourseCard>
                                );
                            })
                        }

                        {
                            (courses.length === 0) ? 
                            <p className="flex items-center justify-center text-center text-lg font-semibold text-red-500 h-[45vh] md:px-[2rem]">
                                You have not published any course yet!
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

export default Earnings;
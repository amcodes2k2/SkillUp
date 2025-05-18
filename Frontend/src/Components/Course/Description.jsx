import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";
import { SyncLoader } from "react-spinners";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";

function Description(props)
{
    const {course, userDetails, refreshTokens} = props;

    const navigate = useNavigate();
    const [isRunning, setIsRunning] = useState(false);
    const [shouldRetry, setShouldRetry] = useState(false);

    async function initiatePayment()
    {
        try
        {
            if(Object.keys(userDetails).length === 0)
            {
                navigate("/login");
                window.scrollTo(0, 0);
                toast.error("You must be logged in.");
    
                return;
            }

            setIsRunning(true);

            const response = await fetch(`${import.meta.env.VITE_REACT_APP_BASE_URL}/api/v1/initiate-payment`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${userDetails.accessToken}`
                },
                body: JSON.stringify({course_id: course._id})
            });

            const data = await response.json();
            console.log(data);

            if(data.success === true)
            {
                window.location.href = data.checkoutPageUrl;
                return;
            }
            else
            {
                if(response.status === 401)
                {
                    await refreshTokens();
                    setShouldRetry(true);
                    return;
                }

                if(response.status != 500)
                    toast.error(data.message);
                else
                    toast.error("Something went wrong with the server.");
            }
        }
        catch(error)
        {
            if(!error?.response)
                toast.error("No response from server.");
        }
    }

    useEffect(function(){
        if(shouldRetry === true)
            initiatePayment();
    }, [userDetails.accessToken]);

    return(
        <div className="flex md:flex-col justify-between">
            <div className="max-h-fit sm:w-[100%]">
                <img src={course.thumbnail} className="h-[250px] md:w-[270px] md:h-[270px] md:m-auto"></img>
            </div>
                                
            <div className="w-[70%] md:w-[100%] md:mt-[2rem] max-h-fit flex-col justify-items-start">
                <h2 className="font-bold text-2xl">
                    {course.title}
                </h2>

                <p className="mt-[0.5rem] sm:mt-[1rem] mb-[1rem] font-semibold text-base text-[#a4a5ab]">
                    {course.description}
                </p>

                <p className="font-semibold text-[#a4a5ab] text-sm">
                    Created by {course.author.name}
                </p>

                <p className="mt-[0.5rem] sm:mt-[1rem] font-semibold text-[#a4a5ab] text-sm flex sm:flex-col gap-2">
                    <span> Published on {course.publishedOn.substring(0, 10)} </span>
                    <span> &#x2022; {course.language} </span>
                    <span> &#x2022; {course.level.charAt(0).toUpperCase() + course.level.slice(1)} </span>
                </p>

                <div className="mt-[2rem] flex items-center justify-center gap-6 text-sm">
                {
                    (Object.keys(userDetails).length > 0) ?
                    <>
                        {
                            (userDetails.courses.includes(course._id) === true) ? 
                            <p className="font-semibold flex items-center gap-1">
                                <span className="text-xl">
                                    <IoIosCheckmarkCircleOutline></IoIosCheckmarkCircleOutline>
                                </span>

                                You have previously {(userDetails.id === course.author._id) ? "published" : "bought"} this course and have full lifetime access
                            </p>
                            :
                            <>
                                <span className="font-semibold"> &#8377; {course.price} </span>

                                <button 
                                    disabled={isRunning}
                                    onClick={initiatePayment}
                                    className="bg-[#514ED8] rounded font-semibold text-base text-white px-[2rem] py-[0.5rem] cursor-pointer">
                                    {(isRunning === false) ? "Buy now" : <SyncLoader color="white" size="5px"></SyncLoader>}
                                </button>
                            </>
                        }
                    </>
                    :
                    <>
   
                        <span className="font-semibold"> &#8377; {course.price} </span>
                                        
                        <button 
                            disabled={isRunning}
                            onClick={initiatePayment}
                            className="bg-[#514ED8] rounded font-semibold text-base text-white px-[2rem] py-[0.5rem] cursor-pointer">
                            Buy now
                        </button>
                    </>
                }
                </div>
            </div>
        </div>
    );
}

export default Description;
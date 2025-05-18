import { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import toast from "react-hot-toast";
import { SyncLoader } from "react-spinners";
import { AppContext } from "../../Context/AppContext.jsx";

function Reviews(props)
{
    const {reviews, course_id} = props;

    const [formData, setFormData] = useState("");
    const [isRunning, setIsRunning] = useState(false);
    const [shouldRetry, setShouldRetry] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const {refreshTokens, userDetails} = useContext(AppContext);

    async function handleSubmit(event)
    {
        try
        {   
            if(event)
                event.preventDefault();

            if(Object.keys(userDetails).length > 0 && !userDetails.courses.includes(course_id))
            {
                toast.error("You do not have access to the course.");
                return;
            }

            setIsRunning(true);

            if(Object.keys(userDetails).length === 0)
            {
                navigate("/login");
                window.scrollTo(0, 0);
                toast.error("You must be logged in.");

                return;
            }

            const response = await fetch(`${import.meta.env.VITE_REACT_APP_BASE_URL}/api/v1/post-review/${location.pathname.split("/").at(-1)}`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${userDetails.accessToken}`
                },
                body: JSON.stringify({content: formData})
            });

            const data = await response.json();
            
            if(data.success === true)
            {
                navigate(0);
                setIsRunning(false);
                toast.success(data.message);
            }
            else
            {
                if(response.status === 401)
                {
                    await refreshTokens();
                    setShouldRetry(true);
                    return;
                }

                if(response.status !== 500)
                    toast.error(data.message);
                else
                    toast.error(data.message);

                setIsRunning(false);
            }
        }
        catch(error)
        {
            setIsRunning(false);

            if(!error?.response)
                toast.error("No response from server.");
        }
    }

    useEffect(function(){
        if(shouldRetry === true)
            handleSubmit();
    }, [userDetails.accessToken]);

    return(
        <div className="py-[1rem] mt-[1rem]">
            <h3 className="font-semibold text-lg text-white">
                Reviews ({reviews.length})
            </h3>          

            <form onSubmit={handleSubmit} className="mb-[2rem] w-[100%]">
                <textarea value={formData}
                    type="text"
                    minLength={10} 
                    maxLength={200}
                    placeholder="Type review here" 
                    onChange={(event) => setFormData(event.target.value)}
                    className="mt-[1rem] outline-none rounded-md w-[100%] px-[1rem] pt-[1rem] pb-[5rem] resize-none font-semibold text-base bg-[#1B1E2D]" >
                </textarea>

                <div className="flex justify-end">
                    <button 
                        disabled={isRunning}
                        type="submit" 
                        className="px-[0.8rem] py-[0.4rem] bg-[#514ED8] rounded font-semibold text-sm mt-[0.5rem]">
                        {(isRunning === false) ? "Submit" : <SyncLoader color="white" size="5px"></SyncLoader>}
                    </button>
                </div>
            </form>

            {
                reviews.map(function(review){
                    return (
                        <div key={review._id} className="px-[1rem] py-[1.5rem] border-b border-[#9194ac] w-[100%]">
                            <p className="font-semibold text-white text-sm flex justify-between">
                                {review.user.name}

                                <span>
                                    {review.reviewedOn.substring(0, 10)}
                                </span>
                            </p>

                            <div className="mt-[1rem] text-[#a4a5ab] text-base font-semibold">
                                {
                                    review.description.split("\n").map(function(line, idx){
                                        return <p key={idx}>{line}</p>;
                                    })
                                }
                            </div>
                        </div>
                    )
                })
            }
        </div>
    );
}

export default Reviews;
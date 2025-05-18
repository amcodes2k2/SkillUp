import { useState, useEffect } from "react";

import toast from "react-hot-toast";
import ReviewCard from "./ReviewCard.jsx";
import { ClipLoader } from "react-spinners";

function ReviewSection()
{
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    
    async function fetchReviews()
    {
        try
        {
            setIsLoading(true);

            const response = await fetch(`${import.meta.env.VITE_REACT_APP_BASE_URL}/api/v1/reviews`, {
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
                setReviews(data.reviews);
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
        fetchReviews();
    }, []);

    return(
        <section className="px-[2rem] py-[3rem] flex-col justify-items-center">
            <div className="text-center mb-[2rem]">
                <h2 className="text-white font-bold text-3xl">
                    See what learners are saying
                </h2>
            </div>
            
            <div className="flex flex-wrap md:flex-col justify-center gap-[2rem] mb-[3rem]">
                {
                    (isLoading === false) ? 
                    reviews.map(function(review){
                        return(
                            <ReviewCard key={review._id} review={review}></ReviewCard>
                        );
                    })
                    :
                    <div className="w-[100%] h-[256px] flex justify-center">
                        <ClipLoader color="white" size="50px"></ClipLoader>
                    </div>
                }
            </div>
        </section>
    );
}

export default ReviewSection;
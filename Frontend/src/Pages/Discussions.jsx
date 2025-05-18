import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import DiscussCard from "../Components/Discussions/DiscussCard.jsx";

function Discussions()
{
    const [isLoading, setIsLoading] = useState(false);
    const [discussions, setDiscussions] = useState([]);

    async function getDiscussions()
    {
        try
        {
            setIsLoading(true);
    
            const response = await fetch(`${import.meta.env.VITE_REACT_APP_BASE_URL}/api/v1/discussions`, {
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
                setDiscussions(data.discussions);
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
        getDiscussions();
    }, []);

    return(
        <div className="min-h-[calc(100dvh-4.5rem)] px-[2rem] md:px-[1rem] py-[2rem] mt-[4.5rem] flex justify-center">
            <div className="max-w-[1000px] md:max-w-[650px] w-[100%] px-[2rem] md:px-[0rem] py-[2rem] text-white flex-col justify-items-start">
                <h2 className="font-bold text-3xl">
                    Discussions
                </h2>

                <div className="w-[100%] flex justify-end">
                    <Link to="/create-post" onClick={() => window.scrollTo(0, 0)}>
                        <button className="bg-green-500 rounded font-semibold text-sm px-[1rem] py-[0.4rem] cursor-pointer">
                            Create Post
                        </button>
                    </Link>
                </div>

                {
                    (isLoading === false) ?
                    <div className="w-[100%] mt-[1rem]">
                        {
                            discussions.map(function(discussion){
                                return (
                                    <DiscussCard key={discussion._id} discussion={discussion}></DiscussCard>
                                );
                            })
                        }
                    </div>
                    :
                    <div className="w-[100%] mt-[6rem] flex justify-center">
                        <ClipLoader color="white" size="50px"></ClipLoader>
                    </div>
                } 
            </div>
        </div>
    );
}

export default Discussions;
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import Comments from "../Components/Discussions/Comments.jsx";

function Post()
{
    const location = useLocation();
    const [post, setPost] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    async function getPost()
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

                setPost(data.discussions.filter(function(discussion){
                    return discussion._id === location.pathname.split("/").at(-1);
                }).at(0));
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
        getPost();
    }, []);

    return(
        <div className="min-h-[calc(100dvh-4.5rem)] px-[2rem] md:px-[1rem] py-[2rem] mt-[4.5rem] flex justify-center">
            {
                (isLoading === false && Object.keys(post).length > 0) ?
                <div className="max-w-[1000px] md:max-w-[650px] w-[100%] px-[2rem] md:px-[0rem] py-[2rem] text-white flex-col justify-items-start">
                    <h2 className="font-bold text-2xl md:text-xl text-white">
                        {post.title}
                    </h2>

                    <p className="font-semibold text-[#a4a5ab] text-sm flex gap-4 mt-[1rem]">
                        {post.user.name}

                        <span>
                            {post.publishedOn.substring(0, 10)}
                        </span>
                    </p>

                    <div className="text-[#a4a5ab] font-semibold text-base flex-col mt-[1rem]">
                        {
                            post.description.split("\n").map(function(line, idx){
                                return <p key={idx}>{line}</p>;
                            })
                        }
                    </div>

                    <div className="mt-[2rem] w-[100%]">
                        <h3 className="font-semibold text-lg">
                            Comments ({post.comments.length})
                        </h3>
                                
                        <Comments post={post} type="discussion"></Comments>
                    </div>   
                </div>
                :
                <div className="w-[100%] mt-[5rem] flex justify-center">
                    <ClipLoader color="white" size="50px"></ClipLoader>
                </div>
            }
        </div>
    );
}

export default Post;
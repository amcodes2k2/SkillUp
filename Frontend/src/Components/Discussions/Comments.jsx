import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

import toast from "react-hot-toast";
import { SyncLoader } from "react-spinners";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";

import Replies from "./Replies.jsx";
import { AppContext } from "../../Context/AppContext.jsx";

function Comments(props)
{
    const {post, type} = props;
    const {refreshTokens, userDetails} = useContext(AppContext);

    const navigate = useNavigate();

    const [formData, setFormData] = useState("");
    const [isRunning, setIsRunning] = useState(false);
    const [shouldRetry, setShouldRetry] = useState(false);
    const [isDropDownMenuOpen, setIsDropDownMenuOpen] = useState(false);

    async function handleSubmit(event)
    {
        try
        {   
            if(event)
                event.preventDefault();

            if(Object.keys(userDetails).length === 0)
            {
                navigate("/login");
                window.scrollTo(0, 0);
                toast.error("You must be logged in.");

                return;
            }

            setIsRunning(true);

            const response = await fetch(`${import.meta.env.VITE_REACT_APP_BASE_URL}/api/v1/${type}-comment/${post._id}`, {
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
        <div className="w-[100%] flex-col justify-items-end">
            <form onSubmit={handleSubmit} className="mb-[2rem] w-[100%]">
                <textarea value={formData}
                    onChange={(event) => setFormData(event.target.value)}
                    type="text" 
                    placeholder="Type comment here" 
                    className="mt-[1rem] outline-none rounded-md w-[100%] px-[1rem] pt-[1rem] pb-[5rem] resize-none font-semibold text-base bg-[#1B1E2D]" >
                </textarea>

                <div className="flex justify-end">
                    <button 
                        type="submit" 
                        disabled={isRunning}
                        className={`px-[0.8rem] py-[0.4rem] bg-[#514ED8] rounded font-semibold text-sm mt-[0.5rem]`}>
                        {(isRunning === false) ? "Comment" : <SyncLoader color="white" size="5px"></SyncLoader>}
                    </button>     
                </div>
            </form>

            {
                post.comments.map(function(comment){
                    return(
                        <div key={comment._id} className="w-[100%] flex-col justify-items-end">
                            <div className="p-[1rem] border-b border-[#9194ac] w-[100%]">
                                <p className="font-semibold text-white text-base flex justify-between">
                                    {comment.user.name}

                                    <span>
                                        {comment.publishedOn.substring(0, 10)}
                                    </span>
                                </p>

                                <div className="mt-[1rem] text-[#a4a5ab] text-[#a4a5ab] text-base font-semibold">
                                    {
                                        comment.content.split("\n").map(function(line, idx){
                                            return <p key={idx}>{line}</p>;
                                        })
                                    }
                                </div>
                                
                                <div className="flex items-center gap-2 mt-[1rem] text-base text-[#a4a5ab]">
                                    <div className="ml-2 font-semibold flex items-center gap-2 cursor-pointer" onClick={() => setIsDropDownMenuOpen(!isDropDownMenuOpen)}>
                                        {
                                            (isDropDownMenuOpen === false) ? 
                                            <IoIosArrowDown></IoIosArrowDown>
                                            :
                                            <IoIosArrowUp></IoIosArrowUp>
                                        }

                                        {comment.replies.length} replies
                                    </div>
                                </div>
                            </div>
                            
                            {
                                (isDropDownMenuOpen === true) ?
                                <Replies replies={comment.replies} type={type} comment_id={comment._id}>
                                </Replies>
                                :
                                <></>
                            }
                        </div>   
                    );
                })
            }
        </div>
    );
}

export default Comments;
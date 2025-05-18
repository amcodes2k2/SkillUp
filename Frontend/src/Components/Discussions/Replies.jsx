import { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import toast from "react-hot-toast";
import { SyncLoader } from "react-spinners";
import { AppContext } from "../../Context/AppContext.jsx";

function Replies(props)
{
    const {replies, type, comment_id} = props;
    const {refreshTokens, userDetails} = useContext(AppContext);

    const navigate = useNavigate();
    const location = useLocation();

    const [formData, setFormData] = useState("");
    const [isRunning, setIsRunning] = useState(false);
    const [shouldRetry, setShouldRetry] = useState(false);

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

            const url = (type === "lecture") ? 
            `${import.meta.env.VITE_REACT_APP_BASE_URL}/api/v1/${type}-comment-reply/${location.pathname.split("/").at(-1)}/${comment_id}`
            :
            `${import.meta.env.VITE_REACT_APP_BASE_URL}/api/v1/${type}-comment-reply/${comment_id}`;

            const response = await fetch(url, {
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
                    toast.error("Something went wrong with the server.");

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
        <div className="w-[85%]">
            <form onSubmit={handleSubmit} className="mb-[1rem]">
                <textarea value={formData}
                    onChange={(event) => setFormData(event.target.value)}
                    type="text" 
                    placeholder="Type reply here" 
                    className="mt-[1rem] outline-none rounded-md w-[100%] px-[1rem] pt-[1rem] pb-[5rem] resize-none font-semibold text-base bg-[#1B1E2D]" >
                </textarea>

                <div className="flex justify-end">
                    <button 
                        type="submit" 
                        disabled={isRunning}
                        className={`px-[0.8rem] py-[0.4rem] bg-[#514ED8] rounded font-semibold text-sm mt-[0.5rem]`}>
                        {(isRunning === false) ? "Reply" : <SyncLoader color="white" size="5px"></SyncLoader>}
                    </button>
                </div>
            </form>

            {
                replies.map(function(reply){
                    return(
                        <div key={reply._id} className="p-[1rem] border-b border-[#9194ac]">
                            <p className="font-semibold text-[#a4a5ab] text-sm text-white flex justify-between">
                                {reply.user.name}

                                <span>
                                    {reply.publishedOn.substring(0, 10)}
                                </span>
                            </p>

                            <div className="mt-[1rem] text-[#a4a5ab] text-base font-semibold">
                                {
                                    reply.content.split("\n").map(function(line, idx){
                                        return <p key={idx}>{line}</p>;
                                    })
                                }
                            </div>
                        </div>
                    );
                })
            }
        </div>
    );
}

export default Replies;
import { useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";

import toast from "react-hot-toast";
import { SyncLoader } from "react-spinners";
import { AppContext } from "../../Context/AppContext.jsx";

function PostForm()
{
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        title: "",
        content: ""
    });
    const [isRunning, setIsRunning] = useState(false);
    const [shouldRetry, setShouldRetry] = useState(false);

    const {userDetails, refreshTokens} = useContext(AppContext);

    function handleChange(event)
    {
        setFormData(function(prevFormData){
            return {
                ...prevFormData,
                [event.target.id]: event.target.value
            };
        });
    }

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
            
            const response = await fetch(`${import.meta.env.VITE_REACT_APP_BASE_URL}/api/v1/discussion`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${userDetails.accessToken}`
                },
                body: JSON.stringify({
                    title: formData.title,
                    description: formData.content
                })
            });

            const data = await response.json();
            
            if(data.success === true)
            {
                setIsRunning(false);

                navigate("/discuss");
                window.scrollTo(0, 0);
                toast.success(data.message);
            }
            else
            {
                setIsRunning(false);

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
        <div className="min-h-[calc(100dvh-4.5rem)] px-[2rem] md:px-[1rem] py-[2rem] mt-[4.5rem] flex justify-center">
            <div className="max-w-[1000px] md:max-w-[650px] w-[100%] px-[2rem] md:px-[0rem] py-[2rem] text-white flex justify-center items-center">
                <form className="w-[100%]" onSubmit={handleSubmit}>
                    <label htmlFor="title" className="font-semibold text-base text-white">Title</label> <br/>
                    <input id="title" type="text" minLength="10" maxLength="100" value={formData.title} onChange={handleChange} placeholder="Enter post title" className="font-semibold text-base bg-[#1B1E2D] outline-none text-white mt-[0.5rem] mb-[1rem] w-[100%] py-[0.8rem] rounded-md indent-3"></input> <br/>

                    <label htmlFor="content" className="font-semibold text-base text-white">Content</label> <br/>
                    <textarea 
                        id="content"
                        type="text"
                        minLength="25"
                        value={formData.content}
                        onChange={handleChange}
                        placeholder="Type post content here" 
                        className="mt-[1rem] outline-none rounded-md w-[100%] px-[1rem] pt-[1rem] pb-[20rem] resize-none font-semibold text-base bg-[#1B1E2D]" >
                    </textarea>
                    
                    <div className="w-[100%] flex justify-end">
                        <button 
                            type="submit" 
                            disabled={isRunning}
                            className="px-[0.8rem] py-[0.4rem] bg-green-500 rounded font-semibold text-sm mt-[0.5rem]">
                            {(isRunning === false) ? "Create Post" : <SyncLoader color="white" size="5px"></SyncLoader>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default PostForm;
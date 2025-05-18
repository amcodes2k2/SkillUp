import { useLocation } from "react-router-dom";
import { useContext, useState, useEffect } from "react";

import toast from "react-hot-toast";
import ReactPlayer from "react-player";
import { ClipLoader } from "react-spinners";
import { AppContext } from "../Context/AppContext.jsx";
import Comments from "../Components/Discussions/Comments.jsx";

function Lecture()
{
    const location = useLocation();
    const [lecture, setLecture] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const {userDetails, refreshTokens} = useContext(AppContext);

    async function fetchLecture()
    {
        try
        {   
            setIsLoading(true);

            const response = await fetch(`${import.meta.env.VITE_REACT_APP_BASE_URL}/api/v1/lecture/${location.pathname.split("/").at(-1)}`, {
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
                setLecture(data.lecture);
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
        fetchLecture();
    }, [userDetails.accessToken]);

    return(
        <div className="min-h-[calc(100dvh-4.5rem)] mt-[4.5rem] flex justify-center">
            {
                (isLoading === false && Object.keys(lecture).length > 0) ?
                <div className="w-[100%] flex-col justify-items-center">
                    <ReactPlayer 
                        controls
                        width={"100%"}
                        height={"80vh"}
                        url={lecture.videoFile}
                        onContextMenu={e => e.preventDefault()}
                        config={{ 
                            file: { 
                                attributes: {
                                    controlsList: "nodownload",
                                    disablePictureInPicture: true
                            }
                        }
                        }}>
                    </ReactPlayer>
                    
                    <div className="px-[2rem] md:px-[1rem] py-[0.5rem] max-w-[1000px] md:max-w-[650px] w-[100%]">
                        <div className="w-[100%] px-[2rem] md:px-[0rem] py-[2rem] text-white flex-col justify-items-start">
                            <h3 className="font-semibold text-lg text-white">
                                Comments ({lecture.comments.length})
                            </h3>    

                            <Comments post={lecture} type={"lecture"}></Comments>
                        </div>  
                    </div>
                </div>
                :
                <div className="w-[100%] mt-[5rem] flex items-center justify-center">
                    <ClipLoader color="white" size="50px"></ClipLoader>
                </div>
            }
        </div>
    );
}

export default Lecture;
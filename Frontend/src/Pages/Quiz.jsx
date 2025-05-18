import { useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import { AppContext } from "../Context/AppContext.jsx";
import QuizResult from "../Components/QuizMaster/QuizResult.jsx";
import QuizQuestion from "../Components/QuizMaster/QuizQuestion.jsx";

function Quiz()
{
    const location = useLocation();
    const {userDetails, refreshTokens} = useContext(AppContext);

    const [score, setScore] = useState(0);
    const [quesNo, setQuesNo] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    
    async function fetchQuestions()
    {
        try
        {
            setIsLoading(true);

            const type = (location.pathname.split("/").includes("general-quiz")) ? "general-quiz" : "section-quiz";

            const response = await fetch(`${import.meta.env.VITE_REACT_APP_BASE_URL}/api/v1/${type}/${location.pathname.split("/").at(-1)}`, {
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
                setQuestions(data.questions);
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
        fetchQuestions();
    }, [userDetails.accessToken]);

    return(
        <div className="min-h-[calc(100dvh-4.5rem)] md:px-[1rem] px-[2rem] py-[2rem] mt-[4.5rem] flex justify-center items-center">
            {
                (isLoading === false && questions.length > 0) ?
                <div className="max-w-[800px] md:max-w-[550px] w-[100%] md:px-[1rem] px-[3rem] py-[2rem] bg-[#1B1E2D]">
                    {
                        (quesNo === questions.length) ? 
                        <QuizResult score={score} totalScore={questions.length}></QuizResult>
                        :
                        <QuizQuestion score={score} setScore={setScore} questions={questions} quesNo={quesNo} setQuesNo={setQuesNo}>
                        </QuizQuestion>
                    }
                </div>
                :
                <div className="w-[100%] flex justify-center">
                    <ClipLoader color="white" size="50px"></ClipLoader>
                </div>
            }
        </div>
    );
}

export default Quiz;
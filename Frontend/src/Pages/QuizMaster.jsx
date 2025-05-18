import { useEffect, useState } from "react";

import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";

import categories from "../Data/Categories.js";
import QuizCard from "../Components/QuizMaster/QuizCard.jsx"
import CategoriesTab from "../Components/Shared/CategoriesTab.jsx";

function QuizMaster()
{
    const [quizzes, setQuizzes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [activeCategory, setActiveCategory] = useState(categories[0]._id);

    async function fetchQuizzes()
    {
        try
        {
            setIsLoading(true);

            const response = await fetch(`${import.meta.env.VITE_REACT_APP_BASE_URL}/api/v1/quizzes/${activeCategory}`, {
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
                setQuizzes(data.quizzes);
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
        fetchQuizzes();
    }, [activeCategory]);

    return(
        <div className="min-h-[calc(100dvh-4.5rem)] px-[2rem] md:px-[1rem] py-[2rem] mt-[4.5rem] flex justify-center">
            <div className="max-w-[1000px] md:max-w-[650px] w-[100%] px-[2rem] md:px-[1rem] py-[2rem] text-white flex-col justify-items-start">
                <h2 className="font-bold text-3xl">
                    Quiz master
                </h2>

                <p className="mt-[0.5rem] mb-[1.5rem] font-semibold text-base text-[#a4a5ab]">
                    Test your coding skills by answering MCQ's as a quiz.
                </p>

                <CategoriesTab categories={categories}
                    activeCategory={activeCategory}
                    setActiveCategory={setActiveCategory}>
                </CategoriesTab>   

                {
                    (isLoading === false) ?
                    <div className="w-[100%] mt-[-2rem]">
                    {
                        quizzes.map(function(quiz){
                            return <QuizCard key={quiz._id} quiz={quiz}></QuizCard>;
                        })
                    }
                    </div>
                    :
                    <div className="w-[100%] flex justify-center">
                        <ClipLoader color="white" size="50px"></ClipLoader>
                    </div>
                }
            </div>
        </div>
    );
}

export default QuizMaster;
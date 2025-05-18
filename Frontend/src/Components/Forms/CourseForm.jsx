import { useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";

import toast from "react-hot-toast";
import { SyncLoader } from "react-spinners";
import Sections from "../CourseForm/Sections.jsx";
import categories from "../../Data/Categories.js";
import Objectives from "../CourseForm/Objectives.jsx";
import { AppContext } from "../../Context/AppContext.jsx";

function CourseForm()
{
    const navigate = useNavigate();
    const {userDetails, refreshTokens} = useContext(AppContext);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: categories[0].title,
        level: "Beginner",
        language: "English",
        price: 0,
        thumbnail: File,
        objectives: [""],
        sections: [{
            title: "",
            lectures: [{
                title: "",
                videoFile: File
            }],
            quiz: {
                title: "",
                questions: [{
                    question: "",
                    options: ["", "", "", ""],
                    correctAnswer: ""
                }]
            }
        }]
    });
    const [isRunning, setIsRunning] = useState(false);
    const [shouldRetry, setShouldRetry] = useState(false);

    function handleChange(event)
    {
        if(event.target.name === "thumbnail" && event.target.files[0].size > 2097152)
        {
            event.target.value = "";
            toast.error("File size should not exceed 2 MB.");
            
            return;
        }

        setFormData(function(prevFormData){
            return {
                ...prevFormData,
                [event.target.id]: (event.target.id === "thumbnail") ? event.target.files[0] : event.target.value
            };
        });
    }

    function removeSection()
    {
        const newSections = [...formData.sections].slice(0, -1);

        setFormData(function(prevFormData){
            return({
                ...prevFormData,
                ["sections"] : newSections
            });
        });
    }

    function addSection()
    {
        const newSections = [...formData.sections];
        
        newSections.push({
            title: "",
            lectures: [{
                title: "",
                videoFile: File
            }],
            quiz: {
                title: "",
                questions: [{
                    question: "",
                    options: ["", "", "", ""],
                    correctAnswer: ""
                }]
            }
        });

        setFormData(function(prevFormData){
            return({
                ...prevFormData,
                ["sections"] : newSections
            });
        });
    }

    async function handleSubmit(event) 
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

        try
        {
            const details = new FormData();
            
            details.append("title", formData.title);
            details.append("description", formData.description);
            details.append("category", formData.category);
            details.append("level", formData.level);
            details.append("language", formData.language);
            details.append("price", formData.price);
            details.append("thumbnail", formData.thumbnail);

            for(let i = 0; i < formData.objectives.length; i++)
                details.append(`objectives`, formData.objectives[i]);

            for(let i = 0; i < formData.sections.length; i++)
            {
                details.append(`section_titles`, formData.sections[i].title);

                for(let j = 0; j < formData.sections[i].lectures.length; j++)
                {
                    details.append(`sections[${i}].lecture_titles`, formData.sections[i].lectures[j].title);
                    details.append(`sections[${i}].lecture_videoFiles`, formData.sections[i].lectures[j].videoFile);
                }

                details.append(`section_quiz_titles[${i}]`, formData.sections[i].quiz.title);

                for(let j = 0; j < formData.sections[i].quiz.questions.length; j++)
                {
                    details.append(`sections[${i}].quiz_questions`, formData.sections[i].quiz.questions[j].question);

                    for(let k = 0; k < 4; k++)
                        details.append(`sections[${i}].quiz_question[${j}].options`, formData.sections[i].quiz.questions[j].options[k]);
                    
                    details.append(`sections[${i}].quiz_questions_correct_answers`, formData.sections[i].quiz.questions[j].correctAnswer);
                }
            }

            const response = await fetch(`${import.meta.env.VITE_REACT_APP_BASE_URL}/api/v1/create-course`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Authorization": `Bearer ${userDetails.accessToken}`
                },
                body: details
            });

            const data = await response.json();
            console.log(data);
            if(data.success === true)
            {
                setIsRunning(false);
                await refreshTokens();
                navigate("/dashboard");

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
                    <div className="p-[2rem] md:p-[1rem] bg-[#1B1E2D] border border-[#9194ac]">
                        <label htmlFor="ctitle" className="font-semibold text-base text-white">
                            Title
                        </label> <br/>
                        <input 
                            id="title" 
                            type="text"
                            required
                            minLength={10} 
                            maxLength={60} 
                            value={formData.title} 
                            onChange={handleChange} 
                            placeholder="Enter course title" 
                            className="font-semibold text-base bg-[#121319] outline-none text-white mt-[0.5rem] 
                            mb-[1rem] w-[100%] py-[0.8rem] rounded-md indent-3">
                        </input> <br/>

                        <label htmlFor="description" className="font-semibold text-base text-white">
                            Description
                        </label> <br/>
                        <textarea 
                            type="text"
                            id="description"
                            required
                            minLength={10}
                            maxLength={80}
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Type course description here" 
                            className="mt-[0.5rem] outline-none rounded-md w-[100%] px-[0.8rem]
                            pt-[1rem] pb-[4rem] mb-[1rem] resize-none font-semibold text-base bg-[#121319]" >
                        </textarea> <br/>

                        <label htmlFor="category" className="font-semibold text-base text-white">
                            Category
                        </label>
                        <select 
                            id="category" 
                            value={formData.category}
                            onChange={handleChange}
                            className="font-semibold text-base bg-[#121319] outline-none text-white text-base 
                            mt-[0.5rem] mb-[1rem] w-[100%] py-[0.8rem] rounded-md px-[0.8rem]">
                            {
                                categories.map(function(category, idx){
                                    return <option value={category.title} id={category._id} key={idx}> {category.title} </option>
                                })
                            }
                        </select> <br/>

                        <label htmlFor="level" className="font-semibold text-base text-white">
                            Level
                        </label>
                        <select
                            id="level" 
                            value={formData.level}
                            onChange={handleChange}
                            className="font-semibold text-base bg-[#121319] outline-none text-white text-base
                            mt-[0.5rem] mb-[1rem] w-[100%] py-[0.8rem] rounded-md px-[0.8rem]">
                            <option value="Beginner"> Beginner </option>
                            <option value="Intermediate"> Intermediate </option>
                            <option value="Advanced"> Advanced </option>
                        </select> <br/>

                        <label htmlFor="language" className="font-semibold text-base text-white">
                            Language
                        </label>
                        <select 
                            id="language" 
                            value={formData.language}
                            onChange={handleChange}
                            className="font-semibold text-base bg-[#121319] outline-none text-white
                            text-base mt-[0.5rem] mb-[1rem] w-[100%] py-[0.8rem] rounded-md px-[0.8rem]">
                            <option value="English"> English </option>
                            <option value="Hindi"> Hindi </option>
                        </select>

                        <label htmlFor="ctitle" className="font-semibold text-base text-white">
                            Price <span className="text-sm">
                                (You'll receive 80% of the amount everytime someone purchases this course)
                            </span>
                        </label> <br/>
                        <input 
                            id="price" 
                            type="number" 
                            min="100"
                            max="5000"
                            value={formData.price} 
                            onChange={handleChange} 
                            placeholder="INR" 
                            className="font-semibold text-base bg-[#121319] outline-none text-white mt-[0.5rem] 
                            mb-[1rem] w-[100%] py-[0.8rem] rounded-md indent-3">
                        </input> <br/>
                        
                        <label htmlFor="language" className="font-semibold text-base text-white">
                            Thumbnail
                        </label> <br/>
                        <input 
                            type="file"
                            id="thumbnail" 
                            required
                            accept="image/*" 
                            onChange={(event) => handleChange(event)}
                            className="font-semibold text-sm mt-[0.5rem]">
                        </input>
                    </div> <br/>
                    
                    <Objectives formData={formData} setFormData={setFormData}>
                    </Objectives> <br/>
                    
                    {
                        formData.sections.map(function(section, idx){
                            return (
                                <Sections 
                                    key={idx}
                                    secIdx={idx}
                                    section={section}
                                    formData={formData} 
                                    setFormData={setFormData}>
                                </Sections> 
                            );
                        })
                    }

                    <div className="w-[100%] mt-[0.5rem] flex justify-end gap-2">
                        {
                            (formData.sections.length > 1) ?
                            <button type="button"
                                onClick={removeSection}
                                className="px-[0.8rem] py-[0.4rem] bg-[#514ED8] rounded font-semibold text-sm mt-[0.5rem]">
                                Remove
                            </button>
                            :
                            <></>
                        }

                        {
                            (formData.sections.length < 6) ?
                            <button type="button"
                                onClick={addSection}
                                className="px-[0.8rem] py-[0.4rem] bg-[#514ED8] rounded font-semibold text-sm mt-[0.5rem]">
                                Add section
                            </button>
                            :
                            <></>
                        }
                    </div>
                    
                    <button type="submit" disabled={isRunning} className="px-[0.8rem] py-[0.4rem] bg-green-500 rounded font-semibold text-sm mt-[0.5rem]">
                        {(isRunning === false) ? "Submit" : <SyncLoader color="white" size="5px"></SyncLoader>}
                    </button>
                </form>
            </div>  
        </div>
    );
}

export default CourseForm;
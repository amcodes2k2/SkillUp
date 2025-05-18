function Quiz(props)
{
    const {formData, setFormData, section, secIdx} = props;

    function handleChange(event, idx1, idx2)
    {
        const newSections = [...formData.sections];

        if(event.target.name === "title")
            newSections[secIdx].quiz.title = event.target.value;
        else if(event.target.name === "question")
            newSections[secIdx].quiz.questions[idx1].question = event.target.value;
        else if(event.target.name === "correctAnswer")
            newSections[secIdx].quiz.questions[idx1].correctAnswer = event.target.value;
        else
            newSections[secIdx].quiz.questions[idx1].options[idx2] = event.target.value;

        setFormData(function(prevFormData){
            return {
                ...prevFormData,
                ["sections"]: newSections
            }
        });
    }

    function removeQuestion()
    {
        let newSections = [...formData.sections];
        newSections[secIdx].quiz.questions = newSections[secIdx].quiz.questions.slice(0, -1);

        setFormData(function(prevFormData){
            return({
                ...prevFormData,
                ["sections"] : newSections
            });
        });
    }

    function addQuestion()
    {
        const newSections = [...formData.sections];
        newSections[secIdx].quiz.questions.push({question: "", options: ["", "", "", ""], correctAnswer: ""});

        setFormData(function(prevFormData){
            return({
                ...prevFormData,
                ["sections"] : newSections
            });
        });
    }

    return(
        <div className="p-[2rem] md:p-[1rem] border border-[#9194ac]">
            <h3 className="font-semibold text-base">
                Quiz (Optional)
            </h3>

            <input 
                type="text"
                name="title"
                minLength={10} 
                maxLength={50} 
                value={section.quiz.title} 
                onChange={(event) => handleChange(event)} 
                placeholder="Enter quiz title" 
                className="font-semibold text-base bg-[#121319] outline-none text-white
                mt-[0.5rem] mb-[1rem] w-[100%] py-[0.8rem] rounded-md indent-3">
            </input>

            <div className="mt-[1rem]">
                {
                    section.quiz.questions.map(function(question, quesIdx){
                        return(
                            <div key={quesIdx} className="mb-[1rem] p-[2rem] md:p-[1rem] border border-[#9194ac]">
                                <label 
                                className="font-semibold text-base 
                                text-white mt-[1rem]">
                                    Question {quesIdx + 1}
                                </label>

                                <input
                                    type="text"
                                    minLength={10} 
                                    maxLength={100} 
                                    name="question"
                                    value={question.question} 
                                    onChange={(event) => handleChange(event, quesIdx)} 
                                    placeholder="Enter question" 
                                    className="font-semibold text-base bg-[#121319] outline-none text-white
                                    mt-[0.5rem] mb-[1rem] w-[100%] py-[0.8rem] rounded-md indent-3">
                                </input>

                                {
                                    question.options.map(function(option, optIdx){
                                        return(
                                            <input 
                                                key={optIdx}
                                                type="text" 
                                                maxLength={100} 
                                                value={option} 
                                                onChange={(event) => handleChange(event, quesIdx, optIdx)} 
                                                placeholder={`Enter option ${optIdx + 1}`} 
                                                className="font-semibold text-base bg-[#121319] outline-none text-white
                                                mt-[0.5rem] w-[100%] py-[0.8rem] rounded-md indent-3">
                                            </input>
                                        );
                                    })
                                }

                                <input 
                                    type="text" 
                                    maxLength={100} 
                                    name="correctAnswer"
                                    value={question.correctAnswer} 
                                    onChange={(event) => handleChange(event, quesIdx)} 
                                    placeholder="Enter correct option" 
                                    className="font-semibold text-base bg-[#121319] outline-none text-white
                                    mt-[0.5rem] w-[100%] py-[0.8rem] rounded-md indent-3">
                                </input>
                            </div>
                        );
                    })
                }
            </div>

            <div className="w-[100%] flex justify-end gap-2">
                {
                    (section.quiz.questions.length > 1) ?
                    <button type="button"
                        onClick={removeQuestion}
                        className="px-[0.8rem] py-[0.4rem] bg-[#514ED8] rounded font-semibold text-sm mt-[0.5rem]">
                        Remove
                    </button>
                    :
                    <></>
                }

                {
                    (section.quiz.questions.length < 5) ?
                    <button type="button"
                        onClick={addQuestion}
                        className="px-[0.8rem] py-[0.4rem] bg-[#514ED8] rounded font-semibold text-sm mt-[0.5rem]">
                        Add question
                    </button>
                    :
                    <></>
                }
            </div>
        </div>
    );
}

export default Quiz;
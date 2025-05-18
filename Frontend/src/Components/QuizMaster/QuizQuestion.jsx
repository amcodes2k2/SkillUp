import { useState } from "react";

import QuizOption from "./QuizOption.jsx";

function QuizQuestion(props)
{   
    const [answer, setAnswer] = useState();
    const [correctAnswer, setCorrectAnswer] = useState();
    
    const {score, setScore, questions, quesNo, setQuesNo} = props;

    function validateAnswer()
    {
        if(!answer)
        {
            alert("Please select an option before checking the answer!");
            return;
        }
        
        if(answer === questions[quesNo].correctAnswer)
            setScore(score + 1);
        
        setCorrectAnswer(questions[quesNo].correctAnswer);
    }

    function changeQuestion()
    {
        setCorrectAnswer();
        setQuesNo(quesNo + 1);
    }

    return(
        <div className="text-[#a4a5ab]">
            <div>
                <span className="font-semibold text-white text-lg">
                    Question {quesNo + 1}
                </span>

                <div className="mt-[0.5rem] font-semibold">
                    <p>
                        {questions[quesNo].question}
                    </p>
                </div>

                <div className="font-semibold text-white text-sm">
                    {
                        questions[quesNo].options.map(function(option, idx){
                            return(
                                <QuizOption key={idx} 
                                    id={idx} 
                                    text={option} 
                                    answer={answer} 
                                    setAnswer={setAnswer} 
                                    correctAnswer={correctAnswer}>
                                </QuizOption>
                            );
                        })
                    }
                </div>
            </div>

            <div className="mt-[4rem] flex justify-between items-center font-semibold">
                <p>Question {quesNo + 1} of {questions.length}</p>

                <div className="flex gap-3 text-white text-sm">
                    {
                        /*if correct answer has been set(check button has been pressed), display next button*/

                        (correctAnswer) ? 
                        <button className="px-[0.8rem] py-[0.4rem] bg-[#514ED8] rounded" onClick={changeQuestion}>
                            {
                                (quesNo === questions.length - 1) ? 
                                "Check result" 
                                : 
                                "Next question"
                            }
                        </button> 
                        :
                        <button className="px-[0.8rem] py-[0.4rem] bg-[#514ED8] rounded" onClick={validateAnswer}>
                            Check answer
                        </button>
                    }
                </div>
            </div>
        </div>
    );
}

export default QuizQuestion;
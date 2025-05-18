import { TiTick } from "react-icons/ti";
import { RxCrossCircled } from "react-icons/rx";

function QuizOption(props)
{
    const {id, text, answer, setAnswer, correctAnswer} = props;
    
    return(
        <label className={`${id == 0 ? "mt-[2rem]" : "mt-[1rem]" } flex items-center justify-between cursor-pointer px-[1.5rem] py-[0.8rem] rounded border ${answer === text ? "border-[#514ED8]" : "border-[#9194ac]"}`}>
            <div className="flex gap-4">
                <input disabled={correctAnswer} 
                    type="radio" 
                    name="radio" 
                    value={text} 
                    checked={answer === text} 
                    onChange={(event) => setAnswer(event.target.value)}>
                </input>

                <p>{text}</p>
            </div>
            
            <div className="flex items-center gap-1">
                {
                    /*if correct answer has been set(check button has been pressed), this option is correct and has
                    been selected by the user, display it as user's correct answer*/

                    (correctAnswer && correctAnswer === text && answer === text) ? 
                    <>
                        <TiTick className="text-green-500 text-lg"></TiTick>
                        <span className="text-green-500 text-sm">Your answer</span>
                    </> 
                    :
                    <>
                    </>
                }

                {
                    /*if correct answer has been set(check button has been pressed), this option is correct but has not
                    been selected by the user, display it as the correct answer*/

                    (correctAnswer && correctAnswer === text && answer !== text) ? 
                    <>
                        <TiTick className="text-green-500 text-lg"></TiTick>
                        <span className="text-green-500 text-sm">Correct answer</span>
                    </> 
                    :
                    <></>
                }
                
                {
                    /* if correct answer has been set(check button has been pressed), this option is selected as answer and
                    it is incorrect, display it as user's wrong answer*/
                    (correctAnswer && answer === text && answer !== correctAnswer) ? 
                    <>
                        <RxCrossCircled className="text-red-500 text-lg"></RxCrossCircled>
                        <span className="text-red-500 text-sm">Your answer</span>
                    </>
                    :
                    <></>
                }
            </div>
        </label>
    );
}

export default QuizOption;
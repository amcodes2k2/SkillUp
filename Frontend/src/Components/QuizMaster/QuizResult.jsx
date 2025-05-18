import { Link } from "react-router-dom";

function QuizResult(props)
{
    const {score, totalScore} = props;

    return(
        <div className="text-[#a4a5ab]">
            <h2 className="font-extrabold text-xl text-white">Result</h2>

            <p className="font-semibold mt-[0.5rem] text-base"> You got {score} out of {totalScore} questions correct. </p>

            <Link to="/quiz-master" onClick={() => window.scrollTo(0, 0)}>
                <button className="mt-[4rem] text-white font-semibold px-[0.8rem] py-[0.4rem] bg-[#514ED8] rounded text-sm">
                    Continue
                </button>
            </Link>
        </div>
    );
}

export default QuizResult;
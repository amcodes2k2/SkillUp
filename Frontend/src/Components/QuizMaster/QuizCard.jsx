import { Link } from "react-router-dom";

function QuizCard(props)
{
    const {quiz} = props;

    return(
        <div className="p-[1rem] border-b border-[#9194ac]">
            <h2 className="text-white font-semibold flex justify-between">
                {quiz.title} <span className="md:hidden"> {quiz.questions.length} questions </span>
            </h2>

            <p className="mt-[0.5rem] text-sm font-semibold text-[#a4a5ab]">
                {quiz.description}
            </p>

            <div className="font-semibold mt-[2rem] flex items-center justify-between">
                <span className="hidden md:block"> {quiz.questions.length} questions</span>

                <Link to={`/general-quiz/${quiz._id}`} onClick={() => window.scrollTo(0, 0)}>
                    <button className="px-[0.8rem] py-[0.4rem] text-sm bg-[#514ED8] rounded">
                        Start quiz
                    </button>
                </Link>
            </div>
        </div>
    );
}

export default QuizCard;
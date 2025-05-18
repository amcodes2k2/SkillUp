function Objectives(props)
{
    const {course} = props;

    return(
        <div className="bg-[#1B1E2D] py-[1rem] px-[2rem] md:px-[1rem] mt-[2rem]">
            <h3 className="mt-[0.5rem] mb-[1rem] font-semibold text-lg text-white">
                What you'll learn
            </h3>

            <ul>
                {
                    course.objectives.map(function(objective, idx){
                        return (
                            <li key={idx} className="font-semibold flex gap-2 text-sm text-[#a4a5ab] py-[0.2rem]"> 
                                <span>&#x2022;</span> 
                                <span>{objective}</span>
                            </li>
                        )
                    })
                }
            </ul>
        </div>     
    );
}

export default Objectives;
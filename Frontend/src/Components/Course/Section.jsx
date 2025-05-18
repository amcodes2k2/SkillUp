import { useState } from "react";
import { Link } from "react-router-dom";

import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { MdOutlineOndemandVideo, MdOutlineQuiz } from "react-icons/md";

function Section(props)
{
    const {section, border_b} = props;

    const [isDropDownMenuOpen, setIsDropDownMenuOpen] = useState(false);

    return(
        <div className={`${border_b ? "border-b" : "border-0"}`}>
            <div className="bg-[#1B1E2D] border-t border-x py-[1rem] px-[2rem] md:px-[1rem] font-semibold flex justify-between cursor-pointer" onClick={() => setIsDropDownMenuOpen(!isDropDownMenuOpen)}>
                <div className="flex items-center gap-4">
                    <span>
                        {
                            (isDropDownMenuOpen === false) ? 
                            <IoIosArrowDown></IoIosArrowDown>
                            :
                            <IoIosArrowUp></IoIosArrowUp>
                        }
                    </span>
            
                    {section.title}
                </div>

                <span className="sm:hidden"> {section.lectures.length} lecture(s) </span>
            </div>
            
            {
                (isDropDownMenuOpen) ?
                <>
                    <ul className="py-[1rem] px-[2rem] font-semibold text-sm border-x">
                        {
                            section.lectures.map(function(lecture){
                                return(
                                    <Link key={lecture._id} to={`/lecture/${lecture._id}`} onClick={() => window.scrollTo(0, 0)}>
                                        <li className="text-[#a4a5ab] py-[0.5rem] flex justify-between">
                                            <div className="flex items-center gap-4">
                                                <MdOutlineOndemandVideo></MdOutlineOndemandVideo>
                                                {lecture.title}
                                            </div>
                                            
                                            <span className="sm:hidden">{lecture.duration}</span>
                                        </li>
                                    </Link>
                                );
                            })
                        }
                    </ul>
                
                    {
                        (section.quiz) ? 
                        <Link to={`/sectional-quiz/${section.quiz._id}`} onClick={() => window.scrollTo(0, 0)}>
                            <div className="font-semibold text-sm border-x pb-[1.5rem] px-[2rem] mt-[-0.5rem] text-[#a4a5ab] flex items-center gap-4">
                                <MdOutlineQuiz></MdOutlineQuiz>
                                {section.quiz.title}
                            </div>
                        </Link>
                        :
                        <></>
                    }
                </>
                :
                <></>
            }
        </div>
    );
}

export default Section;
import { useContext } from "react";
import { Link } from "react-router-dom";

import { IoMdPeople } from "react-icons/io";
import { AppContext } from "../../Context/AppContext.jsx";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";

function CourseCard(props)
{
    const {course} = props;
    const {userDetails} = useContext(AppContext);

    return(
        <Link to={`/course/${course._id}`} onClick={() => window.scrollTo(0, 0)}>
            <div className="max-w-[300px] min-h-[511.6px] bg-[#1B1E2D] text-white cursor-pointer pt-[1rem]">
                <img src={course.thumbnail} width="90%" className="m-auto h-[270px]"></img>

                <div className="px-[2rem] md:px-[1.5rem] py-[1rem]">
                    <h3 className="font-bold text-lg">
                        {(course.title.length > 40) ? course.title.substring(0, 40) + "..." : course.title}
                    </h3>

                    <h4 className="font-semibold text-sm mt-[0.5rem] text-[#a4a5ab]">
                        by {course.author.name}
                    </h4>
                </div>

                <div className="px-[2rem] md:px-[1.5rem] pb-[1rem] border-b-2 border-dashed border-[#718096]">
                    <p className="font-semibold text-base text-[#a4a5ab]">
                        {(course.description.length > 80) ? course.description.substring(0, 80) + "..." : course.description}
                    </p>
                </div>

                <div className="flex justify-between font-semibold text-sm px-[2rem] md:px-[1.5rem] py-[1rem]">
                    <div className="flex items-center gap-2">
                        <IoMdPeople className="text-lg"></IoMdPeople>

                        {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                    </div>

                    <div className="flex items-center justify-between gap-1">
                        {
                            (Object.keys(userDetails).length > 0) ?
                            <>
                                {
                                    (userDetails.courses.includes(course._id) === true) ?
                                    <>
                                        <span className="text-lg">
                                            <IoIosCheckmarkCircleOutline></IoIosCheckmarkCircleOutline>
                                        </span>
                                        
                                        {
                                            (userDetails.id === course.author._id) ? "Published" : "Purchased"
                                        }
                                    </>
                                    :
                                    <>
                                        <span>&#8377;</span> 
                                        {course.price}
                                    </>
                                }
                            </>
                            :
                            <>
                                <span>&#8377;</span> 
                                {course.price}
                            </>
                        }
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default CourseCard;
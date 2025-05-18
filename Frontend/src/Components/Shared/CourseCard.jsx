import { useContext } from "react";
import { Link } from "react-router-dom";

import { AppContext } from "../../Context/AppContext.jsx";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";

function CourseCard(props)
{
    const {userDetails} = useContext(AppContext);
    const {course, showSales, showTransaction} = props;
    
    return(
        <Link to={`/course/${course._id}`} onClick={() => window.scrollTo(0, 0)}>
            <div className="p-[1rem] border-b border-[#9194ac] flex sm:m-auto sm:max-w-[300px] sm:flex-col gap-6 sm:mb-[1.5rem]">
                <div className="sm:w-[100%]">
                    <img src={course.thumbnail} className="h-[200px] sm:w-[270px] sm:h-[270px] sm:m-auto"></img>
                </div>

                <div className={`w-[75%] sm:w-[100%] text-base`}>
                    <h2 className="text-white font-semibold flex justify-between md:flex-col">
                        {course.title} 
                        
                        {
                            (Object.keys(userDetails).length > 0) ?
                            <>
                                {
                                    (showSales === false) ?
                                        (userDetails.courses.includes(course._id) === true) ?
                                        <div className="flex items-center gap-1 md:mt-[0.5rem] md:text-sm">
                                            <span className="text-lg">
                                                <IoIosCheckmarkCircleOutline></IoIosCheckmarkCircleOutline>
                                            </span>
                                            
                                            {
                                                (userDetails.id === course.author._id) ? "Published" : "Purchased"
                                            }
                                        </div>
                                        :
                                        <span className="md:mt-[0.5rem] md:text-sm"> 
                                            &#8377; {course.price}
                                        </span>
                                    :
                                    <span className="md:mt-[0.5rem] md:text-sm"> 
                                        &#8377; {course.price}
                                    </span>
                                }
                            </>
                            :
                            <span className="md:mt-[0.5rem] md:text-sm"> 
                                &#8377; {course.price}
                            </span>
                        }
                    </h2>

                    <div className="flex-col">
                        <p className="mt-[1rem] text-sm font-semibold text-[#a4a5ab]">
                            {course.description}
                        </p>

                        <h3 className="font-semibold text-xs text-[#a4a5ab] mt-[0.5rem]">
                            by {course.author.name}
                        </h3>

                        <p className="mt-[1rem] font-semibold text-xs text-[#a4a5ab] flex gap-2">
                            <span> &#x2022; {course.language} </span>
                            <span> &#x2022; {course.sections.length} Sections </span>
                            <span> &#x2022; {course.level.charAt(0).toUpperCase() + course.level.slice(1)} </span>
                        </p>
                    </div>
                    
                    {
                        (showSales === true) ?
                        <div className="flex gap-[6rem] font-semibold text-sm mt-[2rem] sm:w-[100%] sm:flex-col sm:gap-4">
                            <div className="flex-col">
                                <p className="text-sm">
                                    &#8377; {Math.round(0.8 * course.monthlySales * course.price)} ( {course.monthlySales} Enrollments )
                                </p>

                                <p className="mt-[0.2rem] text-[#a4a5ab]">Sales this month</p>
                            </div>

                            <div className="flex-col">
                                <p className="text-sm">
                                    &#8377; {Math.round(0.8 * course.lifetimeSales * course.price)} ( {course.lifetimeSales} Enrollments )
                                </p>

                                <p className="mt-[0.2rem] text-[#a4a5ab]">Lifetime sales</p>
                            </div>
                        </div>
                        :
                        <></>
                    }

                    {
                        (showTransaction === true && course?.transaction) ?
                        <div className="flex-col mt-[2rem] text-xs text-[#a4a5ab] font-semibold">
                            <p> Purchase Date : {course.transaction.date.substring(0, 10)} </p>
                            <p> Purchase Mode : {course.transaction.paymentMode.replace("_", " ")} </p>
                            <p> Purchase ID : {course.transaction.pgTransactionId} </p>
                        </div>
                        :
                        <></>
                    }
                </div>
            </div>
        </Link>
    );
}

export default CourseCard;
import { IoPersonCircleOutline } from "react-icons/io5";

function ReviewCard(props)
{
    const {review} = props;

    return(
        <div className="flex-col max-w-[300px] min-h-[256px] bg-[#1B1E2D] text-white">
            <div className="flex px-[2rem] py-[2rem] gap-[1rem]">
                <div className="flex justify-center items-center">
                    <IoPersonCircleOutline className="text-white text-5xl"></IoPersonCircleOutline>
                </div>

                <div className="flex-col content-center">
                    <h3 className="font-bold text-base text-white">
                        {review.user.name}
                    </h3>

                    <p className="font-semibold text-sm text-[#a4a5ab]">
                        {(review.course.title.length > 32) ? review.course.title.substring(0, 32) + "..." : review.course.title}
                    </p>
                </div>
            </div>

            <div className="px-[2rem] pb-[2rem]">
                <p className="font-semibold text-base text-[#a4a5ab]">
                    {(review.description.length > 120) ? review.description.substring(0, 120) + "..." : review.description}
                </p>
            </div>
        </div>
    );
}

export default ReviewCard;
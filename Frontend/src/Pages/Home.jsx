import Banner from "../Components/Home/Banner.jsx";
import CourseSection from "../Components/Home/CourseSection.jsx";
import ReviewSection from "../Components/Home/ReviewSection.jsx";

function Home()
{
    return(
        <div className="mt-[6rem]">
            <Banner title_pt1={"Empower your future with"}
                title_pt2={"coding skills"}
                desc={"With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to a wealth of resouces, including hands-on projects and quizzes."}
                btn={"Start learning now"}>
            </Banner>

            <CourseSection></CourseSection>

            <Banner title_pt1={"Become an"}
                title_pt2={"instructor"}
                desc={"Come teach with us and change lives - including your own. Our tools make it easy for you to teach what you love, in the way you want."}
                btn={"Start teaching today"}>
            </Banner>

            <ReviewSection></ReviewSection>
        </div>
    );
}

export default Home;
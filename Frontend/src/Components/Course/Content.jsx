import Section from "./Section.jsx";

function Content(props)
{
    const {course} = props;

    return(
        <div className="py-[1rem] mt-[1rem]">
            <h3 className="mt-[0.5rem] mb-[1rem] font-semibold text-lg text-white">
                Course Content
            </h3>

            {
                course.sections.map(function(section, idx){
                    return(
                        <Section key={section._id} border_b={idx === course.sections.length - 1} section={section}></Section>
                    );
                })
            }
        </div>
    );
}

export default Content;
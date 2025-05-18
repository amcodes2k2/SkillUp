import Quiz from "./Quiz.jsx";
import Lectures from "./Lectures.jsx";

function Sections(props)
{
    const {formData, setFormData, section, secIdx} = props;

    function handleChange(event)
    {
        const newSections = [...formData.sections];
        newSections[secIdx].title = event.target.value;

        setFormData(function(prevFormData){
            return {
                ...prevFormData,
                ["sections"]: newSections
            }
        });
    }

    return (
        <div className="p-[2rem] md:p-[1rem] bg-[#1B1E2D] mb-[1rem] border border-[#9194ac]">
            <label 
                htmlFor={`stitle${secIdx}`} 
                className="font-semibold text-base text-white">
                Section {secIdx + 1}
            </label>
            
            <input 
                type="text" 
                id={`stitle${secIdx}`}
                minLength={10}
                maxLength={50} 
                value={section.title} 
                onChange={(event) => handleChange(event, secIdx)}
                placeholder="Enter section title" 
                className="font-semibold text-base bg-[#121319] outline-none text-white
                mt-[1rem] mb-[1rem] w-[100%] py-[0.8rem] rounded-md indent-3">
            </input> <br/>

            <Lectures 
                secIdx={secIdx}
                section={section}
                formData={formData} 
                setFormData={setFormData}>
            </Lectures><br/>                        
                        
            <Quiz
               secIdx={secIdx}
               section={section}
               formData={formData} 
               setFormData={setFormData}>
            </Quiz> <br/>
        </div>
    );
}

export default Sections;
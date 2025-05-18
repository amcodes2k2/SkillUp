import toast from "react-hot-toast";

function Lectures(props)
{
    const {formData, setFormData, section, secIdx} = props;

    function handleChange(event, idx)
    {
        if(event.target.name !== "title" && event.target.files[0].size > 2097152)
        {
            event.target.value = "";
            toast.error("File size should not exceed 2 MB.");
            
            return;
        }

        const newSections = [...formData.sections];
        newSections[secIdx].lectures[idx][event.target.name] = (event.target.name === "title") ? event.target.value : event.target.files[0];

        setFormData(function(prevFormData){
            return {
                ...prevFormData,
                ["sections"]: newSections
            }
        });
    }

    function removeLecture()
    {
        let newSections = [...formData.sections];
        newSections[secIdx].lectures = newSections[secIdx].lectures.slice(0, -1);

        setFormData(function(prevFormData){
            return({
                ...prevFormData,
                ["sections"] : newSections
            });
        });
    }

    function addLecture()
    {
        const newSections = [...formData.sections];
        newSections[secIdx].lectures.push({title: "", videoFile: File});

        setFormData(function(prevFormData){
            return({
                ...prevFormData,
                ["sections"] : newSections
            });
        });
    }

    return(
        <div className="p-[2rem] md:p-[1rem] mt-[0.5rem] border border-[#9194ac]">
            <h3 className="font-semibold text-base">
                Lectures
            </h3>

            {
                section.lectures.map(function(lecture, idx){
                    return(
                        <div key={idx} className="mb-[0.5rem]">
                            <input 
                                type="text"
                                name="title"
                                required
                                minLength={10} 
                                maxLength={50} 
                                value={lecture.title} 
                                onChange={(event) => handleChange(event, idx)} 
                                placeholder={`Enter lecture ${idx + 1} title`} 
                                className="font-semibold text-base bg-[#121319] outline-none text-white
                                mt-[0.5rem] mb-[1rem] w-[100%] py-[0.8rem] rounded-md indent-3">
                            </input>

                            <input 
                                type="file"
                                required
                                name="videoFile" 
                                accept="video/*" 
                                onChange={(event) => handleChange(event, idx)}
                                className="font-semibold text-sm">
                            </input>
                        </div>
                    );
                })
            }

            <div className="w-[100%] flex justify-end gap-2">
                {
                    (section.lectures.length > 1) ?
                    <button type="button"
                        onClick={removeLecture}
                        className="px-[0.8rem] py-[0.4rem] bg-[#514ED8] rounded font-semibold text-sm mt-[0.5rem]">
                        Remove
                    </button>
                    :
                    <></>
                }

                {
                    (section.lectures.length < 2) ?
                    <button type="button"
                        onClick={addLecture}
                        className="px-[0.8rem] py-[0.4rem] bg-[#514ED8] rounded font-semibold text-sm mt-[0.5rem]">
                        Add lecture
                    </button>
                    :
                    <></>
                }
            </div>
        </div>
    );
}

export default Lectures;
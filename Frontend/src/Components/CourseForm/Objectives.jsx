function Objectives(props)
{
    const {formData, setFormData} = props;

    function handleChange(event, idx)
    {
        const newObjectives = [...formData.objectives];
        newObjectives[idx] = event.target.value;

        setFormData(function(prevFormData){
            return({
                ...prevFormData,
                ["objectives"] : newObjectives
            });
        });
    }

    function removeObjective()
    {
        const newObjectives = [...formData.objectives].slice(0, -1);

        setFormData(function(prevFormData){
            return({
                ...prevFormData,
                ["objectives"] : newObjectives
            });
        });
    }

    function addObjective()
    {
        const newObjectives = [...formData.objectives];
        
        newObjectives.push("");
        setFormData(function(prevFormData){
            return({
                ...prevFormData,
                ["objectives"] : newObjectives
            });
        });
    }

    return(
        <div className="bg-[#1B1E2D] p-[2rem] md:p-[1rem] border border-[#9194ac]">
            <h3 className="font-semibold text-base text-white mb-[0.5rem]">
                Objectives
            </h3>

            {
                formData.objectives.map(function(objective, idx){
                    return(
                        <input key={idx}
                            type="text"
                            required
                            minLength={10}
                            maxLength={80}
                            value={objective}
                            onChange={(event) => handleChange(event, idx)}
                            placeholder={`Enter objective ${idx + 1}`} 
                            className="font-semibold text-base bg-[#121319] outline-none text-white
                            mt-[0.5rem] w-[100%] py-[0.8rem] rounded-md indent-3">
                        </input>
                    );
                })
            }

            <div className="w-[100%] mt-[1rem] flex justify-end gap-2">
                {
                    (formData.objectives.length > 1) ?
                    <button type="button"
                        onClick={removeObjective}
                        className="px-[0.8rem] py-[0.4rem] bg-[#514ED8] rounded font-semibold text-sm mt-[0.5rem]">
                        Remove
                    </button>
                    :
                    <></>
                }

                {
                    (formData.objectives.length < 4) ?
                    <button type="button"
                        onClick={addObjective}
                        className="px-[0.8rem] py-[0.4rem] bg-[#514ED8] rounded font-semibold text-sm mt-[0.5rem]">
                        Add objective
                    </button>
                    :
                    <></>
                }
            </div>
            
        </div>
    );
}

export default Objectives;
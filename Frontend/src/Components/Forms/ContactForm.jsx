import { useState } from "react";

function ContactForm()
{
    const [formData, setFormData] = useState({
        email: "",
        name: "",
        message: ""
    });

    function handleChange(event)
    {
        setFormData(function(prevFormData){
            return {
                ...prevFormData,
                [event.target.id]: event.target.value
            };
        });
    }

    function handleSubmit(event)
    {
        event.preventDefault();
        console.log(formData);
    }

    return(
        <div className="mt-[3rem] flex justify-center w-[100%]">
            <form className="w-[100%]" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email" className="font-semibold text-base text-white">Email</label> <br/>
                    <input id="email" type="email" minLength="3" maxLength="254" value={formData.email} onChange={handleChange} placeholder="Enter email address" className="font-semibold text-base bg-[#151b23] border-b border-[#b1e50e] outline-none text-white mt-[0.5rem] mb-[1rem] w-[100%] py-[0.8rem] rounded-md indent-3"></input> <br/>

                    <label htmlFor="name" className="font-semibold text-base text-white">Full name</label> <br/>
                    <input id="name" type="name" minLength="1" maxLength="71" value={formData.name} onChange={handleChange} placeholder="Enter full name" className="font-semibold text-base bg-[#151b23] border-b border-[#b1e50e] outline-none text-white mt-[0.5rem] mb-[1rem] w-[100%] py-[0.8rem] rounded-md indent-3"></input> <br/>

                    <label htmlFor="message" className="font-semibold text-base text-white">Message</label> <br/>
                    <textarea id="message" type="text" minLength="25" maxLength="300" value={formData.message} onChange={handleChange} placeholder="Enter message" className="resize-none font-semibold text-base bg-[#151b23] border-b border-[#b1e50e] outline-none text-white mt-[0.5rem] w-[100%] pt-[0.8rem] pb-[5rem] rounded-md px-3"></textarea>
                </div>
                
                <button type="submit" className="w-[100%] bg-[#b1e50e] mt-[1.5rem] py-[0.8rem] font-semibold text-base rounded-lg cursor-pointer">
                    Send message
                </button>
            </form>
        </div>
    );
}

export default ContactForm;
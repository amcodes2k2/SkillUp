import ContactForm from "../Components/Forms/ContactForm.jsx";

function Contact()
{
    return(
        <div className="min-h-[calc(100dvh-4.5rem)] px-[2rem] py-[2rem] mt-[4.5rem] flex justify-center items-center">
            <div className="flex-col justify-items-center max-w-[400px] sm:max-w-[300px]">
                <h2 className="font-bold text-3xl text-white text-center">
                    Send us a message to resolve your query
                </h2>

                <ContactForm></ContactForm>
            </div>
        </div>
    );
}

export default Contact;
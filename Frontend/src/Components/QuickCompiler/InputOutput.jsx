function InputOutput(props)
{
    return(
        <div className="w-[50%] md:w-[100%] flex-col">
            {
                (props.isRunning === true) ? <p className="text-white text-sm md:text-xs font-[Lc] font-normal py-[0.5rem] mb-[0.5rem]">Running code...</p> : 
                    <button className="font-[Lc] text-sm md:text-xs font-normal px-[1.5rem] py-[0.5rem] rounded mb-[0.5rem] bg-[#04AA6D] text-white" onClick={props.runCode}>
                        Run code
                    </button>
            }

            <textarea
                value={props.input} 
                placeholder="Your input goes here" 
                className="font-[Lc] w-[100%] outline-none h-[39vh] mb-[1vh] bg-black text-white px-[1rem] overflow-y-scroll"
                onChange={(event) => props.setInput(event.target.value)}>
            </textarea>

            <div className="font-[Lc] h-[39vh] bg-black text-white px-[1rem] overflow-y-scroll">
                {props.output}
            </div>
        </div>
    );
}

export default InputOutput;
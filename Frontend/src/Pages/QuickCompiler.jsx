import { useState } from "react";

import NavBar from "../Components/QuickCompiler/NavBar.jsx";
import CodeEditor from "../Components/QuickCompiler/CodeEditor.jsx";
import InputOutput from "../Components/QuickCompiler/InputOutput.jsx";

function QuickCompiler()
{
    const [sourceCode, setSourceCode] = useState("");
    const [isRunning, setIsRunning] = useState(false);
    const [language, setLanguage] = useState("cpp 10.2.0");

    const [input, setInput] = useState();
    const [output, setOutput] = useState(`Click on "Run code" to see output here`);

    async function runCode()
    {
        try
        {
            setIsRunning(true);

            const response = await fetch("https://emkc.org/api/v2/piston/execute", {
                method: "POST",
                body: JSON.stringify({
                    "language": language.split(" ")[0],
                    "version": language.split(" ")[1],
                    "files": [
                        {
                            "content": sourceCode
                        }
                    ],
                    "stdin": input
                })
            });

            const res = await response.json();
            
            setIsRunning(false);
            setOutput(res.run.output.split("\n").map(function(line){
                return <p className="font-[Lc]">{line}</p>;
            }));
        }
        catch(error)
        {
            setIsRunning(false);
            setOutput(error.message);
        }
    }

    return(
        <div className="h-[100dvh] flex-col">
            <NavBar></NavBar>

            <div className="bg-[#38444d] overflow-y-scroll w-[100%] min-h-[calc(100dvh-4.25rem)] flex items-center md:flex-col gap-2 px-[0.5rem] py-[0.5rem]">
                <CodeEditor 
                    language={language} 
                    setLanguage={setLanguage} 
                    sourceCode={sourceCode} 
                    setSourceCode={setSourceCode}>
                </CodeEditor>

                <InputOutput 
                    runCode={runCode} 
                    isRunning={isRunning} 
                    input={input} 
                    setInput={setInput} 
                    output={output} 
                    setOutput={setOutput}>
                </InputOutput>
            </div>
        </div>
    );
}

export default QuickCompiler;
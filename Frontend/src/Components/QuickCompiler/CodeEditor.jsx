import { Editor } from "@monaco-editor/react";

function CodeEditor(props)
{
    return(
        <div className="w-[50%] md:w-[100%] flex-col font-[Lc]">
            <select className="cursor-pointer bg-[#252526] outline-none text-sm md:text-xs font-normal px-[1.5rem] py-[0.5rem] rounded mb-[0.5rem] text-white" 
                onChange={(event) => props.setLanguage(event.target.value)}
                value={props.language}>
                <option value="cpp 10.2.0">C++</option>
                <option value="java 15.0.2">Java</option>
                <option value="python 3.10.0">Python</option>
                <option value="javascript 18.15.0">Javascript</option>
            </select>
                    
            <Editor 
                options={{
                    minimap: {
                        enabled: false
                    },
                    fontSize: "16px",
                    fontWeight: "600"
                }}
                height="80vh"
                theme="vs-dark"
                value={props.sourceCode}
                language={props.language.split(" ")[0]}
                onChange={(value) => props.setSourceCode(value)}>
            </Editor>
        </div>
    );
}

export default CodeEditor;
import { useContext } from "react";
import { Link } from "react-router-dom";

import {AppContext} from "../../Context/AppContext.jsx";

function Banner(props)
{
    const {userDetails} = useContext(AppContext);
    const {title_pt1, title_pt2, desc, btn} = props;
    
    return(
        <section className="px-[2rem] py-[3rem] flex-col justify-items-center">
            <div className="text-center mb-[1.5rem]">
                <h2 className="text-white font-bold text-3xl">
                    {title_pt1} <span className="text-[#b1e50e]">{title_pt2}</span>
                </h2>
            </div>

            <div className="text-center mb-[2rem] max-w-[1000px]">
                <p className="font-bold text-[#a4a5ab] text-base">
                    {desc}
                </p>
            </div>

            <div className="w-[100%] flex justify-center">
                <Link to={(Object.keys(userDetails).length > 0) ? "/dashboard" : "/signup"} onClick={() => window.scrollTo(0, 0)}>
                    <button className="bg-[#514ED8] cursor-pointer rounded-3xl px-[1.5rem] py-[0.7rem] flex items-center text-white font-semibold text-base">
                        {btn}
                    </button>
                </Link>
            </div>
        </section>
    );
}

export default Banner;

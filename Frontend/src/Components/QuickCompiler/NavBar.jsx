import { Link } from "react-router-dom";

import { IoIosArrowUp } from "react-icons/io";

function NavBar()
{
    return(
        <div className="w-[100%] bg-black text-white text-sm font-semibold py-[1.5rem] px-[1rem]">
            <ul className="flex items-center gap-4">
                <li><Link to="/" onClick={() => window.scrollTo(0, 0)}>Home</Link></li>
                <li><IoIosArrowUp className="rotate-90"></IoIosArrowUp></li>
                <li>Quick compiler</li>
            </ul>
        </div>
    );
}

export default NavBar;
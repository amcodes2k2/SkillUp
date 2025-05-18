import { useContext } from "react";
import { Link } from "react-router-dom";

import { IoIosArrowDown } from "react-icons/io";
import logo from "../../Assets/Images/Logo-Full-Dark.PNG";
import { RxCross2, RxHamburgerMenu } from "react-icons/rx";

import {AppContext} from "../../Context/AppContext.jsx";
import DesktopDropDownMenu from "./DesktopDropDownMenu.jsx";

function NavBar(props)
{
    const {userDetails} = useContext(AppContext);
    const {catalogMenuData, exploreMenuData, isHamburgerMenuOpen, setIsHamburgerMenuOpen, logOut, isRunning} = props;

    return(
        <div className="w-[100%] flex items-center justify-around md:justify-between md:px-[1rem] md:py-[0.8rem]">
            <Link to="/" onClick={() => window.scrollTo(0, 0)}><img src={logo} className="h-[45px] cursor-pointer"></img></Link>
            
            <div className="flex items-center gap-[3rem] md:hidden lg:gap-[1.5rem]">
                <ul className="flex font-semibold text-base gap-[3rem] lg:gap-[1.5rem]">
                    <li className="py-[1.5rem] cursor-pointer">
                        <Link to="/" onClick={() => window.scrollTo(0, 0)}>Home</Link>
                    </li>

                    <li className="py-[1.5rem] group relative cursor-pointer flex items-center gap-2">
                        Catalog <IoIosArrowDown className="font-semibold text-base"></IoIosArrowDown>

                        <DesktopDropDownMenu menuData={catalogMenuData}></DesktopDropDownMenu>
                    </li>

                    <li className="py-[1.5rem] group relative cursor-pointer flex items-center gap-2">
                        Explore <IoIosArrowDown className="font-semibold text-base"></IoIosArrowDown>

                        <DesktopDropDownMenu menuData={exploreMenuData}></DesktopDropDownMenu>
                    </li>

                    <li className="py-[1.5rem] cursor-pointer">
                        <Link to="/contact-us" onClick={() => window.scrollTo(0, 0)}>Contact us</Link>
                    </li>
                </ul>

                <div className="flex gap-4">
                    <Link to={`${(Object.keys(userDetails).length > 0) ? "/dashboard" : "/login"}`} 
                        onClick={() => window.scrollTo(0, 0)}>
                        <button className="flex bg-[#b1e50e] font-semibold text-base px-[1.5rem] py-[0.7rem] rounded-lg cursor-pointer">
                            {
                                (Object.keys(userDetails).length > 0) ? "Dashboard" : "Log in"
                            }
                        </button>
                    </Link>

                    {
                        (Object.keys(userDetails).length === 0) ?
                        <Link to="/signup" 
                            onClick={() => window.scrollTo(0, 0)}>
                            <button className="flex bg-[#b1e50e] font-semibold text-base px-[1.5rem] py-[0.7rem] rounded-lg cursor-pointer">
                                Sign up
                            </button>
                        </Link>
                        :
                        <button 
                            onClick={logOut}
                            disabled={isRunning}
                            className="flex bg-[#b1e50e] font-semibold text-base px-[1.5rem] py-[0.7rem] rounded-lg cursor-pointer">
                            Log out
                        </button>
                    }
                </div>
            </div>
            
            <div className="hidden md:block">
                {
                    (isHamburgerMenuOpen === true) ? 
                    <RxCross2 className="text-3xl" onClick={() => setIsHamburgerMenuOpen(false)}>
                    </RxCross2> 
                    : 
                    <RxHamburgerMenu className="text-3xl" onClick={() => setIsHamburgerMenuOpen(true)}>
                    </RxHamburgerMenu>
                }
            </div>
        </div>
    );
}

export default NavBar;
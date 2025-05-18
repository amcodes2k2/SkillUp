import { Link } from "react-router-dom";
import { useState, useContext } from "react";

import { IoIosArrowUp } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";

import MobileDropDownMenu from "./MobileDropDownMenu.jsx";
import { AppContext } from "../../Context/AppContext.jsx";

function HamburgerMenu(props)
{
    const {userDetails} = useContext(AppContext);
    const {exploreMenuData, catalogMenuData, setIsHamburgerMenuOpen, logOut, isRunning} = props;

    const [isCatalogMenuOpen, setIsCatalogMenuOpen] = useState(false);
    const [isExploreMenuOpen, setIsExploreMenuOpen] = useState(false);

    return(
        <div className="w-[100%] flex-col justify-items-center max-h-[80vh] overflow-y-scroll">
            <ul className="w-[100%] flex-col px-[2rem]">
                <li className="font-semibold text-base cursor-pointer border-b flex items-center border-[#718096] px-[1rem] py-[1rem]">
                    <Link to="/" 
                        onClick={() => {
                            window.scrollTo(0, 0);
                            return setIsHamburgerMenuOpen(false);
                        }}>
                        Home
                    </Link>
                </li>

                <li className="font-semibold text-base cursor-pointer border-b flex-col items-center border-[#718096] px-[1rem] py-[1rem]">
                    <div className="flex gap-2 items-center">
                        Catalog 

                        <button>
                            {
                                (isCatalogMenuOpen === false) ? 
                                <IoIosArrowDown onClick={() => setIsCatalogMenuOpen(true)}></IoIosArrowDown> 
                                :
                                <IoIosArrowUp onClick={() => setIsCatalogMenuOpen(false)}></IoIosArrowUp>
                            }
                        </button>
                    </div>

                    {
                        (isCatalogMenuOpen === true) ? 
                        <MobileDropDownMenu menuData={catalogMenuData} setIsHamburgerMenuOpen={setIsHamburgerMenuOpen}>
                        </MobileDropDownMenu> 
                        : 
                        <></>
                    }
                </li>

                <li className="font-semibold text-base cursor-pointer border-b flex-col items-center border-[#718096] px-[1rem] py-[1rem]">
                    <div className="flex gap-2 items-center">
                        Explore 

                        <button>
                            {
                                (isExploreMenuOpen === false) ? <IoIosArrowDown onClick={() => setIsExploreMenuOpen(true)}></IoIosArrowDown> :
                                <IoIosArrowUp onClick={() => setIsExploreMenuOpen(false)}></IoIosArrowUp>
                            }
                        </button>
                    </div>

                    {
                        (isExploreMenuOpen === true) ? 
                        <MobileDropDownMenu menuData={exploreMenuData} setIsHamburgerMenuOpen={setIsHamburgerMenuOpen}>
                        </MobileDropDownMenu> 
                        : 
                        <></>
                    }
                </li>

                <li className="font-semibold text-base cursor-pointer border-b flex items-center border-[#718096] px-[1rem] py-[1rem]">
                <Link to="/contact-us" 
                        onClick={() => {
                            window.scrollTo(0, 0);
                            return setIsHamburgerMenuOpen(false);
                        }}>
                        Contact us
                    </Link>
                </li>
            </ul>

            <div className="flex w-[100%] justify-between px-[2rem] py-[2rem]">
                <Link to={`${(Object.keys(userDetails).length > 0) ? "/dashboard" : "/login"}`} 
                    onClick={() => {
                        window.scrollTo(0, 0);
                        return setIsHamburgerMenuOpen(false);
                    }} 
                    className="w-[48%]">
                    <button className="text-center w-[100%] bg-[#b1e50e] font-semibold text-base py-[0.7rem] rounded-lg cursor-pointer">
                        {
                            (Object.keys(userDetails).length > 0) ? "Dashboard" : "Log in"
                        }
                    </button>
                </Link>
                
                {
                    (Object.keys(userDetails).length === 0) ?
                    <Link to="/signup" 
                        onClick={() => {
                            window.scrollTo(0, 0);
                            return setIsHamburgerMenuOpen(false);
                        }} 
                        className="w-[48%]">
                        <button className="text-center w-[100%] bg-[#b1e50e] font-semibold text-base py-[0.7rem] rounded-lg cursor-pointer">
                            Sign up
                        </button>
                    </Link>
                    :
                    <></>
                }

                {
                    (Object.keys(userDetails).length > 0) ?
                    <button 
                        onClick={logOut}
                        disabled={isRunning}
                        className="text-center w-[48%] bg-[#b1e50e] font-semibold text-base py-[0.7rem] rounded-lg cursor-pointer">
                        Log out
                    </button>
                    :
                    <></>
                }
            </div>
        </div>
    );
}

export default HamburgerMenu;
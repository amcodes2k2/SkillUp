import { useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";

import toast from "react-hot-toast";
import NavBar from "../Header/NavBar.jsx";
import categories from "../../Data/Categories.js";
import HamburgerMenu from "../Header/HamburgerMenu.jsx";
import exploreMenuData from "../../Data/ExploreMenu.js";
import { AppContext } from "../../Context/AppContext.jsx";

function Header()
{
    const navigate = useNavigate();

    const [isRunning, setIsRunning] = useState(false);
    const [shouldRetry, setShouldRetry] = useState(false);
    const [isHamburgerMenuOpen, setIsHamburgerMenuOpen] = useState(false);

    const {userDetails, setUserDetails, refreshTokens} = useContext(AppContext);
    const catalogMenuData = categories.map(function(category){
        return ({
            id: category._id,
            title: category.title,
            path: `/catalog/${category._id}`,
            desc: ""
        });
    });

    async function logOut()
    {
        try
        {
            setIsRunning(true);
            
            const response = await fetch(`${import.meta.env.VITE_REACT_APP_BASE_URL}/api/v1/logout`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${userDetails.accessToken}`
                }
            });

            const data = await response.json();
            
            if(data.success === true)
            {
                setUserDetails({});
                setIsRunning(false);
                setIsHamburgerMenuOpen(false);

                navigate("/");
                window.scrollTo(0, 0);
                toast.success("Logged out successfully.");
            }
            else
            {
                setIsRunning(false);

                if(response.status === 401)
                {
                    if(Object.keys(userDetails).length === 0)
                    {
                        setShouldRetry(false);
                        setIsHamburgerMenuOpen(false);

                        navigate("/");
                        window.scrollTo(0, 0);
                        toast.success("Logged out successfully.");
                    }
                    else
                    {
                        await refreshTokens();
                        setShouldRetry(true);
                        return;
                    }
                }
                    
                if(response.status !== 500)
                    toast.error(data.message);
                else
                    toast.error("Something went wrong with the server.");
            }
        }
        catch(error)
        {
            setIsRunning(false);
            
            if(!error?.response)
                toast.error("No response from server.");
        }
    }

    useEffect(function(){
        if(shouldRetry === true)
           logOut();
    }, [shouldRetry]);

    return(
        <div className="w-[100%] fixed top-0">
            <header className="w-[100%] bg-white flex-col">
                <NavBar 
                    logOut={logOut}
                    isRunning={isRunning}
                    isHamburgerMenuOpen={isHamburgerMenuOpen} 
                    setIsHamburgerMenuOpen={setIsHamburgerMenuOpen} 
                    exploreMenuData={exploreMenuData} 
                    catalogMenuData={catalogMenuData}>
                </NavBar>
                
                {
                    (isHamburgerMenuOpen === true) ? 
                    <HamburgerMenu 
                        logOut={logOut}
                        isRunning={isRunning}
                        exploreMenuData={exploreMenuData} 
                        catalogMenuData={catalogMenuData} 
                        setIsHamburgerMenuOpen={setIsHamburgerMenuOpen}>
                    </HamburgerMenu>
                    : 
                    <></>
                }
            </header>
        </div>
    );
}

export default Header;
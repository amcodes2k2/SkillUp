import { Link } from "react-router-dom";

function MobileDropDownMenu(props)
{
    const {setIsHamburgerMenuOpen} = props;
    
    return(
        <ul>
            {
                props.menuData.map(function(item){
                    return(
                        <li key={item.id} className="px-[0.5rem] py-[0.5rem] rounded mt-[0.5rem] bg-[#f7fafc]">
                            <Link to={item.path} 
                                onClick={() => {
                                    window.scrollTo(0, 0);
                                    return setIsHamburgerMenuOpen(false);
                                }}>
                                <h3 className="font-bold text-sm">{item.title}</h3>
            
                                <p className="font-semibold text-xs text-[#a4a5ab]">
                                    {item.desc}
                                </p>
                            </Link>
                        </li>
                    );
                })
            }
        </ul>
    );
}

export default MobileDropDownMenu;
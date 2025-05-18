import { Link } from "react-router-dom";

function DesktopDropDownMenu(props)
{
    return(
        <ul className="group-hover:block hidden absolute top-[73px] px-[0.5rem] py-[0.5rem] flex-col text-black rounded-lg bg-white w-[400px]">
            {
                props.menuData.map(function(item){
                    return(
                        <li key={item.id} className="px-[1rem] py-[1rem] rounded hover:bg-[#e5eff5]">
                            <Link to={item.path} onClick={() => window.scrollTo(0, 0)}>
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

export default DesktopDropDownMenu;
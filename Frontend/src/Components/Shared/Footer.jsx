import { Link } from "react-router-dom";
import logo from "../../Assets/Images/Logo-Full-Light.png";

function Footer()
{
    return(
        <footer className="w-[100vw] bg-[#1B1E2D]">
            <div className="flex md:flex-col items-center justify-around py-[0.8rem]">
                <Link to="/" onClick={() => window.scrollTo(0, 0)}>
                    <img src={logo} className="h-[45px] cursor-pointer"></img>
                </Link>

                <h2 className="text-[#a4a5ab] font-semibold text-base md:mt-[1rem]">
                    Developed with ❤️ by <a className="underline cursor-pointer" target="_blank" href="https://github.com/amcodes2k2">
                        amcodes2k2
                    </a>
                </h2>
            </div>
        </footer>
    );
}

export default Footer;
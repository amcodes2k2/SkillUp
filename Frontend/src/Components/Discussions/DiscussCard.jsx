import { Link } from "react-router-dom";

function DiscussCard(props)
{
    const {discussion} = props;

    return(
        <Link to={`/post/${discussion._id}`} onClick={() => window.scrollTo(0, 0)}>
            <div className="p-[1rem] border-b border-[#9194ac]">
                <p className="font-semibold text-[#a4a5ab] text-sm flex gap-4">
                    {discussion.user.name}

                    <span>
                        {discussion.publishedOn.substring(0, 10)}
                    </span>
                </p>

                <h2 className="mt-[0.5rem] text-white text-base font-semibold flex">
                    <div className="md:hidden">
                        {discussion.title}
                    </div>
                     
                    <div className="hidden md:block sm:hidden">
                        {
                            (discussion.title.length <= 75) ?
                            discussion.title
                            :
                            discussion.title.substring(0, 75) + "..."
                        }
                    </div>

                    <div className="hidden md:hidden sm:block">
                        {
                            (discussion.title.length <= 40) ?
                            discussion.title
                            :
                            discussion.title.substring(0, 40) + "..."
                        }
                    </div>
                </h2>

                <div className="text-[#a4a5ab] font-semibold text-sm flex-col mt-[1rem]">
                    <div className="md:hidden">
                        {
                            discussion.description.split("\n").slice(0, 1).map(function(line, idx){
                                return <p key={idx}>
                                    {
                                        (line.length <= 280) ?
                                        line
                                        :
                                        line.substring(0, 280) + "..."
                                    }
                                </p>;
                            })
                        }
                    </div>

                    <div className="hidden md:block sm:hidden">
                        {
                            discussion.description.split("\n").slice(0, 1).map(function(line, idx){
                                return(
                                    <p key={idx}>
                                        {
                                            (line.length <= 175) ?
                                            line
                                            :
                                            line.substring(0, 175) + "..."
                                        }
                                    </p>
                                ) ;
                            })
                        }
                    </div>
                    
                    <div className="hidden md:hidden sm:block">
                        {
                            discussion.description.split("\n").slice(0, 1).map(function(line, idx){
                                return(
                                    <p key={idx}>
                                        {
                                            (line.length <= 95) ?
                                            line
                                            :
                                            line.substring(0, 95) + "..."
                                        }
                                    </p>
                                ) ;
                            })
                        }
                    </div>
                </div>

                <div className="text-[#a4a5ab] font-semibold text-sm mt-[1rem]">
                    <span>{discussion.comments.length} comment(s)</span>
                </div>
            </div>
        </Link>
    );
}

export default DiscussCard;
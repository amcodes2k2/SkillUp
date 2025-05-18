function Category(props)
{
    const {category, activeCategory, setActiveCategory} = props;

    if(activeCategory === category._id)
    {
        return(
            <div className="snap-start shrink-0 px-[1rem] py-[0.8rem] border-b-2 border-[#CDA954] text-center cursor-pointer">
                <h2 className="font-semibold text-base text-[#CDA954]">{category.title}</h2>
            </div>
        );
    }
    else
    {
        return(
            <div className="snap-start shrink-0 px-[1rem] py-[0.8rem] border-b-2 border-[#718096] text-center cursor-pointer" onClick={() => setActiveCategory(category._id)}>
                <h2 className="font-semibold text-base text-[#718096]">{category.title}</h2>
            </div>
        );
    }
}

export default Category;
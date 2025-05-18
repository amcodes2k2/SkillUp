import Category from "./Category.jsx";

function CategoriesTab(props)
{
    const {categories} = props;
    const {activeCategory, setActiveCategory} = props;

    return(
        <div className="flex overflow-x-scroll snap-x snap-mandatory sm:justify-start sm:max-w-[300px] justify-center mb-[3rem]">
            {
                categories.map(function(category){
                    return( 
                        <Category key={category._id} 
                            category={category} 
                            activeCategory={activeCategory} 
                            setActiveCategory={setActiveCategory}>
                        </Category>
                    );
                })
            }
        </div>
    );
}

export default CategoriesTab;
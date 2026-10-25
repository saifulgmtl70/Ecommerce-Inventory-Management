import { Link } from "react-router-dom";
import { FaArrowRight, FaShoppingBag } from "react-icons/fa";

const Category = ({ category }) => {
    const categoryId =
        category?._id ||
        category?.id ||
        category?.categoryId;

    const categoryName =
        category?.name ||
        category?.categoryName ||
        category?.title ||
        "Category";

    const categoryImage =
        category?.image ||
        category?.imageUrl ||
        category?.categoryImage ||
        category?.photo ||
        category?.img ||
        "";

    const productCount =
        category?.productCount ??
        category?.totalProducts ??
        category?.productsCount;

    const shopLink = categoryId
        ? `/shop?category=${encodeURIComponent(categoryId)}`
        : "/shop";

    return (
        <Link
            to={shopLink}
            aria-label={`Explore ${categoryName} products`}
            className="group relative flex min-w-0 flex-col overflow-hidden rounded-xl border border-gray-100 bg-white transition duration-300 hover:-translate-y-1 hover:border-green-200 hover:shadow-[0_10px_28px_rgba(0,120,30,0.09)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 sm:rounded-2xl"
        >
            {/* Category Image */}
            <div className="relative aspect-[1/0.82] overflow-hidden bg-gradient-to-br from-green-50 to-gray-50">

                {categoryImage ? (
                    <img
                        src={categoryImage}
                        alt={categoryName}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(event) => {
                            event.currentTarget.style.display = "none";

                            const fallback =
                                event.currentTarget.nextElementSibling;

                            if (fallback) {
                                fallback.style.display = "flex";
                            }
                        }}
                    />
                ) : null}

                {/* Image Fallback */}
                <div
                    className="absolute inset-0 items-center justify-center bg-gradient-to-br from-green-50 to-green-100 text-3xl text-green-600 sm:text-4xl"
                    style={{
                        display: categoryImage ? "none" : "flex",
                    }}
                >
                    <FaShoppingBag />
                </div>

                {/* Subtle Image Overlay */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/[0.10] via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Hover Explore Badge */}
                <span className="absolute bottom-2 right-2 inline-flex translate-y-1 items-center gap-1 rounded-full bg-white/95 px-2.5 py-1.5 text-[10px] font-bold text-green-700 opacity-0 shadow-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:bottom-3 sm:right-3 sm:px-3 sm:text-xs">
                    Explore
                    <FaArrowRight />
                </span>
            </div>

            {/* Category Information */}
            <div className="flex min-h-[62px] items-center justify-between gap-2 px-2.5 py-3 sm:min-h-[76px] sm:px-3.5 sm:py-3.5 lg:px-4">

                <div className="min-w-0 flex-1">
                    <h3 className="line-clamp-2 break-words text-xs font-bold leading-5 text-gray-800 transition-colors duration-300 group-hover:text-green-700 sm:text-sm sm:leading-6">
                        {categoryName}
                    </h3>

                    {productCount !== undefined &&
                        productCount !== null && (
                            <p className="mt-0.5 text-[10px] text-gray-400 sm:mt-1 sm:text-xs">
                                {productCount}{" "}
                                {Number(productCount) === 1
                                    ? "product"
                                    : "products"}
                            </p>
                        )}
                </div>

                {/* Arrow */}
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-50 text-[10px] text-green-700 transition-all duration-300 group-hover:bg-[#00B207] group-hover:text-white sm:h-8 sm:w-8 sm:text-xs">
                    <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-0.5" />
                </span>
            </div>
        </Link>
    );
};

export default Category;
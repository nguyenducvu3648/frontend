import { FC, useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { addProducts } from "../redux/features/productSlice";
import ProductCard from "../components/ProductCard";
import { Product } from "../models/Product";
import axiosInstance from "../config/axios.config";

const AllProducts: FC = () => {
  const dispatch = useAppDispatch();
  const [sortValue, setSortValue] = useState<string>("default");
  
  // Fetch products from Redux store
  const allProducts = useAppSelector((state) => state.productReducer.allProducts);

  // Fetch products on mount if they are not already in the store
    useEffect(() => {
      if (allProducts.length === 0) {
        axiosInstance
    .get("http://localhost:8080/identity/product/getAll", {
    })
    .then((response) => {

      const  products  = response.data.data;
      
      dispatch(addProducts(products)); // Lưu sản phẩm vào Redux store
    })
    .catch((error) => {
      console.error("Lỗi khi lấy sản phẩm", error);
    });
      }
    }, [allProducts.length, dispatch]);

  // Function to calculate price after discount
  const getDiscountedPrice = (product: Product) => {
    return product.price - (product.price * (product.discountPercentage ?? 0)) / 100;
  };

  // Sort products based on sortValue
  const sortedProducts = [...allProducts].sort((a, b) => {
    const aPrice = getDiscountedPrice(a);
    const bPrice = getDiscountedPrice(b);

    if (sortValue === "asc") {
      return aPrice - bPrice;
    } else if (sortValue === "desc") {
      return bPrice - aPrice;
    } else {
      return a.id - b.id; // Default sort by id
    }
  });

  return (
    <div className="container mx-auto min-h-[83vh] p-4 font-karla">
      <div className="grid grid-cols-4 gap-1">
        <div className="col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-lg dark:text-white">Products</span>
            <select
              className="border border-black dark:border-white rounded p-1 dark:text-white dark:bg-slate-600"
              value={sortValue}
              onChange={(e) => setSortValue(e.target.value)}
            >
              <option value="default">Default</option>
              <option value="asc">Price (low to high)</option>
              <option value="desc">Price (high to low)</option>
            </select>
          </div>

          {/* Display products */}
          <div className="grid gap-4 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;

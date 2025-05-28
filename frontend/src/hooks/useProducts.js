import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import {
  fetchProducts,
  fetchProductById,
  fetchCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  setFilters,
  setPage,
} from "../redux/slices/productSlice";

const useProducts = () => {
  const dispatch = useDispatch();
  const { products, product, categories, loading, error, filters, pagination } =
    useSelector((state) => state.products);

  const getProducts = useCallback(
    (params) => {
      return dispatch(fetchProducts(params));
    },
    [dispatch]
  );

  const getProduct = useCallback(
    (id) => {
      return dispatch(fetchProductById(id));
    },
    [dispatch]
  );

  const getCategories = useCallback(() => {
    return dispatch(fetchCategories());
  }, [dispatch]);

  const addProduct = useCallback(
    (productData) => {
      return dispatch(createProduct(productData));
    },
    [dispatch]
  );

  const editProduct = useCallback(
    (id, data) => {
      return dispatch(updateProduct({ id, data }));
    },
    [dispatch]
  );

  const removeProduct = useCallback(
    (id) => {
      return dispatch(deleteProduct(id));
    },
    [dispatch]
  );

  const updateFilters = useCallback(
    (newFilters) => {
      return dispatch(setFilters(newFilters));
    },
    [dispatch]
  );

  const changePage = useCallback(
    (page) => {
      return dispatch(setPage(page));
    },
    [dispatch]
  );

  return {
    products,
    product,
    categories,
    loading,
    error,
    filters,
    pagination,
    getProducts,
    getProduct,
    getCategories,
    addProduct,
    editProduct,
    removeProduct,
    updateFilters,
    changePage,
  };
};

export default useProducts;

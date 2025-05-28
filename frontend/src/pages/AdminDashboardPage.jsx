import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import ProductList from "../components/admin/ProductList";
import ProductForm from "../components/admin/ProductForm";
import AdminOrderList from "../components/admin/AdminOrderList";
import AdminUserList from "../components/admin/AdminUserList";
import SearchFilters from "../components/admin/SearchFilters";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import AdminNav from "../components/admin/AdminNav";
import useDocumentTitle from "../hooks/useDocumentTitle";

const AdminDashboardPage = () => {
  useDocumentTitle("Admin Dashboard | YourShopName");
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("products");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Check if user is admin
  useEffect(() => {
    if (!authLoading && user && !user.isAdmin) {
      navigate("/"); // Redirect non-admin users
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return <LoadingSpinner />;
  }

  if (!user || !user.isAdmin) {
    return null; // Don't render anything until we're sure the user is an admin
  }

  const handleEdit = (product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingProduct(null);
  };
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <AdminNav activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="container mx-auto px-4 py-6">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100">
          <div className="p-6">
            {" "}
            {activeTab === "products" && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-bold text-gray-800">
                    <span className="border-b-2 border-blue-500 pb-1">
                      Product Management
                    </span>
                  </h1>
                  <button
                    onClick={() => setModalOpen(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Add New Product
                  </button>
                </div>

                <SearchFilters />

                <ProductList onEdit={handleEdit} />
              </>
            )}
            {activeTab === "orders" && (
              <>
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-gray-800">
                    <span className="border-b-2 border-blue-500 pb-1">
                      Order Management
                    </span>
                  </h1>
                </div>
                <AdminOrderList />
              </>
            )}
            {activeTab === "users" && (
              <>
                <AdminUserList />
              </>
            )}
          </div>
        </div>
      </main>
      {modalOpen && (
        <ProductForm
          isOpen={modalOpen}
          onClose={handleCloseModal}
          product={editingProduct}
        />
      )}
    </div>
  );
};

export default AdminDashboardPage;

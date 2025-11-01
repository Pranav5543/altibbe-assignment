import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { api, Product } from "../services/api";
import ProductForm from "../components/ProductForm";

const Dashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.getProducts();
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch products");
    }
  };

  const handleCreateProduct = async (productData: Partial<Product>) => {
    try {
      await api.createProduct({
        name: productData.name!,
        description: productData.description!,
        category: productData.category!,
        price: productData.price!,
        questions: productData.questions!.map((q) => ({
          questionId:
            typeof q.questionId === "string" ? q.questionId : q.questionId._id,
          answer: q.answer,
        })),
      });
      fetchProducts();
      setShowForm(false);
    } catch (err) {
      console.error("Failed to create product");
    }
  };

  const handleUpdateProduct = async (productData: Partial<Product>) => {
    if (!editingProduct) return;
    try {
      await api.updateProduct(editingProduct._id, productData);
      fetchProducts();
      setShowForm(false);
      setEditingProduct(undefined);
    } catch (err) {
      console.error("Failed to update product");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await api.deleteProduct(id);
        fetchProducts();
      } catch (err) {
        console.error("Failed to delete product");
      }
    }
  };

  const handleGenerateReport = async (productId: string) => {
    try {
      const res = await api.generateReport(productId);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "product-report.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Failed to generate report");
    }
  };

  if (showForm) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <ProductForm
          product={editingProduct}
          onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
          onCancel={() => {
            setShowForm(false);
            setEditingProduct(undefined);
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-dashboard">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Product Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.name}</span>
              <button
                onClick={logout}
                className="bg-delete hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Products</h2>
            <button
              onClick={() => setShowForm(true)}
              className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Add Product
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white overflow-hidden shadow rounded-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {product.description}
                  </p>
                  <p className="text-sm text-gray-500 mb-2">
                    Category: {product.category}
                  </p>
                  <p className="text-lg font-semibold text-gray-900 mb-4">
                    ${product.price}
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingProduct(product);
                        setShowForm(true);
                      }}
                      className="bg-edit hover:bg-orange-600 text-white px-3 py-1 rounded text-sm transition-all duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      className="button-critical bg-delete hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-all duration-200"
                      aria-label="Delete this product"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleGenerateReport(product._id)}
                      className="button-press bg-report hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition-all duration-200"
                      aria-label="Generate report for this product"
                    >
                      Report
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {products.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No products yet. Create your first product!
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

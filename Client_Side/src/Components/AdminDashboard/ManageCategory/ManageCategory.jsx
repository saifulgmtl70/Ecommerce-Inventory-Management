import React, { useEffect, useState } from "react";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrashAlt,
  FaTags,
  FaTimes,
  FaImage,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const ManageCategory = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    image: "",
  });

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      setLoading(true);

      const response = await axiosSecure.get("/categories");

      setCategories(
        Array.isArray(response.data) ? response.data : []
      );
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Navigate to the Add Category page
  const handleAdd = () => {
    navigate("/admindashboard/addcategory");
  };

  // Open Edit Category modal
  const handleEdit = (category) => {
    setEditingCategory(category);

    setFormData({
      name: category.name || "",
      image: category.image || "",
    });

    setModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    if (saving) return;

    setModalOpen(false);
    setEditingCategory(null);

    setFormData({
      name: "",
      image: "",
    });
  };

  // Handle form input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // Update category
  const handleUpdate = async (event) => {
    event.preventDefault();

    if (!editingCategory) {
      toast.error("No category selected for editing.");
      return;
    }

    const categoryName = formData.name.trim();
    const categoryImage = formData.image.trim();

    if (!categoryName) {
      toast.error("Please enter a category name.");
      return;
    }

    try {
      setSaving(true);

      const categoryId = editingCategory._id;

      const response = await axiosSecure.patch(
        `/categories/${categoryId}`,
        {
          name: categoryName,
          image: categoryImage,
        }
      );

      if (
        response.data?.modifiedCount > 0 ||
        response.data?.matchedCount > 0 ||
        response.data?.acknowledged
      ) {
        toast.success("Category updated successfully!");

        setModalOpen(false);
        setEditingCategory(null);

        setFormData({
          name: "",
          image: "",
        });

        await fetchCategories();
      } else {
        toast.info("No changes were made.");
      }
    } catch (error) {
      console.error("Error updating category:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to update category."
      );
    } finally {
      setSaving(false);
    }
  };

  // Delete category
  const handleDelete = async (category) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${category.name}"?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(category._id);

      const response = await axiosSecure.delete(
        `/categories/${category._id}`
      );

      if (
        response.data?.deletedCount > 0 ||
        response.data?.acknowledged
      ) {
        toast.success("Category deleted successfully!");

        setCategories((previousCategories) =>
          previousCategories.filter(
            (item) => item._id !== category._id
          )
        );
      } else {
        toast.error("Category could not be deleted.");
      }
    } catch (error) {
      console.error("Error deleting category:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to delete category."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // Filter categories by name
  const filteredCategories = categories.filter((category) =>
    (category.name || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Page Header */}
      <div className="my-14 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-2xl font-bold text-gray-800 md:text-3xl">
            <FaTags className="text-green-600" />
            Manage Categories
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            View, edit, and manage your product categories.
          </p>
        </div>

        {/* Add Category Button */}
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700"
        >
          <FaPlus />
          Add Category
        </button>
      </div>

      {/* Search and Summary */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Categories
              </p>

              <h2 className="mt-2 text-3xl font-bold text-gray-800">
                {categories.length}
              </h2>
            </div>

            <div className="rounded-full bg-green-100 p-4 text-green-600">
              <FaTags size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm md:col-span-2">
          <label
            htmlFor="categorySearch"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Search Categories
          </label>

          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              id="categorySearch"
              type="text"
              placeholder="Search by category name..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              className="w-full rounded-lg border border-gray-200 py-3 pl-11 pr-4 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />
          </div>
        </div>
      </div>

      {/* Categories Table */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col gap-2 border-b border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-gray-800">
            Category List
          </h2>

          <p className="text-sm text-gray-500">
            Showing {filteredCategories.length} of{" "}
            {categories.length} categories
          </p>
        </div>

        {loading ? (
          <div className="flex min-h-60 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-green-200 border-t-green-600"></div>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="flex min-h-60 flex-col items-center justify-center px-4 text-center">
            <FaTags className="mb-4 text-5xl text-gray-300" />

            <h3 className="text-lg font-semibold text-gray-700">
              {searchTerm
                ? "No matching categories found"
                : "No categories available"}
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              {searchTerm
                ? "Try another search term."
                : "Add a category to get started."}
            </p>

            {!searchTerm && (
              <button
                type="button"
                onClick={handleAdd}
                className="mt-4 flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-medium text-white transition hover:bg-green-700"
              >
                <FaPlus />
                Add Category
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    #
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Image
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Category Name
                  </th>

                  <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredCategories.map((category, index) => (
                  <tr
                    key={category._id}
                    className="transition hover:bg-gray-50"
                  >
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                      {index + 1}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                        {category.image ? (
                          <img
                            src={category.image}
                            alt={category.name || "Category"}
                            className="h-full w-full object-cover"
                            onError={(event) => {
                              event.currentTarget.style.display =
                                "none";
                            }}
                          />
                        ) : (
                          <FaImage className="text-xl text-gray-400" />
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-800">
                        {category.name}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleEdit(category)}
                          title="Edit Category"
                          className="rounded-lg bg-blue-50 p-3 text-blue-600 transition hover:bg-blue-100"
                        >
                          <FaEdit />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(category)}
                          disabled={deletingId === category._id}
                          title="Delete Category"
                          className="rounded-lg bg-red-50 p-3 text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {deletingId === category._id ? (
                            <span className="block h-4 w-4 animate-spin rounded-full border-2 border-red-300 border-t-red-600"></span>
                          ) : (
                            <FaTrashAlt />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Category Modal */}
      {modalOpen && editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h2 className="text-xl font-bold text-gray-800">
                Edit Category
              </h2>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800 disabled:opacity-50"
                aria-label="Close modal"
              >
                <FaTimes />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleUpdate} className="space-y-5 p-6">
              <div>
                <label
                  htmlFor="categoryName"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Category Name
                </label>

                <input
                  id="categoryName"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter category name"
                  required
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
              </div>

              <div>
                <label
                  htmlFor="categoryImage"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Category Image URL
                </label>

                <input
                  id="categoryImage"
                  name="image"
                  type="url"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />

                {formData.image && (
                  <div className="mt-3 flex items-center gap-3">
                    <img
                      src={formData.image}
                      alt="Category preview"
                      className="h-16 w-16 rounded-lg border border-gray-200 object-cover"
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />

                    <span className="text-sm text-gray-500">
                      Image preview
                    </span>
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-lg border border-gray-200 px-5 py-3 font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"></span>
                      Updating...
                    </>
                  ) : (
                    <>
                      <FaEdit />
                      Update Category
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCategory;
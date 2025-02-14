import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import upload_area from '../../assets/upload_area.png';
import { AdminContext } from '../../../context/AdminContext';
import { RentContext } from '../../../context/RentContext';

const EditProduct = () => {
  const { backendUrl, token ,isAdmin} = useContext(AdminContext);
  const { products, setProducts } = useContext(RentContext);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setShowEditForm(true);
  };

  const handleCloseForm = () => {
    setShowEditForm(false);
    setSelectedProduct(null);
  };

  // Fetch products
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/`);
      if (!response.data.error) {
        setProducts(response.data.allProduct);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Submit form
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // Check if all necessary fields are filled
    if (!selectedProduct.name) {
      toast.error("Please fill in the product name.");
      return;
    }

    try {
      // Create FormData to send to the server
      const formData = new FormData();

      formData.append('name', selectedProduct.name);
      formData.append('brand', selectedProduct.brand);
      formData.append('quantity', selectedProduct.quantity);
      formData.append('category', selectedProduct.category);
      formData.append('description', selectedProduct.description);
      formData.append('bestseller', selectedProduct.bestseller);
      formData.append('price', selectedProduct.price);
      formData.append('sizes', JSON.stringify(selectedProduct.sizes)); // Add sizes array

      // If the image is a File (user uploaded a new image), append it to formData
      if (selectedProduct.image instanceof File) {
        formData.append('image', selectedProduct.image);
      } else {
        // If no new image is uploaded, keep the old image URL as part of the form data
        formData.append('image', selectedProduct.image);
      }

      const response = await axios.put(`${backendUrl}/api/product/${selectedProduct._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
            isAdmin
          },
        });
      if (response.data.error === false) {
        toast.success(response.data.msg);
        fetchProducts();
        handleCloseForm();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'An error occurred');
    }
  };

  useEffect(() => {
      fetchProducts();
    }, [])
  

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Products List</h1>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product._id} className="p-4 border rounded-lg shadow-md bg-white flex flex-col items-center">
            <img src={product.image} alt={product.name} className="w-48 h-48 object-cover rounded-md mb-4" />
            <h2 className="text-lg font-bold">{product.name}</h2>
            <p className="text-sm text-gray-600">{product.brand}</p>
            <p className="text-sm text-gray-600">${product.price}</p>
            <button
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              onClick={() => handleEditClick(product)}
            >
              Edit
            </button>
          </div>
        ))}
      </div>

      {showEditForm && selectedProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-4xl flex gap-6 relative">

            {/* Close Button */}
            <button className="absolute top-2 right-2 text-xl" onClick={handleCloseForm}>
              &times;
            </button>

            {/* Image Upload Section */}
            <div className="flex flex-col items-center w-1/3">
              <p className="mb-2 font-medium">Upload Image</p>
              <label htmlFor="image-upload" className="cursor-pointer">
                <img
                  className="w-48 h-48 object-cover rounded-md border"
                  src={selectedProduct.image instanceof File ? URL.createObjectURL(selectedProduct.image) : selectedProduct.image || upload_area}
                  alt="Product"
                />
                <input
                  type="file"
                  id="image-upload"
                  hidden
                  onChange={(e) => setSelectedProduct({ ...selectedProduct, image: e.target.files[0] })}
                />
              </label>
            </div>

            {/* Product Form */}
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-center mb-4">Edit Product</h2>
              <form onSubmit={onSubmitHandler} className="flex flex-col gap-4">
                <input
                  type="text"
                  value={selectedProduct.name}
                  onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })}
                  className="border p-2 rounded w-full"
                  placeholder="Product Name"
                  required
                />
                <input
                  type="text"
                  value={selectedProduct.brand}
                  onChange={(e) => setSelectedProduct({ ...selectedProduct, brand: e.target.value })}
                  className="border p-2 rounded w-full"
                  placeholder="Brand"
                  required
                />
                <textarea
                  value={selectedProduct.description}
                  onChange={(e) => setSelectedProduct({ ...selectedProduct, description: e.target.value })}
                  className="border p-2 rounded w-full"
                  placeholder="Description"
                  required
                />

                <div className="grid grid-cols-2 gap-4">
                  <select
                    value={selectedProduct.category}
                    onChange={(e) => setSelectedProduct({ ...selectedProduct, category: e.target.value })}
                    className="border p-2 rounded w-full"
                  >
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Kids">Kids</option>
                  </select>

                  <input
                    type="number"
                    value={selectedProduct.price}
                    onChange={(e) => setSelectedProduct({ ...selectedProduct, price: e.target.value })}
                    className="border p-2 rounded w-full"
                    placeholder="Price"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    value={selectedProduct.quantity}
                    onChange={(e) => setSelectedProduct({ ...selectedProduct, quantity: e.target.value })}
                    className="border p-2 rounded w-full"
                    placeholder="Quantity"
                    required
                  />
                </div>

                {/* Sizes Block */}
                <div>
                  <p className="mb-2 font-medium">Select Sizes</p>
                  <div className="flex gap-2">
                    {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                      <label key={size} className="flex items-center gap-1">
                        <input
                          type="checkbox"
                          value={size}
                          checked={selectedProduct.sizes.includes(size)}
                          onChange={(e) => {
                            const newSizes = e.target.checked
                              ? [...selectedProduct.sizes, size]
                              : selectedProduct.sizes.filter((s) => s !== size);
                            setSelectedProduct({ ...selectedProduct, sizes: newSizes });
                          }}
                        />
                        {size}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Bestseller Checkbox */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedProduct.bestseller}
                    onChange={() => setSelectedProduct({ ...selectedProduct, bestseller: !selectedProduct.bestseller })}
                  />
                  Bestseller
                </label>

                <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                  Update Product
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );

};

export default EditProduct;

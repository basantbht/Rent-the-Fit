import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import upload_area from '../../assets/upload_area.png';
import { AdminContext } from '../../../context/AdminContext';
import { RentContext } from '../../../context/RentContext';

const EditProduct = () => {
  const { backendUrl, token, isAdmin, currency } = useContext(AdminContext);
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

    if (!selectedProduct.name) {
      toast.error("Please fill in the product name.");
      return;
    }

    try {
      const formData = new FormData();

      formData.append('name', selectedProduct.name);
      formData.append('brand', selectedProduct.brand);
      formData.append('quantity', selectedProduct.quantity);
      formData.append('category', selectedProduct.category);
      formData.append('subCategory', selectedProduct.subCategory);
      formData.append('color', selectedProduct.color);
      formData.append('description', selectedProduct.description);
      formData.append('bestseller', selectedProduct.bestseller);
      formData.append('price', selectedProduct.price);
      formData.append('sizes', JSON.stringify(selectedProduct.sizes));

      if (selectedProduct.image instanceof File) {
        formData.append('image', selectedProduct.image);
      }

      for (let [key, value] of formData.entries()) {
        console.log(key, value); // Logs each key-value pair
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
      toast.error(error.response?.data?.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [])


  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Products List</h1>

      {/* Products Grid */}
      <div className='flex flex-col gap-4'>
        {/* Table Header */}
        <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center py-3 px-6 border border-gray-300 bg-gray-800 text-white text-sm font-semibold rounded-lg shadow-lg'>
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Quantity</b>
          <b>Price</b>
          <b className='text-center'>Action</b>
        </div>

        {/* Product List */}
        {products.map((product, index) => (
          <div
            className={`grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center gap-4 py-3 px-6 border border-gray-200 text-sm rounded-lg shadow-md transition duration-200 
        ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-200 hover:shadow-lg`}
            key={index}
          >
            <img className='w-16 h-16 object-cover rounded-lg border border-gray-400' src={product.image} alt="" />
            <p className='text-gray-900 font-semibold'>{product.name}</p>
            <p className='text-gray-700'>{product.category}</p>
            <p className='text-gray-700'>{product.quantity}</p>
            <p className='text-gray-900 font-bold'>{currency}{product.price}</p>
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
          <div className="bg-white p-6 rounded-lg shadow-lg w-full md:w-[80%] lg:w-[70%] xl:w-[60%] flex gap-6 relative">

            {/* Close Button */}
            <button className="absolute top-2 right-2 text-xl" onClick={handleCloseForm}>
              &times;
            </button>

            {/* Image Upload Section */}
            <div className="flex flex-col items-center h-1/2">
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

                <div className='flex gap-6'>
                  <div className="flex-1">
                    <p className="font-medium">Product Name</p>
                    <input
                      type="text"
                      value={selectedProduct.name}
                      onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })}
                      className="border p-2 rounded w-full"
                      placeholder="Product Name"
                      required
                      name="name"
                    />
                  </div>

                  <div className="flex-1">
                    <p className="font-medium">Brand</p>
                    <input
                      type="text"
                      value={selectedProduct.brand}
                      onChange={(e) => setSelectedProduct({ ...selectedProduct, brand: e.target.value })}
                      className="border p-2 rounded w-full"
                      placeholder="Brand"
                      required
                      name="brand"
                    />
                  </div>
                </div>




                <div>
                  <p className="font-medium">Description</p>
                  <textarea
                    value={selectedProduct.description}
                    onChange={(e) => setSelectedProduct({ ...selectedProduct, description: e.target.value })}
                    className="border p-2 rounded w-full"
                    placeholder="Description"
                    required
                    name="description"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium">Category</p>
                    <select
                      value={selectedProduct.category}
                      onChange={(e) => setSelectedProduct({ ...selectedProduct, category: e.target.value })}
                      className="border p-2 rounded w-full"
                      name="category"
                    >
                      <option value="Men">Men</option>
                      <option value="Women">Women</option>
                      <option value="Kids">Kids</option>
                    </select>
                  </div>

                  <div>
                    <p className="font-medium">Subcategory</p>
                    <select
                      value={selectedProduct.subCategory}
                      onChange={(e) => setSelectedProduct({ ...selectedProduct, subCategory: e.target.value })}
                      className="border p-2 rounded w-full"
                      name="subCategory"
                    >
                      <option value="Topwear">Topwear</option>
                      <option value="Bottomwear">Bottomwear</option>
                      <option value="Kidswear">Kidswear</option>
                    </select>
                  </div>

                  <div>
                    <p className="font-medium">Color</p>
                    <select
                      value={selectedProduct.color}
                      onChange={(e) => setSelectedProduct({ ...selectedProduct, color: e.target.value })}
                      className="border p-2 rounded w-full"
                      name="color"
                    >
                      <option value="Black">Black</option>
                      <option value="White">White</option>
                      <option value="Red">Red</option>
                    </select>
                  </div>

                  <div>
                    <p className="font-medium">Price</p>
                    <input
                      type="number"
                      value={selectedProduct.price}
                      onChange={(e) => setSelectedProduct({ ...selectedProduct, price: e.target.value })}
                      className="border p-2 rounded w-full"
                      placeholder="Price"
                      required
                      name="price"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium">Quantity</p>
                    <input
                      type="number"
                      value={selectedProduct.quantity}
                      onChange={(e) => setSelectedProduct({ ...selectedProduct, quantity: e.target.value })}
                      className="border p-2 rounded w-full"
                      placeholder="Quantity"
                      required
                      name="quantity"
                    />
                  </div>
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
                          name={`size_${size}`}
                        />
                        {size}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Bestseller Checkbox */}
                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedProduct.bestseller}
                      onChange={() => setSelectedProduct({ ...selectedProduct, bestseller: !selectedProduct.bestseller })}
                      name="bestseller"
                    />
                    Bestseller
                  </label>
                </div>

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

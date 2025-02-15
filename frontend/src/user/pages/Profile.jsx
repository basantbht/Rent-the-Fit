import React, { useContext, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { RentContext } from '../../../context/RentContext';
import upload_area from '../../assets/upload_area.png';

const Profile = () => {
  const { userDetails, setUserDetails, token, isAdmin } = useContext(RentContext);
  const storedUser = JSON.parse(localStorage.getItem('userDetails')) || userDetails;
  const [editedUser, setEditedUser] = useState({ ...userDetails });
  const [preview, setPreview] = useState(userDetails.profileImage || upload_area);
  const [showEditForm, setShowEditForm] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    console.log(editedUser);
    console.log(editedUser.username);

    const formData = new FormData();
    formData.append('username', editedUser.username);

    // console.log(formData);

    if (editedUser.image instanceof File) {
      formData.append('image', editedUser.image);
    }

    for (let [key, value] of formData.entries()) {
      console.log(key, value); // Logs each key-value pair
    }

    try {
      const response = await axios.put('http://localhost:3000/api/users/profile', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
      });
      console.log(response)
      if (response.data.error === false) {

        const updatedUser = { ...userDetails, username: editedUser.username, profileImage: preview };
        setUserDetails(updatedUser);
        localStorage.setItem('userDetails', JSON.stringify(updatedUser));

        toast.success(response.data.message);
        setShowEditForm(false);


      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-200 to-slate-300 py-8">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-8 mb-20 space-y-6 border border-gray-300">

        {/* Profile Picture */}
        <div className="flex flex-col items-center">
          <img
            src={preview}
            alt="Profile"
            className="w-36 h-36 object-cover rounded-full border-4 border-gray-500 shadow-lg mb-4"
          />

          <input
            type="file"
            id="image-upload"
            hidden
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setEditedUser({ ...editedUser, image: file });
                setPreview(URL.createObjectURL(file)); // Update preview for new image
              }
            }}
          />
        </div>

        <h2 className="text-center text-2xl font-semibold text-gray-800">{userDetails.username}</h2>
        <p className="text-center text-sm text-gray-500">{userDetails.email}</p>

        <div className="flex justify-center">
          <button
            onClick={() => setShowEditForm(true)}
            className="bg-gray-600 text-white py-2 px-6 rounded-md hover:bg-gray-700 transition duration-200"
          >
            Edit Profile
          </button>
        </div>

        {showEditForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-xl flex flex-col gap-6 relative">

              <button
                className="absolute top-2 right-2 text-2xl text-gray-600"
                onClick={() => setShowEditForm(false)}
              >
                &times;
              </button>

              <div className="flex flex-col items-center">
                <h2 className="text-xl font-semibold text-center text-gray-800">Edit Profile</h2>

                {/* Profile Picture Upload */}
                <div className="flex flex-col items-center w-1/3 mb-4">
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <img
                      className="w-36 h-36 object-cover rounded-md border-2 border-gray-300 shadow-md"
                      src={preview}
                      alt="Profile"
                    />
                    <input
                      type="file"
                      id="image-upload"
                      hidden
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setEditedUser({ ...editedUser, image: file });
                          setPreview(URL.createObjectURL(file));
                        }
                        console.log(editedUser)
                      }}
                    />
                  </label>
                </div>

                {/* Form */}
                <form onSubmit={onSubmitHandler} className="flex flex-col gap-4">
                  <input
                    type="text"
                    value={editedUser.username}
                    onChange={(e) => setEditedUser({ ...editedUser, username: e.target.value })}
                    className="border p-3 rounded-md w-full text-lg"
                    placeholder="Username"
                    required
                  />
                  <input
                    type="email"
                    value={editedUser.email}
                    className="border p-3 rounded-md w-full text-lg bg-gray-100 text-gray-500"
                    placeholder="Email"
                    disabled
                  />
                  <button
                    type="submit"
                    className="bg-gray-600 text-white py-3 rounded-md hover:bg-gray-700 transition duration-200"
                  >
                    Update
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;

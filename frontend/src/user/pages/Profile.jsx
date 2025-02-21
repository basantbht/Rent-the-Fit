import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { RentContext } from '../../../context/RentContext';
import upload_area from '../../assets/upload_area.png';

const Profile = () => {
  const { userDetails, setUserDetails, token } = useContext(RentContext);
  const navigate = useNavigate(); // Navigation hook

  if (!userDetails) {
    return <div className="text-center text-gray-600">Loading profile...</div>;
  }

  const [editedUser, setEditedUser] = useState({
    username: userDetails.username,
    email: userDetails.email,
    image: null,
  });
  const [preview, setPreview] = useState(userDetails.profileImage || upload_area);
  const [showEditForm, setShowEditForm] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('username', editedUser.username);
    if (editedUser.image instanceof File) {
      formData.append('image', editedUser.image);
    }

    try {
      const response = await axios.put('http://localhost:3000/api/users/profile', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      const { profileImage, username } = response.data.message;

      if (response.data.error === false) {
        setUserDetails({ ...userDetails, username, profileImage });
        localStorage.setItem('username', username);
        localStorage.setItem('profileImage', profileImage);

        toast.success('Profile updated successfully!');
        setShowEditForm(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-200 to-slate-300 py-8">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-8 mb-20 space-y-6 border border-gray-300">

        {/* Profile Picture */}
        <div className="flex flex-col items-center">
          <img
            src={userDetails.profileImage || upload_area}
            alt="Profile"
            className="w-36 h-36 object-cover rounded-full border-4 border-gray-500 shadow-lg mb-4"
          />
        </div>

        <h2 className="text-center text-2xl font-semibold text-gray-800">{userDetails.username}</h2>
        <p className="text-center text-sm text-gray-500">{userDetails.email}</p>

        {/* Buttons for Edit and KYC */}
        <div className="flex justify-center gap-4 flex-col">
          <button
            onClick={() => setShowEditForm(true)}
            className="bg-gray-600 text-white py-2 px-6 rounded-md hover:bg-gray-700 transition duration-200"
          >
            Edit Profile
          </button>

          <button
            onClick={() => navigate('/kyc-form')}
            className="bg-gray-600 text-white py-2 px-6 rounded-md hover:bg-gray-700 transition duration-200"
          >
            Fill KYC Form
          </button>
        </div>

        {/* Edit Profile Modal */}
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

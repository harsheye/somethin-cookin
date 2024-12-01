import React, { useState, useEffect } from 'react';
import { FaUser, FaShoppingBag, FaMapMarkerAlt, FaSignOutAlt, FaLock, FaEnvelope, FaPhone } from 'react-icons/fa';
import ChangePasswordModal from './ChangePasswordModal';
import AddressForm from './AddressForm';

interface Address {
  _id: string;
  name: string;
  phoneNumber: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  isDefault: boolean;
}

interface Order {
  totalProducts: number;
  // Add other order properties as needed
}

interface UserData {
  basicDetails: {
    profile: {
      mobileNo: string;
      name: string;
      pincode: string;
      username: string;
      email: string;
    }
  };
  addresses: Address[];
  orders: Order[];
}

interface UserProfileProps {
  onLogout: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ onLogout }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [activeTab, setActiveTab] = useState('personal');
  const [editMode, setEditMode] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserData['basicDetails']['profile'] | null>(null);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch('https://onlinesbii.live/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data: UserData = await response.json();
      setUserData(data);
      setEditedProfile(data.basicDetails.profile);
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Handle error (e.g., redirect to login page)
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editedProfile) {
      setEditedProfile({ ...editedProfile, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://onlinesbii.live/api/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ basicDetails: { profile: editedProfile } })
      });

      if (!response.ok) {
        throw new Error('Failed to update user data');
      }

      setUserData(prevData => prevData ? {...prevData, basicDetails: { profile: editedProfile! }} : null);
      setEditMode(false);
    } catch (error) {
      console.error('Error updating user data:', error);
      // Handle error
    }
  };

  // ... (keep other functions like handleAddAddress, handleUpdateAddress, etc.)

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">My Swstik Profile</h2>
      {/* ... (keep tab buttons) */}

      {activeTab === 'personal' && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
          {editMode ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={editedProfile?.name || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Username</label>
                <input
                  type="text"
                  name="username"
                  value={editedProfile?.username || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={editedProfile?.email || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Mobile</label>
                <input
                  type="tel"
                  name="mobileNo"
                  value={editedProfile?.mobileNo || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={editedProfile?.pincode || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                Save Changes
              </button>
            </form>
          ) : (
            <div>
              <p><FaUser className="inline mr-2" /><strong>Name:</strong> {userData.basicDetails.profile.name}</p>
              <p><FaUser className="inline mr-2" /><strong>Username:</strong> {userData.basicDetails.profile.username}</p>
              <p><FaEnvelope className="inline mr-2" /><strong>Email:</strong> {userData.basicDetails.profile.email}</p>
              <p><FaPhone className="inline mr-2" /><strong>Mobile:</strong> {userData.basicDetails.profile.mobileNo}</p>
              <p><FaMapMarkerAlt className="inline mr-2" /><strong>Pincode:</strong> {userData.basicDetails.profile.pincode}</p>
              <button
                onClick={() => setEditMode(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
              >
                Edit Profile
              </button>
              <button
                onClick={() => setShowChangePasswordModal(true)}
                className="bg-yellow-500 text-white px-4 py-2 rounded mt-4 ml-4"
              >
                <FaLock className="inline mr-2" />
                Change Password
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'addresses' && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Addresses</h3>
          {userData.addresses.map((address) => (
            <div key={address._id} className="border p-4 mb-4 rounded">
              <p>{address.name}</p>
              <p>{address.street}</p>
              <p>{address.city}, {address.state} {address.zipCode}</p>
              <p>{address.country}</p>
              <p>Phone: {address.phoneNumber}</p>
              {/* ... (keep address actions) */}
            </div>
          ))}
          {/* ... (keep add address button) */}
        </div>
      )}

      {activeTab === 'orders' && (
        <div>
          <h3 className="text-xl font-semibold mb-4">My Orders</h3>
          {userData.orders.map((order, index) => (
            <div key={index} className="border p-4 mb-4 rounded">
              <p><strong>Total Products:</strong> {order.totalProducts}</p>
              {/* Add more order details as needed */}
            </div>
          ))}
        </div>
      )}

      {/* ... (keep logout button and modals) */}
    </div>
  );
};

export default UserProfile;

import React, { useState } from 'react';
import { FaMapMarkerAlt, FaPhone } from 'react-icons/fa';

interface AddressFormProps {
  onClose: () => void;
  onSubmit: (address: Omit<Address, 'id'>) => void;
}

const AddressForm: React.FC<AddressFormProps> = ({ onClose, onSubmit }) => {
  const [address, setAddress] = useState({
    name: '',
    phoneNumber: '',
    street: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    isDefault: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setAddress(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(address);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Add New Address</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
              <FaMapMarkerAlt className="inline mr-2" />
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={address.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="phoneNumber" className="block text-gray-700 text-sm font-bold mb-2">
              <FaPhone className="inline mr-2" />
              Phone Number
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={address.phoneNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          {/* Add similar input fields for street, city, state, country, and zipCode */}
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isDefault"
                checked={address.isDefault}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-gray-700 text-sm font-bold">Set as default address</span>
            </label>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Add Address
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressForm;

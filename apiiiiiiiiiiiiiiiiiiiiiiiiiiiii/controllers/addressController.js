const User = require('../models/User');

// Add a new address
exports.addAddress = async (req, res) => {
  try {
    const userId = req.user.userId; // Assuming you have user authentication middleware
    const { name, phoneNumber, street, city, state, country, zipCode, isDefault } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newAddress = {
      name,
      phoneNumber,
      street,
      city,
      state,
      country,
      zipCode,
      isDefault: isDefault || false
    };

    if (isDefault) {
      // If the new address is default, set all other addresses to non-default
      user.addresses.forEach(addr => addr.isDefault = false);
    }

    user.addresses.push(newAddress);
    await user.save();

    res.status(201).json({ message: 'Address added successfully', address: newAddress });
  } catch (error) {
    console.error('Error adding address:', error);
    res.status(500).json({ error: 'An error occurred while adding the address' });
  }
};

// Edit an existing address
exports.editAddress = async (req, res) => {
  try {
    const userId = req.user.userId;
    const addressId = req.params.addressId;
    const { name, phoneNumber, street, city, state, country, zipCode, isDefault } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({ error: 'Address not found' });
    }

    // Update address fields
    address.name = name || address.name;
    address.phoneNumber = phoneNumber || address.phoneNumber;
    address.street = street || address.street;
    address.city = city || address.city;
    address.state = state || address.state;
    address.country = country || address.country;
    address.zipCode = zipCode || address.zipCode;

    if (isDefault !== undefined) {
      if (isDefault) {
        // If this address is being set as default, set all others to non-default
        user.addresses.forEach(addr => addr.isDefault = false);
      }
      address.isDefault = isDefault;
    }

    await user.save();

    res.json({ message: 'Address updated successfully', address });
  } catch (error) {
    console.error('Error editing address:', error);
    res.status(500).json({ error: 'An error occurred while editing the address' });
  }
};

// Delete an address
exports.deleteAddress = async (req, res) => {
  try {
    const userId = req.user.userId;
    const addressId = req.params.addressId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === addressId);
    if (addressIndex === -1) {
      return res.status(404).json({ error: 'Address not found' });
    }

    const deletedAddress = user.addresses.splice(addressIndex, 1)[0];

    // If the deleted address was the default, set the first remaining address as default (if any)
    if (deletedAddress.isDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    res.json({ message: 'Address deleted successfully', deletedAddress });
  } catch (error) {
    console.error('Error deleting address:', error);
    res.status(500).json({ error: 'An error occurred while deleting the address' });
  }
};

// Set an address as default
exports.setDefaultAddress = async (req, res) => {
  try {
    const userId = req.user.userId;
    const addressId = req.params.addressId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({ error: 'Address not found' });
    }

    // Set all addresses to non-default
    user.addresses.forEach(addr => addr.isDefault = false);

    // Set the specified address as default
    address.isDefault = true;

    await user.save();

    res.json({ message: 'Default address set successfully', address });
  } catch (error) {
    console.error('Error setting default address:', error);
    res.status(500).json({ error: 'An error occurred while setting the default address' });
  }
};
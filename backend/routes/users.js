const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get all pending users
router.get('/pending', async (req, res) => {
  try {
    const users = await User.find({ accounts_status: 'pending' });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Get all verified users
router.get('/verified', async (req, res) => {
  try {
    // Fetch users with verified account status
    const users = await User.find({ accounts_status: 'verified' });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all rejected users
router.get('/rejected', async (req, res) => {
  try {
    // Fetch users with rejected account status
    const users = await User.find({ accounts_status: 'rejected' });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all suspended users
router.get('/suspended', async (req, res) => {
  try {
    // Fetch users with suspended account status
    const users = await User.find({ accounts_status: 'suspended' });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Verify user
router.put('/:id/verify', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { accounts_status: 'verified' }, { new: true });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Reject user
router.put('/:id/reject', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { accounts_status: 'rejected' }, { new: true });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a suspended user
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
});

// Lift suspension
router.put('/lift-suspension/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { accounts_status: 'Verified' },
      { new: true } // Return the updated user
    );
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User suspension lifted', user: updatedUser });
  } catch (error) {
    console.error('Error lifting suspension:', error);
    res.status(500).json({ message: 'Error lifting suspension' });
  }
});


module.exports = router;

const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
    getAllUsers,
    toggleUserStatus,
    updateBookingPaymentStatus,
    updateBookingStatus
} = require('../controllers/adminController');

// All routes are protected and require admin privileges
router.get('/users', protect, admin, getAllUsers);
router.put('/users/:id/status', protect, admin, toggleUserStatus);
router.put('/bookings/:id/payment', protect, admin, updateBookingPaymentStatus);
router.put('/bookings/:id/status', protect, admin, updateBookingStatus);

module.exports = router;

const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
    getAllUsers,
    toggleUserStatus,
    deleteUser,
    updateBookingPaymentStatus,
    updateBookingStatus,
    deleteBooking,
    updateUserRole
} = require('../controllers/adminController');

// All routes are protected and require admin privileges
router.get('/users', protect, admin, getAllUsers);
router.put('/users/:id/status', protect, admin, toggleUserStatus);
router.delete('/users/:id', protect, admin, deleteUser);
router.put('/users/:id/role', protect, admin, updateUserRole);
router.put('/bookings/:id/payment', protect, admin, updateBookingPaymentStatus);
router.put('/bookings/:id/status', protect, admin, updateBookingStatus);
router.delete('/bookings/:id', protect, admin, deleteBooking);

module.exports = router;
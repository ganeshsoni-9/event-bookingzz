const User = require('../models/User');
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const { sendBookingEmail } = require('../utils/email');

// Get all users with their booking activity
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ name: 1 });
        // Fetch all bookings populated with event details
        const bookings = await Booking.find().populate('eventId');

        const usersWithActivity = users.map(user => {
            const userBookings = bookings.filter(b => b.userId.toString() === user._id.toString());
            return {
                ...user.toObject(),
                bookingsCount: userBookings.length,
                bookings: userBookings
            };
        });

        res.json(usersWithActivity);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Toggle user active status
exports.toggleUserStatus = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Prevent deactivating own account
        if (user._id.toString() === req.user.id.toString()) {
            return res.status(400).json({ message: 'Admins cannot deactivate their own account' });
        }

        user.isActive = user.isActive === undefined ? false : !user.isActive;
        await user.save();

        res.json({
            message: `User account is now ${user.isActive ? 'active' : 'deactivated'}`,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                isActive: user.isActive
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Permanently delete a user (and their bookings) from the database
exports.deleteUser = async (req, res) => {
    try {
        const targetUser = await User.findById(req.params.id);

        if (!targetUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Prevent admin from deleting their own account
        if (targetUser._id.toString() === req.user.id.toString()) {
            return res.status(400).json({ message: 'Admins cannot delete their own account' });
        }

        // Restore seats for any confirmed bookings this user had, before removing them
        const userBookings = await Booking.find({ userId: targetUser._id });

        for (const booking of userBookings) {
            if (booking.status === 'confirmed') {
                const event = await Event.findById(booking.eventId);
                if (event) {
                    event.availableSeats += booking.seats;
                    await event.save();
                }
            }
        }

        // Delete all of this user's bookings, then the user itself
        await Booking.deleteMany({ userId: targetUser._id });
        await User.findByIdAndDelete(req.params.id);

        res.json({ message: 'User and their bookings deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Update booking payment/billing status
exports.updateBookingPaymentStatus = async (req, res) => {
    try {
        const { paymentStatus } = req.body;
        if (!['paid', 'not_paid'].includes(paymentStatus)) {
            return res.status(400).json({ message: 'Invalid payment status value' });
        }

        const booking = await Booking.findById(req.params.id).populate('eventId').populate('userId', 'name email');
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        booking.paymentStatus = paymentStatus;
        await booking.save();

        res.json({
            message: `Booking billing status updated to ${paymentStatus}`,
            booking
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Update booking status (confirmed/pending/cancelled)
exports.updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!['confirmed', 'pending', 'cancelled'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        const oldStatus = booking.status;
        booking.status = status;
        await booking.save();

        // Handle seat counts when status changes
        if (oldStatus !== 'confirmed' && status === 'confirmed') {
            // Deduct seats
            const event = await Event.findById(booking.eventId);
            if (event) {
                if (event.availableSeats < booking.seats) {
                    // Rollback booking status change
                    booking.status = oldStatus;
                    await booking.save();
                    return res.status(400).json({ message: `Not enough seats. Only ${event.availableSeats} available.` });
                }
                event.availableSeats -= booking.seats;
                await event.save();
            }
        } else if (oldStatus === 'confirmed' && status !== 'confirmed') {
            // Restore seats
            const event = await Event.findById(booking.eventId);
            if (event) {
                event.availableSeats += booking.seats;
                await event.save();
            }
        }

        const updatedBooking = await Booking.findById(req.params.id).populate('eventId').populate('userId', 'name email');

        // Send ticket email only when booking newly becomes confirmed
        if (oldStatus !== 'confirmed' && status === 'confirmed') {
            try {
                await sendBookingEmail(
                    updatedBooking.userId.email,
                    {
                        userName: updatedBooking.userId.name,
                        eventTitle: updatedBooking.eventId.title,
                        eventDate: updatedBooking.eventId.date,
                        eventLocation: updatedBooking.eventId.location,
                        seats: updatedBooking.seats,
                        amount: updatedBooking.amount,
                        transactionId: updatedBooking.transactionId,
                        bookingId: updatedBooking._id
                    }
                );
            } catch (emailError) {
                // Don't fail the whole request if email fails - booking is still confirmed
                console.error('Ticket email failed to send:', emailError.message);
            }
        }

        res.json({
            message: `Booking status updated to ${status}`,
            booking: updatedBooking
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Permanently delete a booking record
exports.deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // If the booking was confirmed, restore the seat before deleting
        if (booking.status === 'confirmed') {
            const event = await Event.findById(booking.eventId);
            if (event) {
                event.availableSeats += booking.seats;
                await event.save();
            }
        }

        await Booking.findByIdAndDelete(req.params.id);

        res.json({ message: 'Booking deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Update user role (Promote to Admin / Demote to User)
exports.updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role value' });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Prevent self demotion
        if (user._id.toString() === req.user.id.toString()) {
            return res.status(400).json({ message: 'Admins cannot change their own role' });
        }

        user.role = role;
        await user.save();

        res.json({
            message: `User role updated to ${role}`,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
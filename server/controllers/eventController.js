const Event = require('../models/Event');

/**
 * GET ALL EVENTS
 * (simple + safe + supports search/category)
 */
exports.getEvents = async (req, res) => {
    try {
        const { search, category } = req.query;

        let query = {};

        // category filter
        if (category) {
            query.category = category;
        }

        // search filter (title based)
        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }

        const events = await Event.find(query)
            .populate('createdBy', 'name email');

        res.json(events);
    } catch (error) {
        console.error("GET EVENTS ERROR:", error);
        res.status(500).json({
            message: 'Server Error',
            error: error.message
        });
    }
};

/**
 * GET EVENT BY ID
 */
exports.getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate('createdBy', 'name email');

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.json(event);
    } catch (error) {
        console.error("GET EVENT BY ID ERROR:", error);
        res.status(500).json({
            message: 'Server Error',
            error: error.message
        });
    }
};

/**
 * CREATE EVENT
 */
exports.createEvent = async (req, res) => {
    try {
        const {
            title,
            description,
            date,
            location,
            category,
            totalSeats,
            ticketPrice,
            imageUrl   // ✅ FIXED (use one standard field)
        } = req.body;

        const event = await Event.create({
            title,
            description,
            date,
            location,
            category,
            totalSeats,
            availableSeats: totalSeats,
            ticketPrice: ticketPrice || 0,
            imageUrl: imageUrl || '',   // ✅ FIXED
            createdBy: req.user.id
        });

        res.status(201).json(event);
    } catch (error) {
        console.error("CREATE EVENT ERROR:", error);
        res.status(500).json({
            message: 'Server Error',
            error: error.message
        });
    }
};

/**
 * UPDATE EVENT
 */
exports.updateEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.json(event);
    } catch (error) {
        console.error("UPDATE EVENT ERROR:", error);
        res.status(500).json({
            message: 'Server Error',
            error: error.message
        });
    }
};

/**
 * DELETE EVENT
 */
exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error("DELETE EVENT ERROR:", error);
        res.status(500).json({
            message: 'Server Error',
            error: error.message
        });
    }
};
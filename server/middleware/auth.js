const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    // Check Authorization header (case-insensitive) or query parameter
    if (
        req.headers.authorization &&
        req.headers.authorization.toLowerCase().startsWith('bearer')
    ) {
        token = req.headers.authorization.split(" ")[1];
    } else if (req.query.token) {
        token = req.query.token;
    }

    // No token
    if (!token) {
        console.warn(`[Auth Check] Blocked unauthorized access to ${req.originalUrl}: No token provided.`);
        return res.status(401).json({
            message: 'Not authorized, no token'
        });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from DB
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            return res.status(401).json({
                message: 'Not authorized, user not found'
            });
        }

        if (req.user.isActive === false) {
            return res.status(403).json({
                message: 'Your account has been deactivated. Please contact support.'
            });
        }

        next();

    } catch (error) {
        return res.status(401).json({
            message: 'Not authorized, token failed'
        });
    }
};

// Admin middleware
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({
            message: 'Forbidden, admin access required'
        });
    }
};

module.exports = { protect, admin };
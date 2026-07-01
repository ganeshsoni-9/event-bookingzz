const User = require('../models/User');
const bcrypt = require('bcryptjs');
const OTP = require('../models/OTP');
const jwt = require('jsonwebtoken');
const { sendOTPEmail } = require('../utils/email');

const generateToken = (id, role) => {
    return jwt.sign(
        { id, role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

// Register User
// Register User
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                error: "User already exists"
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "user",
            isVerified: false
        });

        // Generate OTP
        const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        console.log(`OTP for ${email}: ${otp}`);

        // Delete old OTP
        await OTP.deleteMany({
            email,
            state: "account_verification"
        });

        // Save new OTP
        await OTP.create({
            email,
            otp,
            state: "account_verification"
        });

        // Send OTP email
        await sendOTPEmail(
            email,
            otp,
            "account_verification"
        );

        // Success response
        return res.status(201).json({
            message:
                "User registered successfully. Please check your email for OTP to verify your account.",
            email: user.email
        });

    } catch (error) {
        console.error("Register Error:", error);

        return res.status(500).json({
            error: error.message
        });
    }
};

// Login User
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                error: 'Invalid credentials, please sign up first'
            });
        }

        if (user.isActive === false) {
            return res.status(403).json({
                error: 'Your account has been deactivated. Please contact support.'
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(400).json({
                error: 'Invalid credentials'
            });
        }

        if (!user.isVerified && user.role === 'user') {

            const otp = Math.floor(
                100000 + Math.random() * 900000
            ).toString();

            await OTP.deleteMany({
                email,
                state: 'account_verification'
            });

            await OTP.create({
                email,
                otp,
                state: 'account_verification'
            });
            await sendOTPEmail(
                email,
                otp,
                'account_verification'
            );

           return res.status(400).json({
    error: "Account not verified. A new OTP has been sent to your email.",
    needsVerification: true
});
        }

        res.json({
            message: 'Login successful',
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id, user.role)
        });

    } catch (error) {
        res.status(500).json({
            message: 'Server Error',
            error: error.message
        });
    }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        console.log("Verify OTP Request:", req.body);

        const otpRecord = await OTP.findOne({
            email,
            otp,
            state: "account_verification"
        });

        if (!otpRecord) {
            return res.status(400).json({
                message: "Invalid OTP"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (user.isActive === false) {
            return res.status(403).json({
                message: 'Your account has been deactivated. Please contact support.'
            });
        }

        user.isVerified = true;
        await user.save();

        // OTP delete after verification
        await OTP.deleteMany({
            email,
            state: "account_verification"
        });

        res.status(200).json({
            message: "Account verified successfully",
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id, user.role)
        });

    } catch (error) {
        console.error("Verify OTP Error:", error);

        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};
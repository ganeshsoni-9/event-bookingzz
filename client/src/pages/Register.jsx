import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import {
    FaUser,
    FaEnvelope,
    FaLock,
    FaShieldAlt,
    FaArrowRight,
    FaCheckCircle,
    FaTicketAlt
} from 'react-icons/fa';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [showOTP, setShowOTP] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register, verifyOTP } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (!showOTP) {
                await register(name, email, password);
                setShowOTP(true);
                setError('');
            } else {
                await verifyOTP(email, otp);
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err?.message || err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-[calc(100vh-80px)] overflow-hidden flex items-center justify-center px-4 py-10">

            {/* ================= BACKGROUND ================= */}

            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 -z-20"></div>

            {/* Animated blobs */}

            <div className="absolute -top-32 -left-32 w-80 h-80 bg-indigo-500/30 rounded-full blur-3xl animate-pulse -z-10"></div>

            <div
                className="absolute top-1/3 -right-32 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -z-10"
                style={{
                    animation: 'float 7s ease-in-out infinite'
                }}
            ></div>

            <div
                className="absolute -bottom-40 left-1/3 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -z-10"
                style={{
                    animation: 'float 9s ease-in-out infinite'
                }}
            ></div>

            {/* ================= MAIN CARD ================= */}

            <div
                className="
                    w-full max-w-5xl
                    grid lg:grid-cols-2
                    overflow-hidden
                    rounded-[2rem]
                    border border-white/20
                    bg-white/10
                    backdrop-blur-2xl
                    shadow-[0_25px_80px_rgba(0,0,0,0.45)]
                    animate-[fadeUp_0.7s_ease-out]
                "
            >

                {/* ================= LEFT SIDE ================= */}

                <div className="hidden lg:flex relative p-12 flex-col justify-between text-white overflow-hidden">

                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/80 via-blue-600/60 to-purple-700/70"></div>

                    <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full border border-white/10"></div>
                    <div className="absolute -right-10 -top-10 w-52 h-52 rounded-full border border-white/10"></div>

                    <div className="relative z-10">

                        <div className="flex items-center gap-3 mb-10">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                                <FaTicketAlt className="text-2xl" />
                            </div>

                            <div>
                                <h2 className="text-2xl font-black">
                                    Sobhasaria EventAdda
                                </h2>

                                <p className="text-xs text-blue-100">
                                    College Event Platform
                                </p>
                            </div>
                        </div>

                        <span className="inline-block bg-white/15 border border-white/20 px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase mb-6">
                            Join the Community
                        </span>

                        <h1 className="text-4xl xl:text-5xl font-black leading-tight mb-6">
                            Create Your
                            <span className="block text-blue-200">
                                Sobhasaria EventAdda Account
                            </span>
                        </h1>

                        <p className="text-blue-100 leading-relaxed max-w-md">
                            Discover exciting college events, workshops,
                            competitions, cultural programs and more.
                            Register once and start exploring.
                        </p>

                        <div className="mt-10 space-y-4">

                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
                                    <FaCheckCircle />
                                </div>
                                <span className="text-sm">
                                    Discover college events
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
                                    <FaCheckCircle />
                                </div>
                                <span className="text-sm">
                                    Book tickets easily
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
                                    <FaCheckCircle />
                                </div>
                                <span className="text-sm">
                                    Secure OTP verification
                                </span>
                            </div>

                        </div>

                    </div>

                    <div className="relative z-10 text-xs text-blue-200">
                        © {new Date().getFullYear()} Eventora
                    </div>

                </div>

                {/* ================= RIGHT SIDE ================= */}

                <div className="bg-white/95 backdrop-blur-xl p-7 sm:p-10 lg:p-12">

                    {/* Mobile Logo */}

                    <div className="lg:hidden flex items-center justify-center gap-3 mb-8">

                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
                            <FaTicketAlt />
                        </div>

                        <div>
                            <h2 className="text-2xl font-black text-gray-900">
                                Sobhasaria EventAdda
                            </h2>

                            <p className="text-xs text-gray-500">
                                College Event Platform
                            </p>
                        </div>

                    </div>

                    {/* Heading */}

                    <div className="text-center mb-8">

                        <div className="inline-flex w-16 h-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-lg shadow-indigo-500/30 mb-5">

                            {showOTP ? (
                                <FaShieldAlt className="text-2xl" />
                            ) : (
                                <FaUser className="text-2xl" />
                            )}

                        </div>

                        <h2 className="text-3xl sm:text-4xl font-black text-gray-900">

                            {showOTP
                                ? 'Verify Your Account'
                                : 'Create Account'
                            }

                        </h2>

                        <p className="text-gray-500 mt-2">

                            {showOTP
                                ? 'Enter the OTP sent to your email'
                                : 'Join Eventora and explore amazing events'
                            }

                        </p>

                    </div>

                    {/* ================= ERROR ================= */}

                    {error && (

                        <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl animate-[shake_0.3s_ease-in-out]">

                            <span className="font-semibold text-sm">
                                {error}
                            </span>

                        </div>

                    )}

                    {/* ================= FORM ================= */}

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        {!showOTP ? (

                            <>

                                {/* NAME */}

                                <div className="group">

                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        Full Name
                                    </label>

                                    <div className="relative">

                                        <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition" />

                                        <input
                                            type="text"
                                            required
                                            placeholder="Enter your full name"
                                            value={name}
                                            onChange={(e) =>
                                                setName(e.target.value)
                                            }
                                            className="
                                                w-full
                                                pl-12 pr-4 py-3.5
                                                rounded-xl
                                                border border-gray-200
                                                bg-gray-50
                                                text-gray-900
                                                outline-none
                                                transition-all
                                                duration-300
                                                focus:bg-white
                                                focus:border-indigo-500
                                                focus:ring-4
                                                focus:ring-indigo-500/10
                                                focus:-translate-y-0.5
                                            "
                                        />

                                    </div>

                                </div>

                                {/* EMAIL */}

                                <div className="group">

                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        Email Address
                                    </label>

                                    <div className="relative">

                                        <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition" />

                                        <input
                                            type="email"
                                            required
                                            placeholder="you@example.com"
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                            className="
                                                w-full
                                                pl-12 pr-4 py-3.5
                                                rounded-xl
                                                border border-gray-200
                                                bg-gray-50
                                                text-gray-900
                                                outline-none
                                                transition-all
                                                duration-300
                                                focus:bg-white
                                                focus:border-indigo-500
                                                focus:ring-4
                                                focus:ring-indigo-500/10
                                                focus:-translate-y-0.5
                                            "
                                        />

                                    </div>

                                </div>

                                {/* PASSWORD */}

                                <div className="group">

                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        Password
                                    </label>

                                    <div className="relative">

                                        <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition" />

                                        <input
                                            type="password"
                                            required
                                            placeholder="Create a strong password"
                                            value={password}
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                            className="
                                                w-full
                                                pl-12 pr-4 py-3.5
                                                rounded-xl
                                                border border-gray-200
                                                bg-gray-50
                                                text-gray-900
                                                outline-none
                                                transition-all
                                                duration-300
                                                focus:bg-white
                                                focus:border-indigo-500
                                                focus:ring-4
                                                focus:ring-indigo-500/10
                                                focus:-translate-y-0.5
                                            "
                                        />

                                    </div>

                                </div>

                            </>

                        ) : (

                            /* ================= OTP ================= */

                            <div className="animate-[fadeUp_0.4s_ease-out]">

                                <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-6">

                                    <div className="flex items-start gap-3">

                                        <FaCheckCircle className="text-green-500 text-xl mt-0.5" />

                                        <div>

                                            <h3 className="font-bold text-green-800">
                                                OTP Sent Successfully
                                            </h3>

                                            <p className="text-sm text-green-700 mt-1">
                                                We have sent a 6-digit verification
                                                code to your email address.
                                            </p>

                                        </div>

                                    </div>

                                </div>

                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Verification Code
                                </label>

                                <div className="relative">

                                    <FaShieldAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                                    <input
                                        type="text"
                                        required
                                        placeholder="Enter 6-digit OTP"
                                        value={otp}
                                        onChange={(e) =>
                                            setOtp(
                                                e.target.value
                                                    .replace(/\D/g, '')
                                                    .slice(0, 6)
                                            )
                                        }
                                        maxLength="6"
                                        className="
                                            w-full
                                            pl-12 pr-4 py-4
                                            rounded-xl
                                            border border-gray-200
                                            bg-gray-50
                                            text-gray-900
                                            outline-none
                                            text-center
                                            tracking-[0.5em]
                                            text-xl
                                            font-black
                                            transition-all
                                            duration-300
                                            focus:bg-white
                                            focus:border-indigo-500
                                            focus:ring-4
                                            focus:ring-indigo-500/10
                                            focus:-translate-y-0.5
                                        "
                                    />

                                </div>

                                <p className="text-xs text-gray-500 text-center mt-3">
                                    Check your inbox and enter the OTP to
                                    complete registration.
                                </p>

                            </div>

                        )}

                        {/* ================= BUTTON ================= */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                w-full
                                flex items-center justify-center gap-3
                                bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700
                                hover:from-indigo-700 hover:via-blue-700 hover:to-indigo-800
                                disabled:opacity-60
                                disabled:cursor-not-allowed
                                text-white
                                font-black
                                py-4
                                rounded-xl
                                shadow-lg
                                shadow-indigo-500/25
                                hover:shadow-indigo-500/40
                                hover:-translate-y-1
                                active:translate-y-0
                                transition-all
                                duration-300
                            "
                        >

                            {loading ? (

                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Processing...
                                </>

                            ) : (

                                <>
                                    {showOTP
                                        ? 'Verify & Complete'
                                        : 'Create My Account'
                                    }

                                    <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />

                                </>

                            )}

                        </button>

                    </form>

                    {/* ================= LOGIN ================= */}

                    {!showOTP && (

                        <div className="mt-8 text-center">

                            <div className="flex items-center gap-3 mb-5">

                                <div className="h-px bg-gray-200 flex-1"></div>

                                <span className="text-xs text-gray-400 font-semibold">
                                    ALREADY REGISTERED?
                                </span>

                                <div className="h-px bg-gray-200 flex-1"></div>

                            </div>

                            <p className="text-gray-600">

                                Already have an account?{' '}

                                <Link
                                    to="/login"
                                    className="text-indigo-600 font-black hover:text-indigo-800 hover:underline transition"
                                >
                                    Sign In
                                </Link>

                            </p>

                        </div>

                    )}

                </div>

            </div>

            {/* ================= ANIMATION ================= */}

            <style>
                {`
                    @keyframes float {
                        0%, 100% {
                            transform: translateY(0px);
                        }
                        50% {
                            transform: translateY(-25px);
                        }
                    }

                    @keyframes fadeUp {
                        from {
                            opacity: 0;
                            transform: translateY(30px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }

                    @keyframes shake {
                        0%, 100% {
                            transform: translateX(0);
                        }
                        25% {
                            transform: translateX(-5px);
                        }
                        75% {
                            transform: translateX(5px);
                        }
                    }
                `}
            </style>

        </div>
    );
};

export default Register;
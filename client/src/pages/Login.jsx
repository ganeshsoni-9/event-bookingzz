import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import {
    FaEnvelope,
    FaLock,
    FaEye,
    FaEyeSlash,
    FaShieldAlt,
    FaTicketAlt,
    FaArrowRight,
    FaKey
} from 'react-icons/fa';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [showOTP, setShowOTP] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, verifyOTP } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (!showOTP) {
                const data = await login(email, password);

                if (data.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/dashboard');
                }
            } else {
                const data = await verifyOTP(email, otp);

                if (data.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/dashboard');
                }
            }
        } catch (err) {
            if (err.needsVerification) {
                setShowOTP(true);
                setError(
                    'Account not verified. A new OTP has been sent to your email.'
                );
            } else {
                setError(err.message || err);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4 py-12 bg-cover bg-center bg-fixed relative"
            style={{
                backgroundImage:
                    "linear-gradient(rgba(15, 23, 42, 0.72), rgba(15, 23, 42, 0.72)), url('/college-bg.jpeg')"
            }}
        >

            {/* Background Decorative Circles */}
            <div className="absolute top-20 left-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>

            <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>


            {/* LOGIN CARD */}
            <div className="relative w-full max-w-md animate-[fadeIn_0.6s_ease-out]">

                <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden">

                    {/* TOP BRANDING */}
                    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900 text-white px-8 py-8 text-center">

                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 hover:rotate-3">
                                {showOTP ? (
                                    <FaKey className="text-2xl text-indigo-300" />
                                ) : (
                                    <FaTicketAlt className="text-2xl text-white" />
                                )}
                            </div>
                        </div>

                        <h1 className="text-2xl font-extrabold tracking-tight">
                            EventAdda
                        </h1>

                        <p className="text-slate-300 text-sm mt-2">
                            {showOTP
                                ? 'Verify your account to continue'
                                : 'Your gateway to amazing college events'}
                        </p>

                    </div>


                    {/* FORM SECTION */}
                    <div className="p-7 sm:p-9">

                        {/* TITLE */}
                        <div className="text-center mb-7">

                            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                                {showOTP ? 'Verify OTP' : 'Welcome Back'}
                            </h2>

                            <p className="text-gray-500 text-sm mt-2">
                                {showOTP
                                    ? `Enter the verification code sent to ${email}`
                                    : 'Sign in to manage your college event bookings'}
                            </p>

                        </div>


                        {/* ERROR MESSAGE */}
                        {error && (
                            <div className="bg-red-50 text-red-600 p-3.5 rounded-xl mb-6 text-sm text-center border border-red-100 animate-[shake_0.3s_ease-in-out]">
                                {error}
                            </div>
                        )}


                        {/* FORM */}
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >

                            {!showOTP ? (
                                <>

                                    {/* EMAIL */}
                                    <div className="group">

                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Email Address
                                        </label>

                                        <div className="relative">

                                            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />

                                            <input
                                                type="email"
                                                required
                                                placeholder="Enter your email"
                                                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 outline-none transition-all duration-300 shadow-sm"
                                                value={email}
                                                onChange={(e) =>
                                                    setEmail(e.target.value)
                                                }
                                            />

                                        </div>

                                    </div>


                                    {/* PASSWORD */}
                                    <div className="group">

                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Password
                                        </label>

                                        <div className="relative">

                                            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />

                                            <input
                                                type={
                                                    showPassword
                                                        ? 'text'
                                                        : 'password'
                                                }
                                                required
                                                placeholder="Enter your password"
                                                className="w-full pl-11 pr-12 py-3.5 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 outline-none transition-all duration-300 shadow-sm"
                                                value={password}
                                                onChange={(e) =>
                                                    setPassword(e.target.value)
                                                }
                                            />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword
                                                    )
                                                }
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors"
                                            >
                                                {showPassword ? (
                                                    <FaEyeSlash />
                                                ) : (
                                                    <FaEye />
                                                )}
                                            </button>

                                        </div>

                                    </div>

                                </>
                            ) : (

                                /* OTP */
                                <div>

                                    <label className="block text-sm font-semibold text-gray-700 mb-3 text-center">
                                        Verification Code
                                    </label>

                                    <div className="relative">

                                        <FaShieldAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500" />

                                        <input
                                            type="text"
                                            required
                                            inputMode="numeric"
                                            placeholder="Enter 6-digit OTP"
                                            className="w-full pl-11 pr-4 py-4 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 outline-none transition-all duration-300 shadow-sm text-center text-xl font-bold tracking-[0.5em]"
                                            value={otp}
                                            onChange={(e) =>
                                                setOtp(
                                                    e.target.value
                                                        .replace(/\D/g, '')
                                                        .slice(0, 6)
                                                )
                                            }
                                            maxLength="6"
                                        />

                                    </div>

                                    <p className="text-xs text-gray-500 text-center mt-3">
                                        Please enter the OTP sent to your
                                        registered email address.
                                    </p>

                                </div>
                            )}


                            {/* SUBMIT BUTTON */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="group w-full bg-gradient-to-r from-slate-900 to-indigo-700 text-white font-bold py-3.5 rounded-xl hover:from-indigo-700 hover:to-slate-900 focus:ring-4 focus:ring-indigo-200 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
                            >

                                {loading ? (
                                    <>
                                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        {showOTP
                                            ? 'Verify OTP & Log In'
                                            : 'Sign In'}

                                        <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                                    </>
                                )}

                            </button>

                        </form>


                        {/* REGISTER */}
                        {!showOTP && (
                            <p className="text-center mt-7 text-gray-600 text-sm">

                                Don't have an account?{' '}

                                <Link
                                    to="/register"
                                    className="text-indigo-600 font-bold hover:text-indigo-800 hover:underline transition-colors"
                                >
                                    Create Account
                                </Link>

                            </p>
                        )}


                        {/* SECURITY INFO */}
                        <div className="mt-7 pt-5 border-t border-gray-100">

                            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">

                                <FaShieldAlt className="text-green-500" />

                                <span>
                                    Secure & verified college event booking
                                </span>

                            </div>

                        </div>

                    </div>

                </div>


                {/* FOOTER */}
                <p className="text-center text-white/70 text-xs mt-5">
                    © {new Date().getFullYear()} EventAdda • College Event
                    Management Platform
                </p>

            </div>

        </div>
    );
};

export default Login;
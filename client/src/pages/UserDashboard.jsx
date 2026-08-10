import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/axios';
import { Link, useNavigate } from 'react-router-dom';

import {
    FaTicketAlt,
    FaTimesCircle,
    FaCalendarAlt,
    FaMapMarkerAlt,
    FaCheckCircle,
    FaClock,
    FaCreditCard,
    FaArrowRight,
    FaUserCircle,
    FaShieldAlt
} from 'react-icons/fa';

const UserDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        fetchBookings();
    }, [user, navigate]);

    const fetchBookings = async () => {
        try {
            const { data } = await api.get('/bookings/my');
            setBookings(data);
        } catch (error) {
            console.error('Error fetching bookings', error);
        } finally {
            setLoading(false);
        }
    };

    const cancelBooking = async (id) => {
        if (
            window.confirm(
                'Are you sure you want to cancel this booking request?'
            )
        ) {
            try {
                await api.delete(`/bookings/${id}`);
                fetchBookings();
            } catch (error) {
                alert(
                    error.response?.data?.message ||
                        'Error cancelling booking'
                );
            }
        }
    };

    /* ---------------- LOADING ---------------- */

    if (loading) {
        return (
            <div
                className="min-h-screen flex items-center justify-center bg-cover bg-center bg-fixed relative px-4"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(15, 23, 42, 0.78), rgba(15, 23, 42, 0.78)), url('/college-bg.jpeg')"
                }}
            >
                <div className="text-center text-white">

                    <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-xl">
                        <FaTicketAlt className="text-2xl animate-pulse" />
                    </div>

                    <div className="flex justify-center mb-4">
                        <span className="w-7 h-7 border-4 border-white/30 border-t-white rounded-full animate-spin"></span>
                    </div>

                    <h2 className="text-xl font-bold">
                        Loading your dashboard...
                    </h2>

                    <p className="text-white/60 text-sm mt-2">
                        Fetching your event bookings
                    </p>

                </div>
            </div>
        );
    }

    /* ---------------- MAIN UI ---------------- */

    return (
        <div
            className="min-h-screen bg-cover bg-center bg-fixed relative px-4 py-8 sm:py-12"
            style={{
                backgroundImage:
                    "linear-gradient(rgba(15, 23, 42, 0.78), rgba(15, 23, 42, 0.78)), url('/college-bg.jpeg')"
            }}
        >

            {/* Decorative Background */}

            <div className="absolute top-20 left-5 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>

            <div className="absolute bottom-20 right-5 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>


            <div className="relative max-w-6xl mx-auto">

                {/* ================= HEADER ================= */}

                <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-6 sm:p-8 mb-8 transition-all duration-500 hover:shadow-indigo-500/10">

                    <div className="flex flex-col sm:flex-row items-center sm:items-center gap-6">

                        {/* Avatar */}

                        <div className="relative group">

                            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-slate-900 to-indigo-700 text-white flex items-center justify-center text-4xl font-black uppercase shadow-xl transition-all duration-300 group-hover:scale-105 group-hover:rotate-2">

                                {user?.name?.charAt(0)}

                            </div>

                            {/* Online Indicator */}

                            <span className="absolute -right-1 -bottom-1 w-7 h-7 bg-green-500 border-4 border-white rounded-full flex items-center justify-center">

                                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>

                            </span>

                        </div>


                        {/* User Info */}

                        <div className="flex-1 text-center sm:text-left">

                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">

                                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">

                                    Welcome, {user?.name}!

                                </h1>

                            </div>

                            <p className="text-gray-500 mt-2 flex items-center justify-center sm:justify-start gap-2">

                                <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>

                                Student Dashboard

                            </p>

                            <p className="text-gray-400 text-sm mt-1">
                                Manage your college event bookings and tickets
                            </p>

                        </div>


                        {/* Profile Icon */}

                        <div className="hidden sm:flex w-14 h-14 rounded-2xl bg-gray-100 items-center justify-center text-gray-500 text-2xl transition-all duration-300 hover:bg-indigo-50 hover:text-indigo-600 hover:scale-110">

                            <FaUserCircle />

                        </div>

                    </div>

                </div>


                {/* ================= STATS ================= */}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">

                    {/* Total */}

                    <div className="group bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-lg border border-white/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-gray-500 text-sm font-medium">
                                    Total Bookings
                                </p>

                                <h3 className="text-3xl font-black text-slate-900 mt-1">
                                    {bookings.length}
                                </h3>

                            </div>

                            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">

                                <FaTicketAlt />

                            </div>

                        </div>

                    </div>


                    {/* Confirmed */}

                    <div className="group bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-lg border border-white/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-gray-500 text-sm font-medium">
                                    Confirmed
                                </p>

                                <h3 className="text-3xl font-black text-green-600 mt-1">
                                    {
                                        bookings.filter(
                                            (booking) =>
                                                booking.status === 'confirmed'
                                        ).length
                                    }
                                </h3>

                            </div>

                            <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center text-xl transition-transform duration-300 group-hover:scale-110">

                                <FaCheckCircle />

                            </div>

                        </div>

                    </div>


                    {/* Pending */}

                    <div className="group bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-lg border border-white/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-gray-500 text-sm font-medium">
                                    Pending
                                </p>

                                <h3 className="text-3xl font-black text-yellow-600 mt-1">
                                    {
                                        bookings.filter(
                                            (booking) =>
                                                booking.status !== 'confirmed' &&
                                                booking.status !== 'cancelled'
                                        ).length
                                    }
                                </h3>

                            </div>

                            <div className="w-12 h-12 rounded-xl bg-yellow-100 text-yellow-600 flex items-center justify-center text-xl transition-transform duration-300 group-hover:scale-110">

                                <FaClock />

                            </div>

                        </div>

                    </div>

                </div>


                {/* ================= TITLE ================= */}

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">

                    <div>

                        <h2 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">

                            <span className="w-11 h-11 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">

                                <FaTicketAlt className="text-indigo-300 text-lg" />

                            </span>

                            My Bookings

                        </h2>

                        <p className="text-white/60 text-sm mt-2 ml-1">
                            Track and manage your registered college events
                        </p>

                    </div>

                    <Link
                        to="/"
                        className="group self-start sm:self-auto inline-flex items-center gap-2 bg-white/10 hover:bg-white text-white hover:text-slate-900 border border-white/20 px-5 py-2.5 rounded-xl font-semibold transition-all duration-300"
                    >
                        Browse Events
                        <FaArrowRight className="text-sm transition-transform group-hover:translate-x-1" />
                    </Link>

                </div>


                {/* ================= EMPTY STATE ================= */}

                {bookings.length === 0 ? (

                    <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-10 sm:p-16 text-center border border-white/30">

                        <div className="w-24 h-24 bg-gradient-to-br from-indigo-50 to-blue-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">

                            <FaTicketAlt className="text-indigo-400 text-4xl animate-pulse" />

                        </div>

                        <h3 className="text-2xl font-extrabold text-slate-900 mb-3">
                            No Bookings Yet
                        </h3>

                        <p className="text-gray-500 max-w-md mx-auto mb-7 leading-relaxed">
                            You haven't registered for any college events yet.
                            Explore upcoming events and reserve your seat today.
                        </p>

                        <Link
                            to="/"
                            className="group inline-flex items-center gap-3 bg-gradient-to-r from-slate-900 to-indigo-700 hover:from-indigo-700 hover:to-slate-900 text-white font-bold py-3.5 px-7 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        >
                            Explore Events

                            <FaArrowRight className="transition-transform group-hover:translate-x-1" />

                        </Link>

                    </div>

                ) : (

                    /* ================= BOOKINGS GRID ================= */

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                        {bookings.map((booking) => (

                            <div
                                key={booking._id}
                                className="group bg-white/95 backdrop-blur-xl rounded-2xl overflow-hidden shadow-lg border border-white/40 flex flex-col transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                            >

                                {booking.eventId ? (

                                    <>

                                        {/* CARD TOP */}

                                        <div className="relative h-2 bg-gradient-to-r from-slate-900 via-indigo-600 to-blue-500"></div>


                                        {/* CONTENT */}

                                        <div className="p-6 flex-grow">

                                            {/* Event Title + Status */}

                                            <div className="flex justify-between items-start gap-3 mb-5">

                                                <h3 className="text-lg font-extrabold text-slate-900 leading-tight group-hover:text-indigo-700 transition-colors duration-300">

                                                    {booking.eventId.title}

                                                </h3>


                                                <span
                                                    className={`shrink-0 px-2.5 py-1.5 text-[10px] font-black rounded-lg uppercase tracking-wider ${
                                                        booking.status ===
                                                        'confirmed'
                                                            ? 'bg-green-100 text-green-700'
                                                            : booking.status ===
                                                              'cancelled'
                                                            ? 'bg-red-100 text-red-700'
                                                            : 'bg-yellow-100 text-yellow-700'
                                                    }`}
                                                >

                                                    {booking.status}

                                                </span>

                                            </div>


                                            {/* Event Details */}

                                            <div className="space-y-3 text-sm">

                                                <div className="flex items-center gap-3 text-gray-600">

                                                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">

                                                        <FaCalendarAlt />

                                                    </div>

                                                    <div>

                                                        <p className="text-[11px] text-gray-400 uppercase font-bold tracking-wide">
                                                            Event Date
                                                        </p>

                                                        <p className="font-semibold text-gray-700">
                                                            {new Date(
                                                                booking.eventId.date
                                                            ).toLocaleDateString(
                                                                undefined,
                                                                {
                                                                    day: 'numeric',
                                                                    month: 'short',
                                                                    year: 'numeric'
                                                                }
                                                            )}
                                                        </p>

                                                    </div>

                                                </div>


                                                {/* Location */}

                                                <div className="flex items-center gap-3 text-gray-600">

                                                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">

                                                        <FaMapMarkerAlt />

                                                    </div>

                                                    <div>

                                                        <p className="text-[11px] text-gray-400 uppercase font-bold tracking-wide">
                                                            Location
                                                        </p>

                                                        <p className="font-semibold text-gray-700">
                                                            {booking.eventId.location ||
                                                                'College Campus'}
                                                        </p>

                                                    </div>

                                                </div>


                                                {/* Amount */}

                                                <div className="flex items-center gap-3 text-gray-600">

                                                    <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">

                                                        <FaCreditCard />

                                                    </div>

                                                    <div>

                                                        <p className="text-[11px] text-gray-400 uppercase font-bold tracking-wide">
                                                            Amount
                                                        </p>

                                                        <p className="font-bold text-gray-800">

                                                            {booking.amount === 0
                                                                ? 'FREE'
                                                                : `₹${booking.amount}`}

                                                        </p>

                                                    </div>

                                                </div>


                                                {/* Requested */}

                                                <div className="flex items-center gap-3 text-gray-600">

                                                    <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center shrink-0">

                                                        <FaClock />

                                                    </div>

                                                    <div>

                                                        <p className="text-[11px] text-gray-400 uppercase font-bold tracking-wide">
                                                            Requested
                                                        </p>

                                                        <p className="font-semibold text-gray-700">
                                                            {new Date(
                                                                booking.bookedAt
                                                            ).toLocaleDateString()}
                                                        </p>

                                                    </div>

                                                </div>

                                            </div>


                                            {/* Payment Status */}

                                            {booking.status !== 'cancelled' && (

                                                <div className="mt-5 pt-4 border-t border-gray-100">

                                                    <div className="flex items-center justify-between">

                                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                                                            Payment
                                                        </span>

                                                        <span
                                                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                                                booking.paymentStatus ===
                                                                'paid'
                                                                    ? 'bg-blue-100 text-blue-700'
                                                                    : 'bg-gray-100 text-gray-600'
                                                            }`}
                                                        >

                                                            {booking.paymentStatus
                                                                ? booking.paymentStatus.replace(
                                                                      '_',
                                                                      ' '
                                                                  )
                                                                : 'Pending'}

                                                        </span>

                                                    </div>

                                                </div>

                                            )}

                                        </div>


                                        {/* ================= FOOTER ================= */}

                                        <div className="p-4 bg-gray-50/90 border-t border-gray-100 flex items-center justify-between">

                                            {booking.status !== 'cancelled' ? (

                                                <>

                                                    <Link
                                                        to={`/events/${booking.eventId._id}`}
                                                        className="group/link inline-flex items-center gap-2 text-indigo-600 font-bold text-sm hover:text-indigo-800 transition-colors"
                                                    >

                                                        View Event

                                                        <FaArrowRight className="text-xs transition-transform group-hover/link:translate-x-1" />

                                                    </Link>


                                                    <button
                                                        onClick={() =>
                                                            cancelBooking(
                                                                booking._id
                                                            )
                                                        }
                                                        className="group/cancel inline-flex items-center gap-1.5 text-red-500 font-semibold text-sm hover:text-red-700 transition-all duration-300 hover:scale-105"
                                                    >

                                                        <FaTimesCircle className="transition-transform duration-300 group-hover/cancel:rotate-90" />

                                                        Cancel

                                                    </button>

                                                </>

                                            ) : (

                                                <div className="w-full text-center">

                                                    <span className="inline-flex items-center gap-2 text-sm text-red-500 font-semibold">

                                                        <FaTimesCircle />

                                                        Booking Cancelled

                                                    </span>

                                                </div>

                                            )}

                                        </div>

                                    </>

                                ) : (

                                    <div className="p-8 text-center">

                                        <FaTimesCircle className="text-red-400 text-3xl mx-auto mb-3" />

                                        <p className="text-red-500 italic text-sm">
                                            Event details unavailable
                                        </p>

                                        <p className="text-gray-400 text-xs mt-1">
                                            This event might have been deleted.
                                        </p>

                                    </div>

                                )}

                            </div>

                        ))}

                    </div>

                )}


                {/* ================= SECURITY FOOTER ================= */}

                <div className="mt-10 text-center">

                    <div className="inline-flex items-center gap-2 text-white/60 text-xs bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full">

                        <FaShieldAlt className="text-green-400" />

                        Secure & verified college event booking platform

                    </div>

                </div>

            </div>

        </div>
    );
};

export default UserDashboard;
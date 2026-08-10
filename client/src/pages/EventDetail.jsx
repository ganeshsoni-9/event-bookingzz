import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import { AuthContext } from '../context/AuthContext';

import {
    FaCalendarAlt,
    FaMapMarkerAlt,
    FaChair,
    FaMoneyBillWave,
    FaTicketAlt,
    FaArrowLeft,
    FaCheckCircle,
    FaShieldAlt,
    FaClock,
    FaUsers
} from 'react-icons/fa';

const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [otp, setOtp] = useState('');
    const [showOTP, setShowOTP] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const { data } = await api.get(`/events/${id}`);
                setEvent(data);
            } catch (err) {
                setError('Failed to load event details.');
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id]);

    // ---------------- BOOKING ----------------
    const handleBooking = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        setBookingLoading(true);
        setError('');
        setSuccessMsg('');

        try {
            // STEP 1 - SEND OTP
            if (!showOTP) {
                await api.post('/bookings/send-otp');

                setShowOTP(true);

                setSuccessMsg(
                    'OTP sent to your email. Please verify to confirm your booking.'
                );
            }

            // STEP 2 - VERIFY OTP
            else {
                await api.post('/bookings', {
                    eventId: event._id,
                    otp,
                    seats: 1
                });

                setSuccessMsg(
                    'Booking requested successfully! Awaiting admin confirmation.'
                );

                setShowOTP(false);
                setOtp('');

                setEvent(prev => ({
                    ...prev,
                    availableSeats: prev.availableSeats - 1
                }));
            }
        } catch (err) {
            setError(
                err.response?.data?.message || 'Booking failed. Please try again.'
            );
        } finally {
            setBookingLoading(false);
        }
    };

    // ---------------- LOADING ----------------
    if (loading) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <div className="text-center animate-pulse">
                    <div className="w-16 h-16 mx-auto mb-5 rounded-full border-4 border-gray-200 border-t-gray-900 animate-spin"></div>

                    <p className="text-lg font-bold text-gray-700">
                        Loading event...
                    </p>

                    <p className="text-sm text-gray-400 mt-1">
                        Please wait
                    </p>
                </div>
            </div>
        );
    }

    // ---------------- ERROR ----------------
    if (error && !event) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center px-4">
                <div className="bg-white rounded-3xl shadow-xl border border-red-100 p-10 text-center max-w-md">
                    <div className="w-16 h-16 mx-auto bg-red-100 text-red-500 rounded-full flex items-center justify-center text-2xl mb-5">
                        ✕
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Event Not Found
                    </h2>

                    <p className="text-gray-500 mb-6">
                        {error || 'Unable to load event details.'}
                    </p>

                    <button
                        onClick={() => navigate('/')}
                        className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition"
                    >
                        Back to Events
                    </button>
                </div>
            </div>
        );
    }

    const isSoldOut = event.availableSeats <= 0;

    const bookedSeats =
        event.totalSeats - event.availableSeats;

    const availabilityPercentage =
        (event.availableSeats / event.totalSeats) * 100;

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

            {/* BACK BUTTON */}
            <button
                onClick={() => navigate(-1)}
                className="
                    group
                    flex items-center gap-2
                    text-gray-600
                    hover:text-gray-900
                    font-semibold
                    mb-6
                    transition-all duration-300
                "
            >
                <span className="
                    w-9 h-9
                    rounded-full
                    bg-white
                    shadow-sm
                    border
                    flex items-center justify-center
                    group-hover:-translate-x-1
                    transition-transform
                ">
                    <FaArrowLeft />
                </span>

                Back to Events
            </button>

            {/* MAIN CARD */}
            <div className="
                bg-white
                rounded-[2rem]
                overflow-hidden
                shadow-xl
                border border-gray-100
                animate-[fadeIn_0.7s_ease-out]
            ">

                {/* ================= IMAGE ================= */}
                <div className="relative h-[260px] sm:h-[380px] lg:h-[450px] overflow-hidden">

                    {event.imageUrl || event.image ? (
                        <img
                            src={event.imageUrl || event.image}
                            alt={event.title}
                            className="
                                w-full h-full object-cover
                                transition-transform duration-[1500ms]
                                hover:scale-105
                            "
                        />
                    ) : (
                        <div className="
                            w-full h-full
                            bg-gradient-to-br from-gray-900 to-gray-700
                            flex items-center justify-center
                            text-white
                        ">
                            <FaTicketAlt className="text-7xl opacity-30" />
                        </div>
                    )}

                    {/* DARK OVERLAY */}
                    <div className="
                        absolute inset-0
                        bg-gradient-to-t
                        from-black/80
                        via-black/20
                        to-transparent
                    "></div>

                    {/* CATEGORY */}
                    <div className="
                        absolute top-6 left-6
                        bg-white/90 backdrop-blur-md
                        text-gray-900
                        px-4 py-2
                        rounded-full
                        text-xs
                        font-black
                        uppercase
                        tracking-widest
                        shadow-lg
                    ">
                        {event.category}
                    </div>

                    {/* PRICE */}
                    <div className="
                        absolute top-6 right-6
                        bg-black/70
                        backdrop-blur-md
                        text-white
                        px-5 py-3
                        rounded-2xl
                        shadow-lg
                    ">
                        <p className="text-[10px] uppercase tracking-widest text-gray-300">
                            Ticket
                        </p>

                        <p className="text-xl font-black">
                            {event.ticketPrice === 0
                                ? 'FREE'
                                : `₹${event.ticketPrice}`}
                        </p>
                    </div>

                    {/* IMAGE TITLE */}
                    <div className="
                        absolute bottom-0 left-0 right-0
                        p-6 sm:p-10
                    ">
                        <h1 className="
                            text-3xl sm:text-4xl lg:text-5xl
                            font-black
                            text-white
                            leading-tight
                            max-w-4xl
                            drop-shadow-lg
                        ">
                            {event.title}
                        </h1>
                    </div>
                </div>

                {/* ================= CONTENT ================= */}
                <div className="p-6 sm:p-8 lg:p-10">

                    <div className="
                        grid
                        grid-cols-1
                        lg:grid-cols-3
                        gap-8
                    ">

                        {/* ================= LEFT ================= */}
                        <div className="lg:col-span-2">

                            <div className="mb-8">

                                <span className="
                                    inline-flex
                                    items-center gap-2
                                    text-xs
                                    font-black
                                    uppercase
                                    tracking-widest
                                    text-gray-500
                                    mb-3
                                ">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                    College Event
                                </span>

                                <h2 className="
                                    text-2xl sm:text-3xl
                                    font-black
                                    text-gray-900
                                    mb-4
                                ">
                                    About This Event
                                </h2>

                                <p className="
                                    text-gray-600
                                    text-base sm:text-lg
                                    leading-relaxed
                                ">
                                    {event.description}
                                </p>
                            </div>

                            {/* EVENT INFORMATION */}
                            <div className="
                                grid
                                grid-cols-1
                                sm:grid-cols-2
                                gap-4
                                mb-8
                            ">

                                {/* DATE */}
                                <div className="
                                    group
                                    p-5
                                    rounded-2xl
                                    bg-gray-50
                                    border border-gray-100
                                    hover:bg-gray-900
                                    hover:text-white
                                    transition-all duration-300
                                ">
                                    <div className="flex items-start gap-4">

                                        <div className="
                                            w-12 h-12
                                            rounded-xl
                                            bg-white
                                            text-gray-900
                                            shadow-sm
                                            flex items-center justify-center
                                            group-hover:scale-110
                                            transition-transform
                                        ">
                                            <FaCalendarAlt />
                                        </div>

                                        <div>
                                            <p className="
                                                text-xs
                                                uppercase
                                                tracking-widest
                                                font-bold
                                                text-gray-400
                                            ">
                                                Date
                                            </p>

                                            <p className="font-bold mt-1">
                                                {new Date(event.date).toLocaleDateString(
                                                    'en-IN',
                                                    {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric'
                                                    }
                                                )}
                                            </p>
                                        </div>

                                    </div>
                                </div>

                                {/* LOCATION */}
                                <div className="
                                    group
                                    p-5
                                    rounded-2xl
                                    bg-gray-50
                                    border border-gray-100
                                    hover:bg-gray-900
                                    hover:text-white
                                    transition-all duration-300
                                ">
                                    <div className="flex items-start gap-4">

                                        <div className="
                                            w-12 h-12
                                            rounded-xl
                                            bg-white
                                            text-gray-900
                                            shadow-sm
                                            flex items-center justify-center
                                            group-hover:scale-110
                                            transition-transform
                                        ">
                                            <FaMapMarkerAlt />
                                        </div>

                                        <div>
                                            <p className="
                                                text-xs
                                                uppercase
                                                tracking-widest
                                                font-bold
                                                text-gray-400
                                            ">
                                                Location
                                            </p>

                                            <p className="font-bold mt-1 leading-relaxed">
                                                {event.location}
                                            </p>
                                        </div>

                                    </div>
                                </div>

                                {/* SEATS */}
                                <div className="
                                    group
                                    p-5
                                    rounded-2xl
                                    bg-gray-50
                                    border border-gray-100
                                    hover:bg-gray-900
                                    hover:text-white
                                    transition-all duration-300
                                ">
                                    <div className="flex items-start gap-4">

                                        <div className="
                                            w-12 h-12
                                            rounded-xl
                                            bg-white
                                            text-gray-900
                                            shadow-sm
                                            flex items-center justify-center
                                            group-hover:scale-110
                                            transition-transform
                                        ">
                                            <FaUsers />
                                        </div>

                                        <div>
                                            <p className="
                                                text-xs
                                                uppercase
                                                tracking-widest
                                                font-bold
                                                text-gray-400
                                            ">
                                                Availability
                                            </p>

                                            <p className="font-bold mt-1">
                                                {event.availableSeats} seats left
                                            </p>
                                        </div>

                                    </div>
                                </div>

                                {/* PRICE */}
                                <div className="
                                    group
                                    p-5
                                    rounded-2xl
                                    bg-gray-50
                                    border border-gray-100
                                    hover:bg-gray-900
                                    hover:text-white
                                    transition-all duration-300
                                ">
                                    <div className="flex items-start gap-4">

                                        <div className="
                                            w-12 h-12
                                            rounded-xl
                                            bg-white
                                            text-gray-900
                                            shadow-sm
                                            flex items-center justify-center
                                            group-hover:scale-110
                                            transition-transform
                                        ">
                                            <FaMoneyBillWave />
                                        </div>

                                        <div>
                                            <p className="
                                                text-xs
                                                uppercase
                                                tracking-widest
                                                font-bold
                                                text-gray-400
                                            ">
                                                Ticket Price
                                            </p>

                                            <p className="font-bold mt-1">
                                                {event.ticketPrice === 0
                                                    ? 'Free'
                                                    : `₹${event.ticketPrice}`}
                                            </p>
                                        </div>

                                    </div>
                                </div>

                            </div>

                            {/* SEAT PROGRESS */}
                            <div className="
                                bg-gray-50
                                rounded-2xl
                                p-6
                                border border-gray-100
                            ">

                                <div className="flex justify-between items-center mb-3">

                                    <div className="flex items-center gap-2">
                                        <FaChair className="text-gray-700" />

                                        <span className="font-bold text-gray-800">
                                            Seat Availability
                                        </span>
                                    </div>

                                    <span className="
                                        text-sm
                                        font-black
                                        text-gray-700
                                    ">
                                        {event.availableSeats}/{event.totalSeats}
                                    </span>

                                </div>

                                <div className="
                                    h-3
                                    bg-gray-200
                                    rounded-full
                                    overflow-hidden
                                ">
                                    <div
                                        className={`
                                            h-full
                                            rounded-full
                                            transition-all duration-1000
                                            ${
                                                availabilityPercentage < 20
                                                    ? 'bg-red-500'
                                                    : availabilityPercentage < 50
                                                    ? 'bg-orange-500'
                                                    : 'bg-gray-900'
                                            }
                                        `}
                                        style={{
                                            width: `${availabilityPercentage}%`
                                        }}
                                    ></div>
                                </div>

                                <p className="text-xs text-gray-500 mt-3">
                                    {bookedSeats} seats already booked
                                </p>

                            </div>
                        </div>

                        {/* ================= BOOKING CARD ================= */}
                        <div className="
                            lg:sticky
                            lg:top-6
                            h-fit
                        ">

                            <div className="
                                relative
                                bg-gray-900
                                text-white
                                rounded-3xl
                                p-6 sm:p-7
                                shadow-2xl
                                overflow-hidden
                                border border-gray-800
                                animate-[slideUp_0.7s_ease-out]
                            ">

                                {/* DECORATION */}
                                <div className="
                                    absolute
                                    -top-20
                                    -right-20
                                    w-48 h-48
                                    bg-white/10
                                    rounded-full
                                "></div>

                                <div className="
                                    absolute
                                    -bottom-20
                                    -left-20
                                    w-48 h-48
                                    bg-white/5
                                    rounded-full
                                "></div>

                                <div className="relative z-10">

                                    {/* CARD HEADER */}
                                    <div className="flex items-center gap-3 mb-7">

                                        <div className="
                                            w-12 h-12
                                            rounded-2xl
                                            bg-white
                                            text-gray-900
                                            flex items-center justify-center
                                            text-xl
                                        ">
                                            <FaTicketAlt />
                                        </div>

                                        <div>
                                            <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">
                                                Eventora
                                            </p>

                                            <h3 className="text-xl font-black">
                                                Book Your Ticket
                                            </h3>
                                        </div>

                                    </div>

                                    {/* PRICE */}
                                    <div className="
                                        bg-white/10
                                        rounded-2xl
                                        p-5
                                        mb-6
                                        border border-white/10
                                    ">

                                        <p className="text-sm text-gray-400 mb-1">
                                            Ticket Price
                                        </p>

                                        <p className="text-3xl font-black">
                                            {event.ticketPrice === 0
                                                ? 'FREE'
                                                : `₹${event.ticketPrice}`}
                                        </p>

                                    </div>

                                    {/* QUICK DETAILS */}
                                    <div className="space-y-4 mb-7">

                                        <div className="flex items-center gap-3">
                                            <FaCalendarAlt className="text-gray-400" />
                                            <span className="text-sm">
                                                {new Date(event.date).toLocaleDateString()}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <FaClock className="text-gray-400" />
                                            <span className="text-sm">
                                                Registration Required
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <FaChair className="text-gray-400" />
                                            <span className="text-sm">
                                                {event.availableSeats} seats available
                                            </span>
                                        </div>

                                    </div>

                                    {/* OTP */}
                                    {showOTP && (
                                        <div className="
                                            mb-5
                                            p-4
                                            rounded-2xl
                                            bg-white/10
                                            border border-white/10
                                            animate-[slideUp_0.4s_ease-out]
                                        ">

                                            <div className="flex items-center gap-2 mb-3">

                                                <FaShieldAlt className="text-gray-300" />

                                                <label className="text-sm font-bold">
                                                    Email Verification
                                                </label>

                                            </div>

                                            <p className="
                                                text-xs
                                                text-gray-400
                                                mb-3
                                            ">
                                                Enter the 6-digit OTP sent to your email.
                                            </p>

                                            <input
                                                type="text"
                                                placeholder="• • • • • •"
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
                                                    px-4 py-4
                                                    rounded-xl
                                                    bg-white
                                                    text-gray-900
                                                    text-center
                                                    text-xl
                                                    font-black
                                                    tracking-[0.5em]
                                                    outline-none
                                                    focus:ring-4
                                                    focus:ring-white/20
                                                    transition
                                                "
                                            />
                                        </div>
                                    )}

                                    {/* BOOK BUTTON */}
                                    <button
                                        onClick={handleBooking}
                                        disabled={
                                            isSoldOut ||
                                            bookingLoading ||
                                            (showOTP && !otp)
                                        }
                                        className={`
                                            w-full
                                            py-4
                                            rounded-2xl
                                            font-black
                                            text-base
                                            flex
                                            items-center
                                            justify-center
                                            gap-3
                                            transition-all
                                            duration-300
                                            shadow-lg
                                            ${
                                                isSoldOut
                                                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                                    : 'bg-white text-gray-900 hover:bg-gray-100 hover:-translate-y-1 hover:shadow-xl active:scale-95'
                                            }
                                        `}
                                    >

                                        {bookingLoading ? (
                                            <>
                                                <span className="
                                                    w-5 h-5
                                                    border-2
                                                    border-gray-400
                                                    border-t-gray-900
                                                    rounded-full
                                                    animate-spin
                                                "></span>

                                                Processing...
                                            </>
                                        ) : showOTP ? (
                                            <>
                                                <FaCheckCircle />
                                                Verify OTP & Confirm
                                            </>
                                        ) : isSoldOut ? (
                                            'Sold Out'
                                        ) : (
                                            <>
                                                <FaTicketAlt />
                                                Confirm Registration
                                            </>
                                        )}

                                    </button>

                                    {/* ERROR */}
                                    {error && (
                                        <div className="
                                            mt-4
                                            bg-red-500/10
                                            border border-red-500/20
                                            text-red-300
                                            p-3
                                            rounded-xl
                                            text-sm
                                            text-center
                                            animate-[slideUp_0.3s_ease-out]
                                        ">
                                            {error}
                                        </div>
                                    )}

                                    {/* SUCCESS */}
                                    {successMsg && (
                                        <div className="
                                            mt-4
                                            bg-green-500/10
                                            border border-green-500/20
                                            text-green-300
                                            p-4
                                            rounded-xl
                                            text-sm
                                            text-center
                                            animate-[slideUp_0.3s_ease-out]
                                        ">

                                            <FaCheckCircle className="mx-auto text-xl mb-2" />

                                            {successMsg}
                                        </div>
                                    )}

                                    {/* SECURITY */}
                                    <div className="
                                        mt-6
                                        pt-5
                                        border-t border-white/10
                                        flex items-center
                                        gap-3
                                    ">

                                        <FaShieldAlt className="text-gray-400" />

                                        <p className="
                                            text-xs
                                            text-gray-400
                                            leading-relaxed
                                        ">
                                            Secure registration with email OTP
                                            verification.
                                        </p>

                                    </div>

                                </div>
                            </div>

                        </div>

                    </div>
                </div>

            </div>

            {/* BOTTOM TRUST SECTION */}
            <div className="
                grid
                grid-cols-1
                sm:grid-cols-3
                gap-4
                mt-6
            ">

                <div className="
                    bg-white
                    rounded-2xl
                    p-5
                    border border-gray-100
                    shadow-sm
                    flex items-center gap-4
                    hover:-translate-y-1
                    transition-all duration-300
                ">
                    <div className="
                        w-11 h-11
                        bg-gray-100
                        rounded-xl
                        flex items-center justify-center
                    ">
                        <FaShieldAlt />
                    </div>

                    <div>
                        <p className="font-bold text-gray-900">
                            Secure Booking
                        </p>
                        <p className="text-xs text-gray-500">
                            OTP verified
                        </p>
                    </div>
                </div>

                <div className="
                    bg-white
                    rounded-2xl
                    p-5
                    border border-gray-100
                    shadow-sm
                    flex items-center gap-4
                    hover:-translate-y-1
                    transition-all duration-300
                ">
                    <div className="
                        w-11 h-11
                        bg-gray-100
                        rounded-xl
                        flex items-center justify-center
                    ">
                        <FaTicketAlt />
                    </div>

                    <div>
                        <p className="font-bold text-gray-900">
                            Easy Registration
                        </p>
                        <p className="text-xs text-gray-500">
                            Quick & simple
                        </p>
                    </div>
                </div>

                <div className="
                    bg-white
                    rounded-2xl
                    p-5
                    border border-gray-100
                    shadow-sm
                    flex items-center gap-4
                    hover:-translate-y-1
                    transition-all duration-300
                ">
                    <div className="
                        w-11 h-11
                        bg-gray-100
                        rounded-xl
                        flex items-center justify-center
                    ">
                        <FaUsers />
                    </div>

                    <div>
                        <p className="font-bold text-gray-900">
                            Limited Seats
                        </p>
                        <p className="text-xs text-gray-500">
                            Book early
                        </p>
                    </div>
                </div>

            </div>

        </div>
    );
};

export default EventDetail;
import React from 'react';
import {
    FaCheckCircle,
    FaCalendarAlt,
    FaMapMarkerAlt,
    FaChair,
    FaReceipt,
    FaUser
} from 'react-icons/fa';

// Pass a booking object (from GET /bookings/my, with eventId populated)
// and the logged-in user's name.
// Usage: <TicketCard booking={booking} userName={user.name} />

const TicketCard = ({ booking, userName }) => {
    if (!booking || booking.status !== 'confirmed') return null;

    const event = booking.eventId;

    return (
        <div className="
            relative
            bg-gray-900
            text-white
            rounded-3xl
            overflow-hidden
            shadow-xl
            border border-gray-800
            max-w-md
        ">

            {/* SUCCESS HEADER */}
            <div className="
                bg-gradient-to-r from-emerald-600 to-emerald-500
                px-6 py-4
                flex items-center gap-3
            ">
                <FaCheckCircle className="text-2xl" />
                <div>
                    <p className="text-xs uppercase tracking-widest opacity-90">
                        Eventora
                    </p>
                    <p className="font-black">Payment Successful</p>
                </div>
            </div>

            <div className="p-6">

                {/* USER NAME */}
                <div className="flex items-center gap-3 mb-5 pb-5 border-b border-white/10">
                    <div className="
                        w-11 h-11
                        rounded-full
                        bg-white/10
                        flex items-center justify-center
                    ">
                        <FaUser className="text-gray-300" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-widest">
                            Ticket Holder
                        </p>
                        <p className="font-black text-lg">
                            {userName}
                        </p>
                    </div>
                </div>

                {/* EVENT TITLE */}
                <h2 className="text-xl font-black mb-4">
                    {event?.title || 'Event'}
                </h2>

                {/* DETAILS */}
                <div className="space-y-3 mb-5">
                    <div className="flex items-center gap-3 text-sm">
                        <FaCalendarAlt className="text-gray-400 shrink-0" />
                        <span>
                            {event?.date
                                ? new Date(event.date).toLocaleDateString('en-IN', {
                                      day: 'numeric', month: 'long', year: 'numeric'
                                  })
                                : '—'}
                        </span>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                        <FaMapMarkerAlt className="text-gray-400 shrink-0" />
                        <span>{event?.location || '—'}</span>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                        <FaChair className="text-gray-400 shrink-0" />
                        <span>{booking.seats} Seat(s)</span>
                    </div>
                </div>

                {/* PAYMENT INFO */}
                <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
                    <div className="flex items-center gap-2 mb-3">
                        <FaReceipt className="text-gray-300" />
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-300">
                            Payment Details
                        </span>
                    </div>

                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-400">Amount Paid</span>
                            <span className="font-black text-emerald-400">₹{booking.amount}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">UTR / Transaction ID</span>
                            <span className="font-bold font-mono text-xs">
                                {booking.transactionId || 'N/A'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Status</span>
                            <span className="font-black text-emerald-400 uppercase text-xs">
                                Confirmed
                            </span>
                        </div>
                    </div>
                </div>

                {/* BOOKING ID */}
                <p className="text-[10px] text-gray-500 font-mono text-center mt-4">
                    Booking ID: {booking._id}
                </p>

            </div>
        </div>
    );
};

export default TicketCard;

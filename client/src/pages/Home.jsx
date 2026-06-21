import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';
import { FaCalendarAlt, FaMapMarkerAlt, FaSearch, FaRegClock, FaTicketAlt, FaShieldAlt } from 'react-icons/fa';

const Home = () => {
    const [events, setEvents] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchEvents();
        }, 400);
        return () => clearTimeout(timeoutId);
    }, [search]);

    const fetchEvents = async () => {
        try {
            const { data } = await api.get(`/events?search=${search}`);
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">

            {/* HERO SECTION */}
            <div className="relative bg-black text-white rounded-3xl overflow-hidden mb-12 shadow-2xl">

                <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=3000&auto=format&fit=crop')] bg-cover bg-center"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>

                <div className="relative p-6 sm:p-10 md:p-20 text-center flex flex-col items-center z-10">

                    <span className="bg-white/20 text-white backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6 border border-white/20">
                        Welcome to Eventora
                    </span>

                    <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black mb-6 leading-tight tracking-tight drop-shadow-lg">
                        Find Your Next <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500">
                            Unforgettable
                        </span> Experience
                    </h1>

                    <p className="text-gray-300 text-base sm:text-lg md:text-xl mb-10 max-w-2xl mx-auto font-light leading-relaxed">
                        Discover the best tech conferences, late-night music festivals, and hands-on workshops happening directly in your area. Secure your spot today.
                    </p>

                    <div className="w-full max-w-2xl mx-auto relative flex items-center shadow-2xl group">
                        <FaSearch className="absolute left-6 text-gray-500 text-xl group-focus-within:text-black transition-colors" />

                        <input
                            type="text"
                            placeholder="Search events by title..."
                            className="w-full pl-16 pr-6 py-5 rounded-full text-lg text-black bg-white/95 backdrop-blur-sm border-2 border-transparent focus:border-gray-500 focus:outline-none transition-all placeholder-gray-400 font-medium"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                </div>
            </div>

            {/* FEATURES */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 px-4">

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:-translate-y-1 transition">
                    <div className="w-16 h-16 bg-gray-900 text-white rounded-2xl flex items-center justify-center text-2xl mb-6">
                        <FaRegClock />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Fast Booking</h3>
                    <p className="text-gray-500 text-sm">Secure your tickets instantly.</p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:-translate-y-1 transition">
                    <div className="w-16 h-16 bg-gray-900 text-white rounded-2xl flex items-center justify-center text-2xl mb-6">
                        <FaTicketAlt />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Seamless Access</h3>
                    <p className="text-gray-500 text-sm">Manage tickets easily.</p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:-translate-y-1 transition">
                    <div className="w-16 h-16 bg-gray-900 text-white rounded-2xl flex items-center justify-center text-2xl mb-6">
                        <FaShieldAlt />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Secure Platform</h3>
                    <p className="text-gray-500 text-sm">Safe & verified bookings.</p>
                </div>

            </div>

            {/* HEADER */}
            <div className="flex items-center justify-between mb-8 px-2 border-b border-gray-200 pb-4">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                    Upcoming Events
                </h2>
                <div className="text-gray-500 font-medium">
                    {events.length} results
                </div>
            </div>

            {/* EVENTS */}
            {loading ? (
                <div className="text-center py-20 text-xl font-semibold text-gray-600">
                    Loading events...
                </div>
            ) : events.length === 0 ? (
                <div className="text-center py-20 text-xl text-gray-500">
                    No events found
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

                    {events.map(event => (
                        <div key={event._id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition flex flex-col">

                            <div className="h-40 sm:h-48 bg-gray-200 overflow-hidden relative">

                                {/* ✅ FINAL IMAGE FIX */}
                                {event.imageUrl ? (
                                    <img
                                        src={event.imageUrl}
                                        alt={event.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-600 font-bold text-2xl">
                                        {event.category}
                                    </div>
                                )}

                                <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full text-sm font-bold">
                                    {event.ticketPrice === 0 ? "FREE" : `₹${event.ticketPrice}`}
                                </div>

                            </div>

                            <div className="p-6 flex flex-col flex-grow">

                                <h2 className="text-lg sm:text-xl font-bold mb-3">
                                    {event.title}
                                </h2>

                                <div className="text-sm text-gray-600 space-y-2 mb-4">
                                    <div className="flex items-center gap-2">
                                        <FaCalendarAlt />
                                        <span>{new Date(event.date).toDateString()}</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <FaMapMarkerAlt />
                                        <span>{event.location}</span>
                                    </div>
                                </div>

                                <Link
                                    to={`/events/${event._id}`}
                                    className="mt-auto text-center bg-gray-100 hover:bg-gray-200 py-2 rounded-lg font-semibold"
                                >
                                    View Details
                                </Link>

                            </div>

                        </div>
                    ))}

                </div>
            )}

            {/* FOOTER */}
            <footer className="mt-16 pt-10 border-t text-center text-gray-500 text-sm">
                © {new Date().getFullYear()} Eventora
            </footer>

        </div>
    );
};

export default Home;
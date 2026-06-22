import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/axios';
import { useNavigate } from 'react-router-dom';
import {
    FaTicketAlt,
    FaUserShield,
    FaUserCheck,
    FaUserSlash,
    FaCoins,
    FaClock,
    FaCalendarAlt,
    FaPlus,
    FaTrash,
    FaCheck,
    FaTimes,
    FaSearch,
    FaHistory,
    FaLock,
    FaUnlock,
    FaCreditCard,
    FaList,
    FaUsers,
    FaMapMarkerAlt,
    FaExclamationCircle
} from 'react-icons/fa';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    
    // States
    const [events, setEvents] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    
    // Search/Filters
    const [userSearch, setUserSearch] = useState('');
    const [bookingFilterStatus, setBookingFilterStatus] = useState('all');
    const [bookingFilterPayment, setBookingFilterPayment] = useState('all');
    
    // User activity modal/drawer target
    const [expandedUser, setExpandedUser] = useState(null);
    
    // Create event state
    const [showEventForm, setShowEventForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '', description: '', date: '', location: '', category: '', totalSeats: '', ticketPrice: '', image: ''
    });

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/login');
            return;
        }
        fetchData();
    }, [user, navigate]);

    const fetchData = async () => {
        try {
            const [eventsRes, bookingsRes, usersRes] = await Promise.all([
                api.get('/events'),
                api.get('/bookings/my'), // Admin gets all bookings
                api.get('/admin/users') // Admin gets all users with activity
            ]);
            setEvents(eventsRes.data);
            setBookings(bookingsRes.data);
            setUsers(usersRes.data);
        } catch (error) {
            console.error('Error fetching admin data', error);
        } finally {
            setLoading(false);
        }
    };

    // Event operations
    const handleCreateEvent = async (e) => {
        e.preventDefault();
        try {
            await api.post('/events', formData);
            setShowEventForm(false);
            setFormData({ title: '', description: '', date: '', location: '', category: '', totalSeats: '', ticketPrice: '', image: '' });
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Error creating event');
        }
    };

    const handleDeleteEvent = async (id) => {
        if (window.confirm('Are you sure you want to delete this event? This will affect existing bookings.')) {
            try {
                await api.delete(`/events/${id}`);
                fetchData();
            } catch (error) {
                alert('Error deleting event');
            }
        }
    };

    // User operations (block/unblock)
    const handleToggleUserStatus = async (userId) => {
        try {
            const res = await api.put(`/admin/users/${userId}/status`);
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Error updating user status');
        }
    };

    // Booking status operations
    const handleUpdateBookingStatus = async (bookingId, status) => {
        try {
            await api.put(`/admin/bookings/${bookingId}/status`, { status });
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Error updating booking status');
        }
    };

    // Booking payment operations
    const handleUpdateBookingPayment = async (bookingId, paymentStatus) => {
        try {
            await api.put(`/admin/bookings/${bookingId}/payment`, { paymentStatus });
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Error updating payment status');
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-40">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-gray-900 mb-4"></div>
                <div className="text-xl font-semibold text-gray-700">Loading Admin Control Center...</div>
            </div>
        );
    }

    // Calculations for Stats
    const totalRevenue = bookings.reduce((sum, b) => b.paymentStatus === 'paid' && b.status === 'confirmed' ? sum + b.amount : sum, 0);
    const paidBookingsCount = bookings.filter(b => b.paymentStatus === 'paid' && b.status === 'confirmed').length;
    const pendingRequestsCount = bookings.filter(b => b.status === 'pending').length;
    const totalUsersCount = users.length;
    const activeUsersCount = users.filter(u => u.isActive !== false).length;
    const blockedUsersCount = users.filter(u => u.isActive === false).length;

    // Filters and Searches
    const filteredUsers = users.filter(u => 
        u.name.toLowerCase().includes(userSearch.toLowerCase()) || 
        u.email.toLowerCase().includes(userSearch.toLowerCase())
    );

    const filteredBookings = bookings.filter(b => {
        const matchesStatus = bookingFilterStatus === 'all' || b.status === bookingFilterStatus;
        const matchesPayment = bookingFilterPayment === 'all' || b.paymentStatus === bookingFilterPayment;
        return matchesStatus && matchesPayment;
    });

    return (
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 pb-16">
            
            {/* Banner Section */}
            <div className="bg-gradient-to-r from-gray-900 via-slate-800 to-black text-white rounded-3xl p-6 sm:p-10 mb-8 shadow-2xl relative overflow-hidden">
                <div className="absolute right-0 top-0 transform translate-x-20 -translate-y-20 w-80 h-80 bg-yellow-500 rounded-full opacity-10 blur-3xl"></div>
                <div className="absolute left-1/3 bottom-0 transform translate-y-20 w-60 h-60 bg-blue-500 rounded-full opacity-10 blur-2xl"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-center md:text-left">
                        <div className="inline-flex items-center gap-2 bg-yellow-400/20 text-yellow-400 px-3.5 py-1.5 rounded-full text-xs font-black tracking-widest uppercase mb-3 border border-yellow-400/30">
                            <FaUserShield className="text-sm" /> Admin Privilege Active
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">Admin Dashboard</h1>
                        <p className="text-gray-300 text-sm sm:text-base max-w-xl">
                            Control user accounts, monitor system-wide booking activity, manage ticket payments, and publish new events.
                        </p>
                    </div>
                    
                    <button
                        onClick={() => {
                            setActiveTab('events');
                            setShowEventForm(!showEventForm);
                        }}
                        className="w-full md:w-auto bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-950 hover:from-yellow-300 hover:to-amber-400 font-extrabold py-3.5 px-8 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-yellow-500/25 flex items-center justify-center gap-2 transform hover:-translate-y-0.5 shrink-0"
                    >
                        <FaPlus /> Create New Event
                    </button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-gray-200 mb-8 overflow-x-auto scrollbar-none gap-2 p-1 bg-white rounded-2xl shadow-sm border">
                <button
                    onClick={() => setActiveTab('overview')}
                    className={`flex items-center gap-2 px-5 py-3.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all duration-200 ${
                        activeTab === 'overview'
                            ? 'bg-gray-900 text-white shadow-md'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                >
                    <FaHistory className="text-base" /> Overview
                </button>
                <button
                    onClick={() => setActiveTab('users')}
                    className={`flex items-center gap-2 px-5 py-3.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all duration-200 ${
                        activeTab === 'users'
                            ? 'bg-gray-900 text-white shadow-md'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                >
                    <FaUsers className="text-base" /> Users & Access ({users.length})
                </button>
                <button
                    onClick={() => setActiveTab('bookings')}
                    className={`flex items-center gap-2 px-5 py-3.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all duration-200 ${
                        activeTab === 'bookings'
                            ? 'bg-gray-900 text-white shadow-md'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                >
                    <FaTicketAlt className="text-base" /> Booking Registry ({bookings.length})
                </button>
                <button
                    onClick={() => setActiveTab('events')}
                    className={`flex items-center gap-2 px-5 py-3.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all duration-200 ${
                        activeTab === 'events'
                            ? 'bg-gray-900 text-white shadow-md'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                >
                    <FaCalendarAlt className="text-base" /> Events Console ({events.length})
                </button>
            </div>

            {/* TAB CONTENT: OVERVIEW */}
            {activeTab === 'overview' && (
                <div className="animation-fadeIn">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
                            <div>
                                <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">Total Revenue</p>
                                <h3 className="text-3xl font-black text-emerald-600">₹{totalRevenue.toLocaleString()}</h3>
                                <p className="text-xs text-gray-500 mt-1">From confirm paid tickets</p>
                            </div>
                            <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-inner">
                                <FaCoins />
                            </div>
                        </div>
                        
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
                            <div>
                                <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">Paid Tickets</p>
                                <h3 className="text-3xl font-black text-indigo-600">{paidBookingsCount}</h3>
                                <p className="text-xs text-gray-500 mt-1">Active bookings paid</p>
                            </div>
                            <div className="w-14 h-14 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center text-xl font-bold shadow-inner">
                                <FaCreditCard />
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
                            <div>
                                <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">Pending Approval</p>
                                <h3 className="text-3xl font-black text-amber-500">{pendingRequestsCount}</h3>
                                <p className="text-xs text-gray-500 mt-1">Awaiting confirmation</p>
                            </div>
                            <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center text-xl font-bold shadow-inner animate-pulse">
                                <FaClock />
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
                            <div>
                                <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">User Base Control</p>
                                <h3 className="text-3xl font-black text-blue-600">{totalUsersCount}</h3>
                                <div className="flex gap-2 text-[10px] font-bold mt-1 text-gray-500">
                                    <span className="text-green-600">{activeUsersCount} Active</span>
                                    <span>•</span>
                                    <span className="text-red-500">{blockedUsersCount} Blocked</span>
                                </div>
                            </div>
                            <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center text-xl font-bold shadow-inner">
                                <FaUsers />
                            </div>
                        </div>
                    </div>

                    {/* Quick Logs Summary */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Latest Bookings */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-black text-gray-800 flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> Recent Booking Activity
                                </h2>
                                <button onClick={() => setActiveTab('bookings')} className="text-xs text-indigo-600 hover:text-indigo-800 font-bold transition">View Registry →</button>
                            </div>
                            
                            <div className="divide-y divide-gray-100">
                                {bookings.slice(0, 5).map(b => (
                                    <div key={b._id} className="py-4 flex justify-between items-center hover:bg-gray-50/50 rounded-xl px-2 transition-colors">
                                        <div className="min-w-0 pr-4">
                                            <h4 className="font-extrabold text-sm text-gray-900 truncate">{b.eventId?.title || 'Deleted Event'}</h4>
                                            <p className="text-xs text-gray-500 truncate mt-0.5">By {b.userId?.name || 'Unknown User'}</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-1 shrink-0">
                                            <span className={`px-2 py-0.5 text-[10px] font-black rounded-md uppercase tracking-wider ${
                                                b.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700' :
                                                b.status === 'cancelled' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'
                                            }`}>
                                                {b.status}
                                            </span>
                                            <span className="text-xs font-bold text-gray-800">₹{b.amount}</span>
                                        </div>
                                    </div>
                                ))}
                                {bookings.length === 0 && <p className="text-sm text-gray-500 text-center py-6">No bookings recorded yet.</p>}
                            </div>
                        </div>

                        {/* User Access Summary */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-black text-gray-800 flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span> User Access Registry
                                </h2>
                                <button onClick={() => setActiveTab('users')} className="text-xs text-indigo-600 hover:text-indigo-800 font-bold transition">Manage Users →</button>
                            </div>

                            <div className="divide-y divide-gray-100">
                                {users.slice(0, 5).map(u => (
                                    <div key={u._id} className="py-4 flex justify-between items-center hover:bg-gray-50/50 rounded-xl px-2 transition-colors">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-gray-100 to-gray-200 text-gray-700 font-black flex items-center justify-center text-sm shrink-0">
                                                {u.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="font-extrabold text-sm text-gray-900 truncate">{u.name}</h4>
                                                <p className="text-xs text-gray-400 truncate">{u.email}</p>
                                            </div>
                                        </div>
                                        <span className={`px-2.5 py-1 text-[10px] font-black rounded-lg uppercase tracking-wider ${
                                            u.isActive !== false
                                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50'
                                                : 'bg-red-50 text-red-700 border border-red-200/50'
                                        }`}>
                                            {u.isActive !== false ? 'Active' : 'Blocked'}
                                        </span>
                                    </div>
                                ))}
                                {users.length === 0 && <p className="text-sm text-gray-500 text-center py-6">No users found.</p>}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB CONTENT: USERS */}
            {activeTab === 'users' && (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 animation-fadeIn">
                    
                    {/* Header Controls */}
                    <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-6">
                        <div>
                            <h2 className="text-xl font-black text-gray-900">User Directory</h2>
                            <p className="text-xs text-gray-500">Monitor activity and toggle app access permissions.</p>
                        </div>
                        
                        <div className="relative max-w-xs w-full">
                            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                <FaSearch className="text-sm" />
                            </span>
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={userSearch}
                                onChange={e => setUserSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 transition-shadow shadow-sm"
                            />
                        </div>
                    </div>

                    {/* Desktop Users Table */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 text-gray-400 text-xs font-black uppercase tracking-widest">
                                    <th className="py-3 px-4">User</th>
                                    <th className="py-3 px-4">Verification</th>
                                    <th className="py-3 px-4 text-center">Bookings</th>
                                    <th className="py-3 px-4 text-center">Status</th>
                                    <th className="py-3 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredUsers.map(u => {
                                    const isSelf = u._id === user._id;
                                    const isBlocked = u.isActive === false;
                                    const isExpanded = expandedUser === u._id;
                                    
                                    return (
                                        <React.Fragment key={u._id}>
                                            <tr className={`hover:bg-gray-50/50 transition-colors ${isBlocked ? 'bg-red-50/10' : ''}`}>
                                                <td className="py-4.5 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-10 h-10 rounded-full font-black flex items-center justify-center text-sm shadow-sm ${
                                                            u.role === 'admin' 
                                                                ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' 
                                                                : 'bg-slate-100 text-slate-800'
                                                        }`}>
                                                            {u.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className="font-extrabold text-sm text-gray-900 flex items-center gap-1.5">
                                                                {u.name}
                                                                {u.role === 'admin' && (
                                                                    <span className="bg-yellow-400 text-gray-900 text-[9px] font-black uppercase px-1.5 py-0.5 rounded tracking-widest">Admin</span>
                                                                )}
                                                            </div>
                                                            <div className="text-xs text-gray-400">{u.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4.5 px-4">
                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-lg ${
                                                        u.isVerified 
                                                            ? 'bg-green-50 text-green-700 border border-green-200/50' 
                                                            : 'bg-yellow-50 text-yellow-700 border border-yellow-200/50'
                                                    }`}>
                                                        <div className={`w-1.5 h-1.5 rounded-full ${u.isVerified ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                                                        {u.isVerified ? 'Verified' : 'Pending OTP'}
                                                    </span>
                                                </td>
                                                <td className="py-4.5 px-4 text-center">
                                                    <span className="bg-gray-100 text-gray-800 font-extrabold px-2.5 py-1 rounded-lg text-xs">
                                                        {u.bookingsCount || 0}
                                                    </span>
                                                </td>
                                                <td className="py-4.5 px-4 text-center">
                                                    <span className={`px-2.5 py-1 text-[10px] font-black rounded-lg uppercase tracking-wider ${
                                                        !isBlocked 
                                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50' 
                                                            : 'bg-red-50 text-red-700 border border-red-200/50'
                                                    }`}>
                                                        {!isBlocked ? 'Active' : 'Suspended'}
                                                    </span>
                                                </td>
                                                <td className="py-4.5 px-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => setExpandedUser(isExpanded ? null : u._id)}
                                                            className={`inline-flex items-center gap-1 text-xs font-extrabold px-3 py-2 rounded-xl transition ${
                                                                isExpanded
                                                                    ? 'bg-gray-900 text-white'
                                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                            }`}
                                                        >
                                                            <FaHistory /> Activity
                                                        </button>
                                                        
                                                        {!isSelf ? (
                                                            <button
                                                                onClick={() => handleToggleUserStatus(u._id)}
                                                                className={`inline-flex items-center gap-1 text-xs font-black px-3 py-2 rounded-xl transition-all border ${
                                                                    isBlocked
                                                                        ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border-emerald-200 hover:border-emerald-600'
                                                                        : 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border-red-200 hover:border-red-600'
                                                                }`}
                                                            >
                                                                {isBlocked ? (
                                                                    <>
                                                                        <FaUnlock /> Unblock Access
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <FaLock /> Block Access
                                                                    </>
                                                                )}
                                                            </button>
                                                        ) : (
                                                            <span className="text-xs text-gray-400 font-bold px-3 py-2 italic">You</span>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>

                                            {/* Expandable Activity Details Row */}
                                            {isExpanded && (
                                                <tr>
                                                    <td colSpan="5" className="bg-gray-50/50 p-6 border-y border-gray-100">
                                                        <div className="animation-slideDown">
                                                            <h4 className="font-extrabold text-sm text-gray-800 mb-4 flex items-center gap-2">
                                                                <FaHistory className="text-gray-400" /> Booking History for {u.name}
                                                            </h4>
                                                            {u.bookings && u.bookings.length > 0 ? (
                                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                                    {u.bookings.map(b => (
                                                                        <div key={b._id} className="bg-white p-4.5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                                                                            <div>
                                                                                <div className="flex justify-between items-start gap-3 mb-2.5">
                                                                                    <h5 className="font-extrabold text-xs text-gray-900 line-clamp-1">{b.eventId?.title || 'Deleted Event'}</h5>
                                                                                    <span className={`px-1.5 py-0.5 text-[9px] font-black rounded uppercase tracking-wider shrink-0 ${
                                                                                        b.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                                                                        b.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                                                                    }`}>{b.status}</span>
                                                                                </div>
                                                                                
                                                                                <div className="text-[11px] text-gray-500 space-y-1 mb-4">
                                                                                    <div className="flex justify-between">
                                                                                        <span>Seats:</span>
                                                                                        <span className="font-bold text-gray-800">{b.seats} ticket(s)</span>
                                                                                    </div>
                                                                                    <div className="flex justify-between">
                                                                                        <span>Price:</span>
                                                                                        <span className="font-semibold text-gray-800">₹{b.amount}</span>
                                                                                    </div>
                                                                                    <div className="flex justify-between">
                                                                                        <span>Date:</span>
                                                                                        <span>{new Date(b.bookedAt).toLocaleDateString()}</span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>

                                                                            {/* Actions specifically for user's booking & billing */}
                                                                            <div className="border-t border-gray-100 pt-3 flex items-center justify-between gap-2">
                                                                                <div>
                                                                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">Billing</span>
                                                                                    <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-md ${
                                                                                        b.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                                                                    }`}>
                                                                                        {b.paymentStatus === 'paid' ? 'PAID' : 'UNPAID'}
                                                                                    </span>
                                                                                </div>
                                                                                
                                                                                <div className="flex gap-1.5">
                                                                                    <button
                                                                                        onClick={() => handleUpdateBookingPayment(b._id, b.paymentStatus === 'paid' ? 'not_paid' : 'paid')}
                                                                                        className="text-[10px] font-bold px-2.5 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition"
                                                                                    >
                                                                                        Toggle Billing
                                                                                    </button>
                                                                                    
                                                                                    {b.status === 'pending' && (
                                                                                        <button
                                                                                            onClick={() => handleUpdateBookingStatus(b._id, 'confirmed')}
                                                                                            className="bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200 text-[10px] font-black px-2 py-1 rounded"
                                                                                        >
                                                                                            Approve
                                                                                        </button>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <p className="text-xs text-gray-500 italic">This user has not placed any bookings yet.</p>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                                {filteredUsers.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="p-8 text-center text-sm text-gray-500">No users found matching query.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Users View (Cards) */}
                    <div className="md:hidden space-y-4">
                        {filteredUsers.map(u => {
                            const isSelf = u._id === user._id;
                            const isBlocked = u.isActive === false;
                            const isExpanded = expandedUser === u._id;
                            
                            return (
                                <div key={u._id} className={`p-4 rounded-2xl border ${isBlocked ? 'border-red-200 bg-red-50/5' : 'border-gray-100'} shadow-sm`}>
                                    <div className="flex justify-between items-start gap-4 mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-9 h-9 rounded-full font-black flex items-center justify-center text-sm ${
                                                u.role === 'admin' ? 'bg-yellow-100 text-yellow-800' : 'bg-slate-100 text-slate-800'
                                            }`}>
                                                {u.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h4 className="font-extrabold text-sm text-gray-900 flex items-center gap-1.5">
                                                    {u.name}
                                                    {u.role === 'admin' && (
                                                        <span className="bg-yellow-400 text-gray-900 text-[8px] font-black uppercase px-1 rounded">Admin</span>
                                                    )}
                                                </h4>
                                                <p className="text-xs text-gray-400 truncate max-w-[150px]">{u.email}</p>
                                            </div>
                                        </div>
                                        <span className={`px-2 py-0.5 text-[9px] font-black rounded-lg uppercase tracking-wider ${
                                            !isBlocked ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                                        }`}>
                                            {!isBlocked ? 'Active' : 'Suspended'}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between text-xs text-gray-600 mb-4 bg-gray-50 p-2.5 rounded-xl border">
                                        <div>
                                            Verification: <span className="font-bold text-gray-800">{u.isVerified ? 'Verified' : 'Pending'}</span>
                                        </div>
                                        <div>
                                            Bookings: <span className="font-bold text-gray-800">{u.bookingsCount || 0}</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setExpandedUser(isExpanded ? null : u._id)}
                                            className="flex-1 text-center text-xs font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 py-2.5 rounded-xl transition"
                                        >
                                            Activity
                                        </button>
                                        
                                        {!isSelf && (
                                            <button
                                                onClick={() => handleToggleUserStatus(u._id)}
                                                className={`flex-1 text-center text-xs font-black py-2.5 rounded-xl border transition-all ${
                                                    isBlocked
                                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                        : 'bg-red-50 text-red-600 border-red-200'
                                                }`}
                                            >
                                                {isBlocked ? 'Unblock' : 'Block'}
                                            </button>
                                        )}
                                    </div>

                                    {/* Mobile User Activity View */}
                                    {isExpanded && (
                                        <div className="mt-4 pt-4 border-t border-gray-100 bg-gray-50/50 p-3 rounded-2xl animation-slideDown">
                                            <h5 className="font-extrabold text-xs text-gray-800 mb-3">Bookings for {u.name}</h5>
                                            {u.bookings && u.bookings.length > 0 ? (
                                                <div className="space-y-3">
                                                    {u.bookings.map(b => (
                                                        <div key={b._id} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                                                            <div className="flex justify-between items-start gap-2 mb-1.5">
                                                                <h6 className="font-bold text-xs text-gray-900 truncate max-w-[120px]">{b.eventId?.title || 'Deleted Event'}</h6>
                                                                <span className={`text-[9px] font-black rounded px-1 uppercase tracking-wider ${
                                                                    b.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                                                    b.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                                                }`}>{b.status}</span>
                                                            </div>
                                                            <p className="text-[10px] text-gray-500 mb-2">₹{b.amount} • {b.seats} tickets</p>
                                                            
                                                            <div className="flex justify-between items-center border-t border-gray-50 pt-2 text-[10px]">
                                                                <span className={`px-2 py-0.5 font-bold rounded ${
                                                                    b.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                                                }`}>{b.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}</span>
                                                                
                                                                <button
                                                                    onClick={() => handleUpdateBookingPayment(b._id, b.paymentStatus === 'paid' ? 'not_paid' : 'paid')}
                                                                    className="text-xs text-indigo-600 font-bold"
                                                                >
                                                                    Toggle Billing
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-[11px] text-gray-500 italic">No bookings recorded.</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                        {filteredUsers.length === 0 && <p className="p-8 text-center text-sm text-gray-500">No users found.</p>}
                    </div>

                </div>
            )}

            {/* TAB CONTENT: BOOKINGS */}
            {activeTab === 'bookings' && (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 animation-fadeIn">
                    
                    {/* Header Controls */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <div>
                            <h2 className="text-xl font-black text-gray-900">Booking Registry</h2>
                            <p className="text-xs text-gray-500">Confirm seat requests and monitor payment status.</p>
                        </div>
                        
                        {/* Filters */}
                        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Booking Status</label>
                                <select
                                    value={bookingFilterStatus}
                                    onChange={e => setBookingFilterStatus(e.target.value)}
                                    className="px-3.5 py-2 text-xs rounded-xl border border-gray-200 bg-white font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 shadow-sm"
                                >
                                    <option value="all">All Statuses</option>
                                    <option value="pending">Pending</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Billing Status</label>
                                <select
                                    value={bookingFilterPayment}
                                    onChange={e => setBookingFilterPayment(e.target.value)}
                                    className="px-3.5 py-2 text-xs rounded-xl border border-gray-200 bg-white font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 shadow-sm"
                                >
                                    <option value="all">All Payments</option>
                                    <option value="paid">Paid</option>
                                    <option value="not_paid">Not Paid</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Bookings Card List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredBookings.map(b => (
                            <div
                                key={b._id}
                                className={`bg-white rounded-2xl border-l-4 shadow-sm border-y border-r border-gray-150 p-5 hover:shadow-md transition-shadow relative overflow-hidden ${
                                    b.status === 'confirmed' ? 'border-l-emerald-500' :
                                    b.status === 'cancelled' ? 'border-l-rose-500' : 'border-l-amber-500'
                                }`}
                            >
                                <div className="flex justify-between items-start gap-4 mb-3">
                                    <div>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{b.eventId?.category || 'General'}</span>
                                        <h3 className="font-extrabold text-gray-900 text-base leading-tight mt-0.5">{b.eventId?.title || 'Deleted Event'}</h3>
                                    </div>
                                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                                        <span className={`px-2.5 py-0.5 text-[9px] font-black rounded-lg uppercase tracking-wider ${
                                            b.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700' :
                                            b.status === 'cancelled' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'
                                        }`}>{b.status}</span>
                                        
                                        <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded ${
                                            b.paymentStatus === 'paid' ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-800'
                                        }`}>{b.paymentStatus.replace('_', ' ').toUpperCase()}</span>
                                    </div>
                                </div>

                                <div className="bg-slate-50 rounded-xl p-3 text-xs text-gray-700 space-y-1.5 mb-4 border border-slate-100/50">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400 font-bold uppercase text-[9px]">Client:</span>
                                        <span className="font-extrabold text-gray-900">{b.userId?.name || 'Deleted Account'} <span className="font-normal text-gray-400">({b.userId?.email || 'N/A'})</span></span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400 font-bold uppercase text-[9px]">Seats:</span>
                                        <span className="font-bold text-gray-800">{b.seats} Tickets</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400 font-bold uppercase text-[9px]">Amount:</span>
                                        <span className="font-extrabold text-emerald-600">₹{b.amount}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400 font-bold uppercase text-[9px]">Booked At:</span>
                                        <span>{new Date(b.bookedAt).toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-[10px] text-gray-400 font-bold uppercase">Billing Control:</span>
                                        <button
                                            onClick={() => handleUpdateBookingPayment(b._id, b.paymentStatus === 'paid' ? 'not_paid' : 'paid')}
                                            className={`text-[10px] font-black px-2.5 py-1 rounded transition border ${
                                                b.paymentStatus === 'paid'
                                                    ? 'bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white border-rose-200'
                                                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border-emerald-200'
                                            }`}
                                        >
                                            {b.paymentStatus === 'paid' ? 'Mark Unpaid' : 'Mark Paid'}
                                        </button>
                                    </div>
                                    
                                    <div className="flex gap-2">
                                        {b.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => handleUpdateBookingStatus(b._id, 'confirmed')}
                                                    className="inline-flex items-center gap-1 text-[10px] font-black bg-emerald-500 text-white hover:bg-emerald-600 px-3 py-1.5 rounded-lg shadow-sm transition"
                                                >
                                                    <FaCheck /> Confirm
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateBookingStatus(b._id, 'cancelled')}
                                                    className="inline-flex items-center gap-1 text-[10px] font-black bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white border border-rose-200 px-3 py-1.5 rounded-lg transition"
                                                >
                                                    <FaTimes /> Reject
                                                </button>
                                            </>
                                        )}
                                        {b.status === 'confirmed' && (
                                            <button
                                                onClick={() => handleUpdateBookingStatus(b._id, 'cancelled')}
                                                className="inline-flex items-center gap-1 text-[10px] font-black bg-slate-50 text-slate-500 hover:bg-red-500 hover:text-white border px-3 py-1.5 rounded-lg transition"
                                            >
                                                Cancel Booking
                                            </button>
                                        )}
                                        {b.status === 'cancelled' && (
                                            <span className="text-[10px] text-gray-400 font-bold italic py-1">Booking Cancelled</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {filteredBookings.length === 0 && <p className="text-gray-500 text-center py-10 md:col-span-2">No bookings matching selected filters.</p>}
                    </div>
                </div>
            )}

            {/* TAB CONTENT: EVENTS */}
            {activeTab === 'events' && (
                <div className="animation-fadeIn">
                    
                    {/* Create Event Drawer */}
                    {showEventForm && (
                        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-md border border-gray-100 mb-8 animation-slideDown">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                                    <FaCalendarAlt className="text-gray-400" /> Host New Event
                                </h2>
                                <button
                                    onClick={() => setShowEventForm(false)}
                                    className="text-gray-400 hover:text-gray-600 font-bold text-sm bg-gray-50 w-8 h-8 rounded-full flex items-center justify-center transition border"
                                >
                                    ✕
                                </button>
                            </div>

                            <form onSubmit={handleCreateEvent} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Event Title</label>
                                    <input required type="text" placeholder="e.g., Tech Symposium 2026" className="border border-gray-200 px-4 py-2.5 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 transition-shadow" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                                </div>
                                
                                <div className="flex flex-col">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Category</label>
                                    <input required type="text" placeholder="e.g., Tech, Music, Arts" className="border border-gray-200 px-4 py-2.5 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 transition-shadow" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Date & Time</label>
                                    <input required type="date" className="border border-gray-200 px-4 py-2.5 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 transition-shadow text-gray-700" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Location</label>
                                    <input required type="text" placeholder="e.g., Convention Center, Delhi" className="border border-gray-200 px-4 py-2.5 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 transition-shadow" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Total Capacity</label>
                                    <input required type="number" placeholder="Seats available (e.g., 100)" className="border border-gray-200 px-4 py-2.5 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 transition-shadow" value={formData.totalSeats} onChange={e => setFormData({ ...formData, totalSeats: e.target.value })} />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Ticket Price (₹)</label>
                                    <input required type="number" placeholder="0 for Free entry" className="border border-gray-200 px-4 py-2.5 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 transition-shadow" value={formData.ticketPrice} onChange={e => setFormData({ ...formData, ticketPrice: e.target.value })} />
                                </div>

                                <div className="md:col-span-2 flex flex-col">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Banner Image URL</label>
                                    <input type="text" placeholder="Provide link to cover photo (optional)" className="border border-gray-200 px-4 py-2.5 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 transition-shadow" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} />
                                </div>

                                <div className="md:col-span-2 flex flex-col">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Description</label>
                                    <textarea required placeholder="Detailed timeline, eligibility or speaker details..." className="border border-gray-200 px-4 py-3 text-sm rounded-xl h-28 focus:outline-none focus:ring-2 focus:ring-gray-900 transition-shadow" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                                </div>

                                <button type="submit" className="md:col-span-2 bg-gray-950 text-white font-extrabold py-3.5 mt-2 rounded-2xl hover:bg-black transition shadow-lg hover:shadow-gray-950/20">
                                    Publish Event Now
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Events Registry */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-xl font-black text-gray-900">Events Catalog</h2>
                                <p className="text-xs text-gray-500">Monitor active listings and adjust bookings availability.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {events.map(event => (
                                <div key={event._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition duration-200">
                                    {event.imageUrl ? (
                                        <div className="h-44 w-full relative">
                                            <img src={event.imageUrl} alt={event.title} className="h-full w-full object-cover" />
                                            <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[10px] font-black text-gray-800 uppercase tracking-widest shadow-sm border">
                                                {event.category}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-44 w-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center relative">
                                            <span className="text-slate-400 font-extrabold text-sm uppercase tracking-widest">{event.category || 'Event'}</span>
                                            <div className="absolute top-3 right-3 bg-white px-2.5 py-1 rounded-lg text-[10px] font-black text-gray-800 uppercase tracking-widest shadow-sm">
                                                {event.category || 'General'}
                                            </div>
                                        </div>
                                    )}

                                    <div className="p-5 flex-grow flex flex-col justify-between">
                                        <div>
                                            <h4 className="font-extrabold text-gray-900 text-base leading-tight mb-2.5">{event.title}</h4>
                                            
                                            <div className="text-xs text-gray-500 space-y-2 mb-6">
                                                <p className="flex items-center gap-2">
                                                    <FaCalendarAlt className="text-gray-400 shrink-0" />
                                                    <span>{new Date(event.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                                </p>
                                                <p className="flex items-center gap-2">
                                                    <FaMapMarkerAlt className="text-gray-400 shrink-0" />
                                                    <span className="truncate">{event.location}</span>
                                                </p>
                                                <p className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></div>
                                                    <span>
                                                        Capacity: <strong className="text-gray-800">{event.availableSeats} / {event.totalSeats}</strong> seats available
                                                    </span>
                                                </p>
                                                <p className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></div>
                                                    <span>
                                                        Ticket: <strong className={event.ticketPrice === 0 ? 'text-emerald-600' : 'text-gray-800'}>{event.ticketPrice === 0 ? 'Free' : `₹${event.ticketPrice}`}</strong>
                                                    </span>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="border-t border-gray-100 pt-4 flex gap-2">
                                            <button
                                                onClick={() => navigate(`/events/${event._id}`)}
                                                className="flex-1 text-center text-xs font-bold bg-slate-50 hover:bg-slate-100 text-gray-700 py-2.5 rounded-xl border transition"
                                            >
                                                View Page
                                            </button>
                                            
                                            <button
                                                onClick={() => handleDeleteEvent(event._id)}
                                                className="text-xs font-black text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-200 px-4 py-2.5 rounded-xl transition duration-150 flex items-center justify-center gap-1.5"
                                            >
                                                <FaTrash /> Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {events.length === 0 && (
                                <div className="text-center py-10 md:col-span-3">
                                    <p className="text-gray-500 text-sm">No events in catalog.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default AdminDashboard;
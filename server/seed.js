const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Event = require('./models/Event');
const Booking = require('./models/Booking');

dotenv.config();

// ---------------- USERS ----------------
const users = [
    { name: 'Admin User', email: 'admin@eventora.com', password: 'password123', role: 'admin' },
    { name: 'Demo User', email: 'user@eventora.com', password: 'password123', role: 'user' },
    { name: 'Alice Smith', email: 'alice@eventora.com', password: 'password123', role: 'user' },
    { name: 'Bob Johnson', email: 'bob@eventora.com', password: 'password123', role: 'user' },
    { name: 'Charlie Dave', email: 'charlie@eventora.com', password: 'password123', role: 'user' },
    { name: 'Diana Prince', email: 'diana@eventora.com', password: 'password123', role: 'user' },
    { name: 'Ethan Hunt', email: 'ethan@eventora.com', password: 'password123', role: 'user' },
    { name: 'Fiona Gallagher', email: 'fiona@eventora.com', password: 'password123', role: 'user' },
    { name: 'George Miller', email: 'george@eventora.com', password: 'password123', role: 'user' },
    { name: 'Hannah Montana', email: 'hannah@eventora.com', password: 'password123', role: 'user' }
];

// ---------------- EVENTS ----------------
const events = [
    {
        title: 'React & Node.js Developer Retreat',
        description: 'Join us for full-stack development training.',
        date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        location: 'Silicon Valley, CA',
        category: 'technology',
        totalSeats: 100,
        ticketPrice: 800,
        imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800'
    },
    {
        title: 'Neon Nights EDM Festival',
        description: 'Biggest EDM festival of the year.',
        date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        location: 'New York',
        category: 'music',
        totalSeats: 450,
        ticketPrice: 1500,
        imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800'
    },
{
        title: 'Web Development Workshop',
        description: 'Learn HTML, CSS, JavaScript and React from experts.',
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        location: 'Jaipur, Rajasthan',
        category: 'technology',
        totalSeats: 80,
        ticketPrice: 500,
        imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3'
    },

    {
        title: 'Career Guidance Seminar',
        description: 'Get guidance about jobs, internships and placements.',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        location: 'Udaipur, Rajasthan',
        category: 'education',
        totalSeats: 120,
        ticketPrice: 200,
        imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f'
    },

    {
        title: 'Digital Marketing Masterclass',
        description: 'Learn SEO, Social Media Marketing and Branding.',
        date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        location: 'Delhi',
        category: 'business',
        totalSeats: 100,
        ticketPrice: 600,
        imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f'
    },

    {
        title: 'Fitness & Yoga Session',
        description: 'Morning yoga and fitness training for a healthy lifestyle.',
        date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
        location: 'Ahmedabad, Gujarat',
        category: 'health',
        totalSeats: 60,
        ticketPrice: 300,
        imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a'
    },

    {
        title: 'Startup Networking Meetup',
        description: 'Meet founders, investors and startup enthusiasts.',
        date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        location: 'Bangalore, Karnataka',
        category: 'business',
        totalSeats: 150,
        ticketPrice: 1000,
        imageUrl: 'https://images.unsplash.com/photo-1515169067868-5387ec356754'
    },

    {
        title: 'Photography Workshop',
        description: 'Learn photography basics and editing techniques.',
        date: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
        location: 'Mumbai, Maharashtra',
        category: 'creative',
        totalSeats: 50,
        ticketPrice: 700,
        imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32'
    },

    {
        title: 'AI & Machine Learning Conference',
        description: 'Explore the latest trends in Artificial Intelligence.',
        date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        location: 'Hyderabad, Telangana',
        category: 'technology',
        totalSeats: 200,
        ticketPrice: 1200,
        imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e'
    },

    {
        title: 'Music & Cultural Festival',
        description: 'Enjoy live music performances and cultural activities.',
        date: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        location: 'Jodhpur, Rajasthan',
        category: 'entertainment',
        totalSeats: 300,
        ticketPrice: 400,
        imageUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a'
    },
];

// ---------------- SEED ----------------
const seedDatabase = async () => {
    try {
        const MONGO_URI =
            process.env.MONGODB_URI || 'mongodb://localhost:27017/eventora';

        await mongoose.connect(MONGO_URI);
        console.log('✅ MongoDB connected');

        await User.deleteMany();
        await Event.deleteMany();
        await Booking.deleteMany();

        console.log('🗑️ Old data cleared');

        // USERS
        const salt = await bcrypt.genSalt(10);

        const hashedUsers = users.map(u => ({
            ...u,
            password: bcrypt.hashSync(u.password, salt),
            isVerified: true
        }));

        const createdUsers = await User.insertMany(hashedUsers);

        const adminUser = createdUsers.find(u => u.role === 'admin');
        const normalUsers = createdUsers.filter(u => u.role === 'user');

        console.log(`👤 Users created: ${createdUsers.length}`);

        // EVENTS (FIXED)
        const eventsWithAdmin = events.map(e => ({
            title: e.title,
            description: e.description,
            date: e.date,
            location: e.location,
            category: e.category,
            totalSeats: e.totalSeats,
            availableSeats: e.totalSeats,
            ticketPrice: e.ticketPrice,

            createdBy: adminUser._id,

            imageUrl: e.imageUrl || "https://via.placeholder.com/800"
        }));

        const createdEvents = await Event.insertMany(eventsWithAdmin);

        console.log(`🎉 Events created: ${createdEvents.length}`);

        process.exit(0);

    } catch (error) {
        console.error('❌ Seed Error:', error);
        process.exit(1);
    }
};

seedDatabase();
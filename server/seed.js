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
        title: 'TechFest - Annual Technical Festival',
        description:
            'A grand technical festival featuring coding competitions, robotics, project exhibitions, quizzes and innovative technology challenges for students.',
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        location: 'Sobhasaria Group of Institutions, Sikar, Rajasthan',
        category: 'technology',
        totalSeats: 500,
        ticketPrice: 800,
        imageUrl:
            'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800'
    },

    {
        title: 'Annual Cultural Fest',
        description:
            'A colorful college cultural festival featuring dance, singing, fashion shows, drama, music and exciting student performances.',
        date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
        location: 'Sobhasaria Group of Institutions, Sikar, Rajasthan',
        category: 'cultural',
        totalSeats: 800,
        ticketPrice: 500,
        imageUrl:
            'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=80&w=800'
    },

    {
        title: 'Coding Competition - Code Battle',
        description:
            'Test your programming skills in an exciting coding competition covering problem solving, algorithms, data structures and logical challenges.',
        date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        location: 'Computer Science Department, Sobhasaria, Sikar',
        category: 'technology',
        totalSeats: 300,
        ticketPrice: 200,
        imageUrl:
            'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=800'
    },

    {
        title: 'Hackathon - Build for Tomorrow',
        description:
            'A 24-hour college hackathon where students build innovative solutions using web development, AI, IoT and modern technologies.',
        date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
        location: 'Innovation Lab, Sobhasaria Group of Institutions, Sikar',
        category: 'technology',
        totalSeats: 250,
        ticketPrice: 100,
        imageUrl:
            'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800'
    },

    {
        title: 'Sports Meet - Champions Cup',
        description:
            'An exciting inter-college sports event featuring cricket, volleyball, football, badminton, athletics and other sporting activities.',
        date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        location: 'Sports Ground, Sobhasaria Group of Institutions, Sikar',
        category: 'sports',
        totalSeats: 600,
        ticketPrice: 50,
        imageUrl:
            'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=800'
    },

    {
        title: 'Freshers Welcome Party',
        description:
            'A special welcome celebration for new students featuring music, dance, fun activities, games and an exciting introduction to campus life.',
        date: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
        location: 'College Auditorium, Sobhasaria, Sikar',
        category: 'entertainment',
        totalSeats: 700,
        ticketPrice: 500,
        imageUrl:
            'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800'
    },

    {
        title: 'Career & Placement Drive',
        description:
            'Meet recruiters and industry professionals, explore career opportunities, attend placement sessions and learn about internships and jobs.',
        date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        location: 'Seminar Hall, Sobhasaria Group of Institutions, Sikar',
        category: 'career',
        totalSeats: 400,
        ticketPrice: 0,
        imageUrl:
            'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=800'
    },

    {
        title: 'Project Exhibition & Innovation Expo',
        description:
            'Students showcase their innovative academic projects, software applications, engineering models and creative technology solutions.',
        date: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000),
        location: 'Main Exhibition Hall, Sobhasaria, Sikar',
        category: 'innovation',
        totalSeats: 350,
        ticketPrice: 150,
        imageUrl:
            'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=800'
    },

    {
        title: 'AI & Future Technology Seminar',
        description:
            'An interactive seminar exploring Artificial Intelligence, Machine Learning, Generative AI, cloud computing and the future of technology.',
        date: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        location: 'Conference Hall, Sobhasaria Group of Institutions, Sikar',
        category: 'technology',
        totalSeats: 300,
        ticketPrice: 100,
        imageUrl:
            'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800'
    },

    {
        title: 'Farewell Celebration - Batch 2026',
        description:
            'A memorable farewell celebration for graduating students with cultural performances, memories, awards, music and special moments.',
        date: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
        location: 'College Auditorium, Sobhasaria, Sikar',
        category: 'cultural',
        totalSeats: 750,
        ticketPrice: 450,
        imageUrl:
            'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&q=80&w=800'
    },
    {
    title: 'Entrepreneurship & Startup Summit',
    description:
        'An engaging entrepreneurship summit where students learn about startup ideas, business planning, innovation, funding, leadership and building successful ventures.',
    date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    location: 'Seminar Hall, Sobhasaria Group of Institutions, Sikar',
    category: 'business',
    totalSeats: 300,
    ticketPrice: 200,
    imageUrl:
        'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800'
},

{
    title: 'Student Talent & Open Mic Night',
    description:
        'A fun student talent evening featuring singing, poetry, stand-up comedy, storytelling, instrumental performances and other creative talents.',
    date: new Date(Date.now() + 32 * 24 * 60 * 60 * 1000),
    location: 'College Auditorium, Sobhasaria, Sikar',
    category: 'entertainment',
    totalSeats: 500,
    ticketPrice:250,
    imageUrl:
        'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&q=80&w=800'
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
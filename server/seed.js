const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

const User = require("./models/User");
const Event = require("./models/Event");

dotenv.config();

// ======================================================
// USERS (only created if they don't already exist)
// ======================================================

const users = [
    {
        name: "Admin User",
        email: "admin@eventora.com",
        password: "password123",
        role: "admin",
    },
    {
        name: "Demo User",
        email: "user@eventora.com",
        password: "password123",
        role: "user",
    },
];

// ======================================================
// EVENTS
// Add new events here, or edit existing ones (title, price,
// description etc). Re-running this script will NOT delete
// your bookings or users, and will NOT reset availableSeats
// on events that already exist.
// ======================================================

const events = [

    // ==================================================
    // 🏏 SPORTS - 5 EVENTS
    // ==================================================

    {
        title: "Sports Meet - Champions Cup",
        description:
            "An exciting inter-college sports event featuring cricket, volleyball, football, badminton, athletics and other sporting activities.",
        date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        location: "Sports Ground, Sobhasaria Group of Institutions, Sikar",
        category: "sports",
        totalSeats: 600,
        ticketPrice: 50,
        imageUrl:
            "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=800",
    },
    {
        title: "Inter College Cricket Championship",
        description:
            "A thrilling inter-college cricket championship for students featuring competitive matches and exciting campus cricket action.",
        date: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000),
        location: "Sports Ground, Sobhasaria Group of Institutions, Sikar",
        category: "sports",
        totalSeats: 500,
        ticketPrice: 50,
        imageUrl:
            "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=800",
    },
    {
        title: "Inter College Football Tournament",
        description:
            "An exciting football tournament where student teams compete for the Sobhasaria campus championship.",
        date: new Date(Date.now() + 19 * 24 * 60 * 60 * 1000),
        location: "College Football Ground, Sobhasaria, Sikar",
        category: "sports",
        totalSeats: 400,
        ticketPrice: 50,
        imageUrl:
            "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80&w=800",
    },
    {
        title: "Badminton Championship",
        description:
            "A campus badminton championship featuring singles and doubles competitions for students.",
        date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
        location: "Indoor Sports Complex, Sobhasaria, Sikar",
        category: "sports",
        totalSeats: 250,
        ticketPrice: 30,
        imageUrl:
            "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=800",
    },
    {
        title: "Athletics & Fitness Meet",
        description:
            "A student athletics meet featuring running, relay, long jump and other fitness competitions.",
        date: new Date(Date.now() + 24 * 24 * 60 * 60 * 1000),
        location: "Main Sports Ground, Sobhasaria, Sikar",
        category: "sports",
        totalSeats: 350,
        ticketPrice: 30,
        imageUrl:
            "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&q=80&w=800",
    },

    // ==================================================
    // 💻 TECHNOLOGY - 5 EVENTS
    // ==================================================

    {
        title: "TechFest - Annual Technical Festival",
        description:
            "A grand technical festival featuring coding competitions, robotics, project exhibitions, quizzes and innovative technology challenges for students.",
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        location: "Sobhasaria Group of Institutions, Sikar, Rajasthan",
        category: "technology",
        totalSeats: 500,
        ticketPrice: 800,
        imageUrl:
            "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800",
    },
    {
        title: "Coding Competition - Code Battle",
        description:
            "Test your programming skills in an exciting coding competition covering problem solving, algorithms, data structures and logical challenges.",
        date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        location: "Computer Science Department, Sobhasaria, Sikar",
        category: "technology",
        totalSeats: 300,
        ticketPrice: 200,
        imageUrl:
            "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=800",
    },
    {
        title: "Hackathon - Build for Tomorrow",
        description:
            "A 24-hour college hackathon where students build innovative solutions using web development, AI, IoT and modern technologies.",
        date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
        location: "Innovation Lab, Sobhasaria Group of Institutions, Sikar",
        category: "technology",
        totalSeats: 250,
        ticketPrice: 100,
        imageUrl:
            "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800",
    },
    {
        title: "AI & Future Technology Seminar",
        description:
            "An interactive seminar exploring Artificial Intelligence, Machine Learning, Generative AI, cloud computing and the future of technology.",
        date: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        location: "Conference Hall, Sobhasaria Group of Institutions, Sikar",
        category: "technology",
        totalSeats: 300,
        ticketPrice: 100,
        imageUrl:
            "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800",
    },
    {
        title: "Robotics Challenge",
        description:
            "A hands-on robotics competition where students design, build and compete with innovative robotic systems.",
        date: new Date(Date.now() + 34 * 24 * 60 * 60 * 1000),
        location: "Innovation Lab, Sobhasaria, Sikar",
        category: "technology",
        totalSeats: 250,
        ticketPrice: 150,
        imageUrl:
            "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800",
    },

    // ==================================================
    // 🎭 CULTURAL - 5 EVENTS
    // ==================================================

    {
        title: "Annual Cultural Fest",
        description:
            "A colorful college cultural festival featuring dance, singing, fashion shows, drama, music and exciting student performances.",
        date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
        location: "Sobhasaria Group of Institutions, Sikar",
        category: "cultural",
        totalSeats: 800,
        ticketPrice: 500,
        imageUrl:
            "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=80&w=800",
    },
    {
        title: "Inter College Dance Competition",
        description:
            "A high-energy dance competition where students showcase classical, western, folk and contemporary dance performances.",
        date: new Date(Date.now() + 26 * 24 * 60 * 60 * 1000),
        location: "College Auditorium, Sobhasaria, Sikar",
        category: "cultural",
        totalSeats: 600,
        ticketPrice: 100,
        imageUrl:
            "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?auto=format&fit=crop&q=80&w=800",
    },
    {
        title: "Singing & Music Competition",
        description:
            "A musical competition featuring solo singing, instrumental performances and student bands.",
        date: new Date(Date.now() + 29 * 24 * 60 * 60 * 1000),
        location: "College Auditorium, Sobhasaria, Sikar",
        category: "cultural",
        totalSeats: 500,
        ticketPrice: 80,
        imageUrl:
            "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&q=80&w=800",
    },
    {
        title: "Drama & Theatre Night",
        description:
            "A creative theatre evening featuring student plays, social dramas, comedy acts and stage performances.",
        date: new Date(Date.now() + 31 * 24 * 60 * 60 * 1000),
        location: "College Auditorium, Sobhasaria, Sikar",
        category: "cultural",
        totalSeats: 500,
        ticketPrice: 100,
        imageUrl:
            "https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&q=80&w=800",
    },
    {
        title: "Farewell Celebration - Batch 2026",
        description:
            "A memorable farewell celebration for graduating students with cultural performances, memories, awards, music and special moments.",
        date: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
        location: "College Auditorium, Sobhasaria, Sikar",
        category: "cultural",
        totalSeats: 750,
        ticketPrice: 450,
        imageUrl:
            "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&q=80&w=800",
    },

    // ==================================================
    // 💼 CAREER & BUSINESS - 5 EVENTS
    // ==================================================

    {
        title: "Career & Placement Drive",
        description:
            "Meet recruiters and industry professionals, explore career opportunities, attend placement sessions and learn about internships and jobs.",
        date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        location: "Seminar Hall, Sobhasaria Group of Institutions, Sikar",
        category: "career",
        totalSeats: 400,
        ticketPrice: 0,
        imageUrl:
            "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=800",
    },
    {
        title: "Resume Building & Interview Workshop",
        description:
            "A practical workshop helping students build professional resumes and prepare for technical and HR interviews.",
        date: new Date(Date.now() + 27 * 24 * 60 * 60 * 1000),
        location: "Seminar Hall, Sobhasaria Group of Institutions, Sikar",
        category: "career",
        totalSeats: 300,
        ticketPrice: 0,
        imageUrl:
            "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=800",
    },
    {
        title: "Entrepreneurship & Startup Summit",
        description:
            "An engaging entrepreneurship summit where students learn about startup ideas, business planning, innovation, funding, leadership and building successful ventures.",
        date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        location: "Seminar Hall, Sobhasaria Group of Institutions, Sikar",
        category: "business",
        totalSeats: 300,
        ticketPrice: 200,
        imageUrl:
            "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800",
    },
    {
        title: "Startup Idea Competition",
        description:
            "Students present innovative startup ideas and business models before a panel of mentors and industry experts.",
        date: new Date(Date.now() + 33 * 24 * 60 * 60 * 1000),
        location: "Innovation Hall, Sobhasaria, Sikar",
        category: "business",
        totalSeats: 250,
        ticketPrice: 100,
        imageUrl:
            "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=800",
    },
    {
        title: "Business Leadership Workshop",
        description:
            "An interactive workshop covering leadership, communication, teamwork, decision making and business management.",
        date: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
        location: "Conference Hall, Sobhasaria, Sikar",
        category: "business",
        totalSeats: 300,
        ticketPrice: 50,
        imageUrl:
            "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&q=80&w=800",
    },

    // ==================================================
    // 🎉 ENTERTAINMENT - 5 EVENTS
    // ==================================================

    {
        title: "Freshers Welcome Party",
        description:
            "A special welcome celebration for new students featuring music, dance, fun activities, games and an exciting introduction to campus life.",
        date: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
        location: "College Auditorium, Sobhasaria, Sikar",
        category: "entertainment",
        totalSeats: 700,
        ticketPrice: 500,
        imageUrl:
            "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800",
    },
    {
        title: "Student Talent & Open Mic Night",
        description:
            "A fun student talent evening featuring singing, poetry, stand-up comedy, storytelling, instrumental performances and other creative talents.",
        date: new Date(Date.now() + 32 * 24 * 60 * 60 * 1000),
        location: "College Auditorium, Sobhasaria, Sikar",
        category: "entertainment",
        totalSeats: 500,
        ticketPrice: 250,
        imageUrl:
            "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&q=80&w=800",
    },
    {
        title: "DJ Night - Campus Beats",
        description:
            "An energetic college DJ night featuring music, lights, dance and an unforgettable campus celebration.",
        date: new Date(Date.now() + 36 * 24 * 60 * 60 * 1000),
        location: "College Open Ground, Sobhasaria, Sikar",
        category: "entertainment",
        totalSeats: 1000,
        ticketPrice: 300,
        imageUrl:
            "https://images.unsplash.com/photo-1571266028243-d220c9c3b4c8?auto=format&fit=crop&q=80&w=800",
    },
    {
        title: "Comedy & Open Mic Night",
        description:
            "A fun evening featuring stand-up comedy, poetry, storytelling and entertaining student performances.",
        date: new Date(Date.now() + 38 * 24 * 60 * 60 * 1000),
        location: "College Auditorium, Sobhasaria, Sikar",
        category: "entertainment",
        totalSeats: 500,
        ticketPrice: 100,
        imageUrl:
            "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&q=80&w=800",
    },
    {
        title: "College Movie Night",
        description:
            "A relaxed movie night for students with a big-screen campus experience, snacks and entertainment.",
        date: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
        location: "College Open Theatre, Sobhasaria, Sikar",
        category: "entertainment",
        totalSeats: 600,
        ticketPrice: 20,
        imageUrl:
            "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=800",
    },
];

// ======================================================
// SEED DATABASE (NON-DESTRUCTIVE)
// ======================================================

const seedDatabase = async () => {
    try {
        const MONGO_URI =
            process.env.MONGODB_URI || "mongodb://localhost:27017/eventora";

        await mongoose.connect(MONGO_URI);

        console.log("=================================");
        console.log("✅ MongoDB connected");
        console.log("=================================");

        // ==================================================
        // USERS — only create if they don't already exist
        // (never deletes existing users/bookings)
        // ==================================================

        const salt = await bcrypt.genSalt(10);
        let createdUsersCount = 0;

        for (const user of users) {
            const existing = await User.findOne({ email: user.email });
            if (!existing) {
                await User.create({
                    ...user,
                    password: bcrypt.hashSync(user.password, salt),
                    isVerified: true,
                });
                createdUsersCount++;
            }
        }

        console.log(`👤 New users created: ${createdUsersCount} (existing users untouched)`);

        const adminUser = await User.findOne({ role: "admin" });

        // ==================================================
        // EVENTS — upsert by title (create if new, update
        // details if it already exists, WITHOUT touching
        // availableSeats or deleting related bookings)
        // ==================================================

        let created = 0;
        let updated = 0;

        for (const event of events) {
            const existing = await Event.findOne({ title: event.title });

            if (existing) {
                // Update details but keep availableSeats as-is
                // (so seats already booked stay deducted correctly)
                existing.description = event.description;
                existing.date = event.date;
                existing.location = event.location;
                existing.category = event.category;
                existing.ticketPrice = event.ticketPrice;
                existing.imageUrl = event.imageUrl || existing.imageUrl;

                // Only bump totalSeats/availableSeats if you increased capacity
                if (event.totalSeats > existing.totalSeats) {
                    const diff = event.totalSeats - existing.totalSeats;
                    existing.totalSeats = event.totalSeats;
                    existing.availableSeats += diff;
                }

                await existing.save();
                updated++;
            } else {
                await Event.create({
                    ...event,
                    availableSeats: event.totalSeats,
                    createdBy: adminUser._id,
                });
                created++;
            }
        }

        console.log(`🎉 Events created: ${created}, updated: ${updated}`);
        console.log("");

        // ==================================================
        // CATEGORY SUMMARY
        // ==================================================

        const sportsCount = events.filter(e => e.category === "sports").length;
        const technologyCount = events.filter(e => e.category === "technology").length;
        const culturalCount = events.filter(e => e.category === "cultural").length;
        const careerCount = events.filter(e => e.category === "career" || e.category === "business").length;
        const entertainmentCount = events.filter(e => e.category === "entertainment").length;

        console.log("=================================");
        console.log("📊 CATEGORY SUMMARY");
        console.log("=================================");
        console.log(`🏏 Sports: ${sportsCount}`);
        console.log(`💻 Technology: ${technologyCount}`);
        console.log(`🎭 Cultural: ${culturalCount}`);
        console.log(`💼 Career & Business: ${careerCount}`);
        console.log(`🎉 Entertainment: ${entertainmentCount}`);
        console.log("=================================");

        console.log("");
        console.log("✅ Database synced successfully (no data was deleted)!");
        console.log("");

        process.exit(0);

    } catch (error) {
        console.error("❌ Seed Error:", error);
        process.exit(1);
    }
};

seedDatabase();
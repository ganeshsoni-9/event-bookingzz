import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/axios";

import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaSearch,
  FaRegClock,
  FaTicketAlt,
  FaShieldAlt,
  FaArrowRight,
} from "react-icons/fa";

const categories = [
  {
    name: "Sports",
    key: "sports",
    icon: "🏏",
    description:
      "Cricket, football, volleyball, badminton and athletics events.",
    gradient: "from-orange-500 to-red-600",
    shadow: "hover:shadow-orange-500/30",
  },
  {
    name: "Technology",
    key: "technology",
    icon: "💻",
    description:
      "Coding, hackathons, AI, robotics and technical competitions.",
    gradient: "from-blue-500 to-indigo-600",
    shadow: "hover:shadow-blue-500/30",
  },
  {
    name: "Cultural",
    key: "cultural",
    icon: "🎭",
    description:
      "Dance, singing, drama, fashion and cultural celebrations.",
    gradient: "from-pink-500 to-purple-600",
    shadow: "hover:shadow-pink-500/30",
  },
  {
    name: "Career & Business",
    key: "career-business",
    icon: "💼",
    description:
      "Placements, startups, entrepreneurship and career workshops.",
    gradient: "from-emerald-500 to-teal-600",
    shadow: "hover:shadow-emerald-500/30",
  },
  {
    name: "Entertainment",
    key: "entertainment",
    icon: "🎉",
    description:
      "Freshers, open mic, DJ nights, talent shows and fun events.",
    gradient: "from-violet-500 to-fuchsia-600",
    shadow: "hover:shadow-violet-500/30",
  },
];

const Home = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchEvents();
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [search]);

  const fetchEvents = async () => {
    try {
      setLoading(true);

      const { data } = await api.get(
        `/events?search=${encodeURIComponent(search)}`
      );

      setEvents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching events:", error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{
        backgroundImage:
          "linear-gradient(rgba(15, 23, 42, 0.70), rgba(15, 23, 42, 0.70)), url('/college-bg.jpeg')",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ================= HERO ================= */}
        <section className="relative bg-black text-white rounded-3xl overflow-hidden mb-16 shadow-2xl">

          <div
            className="absolute inset-0 opacity-40 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=3000&auto=format&fit=crop')",
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />

          <div className="relative z-10 p-6 sm:p-10 md:p-20 text-center flex flex-col items-center">

            <span className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase mb-6 border border-white/20">
              Welcome to Sobhasaria Event Adda
            </span>

            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black mb-6 leading-tight tracking-tight">
              Discover Campus Events
              <br />

              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500">
                Like Never Before
              </span>
            </h1>

            <p className="text-gray-300 text-base sm:text-lg md:text-xl mb-10 max-w-3xl mx-auto font-light leading-relaxed">
              Explore upcoming college events, workshops, seminars, cultural
              programs, technical competitions and entertainment events at
              Sobhasaria Group of Institutions.
            </p>

            {/* SEARCH */}
            <div className="w-full max-w-2xl relative flex items-center shadow-2xl group">

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
        </section>

        {/* ================= FEATURES ================= */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">

          <div className="group bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-md border border-gray-200 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl">

            <div className="w-16 h-16 bg-gray-900 text-white rounded-2xl flex items-center justify-center text-2xl mb-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:bg-indigo-600">
              <FaRegClock />
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600">
              Easy Event Booking
            </h3>

            <p className="text-gray-500 text-sm leading-relaxed">
              Book your favorite college events quickly and secure your seat
              in just a few clicks.
            </p>
          </div>

          <div className="group bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-md border border-gray-200 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl">

            <div className="w-16 h-16 bg-gray-900 text-white rounded-2xl flex items-center justify-center text-2xl mb-6 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-6 group-hover:bg-blue-600">
              <FaTicketAlt />
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600">
              Digital Event Pass
            </h3>

            <p className="text-gray-500 text-sm leading-relaxed">
              Access your event bookings and manage your digital tickets easily
              from one place.
            </p>
          </div>

          <div className="group bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-md border border-gray-200 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl">

            <div className="w-16 h-16 bg-gray-900 text-white rounded-2xl flex items-center justify-center text-2xl mb-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:bg-emerald-600">
              <FaShieldAlt />
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600">
              Verified College Events
            </h3>

            <p className="text-gray-500 text-sm leading-relaxed">
              Discover trusted college events with secure and reliable
              registration for students.
            </p>
          </div>

        </section>

        {/* ================= CATEGORY SECTION ================= */}
        {/* ================= PROFESSIONAL CATEGORY SECTION ================= */}
<section className="mb-24">

  {/* SECTION HEADER */}
  <div className="text-center mb-14">

    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/20 text-white px-5 py-2 rounded-full text-sm font-bold tracking-widest uppercase mb-5 shadow-lg">
      <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></span>
      Explore Events
    </div>

    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-5">
      Find Your{" "}
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300">
        Perfect Event
      </span>
    </h2>

    <p className="text-gray-300 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
      Discover exciting events, competitions, workshops and celebrations
      happening at Sobhasaria Group of Institutions.
    </p>

  </div>


  {/* CATEGORY GRID */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

    {categories.map((category, index) => (

      <Link
        key={category.key}
        to={`/events/category/${category.key}`}
        className="
          group relative overflow-hidden
          min-h-[300px]
          rounded-[28px]
          bg-white/[0.08]
          backdrop-blur-2xl
          border border-white/20
          p-7
          shadow-2xl
          transition-all duration-500
          hover:-translate-y-3
          hover:border-white/40
          hover:bg-white/[0.13]
        "
        style={{
          animationDelay: `${index * 120}ms`,
        }}
      >

        {/* BACKGROUND GLOW */}
        <div
          className={`
            absolute
            -top-24
            -right-24
            w-64
            h-64
            rounded-full
            bg-gradient-to-br
            ${category.gradient}
            opacity-10
            blur-3xl
            transition-all
            duration-700
            group-hover:opacity-30
            group-hover:scale-125
          `}
        />

        {/* SECOND GLOW */}
        <div
          className={`
            absolute
            -bottom-24
            -left-24
            w-52
            h-52
            rounded-full
            bg-gradient-to-br
            ${category.gradient}
            opacity-5
            blur-3xl
            transition-all
            duration-700
            group-hover:opacity-20
          `}
        />


        {/* TOP ROW */}
        <div className="relative z-10 flex items-start justify-between mb-8">

          {/* ICON */}
          <div
            className={`
              w-16
              h-16
              sm:w-20
              sm:h-20
              rounded-2xl
              bg-gradient-to-br
              ${category.gradient}
              flex
              items-center
              justify-center
              text-3xl
              sm:text-4xl
              shadow-xl
              transition-all
              duration-500
              group-hover:scale-110
              group-hover:rotate-6
            `}
          >
            {category.icon}
          </div>


          {/* NUMBER */}
          <div className="text-white/10 text-6xl font-black leading-none transition-all duration-500 group-hover:text-white/20">
            0{index + 1}
          </div>

        </div>


        {/* CATEGORY TITLE */}
        <div className="relative z-10">

          <h3
            className="
              text-2xl
              sm:text-3xl
              font-black
              text-white
              mb-3
              tracking-tight
              transition-all
              duration-300
              group-hover:translate-x-1
            "
          >
            {category.name}
          </h3>


          {/* DESCRIPTION */}
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-md mb-7">
            {category.description}
          </p>


          {/* BOTTOM ACTION */}
          <div className="flex items-center justify-between">

            <div
              className="
                inline-flex
                items-center
                gap-2
                text-white
                font-bold
                text-sm
                sm:text-base
                transition-all
                duration-300
                group-hover:text-indigo-300
              "
            >
              Explore Events

              <FaArrowRight
                className="
                  transition-transform
                  duration-300
                  group-hover:translate-x-2
                "
              />
            </div>


            {/* SMALL DOTS */}
            <div className="flex gap-1.5">

              <span className="w-1.5 h-1.5 rounded-full bg-white/30"></span>

              <span className="w-1.5 h-1.5 rounded-full bg-white/20"></span>

              <span className="w-1.5 h-1.5 rounded-full bg-white/10"></span>

            </div>

          </div>

        </div>


        {/* BOTTOM GRADIENT LINE */}
        <div
          className={`
            absolute
            bottom-0
            left-0
            h-1
            bg-gradient-to-r
            ${category.gradient}
            w-0
            group-hover:w-full
            transition-all
            duration-700
          `}
        />


        {/* HOVER BORDER GLOW */}
        <div
          className={`
            absolute
            inset-0
            rounded-[28px]
            bg-gradient-to-br
            ${category.gradient}
            opacity-0
            group-hover:opacity-5
            transition-opacity
            duration-500
            pointer-events-none
          `}
        />

      </Link>

    ))}

  </div>


  {/* BOTTOM INFO */}
  <div className="mt-10 text-center">

    <div className="inline-flex flex-wrap justify-center items-center gap-3 sm:gap-5 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl px-5 sm:px-7 py-4">

      <div className="flex items-center gap-2 text-gray-300 text-sm">
        <span className="w-2 h-2 rounded-full bg-green-400"></span>
        5 Categories
      </div>

      <div className="hidden sm:block w-px h-5 bg-white/20"></div>

      <div className="flex items-center gap-2 text-gray-300 text-sm">
        <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
        Multiple Events
      </div>

      <div className="hidden sm:block w-px h-5 bg-white/20"></div>

      <div className="flex items-center gap-2 text-gray-300 text-sm">
        <span className="w-2 h-2 rounded-full bg-purple-400"></span>
        Easy Booking
      </div>

    </div>

  </div>

</section>

        {/* ================= SEARCH RESULTS ================= */}
        {search.trim() !== "" && (
          <section className="mb-16">

            <div className="bg-white/95 rounded-2xl p-5 sm:p-7 shadow-xl">

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-7 border-b pb-5">

                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
                    Search Results
                  </h2>

                  <p className="text-gray-500 text-sm mt-1">
                    Results for "{search}"
                  </p>
                </div>

                <div className="text-gray-500 font-semibold">
                  {events.length} results
                </div>

              </div>

              {loading ? (
                <div className="text-center py-16 text-lg font-semibold text-gray-600">
                  Loading events...
                </div>
              ) : events.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                  No events found.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">

                  {events.map((event) => (
                    <EventCard key={event._id} event={event} />
                  ))}

                </div>
              )}

            </div>
          </section>
        )}

        {/* ================= FOOTER ================= */}
        <footer className="pt-10 pb-6 border-t border-white/30 text-center text-gray-200 text-sm">
          © {new Date().getFullYear()} Sobhasaria EventAdda. All rights
          reserved.
        </footer>

      </div>
    </div>
  );
};

/* =========================================================
   EVENT CARD
========================================================= */

const EventCard = ({ event }) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col border border-gray-100">

      {/* IMAGE */}
      <div className="h-44 bg-gray-200 overflow-hidden relative">

        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600 font-bold text-xl">
            {event.category}
          </div>
        )}

        {/* PRICE */}
        <div className="absolute top-4 right-4 bg-white/95 px-3 py-1.5 rounded-full text-sm font-bold shadow">
          {event.ticketPrice === 0 ? "FREE" : `₹${event.ticketPrice}`}
        </div>

        {/* CATEGORY */}
        <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase">
          {event.category}
        </div>

      </div>

      {/* CONTENT */}
      <div className="p-5 flex flex-col flex-grow">

        <h3 className="text-lg font-bold mb-4 line-clamp-2">
          {event.title}
        </h3>

        <div className="text-sm text-gray-600 space-y-3 mb-5">

          <div className="flex items-start gap-2">
            <FaCalendarAlt className="mt-1 shrink-0" />
            <span>
              {event.date
                ? new Date(event.date).toDateString()
                : "Date unavailable"}
            </span>
          </div>

          <div className="flex items-start gap-2">
            <FaMapMarkerAlt className="mt-1 shrink-0" />
            <span>{event.location}</span>
          </div>

        </div>

        <Link
          to={`/events/${event._id}`}
          className="mt-auto text-center bg-gray-900 text-white hover:bg-indigo-600 py-3 rounded-xl font-bold transition-colors"
        >
          View Details
        </Link>

      </div>
    </div>
  );
};

export default Home;
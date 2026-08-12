import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../utils/axios";

import {
  FaArrowLeft,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaSearch,
  FaTicketAlt,
} from "react-icons/fa";

const categoryInfo = {
  sports: {
    title: "Sports Events",
    subtitle:
      "Cricket, football, volleyball, badminton and athletics events at Sobhasaria.",
    icon: "🏏",
    gradient: "from-orange-500 to-red-600",
  },

  technology: {
    title: "Technology Events",
    subtitle:
      "Coding competitions, hackathons, AI, robotics and innovative technology events.",
    icon: "💻",
    gradient: "from-blue-500 to-indigo-600",
  },

  cultural: {
    title: "Cultural Events",
    subtitle:
      "Dance, singing, drama, fashion shows and cultural celebrations.",
    icon: "🎭",
    gradient: "from-pink-500 to-purple-600",
  },

  career: {
    title: "Career & Business Events",
    subtitle:
      "Placements, entrepreneurship, startups, workshops and professional events.",
    icon: "💼",
    gradient: "from-emerald-500 to-teal-600",
  },

  business: {
    title: "Career & Business Events",
    subtitle:
      "Placements, entrepreneurship, startups, workshops and professional events.",
    icon: "💼",
    gradient: "from-emerald-500 to-teal-600",
  },

  "career-business": {
    title: "Career & Business Events",
    subtitle:
      "Placements, entrepreneurship, startups, workshops and professional events.",
    icon: "💼",
    gradient: "from-emerald-500 to-teal-600",
  },

  entertainment: {
    title: "Entertainment Events",
    subtitle:
      "Freshers, open mic, talent shows, DJ nights and exciting college celebrations.",
    icon: "🎉",
    gradient: "from-violet-500 to-fuchsia-600",
  },
};

const CategoryEvents = () => {
  const { category } = useParams();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const currentCategory = categoryInfo[category];

  useEffect(() => {
    fetchEvents();
  }, [category]);

  const fetchEvents = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/events");

      const allEvents = Array.isArray(data) ? data : [];

      let filteredEvents = [];

      if (category === "career-business") {
        filteredEvents = allEvents.filter(
          (event) =>
            event.category === "career" ||
            event.category === "business"
        );
      } else {
        filteredEvents = allEvents.filter(
          (event) =>
            event.category?.toLowerCase() === category?.toLowerCase()
        );
      }

      setEvents(filteredEvents);
    } catch (error) {
      console.error("Error fetching category events:", error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const searchedEvents = events.filter((event) =>
    event.title?.toLowerCase().includes(search.toLowerCase())
  );

  if (!currentCategory) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">

          <h1 className="text-4xl font-black text-gray-900 mb-4">
            Category Not Found
          </h1>

          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl font-bold"
          >
            <FaArrowLeft />
            Back to Home
          </Link>

        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{
        backgroundImage:
          "linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.75)), url('/college-bg.jpeg')",
      }}
    >

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ================= BACK BUTTON ================= */}

        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-white/95 hover:bg-white text-gray-900 px-5 py-3 rounded-xl font-bold shadow-lg mb-8 transition-all hover:-translate-x-1"
        >
          <FaArrowLeft />
          Back to Categories
        </Link>

        {/* ================= HERO ================= */}

        <section
          className={`relative overflow-hidden rounded-3xl bg-gradient-to-r ${currentCategory.gradient} text-white p-8 sm:p-12 md:p-16 shadow-2xl mb-12`}
        >

          <div className="absolute -right-20 -top-20 text-[180px] opacity-10">
            {currentCategory.icon}
          </div>

          <div className="relative z-10">

            <div className="text-7xl mb-6">
              {currentCategory.icon}
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-5">
              {currentCategory.title}
            </h1>

            <p className="text-white/90 text-base sm:text-lg max-w-3xl leading-relaxed">
              {currentCategory.subtitle}
            </p>

            <div className="mt-7 inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-full font-bold">
              <FaTicketAlt />
              {events.length} Events Available
            </div>

          </div>
        </section>

        {/* ================= SEARCH ================= */}

        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-xl mb-10">

          <div className="relative">

            <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              placeholder={`Search in ${currentCategory.title}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-14 pr-5 py-4 rounded-xl bg-gray-100 border border-gray-200 focus:border-indigo-500 focus:outline-none text-gray-900"
            />

          </div>

        </div>

        {/* ================= EVENTS ================= */}

        <div className="bg-white/95 rounded-3xl p-5 sm:p-8 shadow-2xl">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8 border-b pb-5">

            <div>

              <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
                Upcoming {currentCategory.title}
              </h2>

              <p className="text-gray-500 mt-1">
                Sobhasaria Group of Institutions, Sikar
              </p>

            </div>

            <div className="bg-gray-100 px-4 py-2 rounded-full text-sm font-bold text-gray-600">
              {searchedEvents.length} Events
            </div>

          </div>

          {loading ? (
            <div className="py-20 text-center">

              <div className="w-12 h-12 border-4 border-gray-300 border-t-indigo-600 rounded-full animate-spin mx-auto mb-5" />

              <p className="text-gray-600 font-semibold">
                Loading events...
              </p>

            </div>
          ) : searchedEvents.length === 0 ? (
            <div className="py-20 text-center">

              <div className="text-6xl mb-5">
                😔
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No Events Found
              </h3>

              <p className="text-gray-500">
                There are currently no events in this category.
              </p>

            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">

              {searchedEvents.map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                  gradient={currentCategory.gradient}
                />
              ))}

            </div>
          )}

        </div>

        {/* ================= FOOTER ================= */}

        <footer className="text-center text-gray-200 text-sm py-10">
          © {new Date().getFullYear()} Sobhasaria EventAdda. All rights reserved.
        </footer>

      </div>
    </div>
  );
};

/* =========================================================
   EVENT CARD
========================================================= */

const EventCard = ({ event, gradient }) => {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col">

      {/* IMAGE */}

      <div className="h-48 bg-gray-200 relative overflow-hidden">

        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-2xl font-black`}
          >
            {event.category}
          </div>
        )}

        {/* PRICE */}

        <div className="absolute top-4 right-4 bg-white/95 px-3 py-1.5 rounded-full font-bold text-sm shadow">
          {event.ticketPrice === 0
            ? "FREE"
            : `₹${event.ticketPrice}`}
        </div>

        {/* CATEGORY */}

        <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold uppercase">
          {event.category}
        </div>

      </div>

      {/* CONTENT */}

      <div className="p-5 flex flex-col flex-grow">

        <h3 className="text-xl font-black text-gray-900 mb-4 line-clamp-2">
          {event.title}
        </h3>

        <div className="space-y-3 text-sm text-gray-600 mb-6">

          <div className="flex items-start gap-3">

            <FaCalendarAlt className="mt-1 text-indigo-600 shrink-0" />

            <span>
              {event.date
                ? new Date(event.date).toDateString()
                : "Date unavailable"}
            </span>

          </div>

          <div className="flex items-start gap-3">

            <FaMapMarkerAlt className="mt-1 text-red-500 shrink-0" />

            <span>{event.location}</span>

          </div>

        </div>

        <Link
          to={`/events/${event._id}`}
          className="mt-auto text-center bg-gray-900 hover:bg-indigo-600 text-white py-3 rounded-xl font-bold transition-all"
        >
          View Details
        </Link>

      </div>

    </div>
  );
};

export default CategoryEvents;
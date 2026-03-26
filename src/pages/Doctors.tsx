import { motion } from 'motion/react';
import { Search, Filter, Star, Clock, MapPin } from 'lucide-react';
import { DOCTORS } from '../constants';
import { Link } from 'react-router-dom';

export default function Doctors() {
  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-bold text-emerald-900 mb-2">Our Specialist Doctors</h1>
            <p className="text-emerald-900/60">Find and book appointments with our expert medical team.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400" />
              <input
                type="text"
                placeholder="Search doctors..."
                className="pl-10 pr-4 py-2 bg-white border border-emerald-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full sm:w-64"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-emerald-100 rounded-lg text-emerald-900 hover:bg-emerald-50 transition-colors">
              <Filter className="h-4 w-4" />
              Filter
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {DOCTORS.map((doctor, i) => (
            <motion.div
              key={doctor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden border border-emerald-50 shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 transition-all group"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-bold text-emerald-900">4.9</span>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-2 py-1 rounded">
                    {doctor.specialty}
                  </span>
                  <h3 className="text-xl font-bold text-emerald-900 mt-2">{doctor.name}</h3>
                  <p className="text-sm text-emerald-900/60 mt-1">{doctor.experience} Years Experience</p>
                </div>

                <p className="text-sm text-emerald-900/70 mb-6 line-clamp-2 leading-relaxed">
                  {doctor.description}
                </p>

                <div className="flex items-center gap-4 mb-6 text-sm text-emerald-900/60">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>Available Today</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>Main Clinic</span>
                  </div>
                </div>

                <Link
                  to={`/booking?doctor=${doctor.id}`}
                  className="block w-full text-center bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
                >
                  Book Appointment
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

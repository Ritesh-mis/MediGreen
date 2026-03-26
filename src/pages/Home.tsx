import { motion } from 'motion/react';
import { ArrowRight, ShieldCheck, Clock, Users, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DEPARTMENTS } from '../constants';

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center overflow-hidden bg-emerald-900">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=2000"
            alt="Hospital Hallway"
            className="w-full h-full object-cover opacity-30"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Your Health is Our <span className="text-emerald-400">Top Priority</span>
            </h1>
            <p className="text-xl text-emerald-100 mb-8 leading-relaxed">
              Experience world-class healthcare with state-of-the-art technology and compassionate medical professionals.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/booking"
                className="bg-emerald-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-emerald-600 transition-all flex items-center gap-2 shadow-lg shadow-emerald-900/20"
              >
                Book Appointment <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/doctors"
                className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all"
              >
                Find a Doctor
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b border-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Specialist Doctors', value: '150+', icon: Users },
              { label: 'Happy Patients', value: '50k+', icon: ShieldCheck },
              { label: 'Years Experience', value: '25+', icon: Clock },
              { label: 'Modern Rooms', value: '200+', icon: Calendar },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center text-center p-4">
                <div className="bg-emerald-50 p-3 rounded-full mb-4">
                  <stat.icon className="h-6 w-6 text-emerald-600" />
                </div>
                <span className="text-3xl font-bold text-emerald-900">{stat.value}</span>
                <span className="text-sm text-emerald-600/70 font-medium">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-emerald-900 mb-4">Our Specialized Departments</h2>
            <p className="text-emerald-900/60 max-w-2xl mx-auto">
              We provide a wide range of medical services with expert care and advanced technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {DEPARTMENTS.map((dept, i) => (
              <motion.div
                key={dept.id}
                whileHover={{ y: -10 }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-emerald-50 hover:shadow-xl hover:shadow-emerald-900/5 transition-all"
              >
                <div className="bg-emerald-50 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-2xl">🏥</span>
                </div>
                <h3 className="text-xl font-bold text-emerald-900 mb-3">{dept.name}</h3>
                <p className="text-emerald-900/60 mb-6 leading-relaxed">
                  {dept.description}
                </p>
                <Link
                  to={`/departments/${dept.id}`}
                  className="text-emerald-600 font-semibold flex items-center gap-2 hover:gap-3 transition-all"
                >
                  Learn More <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-emerald-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-8">Need Immediate Medical Assistance?</h2>
          <p className="text-emerald-50 text-xl mb-12 max-w-2xl mx-auto opacity-90">
            Our emergency department is open 24/7. Call us or book an appointment online for non-emergencies.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <a
              href="tel:+12345678900"
              className="bg-white text-emerald-600 px-8 py-4 rounded-xl font-bold hover:bg-emerald-50 transition-all shadow-lg"
            >
              Call: +1 (234) 567-8900
            </a>
            <Link
              to="/booking"
              className="bg-emerald-800 text-white px-8 py-4 rounded-xl font-bold hover:bg-emerald-900 transition-all shadow-lg"
            >
              Book Appointment Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

import { motion } from 'motion/react';
import { DEPARTMENTS } from '../constants';
import { ArrowRight, Heart, Brain, Activity, Baby, Stethoscope } from 'lucide-react';
import { Link } from 'react-router-dom';

const iconMap: Record<string, any> = {
  Heart,
  Brain,
  Activity,
  Baby,
  Stethoscope,
};

export default function Departments() {
  return (
    <div className="py-24 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-emerald-900 mb-4">Our Specialized Departments</h1>
          <p className="text-emerald-900/60 max-w-2xl mx-auto">
            We provide comprehensive medical services across various specialties, ensuring the best care for every patient.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {DEPARTMENTS.map((dept, i) => {
            const Icon = iconMap[dept.icon] || Stethoscope;
            return (
              <motion.div
                key={dept.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-10 rounded-3xl shadow-sm border border-emerald-50 hover:shadow-xl hover:shadow-emerald-900/5 transition-all group"
              >
                <div className="bg-emerald-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-emerald-600 transition-colors">
                  <Icon className="h-8 w-8 text-emerald-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-2xl font-bold text-emerald-900 mb-4">{dept.name}</h3>
                <p className="text-emerald-900/60 mb-8 leading-relaxed">
                  {dept.description} Our team of specialists uses the latest diagnostic tools and treatment methods to provide personalized care.
                </p>
                <Link
                  to="/doctors"
                  className="inline-flex items-center gap-2 text-emerald-600 font-bold hover:gap-3 transition-all"
                >
                  Find Specialists <ArrowRight className="h-5 w-5" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

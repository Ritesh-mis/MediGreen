import { Stethoscope, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-emerald-950 text-emerald-50 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-emerald-600 p-2 rounded-lg">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">MediGreen</span>
            </Link>
            <p className="text-emerald-200/70 text-sm leading-relaxed">
              Providing world-class healthcare with compassion and innovation. Your health is our priority.
            </p>
            <div className="flex gap-4">
              <Facebook className="h-5 w-5 text-emerald-400 cursor-pointer hover:text-emerald-300" />
              <Twitter className="h-5 w-5 text-emerald-400 cursor-pointer hover:text-emerald-300" />
              <Instagram className="h-5 w-5 text-emerald-400 cursor-pointer hover:text-emerald-300" />
              <Linkedin className="h-5 w-5 text-emerald-400 cursor-pointer hover:text-emerald-300" />
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3 text-sm text-emerald-200/70">
              <li><Link to="/" className="hover:text-emerald-400 transition-colors">Home</Link></li>
              <li><Link to="/departments" className="hover:text-emerald-400 transition-colors">Departments</Link></li>
              <li><Link to="/doctors" className="hover:text-emerald-400 transition-colors">Doctors</Link></li>
              <li><Link to="/booking" className="hover:text-emerald-400 transition-colors">Book Appointment</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6">Departments</h3>
            <ul className="space-y-3 text-sm text-emerald-200/70">
              <li>Cardiology</li>
              <li>Neurology</li>
              <li>Orthopedics</li>
              <li>Pediatrics</li>
              <li>Dermatology</li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-4 text-sm text-emerald-200/70">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-emerald-400 shrink-0" />
                <span>123 Medical Plaza, Health City, HC 45678</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-emerald-400 shrink-0" />
                <span>+1 (234) 567-8900</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-emerald-400 shrink-0" />
                <span>contact@medigreen.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-emerald-900 text-center text-sm text-emerald-200/50">
          <p>© {new Date().getFullYear()} MediGreen Hospital. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

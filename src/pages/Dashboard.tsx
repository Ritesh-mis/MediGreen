import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, FileText, Upload, User as UserIcon, LogOut, ChevronRight, Bell, Search } from 'lucide-react';
import { cn } from '../lib/utils';
import { format, addDays } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, onSnapshot, orderBy, addDoc } from 'firebase/firestore';
import { Appointment, Report } from '../types';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState<'appointments' | 'reports'>('appointments');
  const [appointments, setAppointments] = React.useState<Appointment[]>([]);
  const [reports, setReports] = React.useState<Report[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [uploading, setUploading] = React.useState(false);

  React.useEffect(() => {
    if (!user) return;

    const appointmentsPath = 'appointments';
    const qApts = query(
      collection(db, appointmentsPath),
      where('patientId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribeApts = onSnapshot(qApts, (snapshot) => {
      const apts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment));
      setAppointments(apts);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, appointmentsPath);
    });

    const reportsPath = 'reports';
    const qReports = query(
      collection(db, reportsPath),
      where('patientId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribeReports = onSnapshot(qReports, (snapshot) => {
      const reps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Report));
      setReports(reps);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, reportsPath);
    });

    return () => {
      unsubscribeApts();
      unsubscribeReports();
    };
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const handleUploadReport = async () => {
    if (!user) return;
    setUploading(true);
    const reportsPath = 'reports';
    try {
      await addDoc(collection(db, reportsPath), {
        patientId: user.uid,
        title: `Medical Report - ${format(new Date(), 'MMM d, yyyy')}`,
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, reportsPath);
    } finally {
      setUploading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-emerald-100 hidden lg:flex flex-col">
        <div className="p-6 border-b border-emerald-100">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold">
              {user.displayName[0]}
            </div>
            <div>
              <p className="font-bold text-emerald-900">{user.displayName}</p>
              <p className="text-xs text-emerald-600 font-medium">Patient</p>
            </div>
          </div>
        </div>

        <nav className="flex-grow p-4 space-y-2">
          {[
            { id: 'appointments', label: 'Appointments', icon: Calendar },
            { id: 'reports', label: 'Medical Reports', icon: FileText },
            { id: 'profile', label: 'My Profile', icon: UserIcon },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                activeTab === item.id
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                  : "text-emerald-900/60 hover:bg-emerald-50 hover:text-emerald-600"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-emerald-100">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8">
        <header className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-bold text-emerald-900">Patient Dashboard</h1>
            <p className="text-emerald-900/60">Welcome back, {user.displayName.split(' ')[0]}! Here's your health summary.</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400" />
              <input
                type="text"
                placeholder="Search records..."
                className="pl-10 pr-4 py-2 bg-white border border-emerald-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 w-64"
              />
            </div>
            <button className="p-2 bg-white border border-emerald-100 rounded-xl text-emerald-900 hover:bg-emerald-50 relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column: Main List */}
          <div className="xl:col-span-2 space-y-8">
            {activeTab === 'appointments' ? (
              <section className="bg-white p-8 rounded-3xl shadow-sm border border-emerald-50">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-bold text-emerald-900">Upcoming Appointments</h2>
                  <button className="text-emerald-600 text-sm font-bold hover:underline">View All</button>
                </div>

                <div className="space-y-4">
                  {appointments.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-emerald-50 rounded-2xl">
                      <p className="text-emerald-900/40 font-medium">No appointments found.</p>
                      <button 
                        onClick={() => navigate('/booking')}
                        className="mt-4 text-emerald-600 font-bold hover:underline"
                      >
                        Book your first appointment
                      </button>
                    </div>
                  ) : (
                    appointments.map((apt) => (
                      <div
                        key={apt.id}
                        className="flex items-center justify-between p-6 rounded-2xl border border-emerald-50 hover:border-emerald-200 transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                            <Calendar className="h-6 w-6 text-emerald-600" />
                          </div>
                          <div>
                            <h3 className="font-bold text-emerald-900">{apt.doctorName}</h3>
                            <p className="text-sm text-emerald-600 font-medium">Consultation</p>
                          </div>
                        </div>

                        <div className="hidden md:flex flex-col items-end">
                          <p className="font-bold text-emerald-900">{apt.date}</p>
                          <p className="text-sm text-emerald-900/60">{apt.time}</p>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className={cn(
                            "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                            apt.status === 'confirmed' ? "bg-emerald-100 text-emerald-700" : 
                            apt.status === 'pending' ? "bg-yellow-100 text-yellow-700" :
                            "bg-red-100 text-red-700"
                          )}>
                            {apt.status}
                          </span>
                          <ChevronRight className="h-5 w-5 text-emerald-200 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>
            ) : (
              <section className="bg-white p-8 rounded-3xl shadow-sm border border-emerald-50">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-bold text-emerald-900">Medical Reports</h2>
                  <button 
                    onClick={handleUploadReport}
                    disabled={uploading}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    <Upload className="h-4 w-4" /> {uploading ? 'Uploading...' : 'Upload New'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reports.length === 0 ? (
                    <div className="col-span-2 text-center py-12 border-2 border-dashed border-emerald-50 rounded-2xl">
                      <p className="text-emerald-900/40 font-medium">No reports uploaded yet.</p>
                    </div>
                  ) : (
                    reports.map((report) => (
                      <div
                        key={report.id}
                        className="p-6 rounded-2xl border border-emerald-50 hover:border-emerald-200 transition-all flex items-center gap-4"
                      >
                        <div className="h-12 w-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                          <FileText className="h-6 w-6 text-emerald-600" />
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-bold text-emerald-900">{report.title}</h3>
                          <p className="text-sm text-emerald-900/60">{format(new Date(report.createdAt), 'MMM d, yyyy')}</p>
                        </div>
                        <a 
                          href={report.fileUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-emerald-600 hover:text-emerald-700 font-bold text-sm"
                        >
                          View
                        </a>
                      </div>
                    ))
                  )}
                </div>
              </section>
            )}
          </div>

          {/* Right Column: Quick Actions & Summary */}
          <div className="space-y-8">
            <section className="bg-emerald-900 p-8 rounded-3xl text-white shadow-xl shadow-emerald-900/20">
              <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
              <div className="space-y-4">
                <button 
                  onClick={() => navigate('/booking')}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
                >
                  Book New Appointment
                </button>
                <button className="w-full bg-white/10 hover:bg-white/20 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2">
                  Contact Support
                </button>
              </div>
            </section>

            <section className="bg-white p-8 rounded-3xl shadow-sm border border-emerald-50">
              <h2 className="text-xl font-bold text-emerald-900 mb-6">Health Summary</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-emerald-900/60 text-sm">Blood Type</span>
                  <span className="font-bold text-emerald-900">O+ Positive</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-emerald-900/60 text-sm">Height</span>
                  <span className="font-bold text-emerald-900">175 cm</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-emerald-900/60 text-sm">Weight</span>
                  <span className="font-bold text-emerald-900">72 kg</span>
                </div>
                <div className="pt-4 border-t border-emerald-50">
                  <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider mb-2">Next Checkup</p>
                  <p className="text-sm text-emerald-900/70">
                    {appointments.length > 0 ? `Consultation with ${appointments[0].doctorName}` : 'No upcoming checkups'}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

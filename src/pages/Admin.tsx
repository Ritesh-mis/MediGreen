import React from 'react';
import { motion } from 'motion/react';
import { Users, Calendar, UserPlus, Search, Filter, MoreVertical, Check, X, Download, TrendingUp } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, query, onSnapshot, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Appointment, User } from '../types';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

export default function Admin() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState<'doctors' | 'appointments' | 'patients'>('appointments');
  const [appointments, setAppointments] = React.useState<Appointment[]>([]);
  const [patients, setPatients] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (authLoading) return;
    if (!isAdmin) {
      navigate('/dashboard');
      return;
    }

    const appointmentsPath = 'appointments';
    const qApts = query(collection(db, appointmentsPath), orderBy('createdAt', 'desc'));
    const unsubscribeApts = onSnapshot(qApts, (snapshot) => {
      const apts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment));
      setAppointments(apts);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, appointmentsPath);
    });

    const patientsPath = 'users';
    const qPatients = query(collection(db, patientsPath), orderBy('createdAt', 'desc'));
    const unsubscribePatients = onSnapshot(qPatients, (snapshot) => {
      const pts = snapshot.docs.map(doc => ({ ...doc.data() } as User));
      setPatients(pts.filter(p => p.role === 'patient'));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, patientsPath);
    });

    return () => {
      unsubscribeApts();
      unsubscribePatients();
    };
  }, [isAdmin, authLoading, navigate]);

  const handleStatusUpdate = async (id: string, status: 'confirmed' | 'cancelled') => {
    const path = `appointments/${id}`;
    try {
      await updateDoc(doc(db, 'appointments', id), { status });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const handleDeleteAppointment = async (id: string) => {
    const path = `appointments/${id}`;
    if (!window.confirm('Are you sure you want to delete this appointment?')) return;
    try {
      await deleteDoc(doc(db, 'appointments', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  const stats = [
    { label: 'Total Patients', value: patients.length.toString(), change: '+12%', icon: Users },
    { label: 'Total Appointments', value: appointments.length.toString(), change: '+5%', icon: Calendar },
    { label: 'Pending Requests', value: appointments.filter(a => a.status === 'pending').length.toString(), change: 'New', icon: UserPlus },
    { label: 'Revenue (Est)', value: `$${(appointments.filter(a => a.status === 'confirmed').length * 150).toLocaleString()}`, change: '+18%', icon: TrendingUp },
  ];

  if (authLoading || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-[1600px] mx-auto p-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-bold text-emerald-900">Admin Control Panel</h1>
            <p className="text-emerald-900/60">Manage hospital operations, staff, and patient records.</p>
          </div>

          <div className="flex items-center gap-4">
            <button className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center gap-2">
              <Download className="h-5 w-5" /> Export Data
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-3xl border border-emerald-50 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="bg-emerald-50 p-3 rounded-xl">
                  <stat.icon className="h-6 w-6 text-emerald-600" />
                </div>
                <span className={cn(
                  "text-xs font-bold px-2 py-1 rounded-full",
                  stat.change.startsWith('+') || stat.change === 'New' ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                )}>
                  {stat.change}
                </span>
              </div>
              <p className="text-emerald-900/60 text-sm font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-emerald-900 mt-1">{stat.value}</h3>
            </motion.div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-3xl border border-emerald-50 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-emerald-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex gap-4">
              {['appointments', 'patients'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={cn(
                    "px-6 py-2 rounded-xl text-sm font-bold capitalize transition-all",
                    activeTab === tab
                      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                      : "text-emerald-900/60 hover:bg-emerald-50"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 bg-slate-50 border border-emerald-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 w-64"
                />
              </div>
              <button className="p-2 bg-slate-50 border border-emerald-100 rounded-xl text-emerald-900 hover:bg-emerald-100">
                <Filter className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            {activeTab === 'appointments' ? (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-emerald-900/60 text-xs font-bold uppercase tracking-wider">
                    <th className="px-8 py-4">Patient</th>
                    <th className="px-8 py-4">Doctor</th>
                    <th className="px-8 py-4">Date & Time</th>
                    <th className="px-8 py-4">Status</th>
                    <th className="px-8 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-50">
                  {appointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-emerald-50/30 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold">
                            {apt.patientName[0]}
                          </div>
                          <span className="font-bold text-emerald-900">{apt.patientName}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-emerald-900 font-medium">{apt.doctorName}</span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-emerald-900 font-bold">{apt.date}</span>
                          <span className="text-emerald-900/60 text-xs">{apt.time}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                          apt.status === 'confirmed' ? "bg-emerald-100 text-emerald-700" :
                          apt.status === 'pending' ? "bg-yellow-100 text-yellow-700" :
                          "bg-red-100 text-red-700"
                        )}>
                          {apt.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {apt.status === 'pending' && (
                            <button 
                              onClick={() => handleStatusUpdate(apt.id, 'confirmed')}
                              className="p-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200"
                              title="Confirm"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                          )}
                          <button 
                            onClick={() => handleStatusUpdate(apt.id, 'cancelled')}
                            className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                            title="Cancel"
                          >
                            <X className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteAppointment(apt.id)}
                            className="p-2 text-emerald-400 hover:text-emerald-600"
                            title="Delete"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-emerald-900/60 text-xs font-bold uppercase tracking-wider">
                    <th className="px-8 py-4">Name</th>
                    <th className="px-8 py-4">Email</th>
                    <th className="px-8 py-4">Joined Date</th>
                    <th className="px-8 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-50">
                  {patients.map((patient) => (
                    <tr key={patient.uid} className="hover:bg-emerald-50/30 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold">
                            {patient.displayName[0]}
                          </div>
                          <span className="font-bold text-emerald-900">{patient.displayName}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-emerald-900 font-medium">{patient.email}</span>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-emerald-900 font-bold">{format(new Date(patient.createdAt), 'MMM d, yyyy')}</span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button className="p-2 text-emerald-400 hover:text-emerald-600">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="p-8 border-t border-emerald-50 flex items-center justify-between">
            <p className="text-sm text-emerald-900/60 font-medium">
              Showing {activeTab === 'appointments' ? appointments.length : patients.length} records
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

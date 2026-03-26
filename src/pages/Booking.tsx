import React from 'react';
import { motion } from 'motion/react';
import { Calendar as CalendarIcon, Clock, User, Stethoscope, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { DOCTORS } from '../constants';
import { format, addDays, startOfToday } from 'date-fns';
import { cn } from '../lib/utils';
import { collection, addDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { useAuth } from '../context/AuthContext';

export default function Booking() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const doctorId = searchParams.get('doctor');
  const selectedDoctor = DOCTORS.find(d => d.id === doctorId);

  const [step, setStep] = React.useState(1);
  const [selectedDate, setSelectedDate] = React.useState<Date>(startOfToday());
  const [selectedTime, setSelectedTime] = React.useState<string>('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const dates = Array.from({ length: 7 }, (_, i) => addDays(startOfToday(), i));

  const handleBooking = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!selectedDoctor || !selectedTime) return;

    setIsSubmitting(true);
    setError(null);
    const path = 'appointments';
    try {
      await addDoc(collection(db, path), {
        patientId: user.uid,
        patientName: user.displayName,
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: selectedTime,
        status: 'pending',
        createdAt: new Date().toISOString(),
      });
      setStep(3);
    } catch (err: any) {
      console.error("Booking error:", err);
      setError(err.message || "Failed to book appointment. Please try again.");
      // Don't re-throw here so we can show the error in UI
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === 3) {
    return (
      <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white p-12 rounded-3xl shadow-xl text-center border border-emerald-50"
        >
          <div className="mx-auto h-20 w-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="h-12 w-12 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-bold text-emerald-900 mb-4">Appointment Booked!</h2>
          <p className="text-emerald-900/60 mb-8 leading-relaxed">
            Your appointment with {selectedDoctor?.name} has been successfully scheduled for {format(selectedDate, 'MMMM d, yyyy')} at {selectedTime}.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
          >
            Go to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-emerald-900 mb-2">Book an Appointment</h1>
          <p className="text-emerald-900/60">Complete the steps below to schedule your visit.</p>
        </div>

        {!user && (
          <div className="mb-8 bg-emerald-50 border border-emerald-100 p-4 rounded-2xl text-center">
            <p className="text-emerald-900 font-medium">Please <Link to="/login" className="text-emerald-600 font-bold hover:underline">login</Link> to book an appointment.</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side: Selection */}
          <div className="lg:col-span-2 space-y-8">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100">
                {error}
              </div>
            )}
            {/* Step 1: Doctor Selection */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-emerald-50">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-8 w-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                <h2 className="text-xl font-bold text-emerald-900">Select Doctor</h2>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {DOCTORS.map((doctor) => (
                  <button
                    key={doctor.id}
                    onClick={() => navigate(`/booking?doctor=${doctor.id}`)}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-2xl border transition-all text-left",
                      doctorId === doctor.id
                        ? "border-emerald-600 bg-emerald-50 ring-2 ring-emerald-500/20"
                        : "border-emerald-100 hover:border-emerald-300 bg-white"
                    )}
                  >
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="h-16 w-16 rounded-xl object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h3 className="font-bold text-emerald-900">{doctor.name}</h3>
                      <p className="text-sm text-emerald-600 font-medium">{doctor.specialty}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Date & Time */}
            {selectedDoctor && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 rounded-3xl shadow-sm border border-emerald-50"
              >
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-8 w-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                  <h2 className="text-xl font-bold text-emerald-900">Select Date & Time</h2>
                </div>

                <div className="space-y-8">
                  <div>
                    <label className="block text-sm font-bold text-emerald-900 mb-4 flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-emerald-600" /> Select Date
                    </label>
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                      {dates.map((date) => {
                        const isSelected = format(selectedDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
                        return (
                          <button
                            key={date.toString()}
                            onClick={() => setSelectedDate(date)}
                            className={cn(
                              "flex flex-col items-center min-w-[80px] p-4 rounded-2xl border transition-all",
                              isSelected
                                ? "border-emerald-600 bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                                : "border-emerald-100 hover:border-emerald-300 bg-white text-emerald-900"
                            )}
                          >
                            <span className="text-xs font-medium uppercase opacity-70">{format(date, 'EEE')}</span>
                            <span className="text-xl font-bold">{format(date, 'd')}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-emerald-900 mb-4 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-emerald-600" /> Select Time
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {selectedDoctor.availability.map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={cn(
                            "py-3 rounded-xl border font-bold transition-all",
                            selectedTime === time
                              ? "border-emerald-600 bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                              : "border-emerald-100 hover:border-emerald-300 bg-white text-emerald-900"
                          )}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Side: Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-emerald-50 sticky top-24">
              <h2 className="text-xl font-bold text-emerald-900 mb-6">Booking Summary</h2>
              
              <div className="space-y-6 mb-8">
                <div className="flex items-start gap-4">
                  <div className="bg-emerald-50 p-2 rounded-lg">
                    <Stethoscope className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider">Doctor</p>
                    <p className="font-bold text-emerald-900">{selectedDoctor?.name || 'Not selected'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-emerald-50 p-2 rounded-lg">
                    <CalendarIcon className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider">Date</p>
                    <p className="font-bold text-emerald-900">{format(selectedDate, 'MMMM d, yyyy')}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-emerald-50 p-2 rounded-lg">
                    <Clock className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider">Time</p>
                    <p className="font-bold text-emerald-900">{selectedTime || 'Not selected'}</p>
                  </div>
                </div>
              </div>

              <button
                disabled={!selectedDoctor || !selectedTime || isSubmitting || !user}
                onClick={handleBooking}
                className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Confirm Booking <ArrowRight className="h-5 w-5" /></>
                )}
              </button>
              
              <p className="mt-4 text-xs text-center text-emerald-900/40">
                By confirming, you agree to our medical consultation terms.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

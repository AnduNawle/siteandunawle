import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, getDocs, orderBy, limit } from 'firebase/firestore';
import { Event, EventStatus } from '../types';
import { Calendar, MapPin, Clock, ArrowRight, Video, Sparkles, Navigation } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion } from 'motion/react';

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const q = query(collection(db, 'events'), orderBy('eventDate', 'asc'), limit(6));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  return (
    <div className="pt-24 pb-20 bg-gray-50/50 min-h-screen">
      <section className="max-w-7xl mx-auto px-4 mb-24 relative">
        <div className="text-center mb-20 relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-20 h-20 bg-blue-50 text-[#0047AB] rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner"
          >
            <Calendar size={32} />
          </motion.div>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-gray-900 mb-6 uppercase tracking-tighter"
          >
            Agenda <span className="text-[#0047AB]">Politique</span>
          </motion.h1>
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.2 }}
            className="w-24 h-2 bg-[#0047AB] mx-auto mb-8 rounded-full"
          />
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-500 max-w-2xl mx-auto text-xl font-light leading-relaxed"
          >
            Participez à nos meetings, réunions publiques et conférences à travers le pays. Rejoignez le mouvement !
          </motion.p>
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-100/40 rounded-full blur-[120px] -z-10 pointer-events-none" />

        {loading ? (
          <div className="space-y-6">
            {[1, 2].map(i => (
              <div key={i} className="animate-pulse bg-white rounded-[2rem] p-8 flex flex-col md:flex-row gap-8 shadow-sm">
                <div className="w-32 h-32 bg-gray-100 rounded-3xl"></div>
                <div className="flex-1 space-y-4">
                  <div className="h-6 bg-gray-100 rounded-lg w-3/4"></div>
                  <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-100 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : events.length > 0 ? (
          <div className="space-y-8">
            {events.map((event, idx) => (
              <motion.div 
                key={event.id} 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="bg-white rounded-[2rem] p-8 md:p-10 flex flex-col md:flex-row items-center gap-10 shadow-xl shadow-gray-200/50 border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group"
              >
                <div className="absolute left-0 top-0 bottom-0 w-2 bg-[#0047AB] group-hover:w-4 transition-all duration-300" />
                
                <div className="flex flex-col items-center justify-center p-6 bg-blue-50/50 rounded-3xl min-w-[140px] border border-blue-100/50 group-hover:bg-[#0047AB] transition-colors duration-300">
                  <span className="text-5xl font-black text-[#0047AB] group-hover:text-white transition-colors">{format(new Date(event.eventDate), 'dd')}</span>
                  <span className="text-sm font-bold text-gray-500 uppercase tracking-widest group-hover:text-blue-100 transition-colors">{format(new Date(event.eventDate), 'MMM', { locale: fr })}</span>
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs font-bold text-gray-400 mb-4 uppercase tracking-widest">
                    <span className="flex items-center gap-2 text-[#0047AB]"><Clock size={16} /> {event.startTime}</span>
                    <span className="flex items-center gap-2"><MapPin size={16} /> {event.location}</span>
                    {event.status === EventStatus.UPCOMING && <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full flex items-center gap-1"><Sparkles size={12}/> Confirmé</span>}
                    {event.status === EventStatus.CANCELLED && <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full">Annulé</span>}
                  </div>
                  <h2 className="text-3xl font-black text-gray-900 mb-4 capitalize">{event.title}</h2>
                  <p className="text-gray-600 leading-relaxed font-light text-lg">
                    {event.description}
                  </p>
                </div>

                <div className="shrink-0 flex flex-col gap-4 w-full md:w-auto">
                  <button className="bg-[#0047AB] text-white px-8 py-4 rounded-xl font-black hover:bg-blue-800 transition-colors w-full shadow-lg hover:shadow-blue-900/20 active:scale-95 uppercase tracking-widest text-sm flex items-center justify-center gap-2">
                    <Navigation size={18} /> S'INSCRIRE
                  </button>
                  <button className="bg-white border-2 border-gray-100 text-gray-700 px-8 py-4 rounded-xl font-bold hover:bg-gray-50 hover:border-gray-200 transition-colors w-full uppercase tracking-widest text-sm flex items-center justify-center gap-2">
                    <Video size={18} /> EN SAVOIR PLUS
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[3rem] p-24 text-center border-2 border-dashed border-gray-200 shadow-xl"
          >
            <Calendar className="mx-auto mb-8 text-gray-300" size={80} />
            <h2 className="text-3xl font-black text-gray-900 mb-4 uppercase tracking-tight">Aucun événement prévu</h2>
            <p className="text-gray-500 mb-10 text-lg font-light max-w-md mx-auto">Nous sommes en train de planifier nos prochaines rencontres. Revenez bientôt !</p>
            <button className="bg-white border-2 border-gray-200 px-10 py-4 rounded-xl font-black uppercase tracking-widest text-sm text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
              S'ABONNER À NOS ALERTES
            </button>
          </motion.div>
        )}
      </section>

      {/* Categories / History */}
      <section className="bg-[#002B6B] py-32 text-white relative overflow-hidden -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 mt-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-10 border border-white/10 rounded-[2rem] bg-white/5 backdrop-blur-md hover:bg-white/10 transition-colors group cursor-pointer"
          >
            <h3 className="text-2xl font-black mb-6 uppercase tracking-tight group-hover:text-blue-300 transition-colors">Meetings Nationaux</h3>
            <p className="text-blue-100 text-lg font-light leading-relaxed mb-8">Nos grands rassemblements pour partager notre vision avec le peuple sénégalais.</p>
            <ArrowRight className="text-blue-400 group-hover:translate-x-2 transition-transform" size={28} />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="p-10 border border-white/10 rounded-[2rem] bg-white/5 backdrop-blur-md hover:bg-white/10 transition-colors group cursor-pointer"
          >
            <h3 className="text-2xl font-black mb-6 uppercase tracking-tight group-hover:text-blue-300 transition-colors">Réunions de Quartier</h3>
            <p className="text-blue-100 text-lg font-light leading-relaxed mb-8">Des moments d'échange direct pour écouter les préoccupations de proximité.</p>
            <ArrowRight className="text-blue-400 group-hover:translate-x-2 transition-transform" size={28} />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="p-10 border border-white/10 rounded-[2rem] bg-white/5 backdrop-blur-md hover:bg-white/10 transition-colors group cursor-pointer"
          >
            <h3 className="text-2xl font-black mb-6 uppercase tracking-tight group-hover:text-blue-300 transition-colors">Conférences Thématiques</h3>
            <p className="text-blue-100 text-lg font-light leading-relaxed mb-8">Des débats d'idées sur l'économie, la santé, l'éducation et la décentralisation.</p>
            <ArrowRight className="text-blue-400 group-hover:translate-x-2 transition-transform" size={28} />
          </motion.div>
        </div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#0047AB]/50 rounded-full blur-[120px] pointer-events-none" />
      </section>
    </div>
  );
}

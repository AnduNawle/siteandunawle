import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, getDocs, orderBy, limit } from 'firebase/firestore';
import { Event, EventStatus } from '../types';
import { Calendar, MapPin, Clock, ArrowRight, Video } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

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
    <div className="pt-24 pb-20">
      <section className="max-w-7xl mx-auto px-4 mb-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 uppercase tracking-tight">Agenda Politique</h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            Participez à nos meetings, réunions publiques et conférences à travers le pays.
          </p>
        </div>

        {loading ? (
          <div className="space-y-6">
            {[1, 2].map(i => (
              <div key={i} className="animate-pulse bg-gray-50 rounded-2xl p-8 flex flex-col md:flex-row gap-8">
                <div className="w-24 h-24 bg-gray-200 rounded-xl"></div>
                <div className="flex-1 space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : events.length > 0 ? (
          <div className="space-y-6">
            {events.map((event) => (
              <div key={event.id} className="bg-white rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all border-l-8 border-l-[#0047AB]">
                <div className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-xl min-w-[100px]">
                  <span className="text-3xl font-extrabold text-[#0047AB]">{format(new Date(event.eventDate), 'dd')}</span>
                  <span className="text-sm font-bold text-gray-500 uppercase">{format(new Date(event.eventDate), 'BBB', { locale: fr })}</span>
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">
                    <span className="flex items-center gap-1 text-[#0047AB]"><Clock size={14} /> {event.startTime}</span>
                    <span className="flex items-center gap-1"><MapPin size={14} /> {event.location}</span>
                    {event.status === EventStatus.UPCOMING && <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded">Confirmé</span>}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">{event.title}</h2>
                  <p className="text-gray-600 text-sm mb-0">
                    {event.description}
                  </p>
                </div>

                <div className="shrink-0 flex flex-col gap-3 w-full md:w-auto">
                  <button className="bg-[#0047AB] text-white px-6 py-2.5 rounded font-bold hover:bg-blue-800 transition-colors w-full">
                    S'INSCRIRE
                  </button>
                  <button className="bg-transparent border border-gray-200 text-gray-700 px-6 py-2.5 rounded font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 w-full">
                    <Video size={18} /> EN SAVOIR PLUS
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-3xl p-20 text-center border-2 border-dashed border-gray-200">
            <Calendar className="mx-auto mb-6 text-gray-300" size={64} />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Aucun événement prévu</h2>
            <p className="text-gray-500 mb-8">Nous sommes en train de planifier nos prochaines rencontres. Revenez bientôt !</p>
            <button className="bg-white border border-gray-200 px-8 py-3 rounded-md font-bold text-gray-700 hover:bg-gray-50 transition-colors">
              S'ABONNER À NOS ALERTES
            </button>
          </div>
        )}
      </section>

      {/* Categories / History */}
      <section className="bg-[#002B6B] py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 text-center md:text-left">
          <div className="p-8 border border-white/10 rounded-2xl">
            <h3 className="text-xl font-bold mb-4">Meetings Nationaux</h3>
            <p className="text-blue-100 text-sm leading-relaxed mb-6">Nos grands rassemblements pour partager notre vision avec le peuple sénégalais.</p>
            <ArrowRight className="mx-auto md:ml-0 text-blue-300" />
          </div>
          <div className="p-8 border border-white/10 rounded-2xl">
            <h3 className="text-xl font-bold mb-4">Réunions de Quartier</h3>
            <p className="text-blue-100 text-sm leading-relaxed mb-6">Des moments d'échange direct pour écouter les préoccupations de proximité.</p>
            <ArrowRight className="mx-auto md:ml-0 text-blue-300" />
          </div>
          <div className="p-8 border border-white/10 rounded-2xl">
            <h3 className="text-xl font-bold mb-4">Conférences Thématiques</h3>
            <p className="text-blue-100 text-sm leading-relaxed mb-6">Des débats d'idées sur l'économie, la santé, l'éducation et la décentralisation.</p>
            <ArrowRight className="mx-auto md:ml-0 text-blue-300" />
          </div>
        </div>
      </section>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { Article, ArticleStatus } from '../types';
import { Shield, GraduationCap, HeartPulse, Lock, ArrowRight, Users, Megaphone, CalendarDays, Heart, Calendar, ArrowRightCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function Home() {
  const [latestArticles, setLatestArticles] = useState<Article[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch Articles
        const articlesQuery = query(
          collection(db, 'articles'),
          where('status', '==', ArticleStatus.PUBLISHED),
          orderBy('publishedAt', 'desc'),
          limit(3)
        );
        const articlesSnap = await getDocs(articlesQuery);
        setLatestArticles(articlesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Article)));

        // Fetch Events
        const eventsQuery = query(
          collection(db, 'events'),
          where('status', '==', 'upcoming'),
          orderBy('eventDate', 'asc'),
          limit(2)
        );
        const eventsSnap = await getDocs(eventsQuery);
        setUpcomingEvents(eventsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching homepage data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const priorities = [
    {
      title: "Développement Économique",
      description: "Créer des emplois et valoriser nos ressources locales.",
      icon: <Shield className="text-[#0047AB]" size={32} />
    },
    {
      title: "Éducation",
      description: "Garantir une éducation de qualité pour tous et promouvoir l'excellence.",
      icon: <GraduationCap className="text-[#0047AB]" size={32} />
    },
    {
      title: "Santé",
      description: "Améliorer l'accès aux soins et construire un système de santé performant.",
      icon: <HeartPulse className="text-[#0047AB]" size={32} />
    },
    {
      title: "Sécurité",
      description: "Assurer la sécurité des personnes et des biens sur tout le territoire.",
      icon: <Lock className="text-[#0047AB]" size={32} />
    }
  ];

  return (
    <main>
      <Hero />

      {/* Latest News Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <span className="text-[#0047AB] font-bold text-sm uppercase tracking-widest mb-2 block text-center md:text-left">Actualités</span>
              <h2 className="text-3xl font-black text-gray-900 uppercase">Dernières Nouvelles</h2>
            </div>
            <Link to="/actualites" className="hidden md:flex items-center gap-2 text-[#0047AB] font-bold hover:gap-3 transition-all">
              Toutes les actus <ArrowRightCircle size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-100 aspect-video rounded-2xl mb-4"></div>
                  <div className="h-4 bg-gray-100 rounded w-1/3 mb-2"></div>
                  <div className="h-6 bg-gray-100 rounded w-full"></div>
                </div>
              ))
            ) : latestArticles.length > 0 ? (
              latestArticles.map((article) => (
                <Link key={article.id} to={`/actualites/${article.slug}`} className="group">
                  <div className="aspect-video rounded-2xl overflow-hidden mb-6 relative shadow-sm group-hover:shadow-xl transition-all duration-500">
                    <img 
                      src={article.image || "https://images.unsplash.com/photo-1540910419892-f0c73255dc1b?q=80&w=2670&auto=format&fit=crop"} 
                      alt={article.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-bold text-[#0047AB] uppercase tracking-widest mb-3">
                    <span className="bg-blue-50 px-2 py-1 rounded">Actu</span>
                    <span className="text-gray-400">|</span>
                    <span className="text-gray-500 flex items-center gap-1">
                      <Calendar size={12} /> {article.publishedAt?.toDate ? format(article.publishedAt.toDate(), 'dd MMM yyyy', { locale: fr }) : "N/A"}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#0047AB] transition-colors line-clamp-2 leading-snug">
                    {article.title}
                  </h3>
                </Link>
              ))
            ) : (
              <div className="col-span-full py-12 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                <p className="text-gray-400 italic font-medium">Bientôt de nouvelles actualités ici...</p>
              </div>
            )}
          </div>
          
          <div className="mt-12 text-center md:hidden">
            <Link to="/actualites" className="inline-flex items-center gap-2 bg-blue-50 text-[#0047AB] border border-blue-100 px-6 py-3 rounded-full font-bold">
              Toutes les actualités
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      {upcomingEvents.length > 0 && (
        <section className="py-20 bg-gray-900 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
              <div>
                <span className="text-blue-400 font-bold text-sm uppercase tracking-widest mb-2 block">Agenda</span>
                <h2 className="text-3xl font-black uppercase">Prochaines Rencontres</h2>
              </div>
              <Link to="/evenements" className="flex items-center gap-2 text-blue-400 font-bold hover:gap-3 transition-all">
                Tout l'agenda <ArrowRight size={20} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 flex gap-6 hover:bg-white/10 transition-all group">
                  <div className="w-20 h-20 bg-blue-600 text-white rounded-2xl flex flex-col items-center justify-center shrink-0 shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform">
                    <span className="text-2xl font-black">{format(new Date(event.eventDate), 'dd')}</span>
                    <span className="text-[10px] font-bold uppercase">{format(new Date(event.eventDate), 'BBB', { locale: fr })}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-3 group-hover:text-blue-400 transition-colors">{event.title}</h3>
                    <div className="flex flex-wrap gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                      <span className="flex items-center gap-1"><Calendar size={14} className="text-blue-500" /> {event.startTime}</span>
                      <span className="flex items-center gap-1"><Users size={14} className="text-blue-500" /> {event.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Intro Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <span className="text-[#0047AB] font-bold text-sm uppercase tracking-widest mb-4 block">Andu Nawle</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
                Un parti, une vision, <br /> des actions.
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Andu Nawle se bat pour des territoires forts, unis et prospères. Notre mission est de défendre vos intérêts et de bâtir un avenir meilleur pour tous. Nous croyons en la force de la décentralisation et de l'engagement citoyen.
              </p>
              <Link 
                to="/parti" 
                className="bg-[#0047AB] text-white px-8 py-3 rounded font-bold hover:bg-blue-800 transition-colors inline-block"
              >
                EN SAVOIR PLUS
              </Link>
            </div>
            <div className="flex-1 relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl relative z-10">
                <img 
                  src="src/components/images/partileadership.png" 
                  alt="Parti leadership" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#0047AB] rounded-2xl -z-0 opacity-10"></div>
              <div className="absolute -top-6 -left-6 w-32 h-32 border-4 border-blue-100 rounded-2xl -z-0"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Priorities Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <span className="text-[#0047AB] font-bold text-sm uppercase tracking-widest mb-4 block">Notre Programme</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            Nos priorités pour le changement
          </h2>
          <div className="w-20 h-1 bg-[#0047AB] mx-auto"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {priorities.map((item, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -10 }}
              className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center transition-all hover:shadow-md"
            >
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                {item.description}
              </p>
              <Link to="/programme" className="text-[#0047AB] font-bold text-xs uppercase tracking-wider flex items-center gap-1 hover:gap-2 transition-all">
                Détails <ArrowRight size={14} />
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link 
            to="/programme" 
            className="bg-[#0047AB] text-white px-10 py-4 rounded font-bold hover:bg-blue-800 transition-colors uppercase tracking-wide"
          >
            VOIR TOUT LE PROGRAMME
          </Link>
        </div>
      </section>

      {/* Quick CTAs */}
      <section className="bg-[#002B6B] py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-white divide-y md:divide-y-0 md:divide-x divide-blue-800">
          <Link to="/rejoindre" className="flex flex-col items-center p-6 hover:bg-blue-800/50 transition-colors group">
            <Users size={40} className="mb-4 text-blue-300 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-bold">Rejoignez le mouvement</h3>
            <p className="text-sm text-blue-200">Devenez acteur du changement.</p>
          </Link>
          <Link to="/faire-un-don" className="flex flex-col items-center p-6 hover:bg-blue-800/50 transition-colors group">
            <Heart size={40} className="mb-4 text-blue-300 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-bold">Faites un don</h3>
            <p className="text-sm text-blue-200">Soutenez nos actions sur le terrain.</p>
          </Link>
          <Link to="/evenements" className="flex flex-col items-center p-6 hover:bg-blue-800/50 transition-colors group">
            <Megaphone size={40} className="mb-4 text-blue-300 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-bold">Prochains événements</h3>
            <p className="text-sm text-blue-200">Consultez notre calendrier politique.</p>
          </Link>
        </div>
      </section>
    </main>
  );
}

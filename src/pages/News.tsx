import React, { useState, useEffect } from 'react';
import { supabase, mapRow } from '../lib/supabase';
import { Article, ArticleStatus } from '../types';
import { Calendar, User, ArrowRight, Search, Newspaper, TrendingUp, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export default function News() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchArticles() {
      try {
        const { data: dbData, error } = await supabase
          .from('articles')
          .select('*')
          .limit(100);

        if (error) throw error;

        const data = (dbData || [])
          .map(row => mapRow(row) as Article)
          .filter(art => art.status === ArticleStatus.PUBLISHED)
          .sort((a, b) => {
            const dateA = a.publishedAt?.toDate?.() || a.publishedAt?.seconds || 0;
            const dateB = b.publishedAt?.toDate?.() || b.publishedAt?.seconds || 0;
            return dateB > dateA ? 1 : -1;
          });
        setArticles(data);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, []);

  const filteredArticles = articles.filter(art => 
    art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    art.summary?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pt-24 pb-20 bg-gray-50/30 min-h-screen">
      <section className="max-w-7xl mx-auto px-4 mb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 relative">
          <div className="relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-[#0047AB] font-bold tracking-widest uppercase mb-4"
            >
              <Newspaper size={20} /> Médias et Presse
            </motion.div>
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-black text-gray-900 mb-6 uppercase tracking-tighter"
            >
              Notre <span className="text-[#0047AB]">Actualité</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-500 max-w-xl text-lg font-light leading-relaxed"
            >
              Suivez les dernières nouvelles du parti, nos déclarations officielles et nos actions sur le terrain.
            </motion.p>
          </div>
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="relative lg:min-w-[400px] z-10"
          >
            <input 
              type="text" 
              placeholder="Rechercher un article..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-4 border-2 border-transparent rounded-[2rem] text-base focus:ring-4 focus:ring-[#0047AB]/20 focus:border-[#0047AB] w-full outline-none transition-all shadow-xl bg-white"
            />
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#0047AB] font-bold" size={20} />
          </motion.div>
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-[100px] -z-10 -mt-64 -mr-64 pointer-events-none" />
        </div>

        {/* Featured Article layout if no search */}
        {searchQuery === '' && !loading && filteredArticles.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <Link to={`/actualites/${filteredArticles[0].slug}`} className="group relative block rounded-[3rem] overflow-hidden shadow-2xl bg-white">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="aspect-square lg:aspect-auto h-full relative overflow-hidden">
                  <img 
                    src={filteredArticles[0].image || "https://images.unsplash.com/photo-1540910419892-f0c73255dc1b?q=80&w=2670&auto=format&fit=crop"} 
                    alt={filteredArticles[0].title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-900/60 to-transparent lg:hidden" />
                </div>
                <div className="p-8 lg:p-16 flex flex-col justify-center bg-[#002B6B] text-white">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-widest text-xs mb-6 bg-emerald-400/10 w-max px-4 py-2 rounded-full">
                    <Sparkles size={16} /> À la une
                  </div>
                  <h2 className="text-3xl lg:text-5xl font-black mb-6 leading-tight group-hover:text-blue-200 transition-colors">
                    {filteredArticles[0].title}
                  </h2>
                  <p className="text-blue-100 text-lg mb-8 leading-relaxed font-light line-clamp-3">
                    {filteredArticles[0].summary}
                  </p>
                  <div className="flex items-center gap-6 text-sm text-blue-200 font-bold uppercase tracking-wider mt-auto">
                     <span className="flex items-center gap-2"><Calendar size={18} /> {filteredArticles[0].publishedAt?.toDate ? format(filteredArticles[0].publishedAt.toDate(), 'dd MMM yyyy', { locale: fr }) : "N/A"}</span>
                     <span className="flex items-center gap-2 bg-white text-[#002B6B] px-6 py-3 rounded-xl group-hover:bg-blue-50 transition-colors">Lire l'article <ArrowRight size={18} /></span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        <div className="flex items-center gap-3 text-2xl font-black text-gray-900 mb-8 uppercase tracking-tight">
          <TrendingUp /> {searchQuery ? 'Résultats de recherche' : 'Dernières Publications'}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse bg-white p-4 rounded-3xl">
                <div className="bg-gray-100 aspect-video rounded-2xl mb-6"></div>
                <div className="h-4 bg-gray-100 rounded w-1/4 mb-4"></div>
                <div className="h-6 bg-gray-100 rounded-lg w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-100 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-100 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : filteredArticles.length > (searchQuery ? 0 : 1) ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredArticles.slice(searchQuery ? 0 : 1).map((article, idx) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: idx * 0.05, duration: 0.5 }}
                >
                  <article className="bg-white rounded-[2rem] overflow-hidden shadow-xl shadow-gray-200/50 border border-gray-100 hover:-translate-y-2 transition-all duration-300 group h-full flex flex-col">
                    <div className="aspect-video relative overflow-hidden p-3">
                      <div className="w-full h-full rounded-2xl overflow-hidden relative">
                        <img 
                          src={article.image || "https://images.unsplash.com/photo-1540910419892-f0c73255dc1b?q=80&w=2670&auto=format&fit=crop"} 
                          alt={article.title} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm text-[#0047AB] text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest shadow-sm">ACTU</div>
                    </div>
                    <div className="p-8 pt-4 flex-grow flex flex-col">
                      <div className="flex items-center gap-4 text-xs font-bold text-gray-400 mb-4 uppercase tracking-widest">
                        <span className="flex items-center gap-1"><Calendar size={14} className="text-[#0047AB]" /> {article.publishedAt?.toDate ? format(article.publishedAt.toDate(), 'dd MMM yyyy', { locale: fr }) : "N/A"}</span>
                      </div>
                      <h2 className="text-2xl font-black text-gray-900 mb-4 line-clamp-2 group-hover:text-[#0047AB] transition-colors leading-tight">
                        <Link to={`/actualites/${article.slug}`}>{article.title}</Link>
                      </h2>
                      <p className="text-gray-600 text-sm mb-8 line-clamp-3 leading-relaxed font-light flex-grow">
                        {article.summary}
                      </p>
                      <Link 
                        to={`/actualites/${article.slug}`} 
                        className="flex items-center justify-between w-full text-[#0047AB] font-black text-xs uppercase tracking-widest group-hover:bg-blue-50 p-4 rounded-xl transition-all border border-transparent group-hover:border-blue-100 mt-auto"
                      >
                        <span>Lire l'article</span> <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </article>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border text-center border-gray-100 rounded-[3rem] p-20 shadow-2xl"
          >
            <div className="w-24 h-24 bg-blue-50 text-[#0047AB] rounded-full flex items-center justify-center mx-auto mb-8">
              <Search size={40} />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-4 uppercase tracking-tight">Aucun article trouvé</h2>
            <p className="text-gray-500 text-lg font-light max-w-md mx-auto">Nous n'avons pas trouvé de résultats pour votre recherche. Essayez d'autres mots-clés.</p>
          </motion.div>
        )}
      </section>
    </div>
  );
}

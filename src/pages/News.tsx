import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { Article, ArticleStatus } from '../types';
import { Calendar, User, ArrowRight, Search } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Link } from 'react-router-dom';

export default function News() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchArticles() {
      try {
        const q = query(
          collection(db, 'articles'),
          orderBy('publishedAt', 'desc'),
          limit(50)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() } as Article))
          .filter(art => art.status === ArticleStatus.PUBLISHED);
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
    <div className="pt-24 pb-20">
      <section className="max-w-7xl mx-auto px-4 mb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4 uppercase tracking-tight">Actualités</h1>
            <p className="text-gray-500 max-w-xl">
              Suivez les dernières nouvelles du parti, nos déclarations et nos actions sur le terrain.
            </p>
          </div>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Rechercher un article..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-[#0047AB] w-full md:w-64 outline-none transition-all shadow-sm bg-gray-50/50"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold" size={16} />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 aspect-video rounded-xl mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <article key={article.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all group">
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={article.image || "https://images.unsplash.com/photo-1540910419892-f0c73255dc1b?q=80&w=2670&auto=format&fit=crop"} 
                    alt={article.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-[#0047AB] text-white text-[10px] font-bold px-2 py-1 rounded">ACTU</div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                    <span className="flex items-center gap-1"><Calendar size={14} /> {article.publishedAt?.toDate ? format(article.publishedAt.toDate(), 'dd MMM yyyy', { locale: fr }) : "N/A"}</span>
                    <span className="flex items-center gap-1"><User size={14} /> Admin</span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-[#0047AB] transition-colors">
                    <Link to={`/actualites/${article.slug}`}>{article.title}</Link>
                  </h2>
                  <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed">
                    {article.summary}
                  </p>
                  <Link 
                    to={`/actualites/${article.slug}`} 
                    className="flex items-center gap-2 text-[#0047AB] font-bold text-xs uppercase tracking-wider group-hover:gap-3 transition-all"
                  >
                    Lire l'article <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-12 text-center">
            <h2 className="text-2xl font-bold text-[#0047AB] mb-2">Aucun article trouvé</h2>
            <p className="text-gray-600">Revenez bientôt pour découvrir nos dernières actualités.</p>
          </div>
        )}
      </section>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { Article } from '../types';
import { Calendar, User, ArrowLeft, Share2, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import ReactMarkdown from 'react-markdown';

export default function NewsDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticle() {
      try {
        const q = query(
          collection(db, 'articles'),
          where('slug', '==', slug),
          limit(1)
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const data = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Article;
          // Only show published articles unless we add admin preview logic later
          if (data.status === 'published' || data.status === undefined) {
             setArticle(data);
          }
        }
      } catch (error) {
        console.error("Error fetching article:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-32 pb-20 text-center">
        <div className="animate-spin w-10 h-10 border-4 border-[#0047AB] border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-500">Chargement de l'article...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="pt-32 pb-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Article non trouvé</h1>
        <Link to="/actualites" className="text-[#0047AB] hover:underline">Retour aux actualités</Link>
      </div>
    );
  }

  return (
    <article className="pt-24 pb-20">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 mb-10">
        <Link 
          to="/actualites" 
          className="inline-flex items-center gap-2 text-gray-500 hover:text-[#0047AB] mb-8 font-medium transition-colors"
        >
          <ArrowLeft size={18} /> Retour aux actualités
        </Link>
        
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 border-b border-gray-100 pb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#0047AB] text-white rounded-full flex items-center justify-center font-bold">
              AN
            </div>
            <span className="font-bold text-gray-900">Mouvement Andu Nawle</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-blue-500" />
            {article.publishedAt?.toDate ? format(article.publishedAt.toDate(), 'dd MMMM yyyy', { locale: fr }) : "N/A"}
          </div>
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-blue-500" />
            5 min de lecture
          </div>
        </div>
      </div>

      {/* Featured Image */}
      <div className="max-w-6xl mx-auto px-4 mb-12">
        <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl">
          <img 
            src={article.image || "https://images.unsplash.com/photo-1540910419892-f0c73255dc1b?q=80&w=2670&auto=format&fit=crop"} 
            alt={article.title} 
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4">
        <div className="prose prose-lg prose-blue max-w-none">
          <div className="markdown-body">
            <ReactMarkdown>
              {article.content}
            </ReactMarkdown>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="p-2 bg-gray-50 text-gray-500 rounded-full hover:bg-blue-50 hover:text-[#0047AB] transition-all">
              <Share2 size={20} />
            </button>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
            Andu Nawle &copy; {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </article>
  );
}

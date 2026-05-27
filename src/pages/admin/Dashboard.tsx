import React, { useState, useEffect } from 'react';
import { supabase, mapRow } from '../../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Users, 
  MessageSquare, 
  Newspaper, 
  Calendar, 
  LayoutDashboard, 
  Settings, 
  LogOut,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Briefcase,
  TrendingUp,
  Clock,
  ExternalLink,
  Trash2,
  Mail,
  Phone,
  User,
  MapPin,
  Loader2,
  Plus,
  X,
  Save,
  Menu
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import ReactMarkdown from 'react-markdown';

type View = 'overview' | 'inscriptions' | 'messages' | 'articles' | 'events' | 'settings';

export default function Dashboard() {
  const [currentView, setCurrentView] = useState<View>('overview');
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const toggleExpand = (id: string) => {
    setExpandedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const [stats, setStats] = useState({
    members: 0,
    messages: 0,
    articles: 0,
    events: 0
  });
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [newArticle, setNewArticle] = useState({
    title: '',
    content: '',
    status: 'published' as 'published' | 'draft',
    imageUrl: ''
  });
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    location: '',
    eventDate: '',
    startTime: '',
    imageUrl: ''
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const navigate = useNavigate();
  const [adminEmail, setAdminEmail] = useState<string>('');

  const fetchStats = async () => {
    try {
      const collectionsList = ['join_requests', 'contact_messages', 'articles', 'events'];
      const counts = await Promise.all(collectionsList.map(async (table) => {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          const { data } = await supabase.from(table).select('id');
          return data ? data.length : 0;
        }
        return count || 0;
      }));
      
      setStats({
        members: counts[0],
        messages: counts[1],
        articles: counts[2],
        events: counts[3]
      });

      // Fetch real recent activity across all collections
      let activityData: any[] = [];
      
      const collectionsToPoll = [
        { name: 'join_requests', type: 'inscription', icon: 'User' },
        { name: 'contact_messages', type: 'message', icon: 'Mail' },
        { name: 'articles', type: 'article', icon: 'Newspaper' },
        { name: 'events', type: 'événement', icon: 'Calendar' }
      ];

      for (const col of collectionsToPoll) {
        try {
          const { data, error } = await supabase
            .from(col.name)
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5);

          if (error) throw error;

          (data || []).forEach(row => {
            const mapped = mapRow(row);
            activityData.push({ 
              id: mapped.id, 
              type: col.type, 
              label: col.icon,
              ...mapped 
            });
          });
        } catch (e) {
          const { data } = await supabase.from(col.name).select('*');
          (data || []).slice(0, 5).forEach(row => {
            const mapped = mapRow(row);
            activityData.push({ 
              id: mapped.id, 
              type: col.type, 
              label: col.icon,
              ...mapped
            });
          });
        }
      }

      setRecentActivity(activityData.sort((a, b) => {
        const dateA = a.createdAt?.seconds || a.createdAt?._seconds || 0;
        const dateB = b.createdAt?.seconds || b.createdAt?._seconds || 0;
        return dateB - dateA;
      }).slice(0, 10));

    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const fetchData = async (view: View) => {
    setLoading(true);
    setError(null);
    try {
      let colName = '';
      if (view === 'inscriptions') colName = 'join_requests';
      if (view === 'messages') colName = 'contact_messages';
      if (view === 'articles') colName = 'articles';
      if (view === 'events') colName = 'events';

      if (colName) {
        const { data: dbData, error: fetchErr } = await supabase.from(colName).select('*');
        if (fetchErr) throw fetchErr;

        const allData = (dbData || []).map(row => mapRow(row));
        
        console.log(`Fetched ${allData.length} items for ${view}`);
        
        // Sort in memory safely to handle documents missing sort fields
        allData.sort((a: any, b: any) => {
          const dateA = a.eventDate || a.createdAt?.toDate?.() || a.createdAt?.seconds || a.publishedAt?.toDate?.() || a.publishedAt?.seconds || 0;
          const dateB = b.eventDate || b.createdAt?.toDate?.() || b.createdAt?.seconds || b.publishedAt?.toDate?.() || b.publishedAt?.seconds || 0;
          
          if (view === 'events') {
            return dateA > dateB ? 1 : -1;
          } else {
            return dateB > dateA ? 1 : -1;
          }
        });
        
        setData(allData);
      }
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Reset loading and clear previous view data immediately on tab/view switch
    setLoading(true);
    setData([]);
    setError(null);
    setExpandedIds({});

    supabase.auth.getSession().then(({ data: { session } }) => {
      setAdminEmail(session?.user?.email || '');
    });

    if (currentView === 'overview') {
      fetchStats().then(() => {
        setLoading(false);
      });
    } else {
      // Run stats fetch and view data fetch in parallel to prevent any latency in loading the view
      fetchStats();
      fetchData(currentView);
    }
  }, [currentView]);

  const handleDelete = async (id: string, col: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet élément définitivement ?")) {
      try {
        const { error } = await supabase.from(col).delete().eq('id', id);
        if (error) throw error;
        
        // Optimistic UI update for the current list
        setData(prev => prev.filter(item => item.id !== id));
        
        // Refresh stats and potentially the list
        fetchStats();
        if (currentView !== 'overview') {
          fetchData(currentView);
        }
        
      } catch (err) {
        console.error("Delete error:", err);
        alert("Erreur lors de la suppression. Vérifiez vos permissions.");
      }
    }
  };

  const handleCreateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    const articleData = { ...newArticle };
    
    // Close modal immediately for "Instant" feel
    setIsArticleModalOpen(false);
    setNewArticle({ title: '', content: '', status: 'published', imageUrl: '' });

    try {
      const slug = articleData.title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      const { error } = await supabase.from('articles').insert([{
        title: articleData.title,
        content: articleData.content,
        status: articleData.status,
        image: articleData.imageUrl,
        slug,
        created_at: new Date().toISOString(),
        published_at: articleData.status === 'published' ? new Date().toISOString() : null,
        authorId: userId,
        summary: articleData.content.replace(/<[^>]*>/g, '').substring(0, 160)
      }]);

      if (error) throw error;
      
      // Refresh in background
      fetchData('articles');
      fetchStats();
    } catch (err) {
      console.error("Error creating article:", err);
      alert("Une erreur est survenue lors de la sauvegarde.");
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    const eventData = { ...newEvent };
    
    setIsEventModalOpen(false);
    setNewEvent({ title: '', description: '', location: '', eventDate: '', startTime: '', imageUrl: '' });

    try {
      const slug = eventData.title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      const { error } = await supabase.from('events').insert([{
        title: eventData.title,
        description: eventData.description,
        location: eventData.location,
        eventDate: eventData.eventDate,
        startTime: eventData.startTime,
        image: eventData.imageUrl,
        slug,
        status: 'upcoming',
        created_at: new Date().toISOString()
      }]);

      if (error) throw error;
      
      fetchData('events');
      fetchStats();
    } catch (err) {
      console.error("Error creating event:", err);
      alert("Une erreur est survenue lors de la sauvegarde.");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const SidebarButton = ({ view, label, icon: Icon }: { view: View, label: string, icon: any }) => (
    <button 
      onClick={() => {
        setCurrentView(view);
        setIsMobileMenuOpen(false);
      }}
      className={`flex items-center gap-3 w-full p-3 rounded-xl font-semibold transition-all ${currentView === view ? 'bg-blue-600 text-white' : 'text-blue-100 hover:bg-white/5'}`}
    >
      <Icon size={20} /> {label}
    </button>
  );

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      {/* Mobile Sticky Header */}
      <div className="lg:hidden bg-[#002B6B] text-white p-4 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-[#002B6B] font-bold">AN</div>
          <h2 className="font-bold tracking-tight text-sm">ADMIN PANEL</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] md:text-xs bg-white/10 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
            {currentView === 'overview' ? 'DASHBOARD' : currentView === 'inscriptions' ? 'Membres' : currentView === 'messages' ? 'Messages' : currentView === 'articles' ? 'Actualités' : currentView === 'events' ? 'Événements' : 'Paramètres'}
          </span>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white"
            title="Menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Backdrop Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30 transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 bg-[#002B6B] text-white p-6 flex flex-col z-40 w-64 transform transition-transform duration-300 ease-in-out shrink-0
        lg:static lg:translate-x-0 lg:flex lg:h-screen lg:w-64
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-[#002B6B] font-bold">AN</div>
          <h2 className="font-bold tracking-tight">ADMIN PANEL</h2>
        </div>
        
        <nav className="space-y-2 flex-grow">
          <SidebarButton view="overview" label="Dashboard" icon={LayoutDashboard} />
          <SidebarButton view="inscriptions" label="Inscriptions" icon={Users} />
          <SidebarButton view="messages" label="Messages" icon={MessageSquare} />
          <SidebarButton view="articles" label="Actualités" icon={Newspaper} />
          <SidebarButton view="events" label="Événements" icon={Calendar} />
          <SidebarButton view="settings" label="Paramètres" icon={Settings} />
        </nav>

        <div className="mt-8 space-y-4">
          <Link 
            to="/" 
            className="flex items-center gap-3 w-full p-3 text-blue-200 hover:text-white border border-white/10 rounded-xl transition-all text-sm font-medium"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <ExternalLink size={18} /> Voir le site public
          </Link>
          <button 
            onClick={() => {
              setIsMobileMenuOpen(false);
              handleLogout();
            }}
            className="flex items-center gap-3 w-full p-3 text-red-300 hover:text-red-100 hover:bg-red-500/10 rounded-xl transition-all text-sm font-bold"
          >
            <LogOut size={18} /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 lg:p-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 capitalize">
              {currentView === 'overview' ? 'Tableau de bord' : currentView}
            </h1>
            <p className="text-gray-500">
              {currentView === 'overview' ? 'Bienvenue dans votre espace de gestion.' : `Gestion des ${currentView}`}
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-[#0047AB]">
              <TrendingUp size={20} />
            </div>
            <div className="pr-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Aujourd'hui</p>
              <p className="text-sm font-bold text-gray-900">{format(new Date(), 'dd MMMM yyyy', { locale: fr })}</p>
            </div>
          </div>
        </header>

        {error && (
          <div className="mb-8 p-6 bg-red-50 border border-red-100 rounded-2xl text-red-800 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
                <X size={20} className="text-red-600" />
              </div>
              <div className="flex-grow">
                <h4 className="font-bold mb-1 text-red-900">Erreur de Base de Données / Supabase</h4>
                <p className="font-mono text-xs mb-3 bg-red-100/30 p-2.5 rounded border border-red-200 overflow-x-auto select-all">{error}</p>
                <div className="bg-white/80 p-4 rounded-xl border border-red-100 text-xs text-gray-600 leading-relaxed">
                  <p className="font-bold mb-2 text-gray-800">Comment résoudre ce problème :</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Allez sur votre tableau de bord <span className="font-semibold">Supabase</span>.</li>
                    <li>Ouvrez l'éditeur SQL (<span className="font-semibold">SQL Editor</span>).</li>
                    <li>Copiez-collez et exécutez le script SQL fourni ci-dessous pour créer ou mettre à jour la table de cette vue.</li>
                    <li>Assurez-vous que l'accès ou l'insertion public est autorisé par des politiques de sécurité (RLS) dans Supabase.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentView === 'overview' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {[
                { label: 'Inscriptions', value: stats.members, icon: <Users />, color: 'bg-blue-500', view: 'inscriptions' as View },
                { label: 'Messages', value: stats.messages, icon: <MessageSquare />, color: 'bg-indigo-500', view: 'messages' as View },
                { label: 'Articles', value: stats.articles, icon: <Newspaper />, color: 'bg-teal-500', view: 'articles' as View },
                { label: 'Événements', value: stats.events, icon: <Calendar />, color: 'bg-amber-500', view: 'events' as View },
              ].map((card, i) => (
                <button 
                  key={i} 
                  onClick={() => setCurrentView(card.view)}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-left"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl text-white ${card.color}`}>
                      {card.icon}
                    </div>
                    <ChevronRight className="text-gray-300" size={16} />
                  </div>
                  <p className="text-2xl font-black text-gray-900 mb-1">{loading ? '...' : card.value}</p>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">{card.label}</p>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <Clock size={20} className="text-blue-500" /> Activité récente
                  </h3>
                  <button onClick={() => setCurrentView('inscriptions')} className="text-xs font-bold text-[#0047AB] hover:underline">Voir tout</button>
                </div>
                
                <div className="space-y-6">
                  {recentActivity.length > 0 ? (
                    recentActivity.map((activity) => (
                      <div 
                        key={activity.id} 
                        className="flex items-center gap-4 group cursor-pointer" 
                        onClick={() => {
                          if (activity.type === 'inscription') setCurrentView('inscriptions');
                          else if (activity.type === 'message') setCurrentView('messages');
                          else if (activity.type === 'article') setCurrentView('articles');
                          else if (activity.type === 'événement') setCurrentView('events');
                        }}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                          activity.type === 'inscription' ? 'bg-blue-50 text-blue-500' : 
                          activity.type === 'message' ? 'bg-indigo-50 text-indigo-500' :
                          activity.type === 'article' ? 'bg-teal-50 text-teal-500' : 'bg-amber-50 text-amber-500'
                        }`}>
                          {activity.type === 'inscription' ? <User size={18} /> : 
                           activity.type === 'message' ? <Mail size={18} /> :
                           activity.type === 'article' ? <Newspaper size={18} /> : <Calendar size={18} />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-700">
                            {activity.type === 'inscription' ? (
                              <>Nouvelle inscription : <span className="font-bold">{activity.firstname} {activity.lastname}</span></>
                            ) : activity.type === 'message' ? (
                              <>Nouveau message de <span className="font-bold">{activity.name}</span></>
                            ) : activity.type === 'article' ? (
                              <>Article publié : <span className="font-bold">{activity.title}</span></>
                            ) : (
                              <>Événement créé : <span className="font-bold">{activity.title}</span></>
                            )}
                          </p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase">
                            {activity.createdAt?.seconds ? format(activity.createdAt.toDate(), 'dd/MM/yyyy HH:mm', { locale: fr }) : 
                             activity.createdAt?._seconds ? format(new Date(activity.createdAt._seconds * 1000), 'dd/MM/yyyy HH:mm', { locale: fr }) : 'Maintenant'}
                          </p>
                        </div>
                        <ChevronRight size={14} className="text-gray-300" />
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm italic py-8 text-center">Aucune activité récente.</p>
                  )}
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#0047AB] to-[#002B6B] rounded-2xl p-8 text-white relative overflow-hidden flex flex-col justify-center">
                <h3 className="text-2xl font-bold mb-4 relative z-10">Gestion Intelligente</h3>
                <p className="text-blue-100 text-sm mb-8 relative z-10 leading-relaxed">
                  Utilisez les sections à gauche pour gérer les membres, répondre aux messages des citoyens et publier les actualités du mouvement.
                </p>
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-24 -mt-24"></div>
              </div>
            </div>
          </>
        )}

        {currentView === 'inscriptions' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {loading ? (
              <div className="p-20 text-center text-gray-400">
                <Loader2 className="animate-spin mx-auto mb-4" /> Chargement...
              </div>
            ) : data.length === 0 ? (
              <div className="p-20 text-center text-gray-400">Aucune inscription pour le moment.</div>
            ) : (
              <>
                {/* Mobile & Tablet View: Structured Cards List */}
                <div className="lg:hidden divide-y divide-gray-100">
                  {data.map((item) => {
                    const isExpanded = !!expandedIds[item.id];
                    return (
                      <div key={item.id} className="p-5 space-y-4 hover:bg-gray-50/20 transition-colors">
                        {/* Header Area */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 bg-blue-50 text-[#0047AB] border border-blue-100/50 rounded-full flex items-center justify-center font-bold text-sm uppercase shrink-0 shadow-sm">
                              {item.firstname?.[0]}{item.lastname?.[0]}
                            </div>
                            <div className="min-w-0">
                              <span className="font-extrabold text-gray-900 text-sm block truncate">
                                {item.firstname} {item.lastname}
                              </span>
                              {item.profession ? (
                                <span className="text-[10px] text-blue-700 bg-blue-50/60 px-2 py-0.5 rounded font-semibold inline-flex items-center gap-1 mt-1 border border-blue-100/30">
                                  <Briefcase size={10} className="shrink-0 text-blue-500" /> {item.profession}
                                </span>
                              ) : (
                                <span className="text-[10px] text-gray-400 italic block mt-1">Aucune profession renseignée</span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => toggleExpand(item.id)}
                              className="p-2 hover:bg-gray-100 rounded-lg text-blue-600 transition-colors"
                              title="Voir les détails"
                            >
                              {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </button>
                            <button 
                              onClick={() => handleDelete(item.id, 'join_requests')}
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Supprimer l'inscription"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>

                        {/* Middle Info Block: Custom Structured Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-gray-50/50 p-4 rounded-xl border border-gray-100 text-xs text-gray-600">
                          <div className="space-y-2">
                            <div className="flex items-start gap-2">
                              <MapPin size={13} className="text-gray-400 shrink-0 mt-0.5" />
                              <span className="font-semibold text-gray-700">Localité : <span className="text-gray-900 font-bold">{item.locality || 'N/A'}</span></span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar size={13} className="text-gray-400 shrink-0" />
                              <span className="text-gray-500">
                                Date : <span className="font-medium text-gray-700">{item.createdAt?.seconds ? format(item.createdAt.toDate(), 'dd/MM/yyyy HH:mm', { locale: fr }) : 'N/A'}</span>
                              </span>
                            </div>
                          </div>
                          
                          <div className="space-y-2 pt-2 sm:pt-0 sm:border-l sm:border-gray-200/60 sm:pl-4">
                            <div className="flex items-center gap-2">
                              <Mail size={13} className="text-gray-400 shrink-0" />
                              <span className="font-medium text-gray-800 select-all break-all">{item.email}</span>
                            </div>
                            {item.phone && (
                              <div className="flex items-center gap-2">
                                <Phone size={13} className="text-gray-400 shrink-0" />
                                <span className="text-gray-700 font-semibold select-all">{item.phone}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Footer / Badges & Expand Trigger */}
                        <div className="flex items-center justify-between gap-3 flex-wrap pt-1">
                          <div>
                            {item.engagementType && (
                              <span className="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-100/40 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                {item.engagementType === 'adherent' ? 'Adhérent' : 
                                 item.engagementType === 'sympathisant' ? 'Sympathisant' : 
                                 item.engagementType === 'donateur' ? 'Donateur' : item.engagementType}
                              </span>
                            )}
                          </div>
                          <button 
                            onClick={() => toggleExpand(item.id)}
                            className="text-xs font-bold text-[#0047AB] hover:underline"
                          >
                            {isExpanded ? 'Masquer les détails' : 'Voir les détails & motivations'}
                          </button>
                        </div>

                        {/* Expanded details container */}
                        {isExpanded && (
                          <div className="pt-3 border-t border-gray-100 text-xs text-gray-700 space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="bg-blue-50/10 p-4 rounded-xl border border-blue-100/30 space-y-2.5">
                                <h5 className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Type d'engagement souhaité</h5>
                                <span className="capitalize font-bold text-[#0047AB] bg-blue-50 border border-blue-100/50 px-2.5 py-1 rounded-full text-[11px] inline-block">
                                  {item.engagementType === 'adherent' ? 'Adhérent actif' : 
                                   item.engagementType === 'sympathisant' ? 'Sympathisant réactif' : 
                                   item.engagementType === 'donateur' ? 'Donateur' : item.engagementType || 'Non spécifié'}
                                </span>
                              </div>
                              <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 space-y-2">
                                <h5 className="text-[9px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                                  <MessageSquare size={11} className="text-blue-500" />
                                  Motivations de l'adhérent :
                                </h5>
                                {item.message?.trim() ? (
                                  <div className="bg-white p-3 rounded-lg border border-gray-100 text-xs italic text-gray-600 leading-relaxed whitespace-pre-wrap">
                                    "{item.message}"
                                  </div>
                                ) : (
                                  <p className="text-[11px] text-gray-400 italic bg-white/40 p-2.5 rounded-lg border border-dashed border-gray-200">
                                    Aucun message d'accompagnement rédigé.
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Desktop View: Styled Full-Width Table Layout */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="p-4 text-xs font-bold text-gray-400 uppercase w-10"></th>
                        <th className="p-4 text-xs font-bold text-gray-400 uppercase">Militant</th>
                        <th className="p-4 text-xs font-bold text-gray-400 uppercase">Localité</th>
                        <th className="p-4 text-xs font-bold text-gray-400 uppercase">Contact / Engagement</th>
                        <th className="p-4 text-xs font-bold text-gray-400 uppercase">Date</th>
                        <th className="p-4 text-xs font-bold text-gray-400 uppercase text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {data.map((item) => {
                        const isExpanded = !!expandedIds[item.id];
                        return (
                          <React.Fragment key={item.id}>
                            <tr 
                              className={`hover:bg-gray-50/60 cursor-pointer select-none transition-colors ${isExpanded ? 'bg-blue-50/10' : ''}`}
                              onClick={() => toggleExpand(item.id)}
                            >
                              <td className="p-4 w-10 text-center" onClick={(e) => e.stopPropagation()}>
                                <button
                                  onClick={() => toggleExpand(item.id)}
                                  className="p-1.5 hover:bg-gray-100 rounded text-blue-600 transition-colors"
                                  title="Voir les détails"
                                >
                                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </button>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-blue-50 text-[#0047AB] rounded-full flex items-center justify-center font-bold text-xs uppercase shrink-0">
                                    {item.firstname?.[0]}{item.lastname?.[0]}
                                  </div>
                                  <div className="min-w-0">
                                    <span className="font-bold text-gray-900 block truncate">{item.firstname} {item.lastname}</span>
                                    {item.profession && (
                                      <span className="text-[11px] text-blue-800 bg-blue-50/80 px-2 py-0.5 rounded font-medium inline-flex items-center gap-1 mt-0.5">
                                        <Briefcase size={11} className="shrink-0 text-blue-500" /> {item.profession}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <MapPin size={14} className="text-gray-400 shrink-0" /> {item.locality || 'N/A'}
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="text-sm font-medium text-gray-800">{item.email}</div>
                                <div className="text-xs text-gray-400">{item.phone}</div>
                                {item.engagementType && (
                                  <div className="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-100/50 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider inline-block mt-1">
                                    {item.engagementType === 'adherent' ? 'Adhérent' : 
                                     item.engagementType === 'sympathisant' ? 'Sympathisant' : 
                                     item.engagementType === 'donateur' ? 'Donateur' : item.engagementType}
                                  </div>
                                )}
                              </td>
                              <td className="p-4 text-xs text-gray-500 whitespace-nowrap">
                                {item.createdAt?.seconds ? format(item.createdAt.toDate(), 'dd/MM/yyyy HH:mm', { locale: fr }) : 'N/A'}
                              </td>
                              <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                                <button 
                                  onClick={() => handleDelete(item.id, 'join_requests')}
                                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                  title="Supprimer l'inscription"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </td>
                            </tr>
                            {isExpanded && (
                              <tr className="bg-gray-50/30">
                                <td colSpan={6} className="p-6 border-b border-gray-100 bg-blue-50/5">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-10">
                                    <div>
                                      <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Informations de Profil</h5>
                                      <ul className="space-y-2.5 text-sm text-gray-700">
                                        <li>
                                          <span className="font-bold text-gray-500">Nom complet : </span>
                                          <span className="text-gray-900 font-semibold">{item.firstname} {item.lastname}</span>
                                        </li>
                                        <li>
                                          <span className="font-bold text-gray-400 block mb-0.5">Profession renseignée :</span>
                                          <span className="text-gray-900 font-semibold inline-flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-gray-100 text-xs">
                                            <Briefcase size={12} className="text-gray-400" /> {item.profession || 'Non renseignée'}
                                          </span>
                                        </li>
                                        <li>
                                          <span className="font-bold text-gray-500">Type d'engagement souhaité : </span>
                                          <span className="capitalize font-bold text-[#0047AB] bg-blue-50 border border-blue-100/50 px-2.5 py-1 rounded-full text-xs inline-block mt-1">
                                            {item.engagementType === 'adherent' ? 'Adhérent actif' : 
                                             item.engagementType === 'sympathisant' ? 'Sympathisant réactif' : 
                                             item.engagementType === 'donateur' ? 'Donateur' : item.engagementType || 'Non spécifié'}
                                          </span>
                                        </li>
                                      </ul>
                                    </div>
                                    <div className="border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                                      <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                        <MessageSquare size={12} className="text-blue-500" />
                                        Message & motivations de l'adhérent :
                                      </h5>
                                      {item.message?.trim() ? (
                                        <div className="bg-white p-4 rounded-xl border border-gray-100 relative max-w-lg shadow-inner">
                                          <p className="text-sm text-gray-700 leading-relaxed italic whitespace-pre-wrap">
                                            "{item.message}"
                                          </p>
                                        </div>
                                      ) : (
                                        <p className="text-xs text-gray-400 italic bg-gray-50 p-3 rounded-lg border border-dashed border-gray-200 inline-block">
                                          Aucun message d'accompagnement n'a été rédigé.
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}

        {currentView === 'messages' && (
          <div className="space-y-4">
            {loading ? (
              <div className="bg-white rounded-2xl p-20 text-center text-gray-400 border border-gray-100">
                <Loader2 className="animate-spin mx-auto mb-4" /> Chargement...
              </div>
            ) : data.length === 0 ? (
              <div className="bg-white rounded-2xl p-20 text-center text-gray-400 border border-gray-100">Aucun message reçu.</div>
            ) : (
              data.map((msg) => (
                <div key={msg.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center shrink-0">
                        <Mail size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{msg.subject}</h4>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400 mt-1">
                          <span>De : <span className="text-gray-900 font-semibold">{msg.name}</span></span>
                          <span className="text-gray-200">|</span>
                          <span className="flex items-center gap-1">
                            <Mail size={12} className="text-gray-400 shrink-0" />
                            <span className="text-gray-700 font-medium select-all">{msg.email}</span>
                          </span>
                          {msg.phone && (
                            <>
                              <span className="text-gray-200">|</span>
                              <span className="flex items-center gap-1">
                                <Phone size={11} className="text-gray-400 shrink-0" />
                                <span className="text-gray-700 font-semibold select-all">{msg.phone}</span>
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">
                        {msg.createdAt?.seconds ? format(msg.createdAt.toDate(), 'dd MMM yyyy', { locale: fr }) : 'N/A'}
                      </p>
                      <button 
                        onClick={() => handleDelete(msg.id, 'contact_messages')}
                        className="p-1.5 text-gray-400 lg:text-gray-300 hover:text-red-500 transition-all opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
                        title="Supprimer le message"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100 italic">
                    "{msg.message}"
                  </p>
                </div>
              ))
            )}
          </div>
        )}

        {currentView === 'articles' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Articles publiés</h3>
              <button 
                onClick={() => setIsArticleModalOpen(true)}
                className="bg-[#0047AB] text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-800 transition-all shadow-md"
              >
                <Plus size={18} /> NOUVEL ARTICLE
              </button>
            </div>

            {loading ? (
              <div className="bg-white rounded-2xl p-20 text-center text-gray-400 border border-gray-100">
                <Loader2 className="animate-spin mx-auto mb-4" /> Chargement...
              </div>
            ) : data.length === 0 ? (
              <div className="bg-white rounded-2xl p-20 text-center text-gray-400 border border-gray-100">Aucun article publié.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.map((art) => (
                  <div key={art.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group">
                    <div className="h-40 bg-gray-100 relative overflow-hidden">
                      {art.image ? (
                        <img src={art.image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <Newspaper size={40} />
                        </div>
                      )}
                      <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur rounded text-[10px] font-bold uppercase tracking-widest text-[#0047AB]">
                        {art.status}
                      </div>
                    </div>
                    <div className="p-5">
                      <h4 className="font-bold text-gray-900 mb-2 line-clamp-2">{art.title}</h4>
                      <p className="text-xs text-gray-500 mb-4 line-clamp-3 leading-relaxed">
                        {art.summary || art.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
                      </p>
                      <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                        <span className="text-[10px] text-gray-400 font-bold uppercase">
                          {art.publishedAt?.seconds ? format(art.publishedAt.toDate(), 'dd MMM yyyy', { locale: fr }) : 
                           art.createdAt?.seconds ? format(art.createdAt.toDate(), 'dd MMM yyyy', { locale: fr }) : 'En attente...'}
                        </span>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleDelete(art.id, 'articles')}
                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-100"
                            title="Supprimer l'article"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {currentView === 'events' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Agenda Politique</h3>
              <button 
                onClick={() => setIsEventModalOpen(true)}
                className="bg-[#0047AB] text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-800 transition-all shadow-md"
              >
                <Plus size={18} /> NOUVEL ÉVÉNEMENT
              </button>
            </div>

            {loading ? (
              <div className="bg-white rounded-2xl p-20 text-center text-gray-400 border border-gray-100">
                <Loader2 className="animate-spin mx-auto mb-4" /> Chargement...
              </div>
            ) : data.length === 0 ? (
              <div className="bg-white rounded-2xl p-20 text-center text-gray-400 border border-gray-100">Aucun événement prévu.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.map((event) => (
                  <div key={event.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex gap-6 relative group">
                    <div className="w-20 h-20 bg-blue-50 text-[#0047AB] rounded-2xl flex flex-col items-center justify-center shrink-0">
                      <span className="text-2xl font-black">{format(new Date(event.eventDate), 'dd')}</span>
                      <span className="text-[10px] font-bold uppercase">{format(new Date(event.eventDate), 'BBB', { locale: fr })}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 mb-1">{event.title}</h4>
                      <div className="flex flex-wrap gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                        <span className="flex items-center gap-1 text-[#0047AB]"><Clock size={12} /> {event.startTime}</span>
                        <span className="flex items-center gap-1"><MapPin size={12} /> {event.location}</span>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2">{event.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleDelete(event.id, 'events')}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-100 self-start"
                        title="Supprimer l'événement"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {currentView === 'settings' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-8 border-b pb-4">Paramètres du Compte</h3>
            <div className="space-y-8 max-w-md">
              <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl">
                <p className="text-xs text-amber-700 leading-relaxed">
                  <span className="font-bold">Note :</span> Vos accès administratifs sont régis par l'email lié à votre compte Supabase.
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Email Administrateur</label>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-gray-700 font-medium flex items-center gap-3">
                    <User size={16} className="text-gray-400" />
                    {adminEmail}
                  </div>
                </div>
                <div className="pt-4">
                  <p className="text-xs text-blue-500 italic mb-4">Pour changer votre mot de passe, déconnectez-vous et utilisez la fonction "Mot de passe oublié" sur la page de connexion.</p>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 w-full p-4 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-all border border-red-100"
                  >
                    <LogOut size={18} /> SE DÉCONNECTER MAINTENANT
                  </button>
                </div>
              </div>

              <div className="pt-10 border-t border-gray-50 text-center">
                <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">Version du panel 1.0.2</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Article Modal */}
      {isArticleModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#0047AB] text-white">
              <h3 className="font-bold text-lg flex items-center gap-2"><Newspaper size={20} /> Nouvel Article</h3>
              <button 
                onClick={() => setIsArticleModalOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreateArticle} className="p-6 space-y-6 overflow-y-auto">
              <div className="flex bg-gray-100 p-1 rounded-xl mb-4">
                <button 
                  type="button"
                  onClick={() => setPreviewMode(false)}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${!previewMode ? 'bg-white shadow-sm text-[#0047AB]' : 'text-gray-500'}`}
                >
                  ÉDITEUR
                </button>
                <button 
                  type="button"
                  onClick={() => setPreviewMode(true)}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${previewMode ? 'bg-white shadow-sm text-[#0047AB]' : 'text-gray-500'}`}
                >
                  APERÇU
                </button>
              </div>

              {!previewMode ? (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Titre de l'article</label>
                    <input 
                      required
                      type="text"
                      value={newArticle.title}
                      onChange={e => setNewArticle({...newArticle, title: e.target.value})}
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#0047AB] focus:bg-white outline-none transition-all font-bold text-gray-800"
                      placeholder="Ex: Lancement de la campagne territoriale..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">URL de l'image</label>
                    <div className="flex gap-2">
                      <input 
                        type="url"
                        value={newArticle.imageUrl}
                        onChange={e => setNewArticle({...newArticle, imageUrl: e.target.value})}
                        className="flex-grow p-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#0047AB] focus:bg-white outline-none transition-all text-sm"
                        placeholder="https://images.unsplash.com/..."
                      />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-2 italic">Astuce : Utilisez Unsplash ou Imgur pour héberger vos images.</p>
                  </div>

                  <div className="flex-1">
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Contenu (Format Markdown supporté)</label>
                    <textarea 
                      required
                      value={newArticle.content}
                      onChange={e => setNewArticle({...newArticle, content: e.target.value})}
                      rows={12}
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#0047AB] focus:bg-white outline-none transition-all text-sm leading-relaxed font-mono"
                      placeholder="# Titre principal&#10;&#10;Votre texte ici... Use **bold** for emphasis."
                    ></textarea>
                  </div>
                </>
              ) : (
                <div className="border border-gray-100 rounded-2xl p-6 min-h-[400px] bg-white overflow-y-auto">
                  <h1 className="text-3xl font-black mb-4">{newArticle.title || "Titre de l'article"}</h1>
                  {newArticle.imageUrl && <img src={newArticle.imageUrl} alt="" className="w-full h-48 object-cover rounded-xl mb-6 shadow-md" />}
                  <div className="prose prose-blue max-w-none">
                    <ReactMarkdown>{newArticle.content || "_Aucun contenu à prévisualiser_"}</ReactMarkdown>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <button 
                  type="button"
                  onClick={() => setIsArticleModalOpen(false)}
                  className="w-full p-4 border border-gray-100 rounded-xl font-bold text-gray-400 hover:bg-gray-50 transition-all uppercase text-xs tracking-widest"
                >
                  Annuler
                </button>
                <button 
                  disabled={loading}
                  type="submit"
                  className="w-full p-4 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-all shadow-lg flex items-center justify-center gap-2 uppercase text-xs tracking-widest disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : <> <Save size={18} /> Publier enfin</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Event Modal */}
      {isEventModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#0047AB] text-white">
              <h3 className="font-bold text-lg flex items-center gap-2"><Calendar size={20} /> Nouvel Événement</h3>
              <button 
                onClick={() => setIsEventModalOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreateEvent} className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Titre de l'événement</label>
                <input 
                  required
                  type="text"
                  value={newEvent.title}
                  onChange={e => setNewEvent({...newEvent, title: e.target.value})}
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#0047AB] focus:bg-white outline-none transition-all font-bold"
                  placeholder="Ex: Meeting Départemental à Mbour"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Date</label>
                  <input 
                    required
                    type="date"
                    value={newEvent.eventDate}
                    onChange={e => setNewEvent({...newEvent, eventDate: e.target.value})}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#0047AB] outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Heure</label>
                  <input 
                    required
                    type="time"
                    value={newEvent.startTime}
                    onChange={e => setNewEvent({...newEvent, startTime: e.target.value})}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#0047AB] outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Lieu</label>
                <input 
                  required
                  type="text"
                  value={newEvent.location}
                  onChange={e => setNewEvent({...newEvent, location: e.target.value})}
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#0047AB] outline-none transition-all text-sm"
                  placeholder="Ex: Place de l'Indépendance, Thiès"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Description courte</label>
                <textarea 
                  required
                  value={newEvent.description}
                  onChange={e => setNewEvent({...newEvent, description: e.target.value})}
                  rows={3}
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#0047AB] outline-none transition-all text-sm leading-relaxed"
                  placeholder="Expliquez brièvement l'objet de la rencontre..."
                ></textarea>
              </div>

              <button 
                type="submit"
                className="w-full p-4 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-all shadow-lg flex items-center justify-center gap-2 uppercase text-xs tracking-widest mt-4"
              >
                <Save size={18} /> ENREGISTRER L'ÉVÉNEMENT
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

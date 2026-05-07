import React, { useState, useEffect } from 'react';
import { db, auth } from '../../lib/firebase';
import { collection, query, getDocs, limit, orderBy, deleteDoc, doc, Timestamp, addDoc, serverTimestamp, getCountFromServer } from 'firebase/firestore';
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
  TrendingUp,
  Clock,
  ExternalLink,
  Trash2,
  Mail,
  User,
  MapPin,
  Loader2,
  Plus,
  X,
  Save
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import ReactMarkdown from 'react-markdown';

type View = 'overview' | 'inscriptions' | 'messages' | 'articles' | 'events' | 'settings';

export default function Dashboard() {
  const [currentView, setCurrentView] = useState<View>('overview');
  const [stats, setStats] = useState({
    members: 0,
    messages: 0,
    articles: 0,
    events: 0
  });
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
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
  const navigate = useNavigate();

  const fetchStats = async () => {
    try {
      const collectionsList = ['join_requests', 'contact_messages', 'articles', 'events'];
      const counts = await Promise.all(collectionsList.map(async (col) => {
        const coll = collection(db, col);
        const snapshot = await getCountFromServer(coll);
        return snapshot.data().count;
      }));
      
      setStats({
        members: counts[0],
        messages: counts[1],
        articles: counts[2],
        events: counts[3]
      });
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const fetchData = async (view: View) => {
    setLoading(true);
    try {
      let colName = '';
      if (view === 'inscriptions') colName = 'join_requests';
      if (view === 'messages') colName = 'contact_messages';
      if (view === 'articles') colName = 'articles';
      if (view === 'events') colName = 'events';

      if (colName) {
        const q = query(collection(db, colName), orderBy(view === 'events' ? 'eventDate' : 'createdAt', view === 'events' ? 'asc' : 'desc'));
        const snap = await getDocs(q);
        setData(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats().then(() => {
      if (currentView === 'overview') {
        setLoading(false);
      } else {
        fetchData(currentView);
      }
    });
  }, [currentView]);

  const handleDelete = async (id: string, col: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet élément ?")) {
      try {
        await deleteDoc(doc(db, col, id));
        fetchData(currentView);
        fetchStats();
      } catch (err) {
        alert("Erreur lors de la suppression");
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

      await addDoc(collection(db, 'articles'), {
        title: articleData.title,
        content: articleData.content,
        status: articleData.status,
        image: articleData.imageUrl,
        slug,
        createdAt: serverTimestamp(),
        publishedAt: articleData.status === 'published' ? serverTimestamp() : null,
        authorId: auth.currentUser?.uid,
        summary: articleData.content.replace(/<[^>]*>/g, '').substring(0, 160)
      });
      
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

      await addDoc(collection(db, 'events'), {
        ...eventData,
        image: eventData.imageUrl,
        slug,
        status: 'upcoming',
        createdAt: serverTimestamp()
      });
      
      fetchData('events');
      fetchStats();
    } catch (err) {
      console.error("Error creating event:", err);
      alert("Une erreur est survenue lors de la sauvegarde.");
    }
  };

  const handleLogout = () => {
    auth.signOut();
    navigate('/admin/login');
  };

  const SidebarButton = ({ view, label, icon: Icon }: { view: View, label: string, icon: any }) => (
    <button 
      onClick={() => setCurrentView(view)}
      className={`flex items-center gap-3 w-full p-3 rounded-xl font-semibold transition-all ${currentView === view ? 'bg-blue-600 text-white' : 'text-blue-100 hover:bg-white/5'}`}
    >
      <Icon size={20} /> {label}
    </button>
  );

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 bg-[#002B6B] text-white p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-12">
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
          >
            <ExternalLink size={18} /> Voir le site public
          </Link>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full p-3 text-red-300 hover:text-red-100 hover:bg-red-500/10 rounded-xl transition-all text-sm font-bold"
          >
            <LogOut size={18} /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10">
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

        {currentView === 'overview' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {[
                { label: 'Inscriptions', value: stats.members, icon: <Users />, color: 'bg-blue-500', view: 'inscriptions' as View },
                { label: 'Messages', value: stats.messages, icon: <MessageSquare />, color: 'bg-indigo-500', view: 'messages' as View },
                { label: 'Articles', value: stats.articles, icon: <Newspaper />, color: 'bg-teal-500', view: 'articles' as View },
                { label: 'Événements', value: stats.events, icon: <Calendar />, color: 'bg-amber-500', view: 'overview' as View },
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
                  {stats.members > 0 || stats.messages > 0 || stats.articles > 0 ? (
                    <>
                      {stats.members > 0 && (
                        <div className="flex items-center gap-4 group cursor-pointer" onClick={() => setCurrentView('inscriptions')}>
                          <div className="w-2 h-2 bg-blue-400 rounded-full group-hover:scale-150 transition-transform"></div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-700">Vous avez <span className="font-bold">{stats.members}</span> inscriptions en attente.</p>
                          </div>
                          <ChevronRight size={14} className="text-gray-300" />
                        </div>
                      )}
                      {stats.messages > 0 && (
                        <div className="flex items-center gap-4 group cursor-pointer" onClick={() => setCurrentView('messages')}>
                          <div className="w-2 h-2 bg-indigo-400 rounded-full group-hover:scale-150 transition-transform"></div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-700">Vous avez <span className="font-bold">{stats.messages}</span> nouveaux messages reçus.</p>
                          </div>
                          <ChevronRight size={14} className="text-gray-300" />
                        </div>
                      )}
                      {stats.articles > 0 && (
                        <div className="flex items-center gap-4 group cursor-pointer" onClick={() => setCurrentView('articles')}>
                          <div className="w-2 h-2 bg-teal-400 rounded-full group-hover:scale-150 transition-transform"></div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-700">Total de <span className="font-bold">{stats.articles}</span> articles publiés sur le site.</p>
                          </div>
                          <ChevronRight size={14} className="text-gray-300" />
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-gray-400 text-sm italic">Aucune activité récente.</p>
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
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="p-4 text-xs font-bold text-gray-400 uppercase">Militant</th>
                      <th className="p-4 text-xs font-bold text-gray-400 uppercase">Localité</th>
                      <th className="p-4 text-xs font-bold text-gray-400 uppercase">Contact</th>
                      <th className="p-4 text-xs font-bold text-gray-400 uppercase">Date</th>
                      <th className="p-4 text-xs font-bold text-gray-400 uppercase text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {data.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50/50">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-50 text-[#0047AB] rounded-full flex items-center justify-center font-bold text-xs uppercase">
                              {item.firstname?.[0]}{item.lastname?.[0]}
                            </div>
                            <span className="font-bold text-gray-900">{item.firstname} {item.lastname}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin size={14} /> {item.locality || 'N/A'}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm font-medium">{item.email}</div>
                          <div className="text-xs text-gray-400">{item.phone}</div>
                        </td>
                        <td className="p-4 text-xs text-gray-500 whitespace-nowrap">
                          {item.createdAt?.seconds ? format(item.createdAt.toDate(), 'dd/MM/yyyy HH:mm', { locale: fr }) : 'N/A'}
                        </td>
                        <td className="p-4 text-right">
                          <button 
                            onClick={() => handleDelete(item.id, 'join_requests')}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
                        <p className="text-xs text-gray-400">De: <span className="text-gray-900 font-medium">{msg.name}</span> ({msg.email})</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">
                        {msg.createdAt?.seconds ? format(msg.createdAt.toDate(), 'dd MMM yyyy', { locale: fr }) : 'N/A'}
                      </p>
                      <button 
                        onClick={() => handleDelete(msg.id, 'contact_messages')}
                        className="p-1.5 text-gray-300 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
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
                            className="p-1.5 text-gray-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
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
                    <button 
                      onClick={() => handleDelete(event.id, 'events')}
                      className="absolute top-4 right-4 p-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
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
                  <span className="font-bold">Note :</span> Vos accès administratifs sont régis par l'email lié à votre compte Firebase.
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Email Administrateur</label>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-gray-700 font-medium flex items-center gap-3">
                    <User size={16} className="text-gray-400" />
                    {auth.currentUser?.email}
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

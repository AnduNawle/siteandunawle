import React, { useState } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      await addDoc(collection(db, 'contact_messages'), {
        ...formData,
        isRead: false,
        createdAt: serverTimestamp(),
      });
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      console.error("Error sending message:", error);
      setStatus('error');
    }
  };

  return (
    <div className="pt-24 pb-20">
      <section className="bg-gray-50 py-20 mb-20 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 uppercase tracking-tight">Contactez-nous</h1>
        <p className="text-gray-500 max-w-xl mx-auto px-4">
          Vous avez des questions ou des suggestions ? Notre équipe est à votre écoute pour construire ensemble l'avenir.
        </p>
      </section>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Info Column */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold mb-8 text-[#0047AB]">Coordonnées Officielles</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-50 text-[#0047AB] rounded-full flex items-center justify-center shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase mb-1">Email</p>
                  <p className="text-gray-900 font-semibold">contact@andunawle.sn</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-50 text-[#0047AB] rounded-full flex items-center justify-center shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase mb-1">Téléphone</p>
                  <p className="text-gray-900 font-semibold">+221 33 000 00 00</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-50 text-[#0047AB] rounded-full flex items-center justify-center shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase mb-1">Siége Social</p>
                  <p className="text-gray-900 font-semibold">Dakar, Avenue Cheikh Anta Diop, Sénégal</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#0047AB] text-white p-8 rounded-2xl shadow-lg relative overflow-hidden">
            <h3 className="text-xl font-bold mb-4 relative z-10">Réseaux Sociaux</h3>
            <p className="text-blue-100 text-sm mb-6 relative z-10">Suivez-nous pour ne rien rater de l'actualité politique et territoriale.</p>
            <div className="flex gap-4 relative z-10">
              {['FB', 'TW', 'IG', 'YT'].map(s => (
                <div key={s} className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center font-bold text-xs hover:bg-white hover:text-[#0047AB] transition-colors cursor-pointer">
                  {s}
                </div>
              ))}
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          </div>
        </div>

        {/* Form Column */}
        <div className="lg:col-span-2">
          {status === 'success' ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-12 rounded-3xl shadow-xl text-center border border-green-100"
            >
              <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Message envoyé !</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Nous avons bien reçu votre message. Notre équipe reviendra vers vous dans les plus brefs délais.
              </p>
              <button 
                onClick={() => setStatus('idle')}
                className="bg-[#0047AB] text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-800 transition-colors"
              >
                ENVOYER UN AUTRE MESSAGE
              </button>
            </motion.div>
          ) : (
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Nom Complet</label>
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#0047AB] focus:bg-white transition-all outline-none"
                      placeholder="Jean Dupont"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Email</label>
                    <input 
                      required
                      type="email" 
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#0047AB] focus:bg-white transition-all outline-none"
                      placeholder="jean@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Téléphone</label>
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#0047AB] focus:bg-white transition-all outline-none"
                      placeholder="+221 ..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Sujet</label>
                    <input 
                      required
                      type="text" 
                      value={formData.subject}
                      onChange={e => setFormData({...formData, subject: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#0047AB] focus:bg-white transition-all outline-none"
                      placeholder="Objet de votre message"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Message</label>
                  <textarea 
                    required
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                    rows={6}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#0047AB] focus:bg-white transition-all outline-none"
                    placeholder="Comment pouvons-nous vous aider ?"
                  ></textarea>
                </div>

                <button 
                  disabled={status === 'loading'}
                  className="w-full bg-[#0047AB] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-blue-800 transition-all shadow-lg active:scale-95 disabled:opacity-70"
                >
                  {status === 'loading' ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                  ENVOYER LE MESSAGE
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useSettings } from '../context/SettingsContext';

export default function Contact() {
  const { mouvementPhone, mouvementEmail, mouvementAddress } = useSettings();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const { error } = await supabase.from('contact_messages').insert([
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
          isRead: false,
          created_at: new Date().toISOString(),
        }
      ]);
      
      if (error) throw error;
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err: any) {
      console.error("Error sending message:", err);
      setStatus('error');
      setErrorMessage(err?.message || String(err));
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
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-1 space-y-8"
        >
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold mb-8 text-[#0047AB]">Coordonnées Officielles</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-50 text-[#0047AB] rounded-full flex items-center justify-center shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase mb-1">Email</p>
                  <p className="text-gray-900 font-semibold">{mouvementEmail}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-50 text-[#0047AB] rounded-full flex items-center justify-center shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase mb-1">Téléphone</p>
                  <p className="text-gray-900 font-semibold">{mouvementPhone}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-50 text-[#0047AB] rounded-full flex items-center justify-center shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase mb-1">Siége Social</p>
                  <p className="text-gray-900 font-semibold">{mouvementAddress}</p>
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
        </motion.div>

        {/* Form Column */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-2"
        >
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

                {status === 'error' && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-4 rounded-xl shadow-sm">
                    <div className="flex items-start gap-3">
                      <AlertCircle size={20} className="shrink-0 mt-0.5 text-red-500" />
                      <div>
                        <p className="font-bold text-sm">Une erreur est survenue lors de l'envoi.</p>
                        {errorMessage && (
                          <p className="font-mono text-xs mt-2 bg-white/70 p-2.5 rounded border border-red-100 select-all overflow-x-auto max-w-full">
                            {errorMessage}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

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
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto px-4 mt-16"
      >
        <div className="bg-white rounded-3xl p-2 shadow-xl border border-gray-100 h-[400px] overflow-hidden">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15436.438258386!2d-17.472111!3d14.68535!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTTCsDQxJzA3LjIiTiAxN8KwMjgnMTkuNiJX!5e0!3m2!1sen!2ssn!4v1620000000000!5m2!1sen!2ssn" 
            width="100%" 
            height="100%" 
            style={{ border: 0, borderRadius: '1.5rem' }} 
            allowFullScreen={true} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Localisation du Siége"
          ></iframe>
        </div>
      </motion.div>
    </div>
  );
}

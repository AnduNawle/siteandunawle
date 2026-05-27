import React, { useState } from 'react';
import { Facebook, Twitter, Instagram, Youtube, Phone, Mail, MapPin, Loader2, Check } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { supabase } from '../lib/supabase';

export default function Footer() {
  const { mouvementName, mouvementSlogan, mouvementPhone, mouvementEmail, mouvementAddress } = useSettings();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('loading');
    setErrorMessage('');

    try {
      const { error } = await supabase.from('newsletter_subscriptions').insert([
        { email: email.trim().toLowerCase() }
      ]);

      if (error) {
        // Handle unique constraint or general error
        if (error.code === '23505') {
          setErrorMessage('Cette adresse email est déjà inscrite à notre newsletter !');
        } else {
          setErrorMessage(error.message || 'Une erreur est survenue lors de l\'inscription.');
        }
        setStatus('error');
      } else {
        setStatus('success');
        setEmail('');
        setTimeout(() => setStatus('idle'), 5000);
      }
    } catch (err: any) {
      console.error('Subscription error:', err);
      setErrorMessage('Une erreur de réseau s\'est produite.');
      setStatus('error');
    }
  };

  return (
    <footer className="bg-[#002B6B] text-white">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden">
                <img src="./images/logo.png" alt="Logo" className="w-9 h-9 object-contain" referrerPolicy="no-referrer" />
              </div>
              <span className="font-bold text-xl tracking-tight uppercase">{mouvementName}</span>
            </div>
            <p className="text-blue-100 text-sm mb-6">
              {mouvementSlogan}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-300 transition-colors"><Facebook size={20} /></a>
              <a href="#" className="hover:text-blue-300 transition-colors"><Twitter size={20} /></a>
              <a href="#" className="hover:text-blue-300 transition-colors"><Instagram size={20} /></a>
              <a href="#" className="hover:text-blue-300 transition-colors"><Youtube size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 uppercase tracking-wider">Liens Rapides</h3>
            <ul className="space-y-2 text-sm text-blue-100">
              <li><a href="/" className="hover:text-white transition-colors">Accueil</a></li>
              <li><a href="/parti" className="hover:text-white transition-colors">Le Parti</a></li>
              <li><a href="/programme" className="hover:text-white transition-colors">Notre Programme</a></li>
              <li><a href="/actualites" className="hover:text-white transition-colors">Dernières Actualités</a></li>
              <li><a href="/evenements" className="hover:text-white transition-colors">Événements</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4 uppercase tracking-wider">Contact</h3>
            <ul className="space-y-3 text-sm text-blue-100">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="shrink-0" />
                <span>{mouvementAddress}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="shrink-0" />
                <span>{mouvementPhone}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="shrink-0" />
                <span>{mouvementEmail}</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-bold mb-4 uppercase tracking-wider">Newsletter</h3>
            <p className="text-blue-100 text-sm mb-4">
              Inscrivez-vous pour recevoir nos dernières nouvelles et mises à jour.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input 
                type="email" 
                required
                disabled={status === 'loading'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre email" 
                className="bg-blue-900 border-none rounded px-3 py-2 text-sm w-full focus:ring-2 focus:ring-blue-400 placeholder-blue-300 disabled:opacity-50"
              />
              <button 
                type="submit"
                disabled={status === 'loading'}
                className="bg-white text-[#0047AB] px-4 py-2 rounded text-sm font-bold hover:bg-blue-50 transition-colors disabled:opacity-50 flex items-center justify-center min-w-[50px]"
              >
                {status === 'loading' ? <Loader2 size={16} className="animate-spin" /> : 'OK'}
              </button>
            </form>
            {status === 'success' && (
              <p className="text-[#4ade80] text-xs font-semibold mt-2 flex items-center gap-1">
                <Check size={14} /> Inscription réussie ! Merci.
              </p>
            )}
            {status === 'error' && (
              <p className="text-[#f87171] text-xs font-semibold mt-2 leading-tight">
                {errorMessage}
              </p>
            )}
          </div>
        </div>

        <div className="border-t border-blue-800 mt-12 pt-8 text-center text-sm text-blue-300">
          <p>© {new Date().getFullYear()} {mouvementName}. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}

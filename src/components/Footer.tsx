import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#002B6B] text-white">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#0047AB] font-bold">
                AN
              </div>
              <span className="font-bold text-xl tracking-tight">ANDU NAWLE</span>
            </div>
            <p className="text-blue-100 text-sm mb-6">
              Ensemble, construisons l'avenir de nos territoires. Un développement inclusif, équitable et durable.
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
                <span>Dakar, Avenue Cheikh Anta Diop, Sénégal</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="shrink-0" />
                <span>+221 33 000 00 00</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="shrink-0" />
                <span>contact@andunawle.sn</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-bold mb-4 uppercase tracking-wider">Newsletter</h3>
            <p className="text-blue-100 text-sm mb-4">
              Inscrivez-vous pour recevoir nos dernières nouvelles et mises à jour.
            </p>
            <form className="flex gap-2">
              <input 
                type="email" 
                placeholder="Votre email" 
                className="bg-blue-900 border-none rounded px-3 py-2 text-sm w-full focus:ring-2 focus:ring-blue-400"
              />
              <button className="bg-white text-[#0047AB] px-4 py-2 rounded text-sm font-bold hover:bg-blue-50 transition-colors">
                OK
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-blue-800 mt-12 pt-8 text-center text-sm text-blue-300">
          <p>© {new Date().getFullYear()} ANDU NAWLE. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}

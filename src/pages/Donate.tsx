import React from 'react';
import { Heart, ShieldCheck, Zap, Globe, ArrowRight } from 'lucide-react';

export default function Donate() {
  return (
    <div className="pt-24 pb-20">
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 uppercase tracking-tight">Soutenir le mouvement</h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            Votre contribution financière nous permet de mener nos actions sur le terrain, d'organiser nos événements et de partager notre programme avec le plus grand nombre.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100">
              <h3 className="text-2xl font-bold text-[#0047AB] mb-6 flex items-center gap-3">
                <ShieldCheck /> Pourquoi donner ?
              </h3>
              <ul className="space-y-4">
                {[
                  "Financer nos caravanes territoriales",
                  "Soutenir la formation de nos militants",
                  "Produire nos supports de communication",
                  "Organiser nos meetings nationaux",
                  "Garantir l'indépendance de notre mouvement"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700 font-medium">
                    <div className="w-1.5 h-1.5 bg-[#0047AB] rounded-full"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-6">
              <div className="flex-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                <div className="w-12 h-12 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">$</div>
                <h4 className="font-bold text-gray-900 mb-1">Transparence</h4>
                <p className="text-xs text-gray-500 leading-relaxed">Chaque don est tracé et utilisé pour les actions du parti.</p>
              </div>
              <div className="flex-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                  <Zap size={20} />
                </div>
                <h4 className="font-bold text-gray-900 mb-1">Impact Direct</h4>
                <p className="text-xs text-gray-500 leading-relaxed">Votre don se transforme immédiatement en action concrète.</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="p-10">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-gray-900">
                <Heart className="text-red-500 fill-red-500" /> Formulaire de don
              </h2>
              
              <div className="grid grid-cols-3 gap-3 mb-8">
                {['5 000', '10 000', '25 000', '50 000', '100 000', 'Autre'].map((amount, i) => (
                  <button 
                    key={i}
                    className="py-3 border-2 border-gray-100 hover:border-[#0047AB] hover:text-[#0047AB] font-bold rounded-xl transition-all text-sm"
                  >
                    {amount} FCFA
                  </button>
                ))}
              </div>

              <form className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Nom complet" 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#0047AB] transition-all"
                />
                <input 
                  type="email" 
                  placeholder="Adresse email" 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#0047AB] transition-all"
                />
                
                <div className="pt-4">
                  <button className="w-full bg-[#0047AB] text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-800 transition-all flex items-center justify-center gap-3">
                    PROCÉDER AU PAIEMENT
                    <ArrowRight size={20} />
                  </button>
                </div>
                <div className="flex justify-center items-center gap-4 mt-6 opacity-30 grayscale scale-75">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="Paypal" className="h-6" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
                </div>
              </form>
            </div>
            <div className="bg-gray-900 p-4 text-center">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Sécurisé par protocole SSL</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

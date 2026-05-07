import React from 'react';
import { Target, Eye, ShieldCheck, Users } from 'lucide-react';

export default function TheParty() {
  const values = [
    { title: "Intégrité", description: "La transparence et l'éthique au cœur de toutes nos actions politiques." },
    { title: "Proximité", description: "Une écoute permanente des préoccupations réelles des citoyens dans chaque territoire." },
    { title: "Solidarité", description: "Le refus de l'exclusion et la promotion d'un développement pour tous sans exception." },
    { title: "Progrès", description: "L'audace d'innover pour transformer durablement les conditions de vie des populations." }
  ];

  return (
    <div className="pt-24 pb-20">
      {/* Header */}
      <section className="bg-gray-50 py-16 mb-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 uppercase tracking-tight">Le Parti</h1>
          <div className="w-24 h-1.5 bg-[#0047AB] mx-auto mb-8"></div>
          <p className="max-w-3xl mx-auto text-lg text-gray-600 leading-relaxed">
            Andu Nawle est né de la volonté de citoyens engagés pour une redéfinition du contrat social entre l'État et ses territoires.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 space-y-24">
        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 text-[#0047AB] rounded-lg flex items-center justify-center mb-6">
              <Eye size={28} />
            </div>
            <h2 className="text-2xl font-bold mb-4">Notre Vision</h2>
            <p className="text-gray-600 leading-relaxed">
              Nous voyons un Sénégal où chaque territoire est un pôle de développement autonome et prospère, où les richesses sont partagées équitablement et où chaque citoyen a les opportunités pour réaliser son potentiel localement.
            </p>
          </div>
          <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 text-[#0047AB] rounded-lg flex items-center justify-center mb-6">
              <Target size={28} />
            </div>
            <h2 className="text-2xl font-bold mb-4">Notre Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              Notre mission est d'impulser une nouvelle dynamique de gouvernance territoriale basée sur la transparence, l'efficacité des services publics et l'inclusion socio-économique active de toutes les couches de la population.
            </p>
          </div>
        </div>

        {/* Values */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Nos Valeurs Fondamentales</h2>
            <p className="text-gray-500">Les principes qui guident chacune de nos décisions.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <div key={i} className="text-center p-6 border-b-4 border-transparent hover:border-[#0047AB] bg-white shadow-sm transition-all">
                <h3 className="text-xl font-bold text-[#0047AB] mb-3">{v.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Leadership Intro */}
        <section className="bg-[#002B6B] rounded-3xl p-12 text-white relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Une Équipe Dirigeante Engagée</h2>
              <p className="text-blue-100 mb-8 leading-relaxed">
                Le parti Andu Nawle est dirigé par des hommes et des femmes d'expérience, venus de divers horizons professionnels, unis par l'amour de la patrie et le désir de servir.
              </p>
              <button className="bg-white text-[#002B6B] px-8 py-3 rounded font-bold hover:bg-blue-50 transition-colors">
                DÉCOUVRIR LES RESPONSABLES
              </button>
            </div>
            <div className="flex gap-4">
              <div className="w-full aspect-[3/4] bg-blue-800 rounded-2xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-500">
                <img src="https://images.unsplash.com/photo-1540910419892-f0c73255dc1b?q=80&w=2670&auto=format&fit=crop" alt="Leader 1" className="w-full h-full object-cover" />
              </div>
              <div className="w-full aspect-[3/4] bg-blue-800 rounded-2xl overflow-hidden mt-8 grayscale hover:grayscale-0 transition-all duration-500">
                <img src="https://images.unsplash.com/photo-1540910419892-f0c73255dc1b?q=80&w=2670&auto=format&fit=crop" alt="Leader 2" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 rounded-full -mr-32 -mt-32"></div>
        </section>
      </div>
    </div>
  );
}

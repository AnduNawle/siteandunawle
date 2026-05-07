import React, { useState } from 'react';
import { Shield, GraduationCap, HeartPulse, Lock, Briefcase, Shovel as Tractor, UserCircle2, Landmark, Leaf, Map, ArrowRight, X, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Program() {
  const [selectedTheme, setSelectedTheme] = useState<typeof themes[0] | null>(null);

  const themes = [
    { 
      title: "Développement Économique", 
      icon: <Shield size={32} />, 
      content: "Favoriser l'entreprenariat local, faciliter l'accès au crédit pour les PME territoriales et valoriser les ressources propres à chaque région.",
      details: [
        "Création de banques régionales de développement pour soutenir les projets locaux.",
        "Suppression des barrières administratives pour les micro-entreprises rurales.",
        "Label 'Produit du Terroir' pour booster les exportations artisanales.",
        "Programmes de mentorat entre grands entrepreneurs et jeunes créateurs."
      ]
    },
    { 
      title: "Éducation", 
      icon: <GraduationCap size={32} />, 
      content: "Moderniser les infrastructures scolaires, adapter les formations aux besoins du marché du travail local et promouvoir l'excellence.",
      details: [
        "Construction de lycées techniques spécialisés par pôle économique régional.",
        "Digitalisation complète du système éducatif dès le primaire.",
        "Restauration des bourses d'excellence basées sur le mérite territorial.",
        "Renforcement de l'enseignement des langues nationales et de l'histoire locale."
      ]
    },
    { 
      title: "Santé", 
      icon: <HeartPulse size={32} />, 
      content: "Construire des hôpitaux de référence, renforcer les plateaux techniques et assurer une couverture santé universelle effective.",
      details: [
        "Un hôpital de niveau 3 dans chaque capitale régionale.",
        "Mise en place d'un Samu régional performant avec hélicoptères médicalisés.",
        "Gratuité totale des soins pour les enfants de moins de 5 ans et les seniors.",
        "Incitations majeures pour l'installation des médecins dans les zones rurales."
      ]
    },
    { 
      title: "Sécurité", 
      icon: <Lock size={32} />, 
      content: "Renforcer les effectifs de proximité, investir dans la cybersécurité et assurer la protection des biens et des personnes.",
      details: [
        "Augmentation des effectifs de la police de proximité.",
        "Équipement moderne (drones, caméras) pour la surveillance des frontières.",
        "Création d'une agence nationale de lutte contre la cybercriminalité.",
        "Programmes de médiation sociale pour réduire la délinquance juvénile."
      ]
    },
    { 
      title: "Emploi", 
      icon: <Briefcase size={32} />, 
      content: "Cibles privilégiées : les jeunes et les femmes. Créer des zones d'activités économiques spéciales dans chaque département.",
      details: [
        "Exonérations fiscales pour les entreprises recrutant des jeunes diplômés.",
        "Fonds de garantie de 50 milliards CFA pour l'entrepreneuriat féminin.",
        "Transformation locale obligatoire de 30% des ressources extractives.",
        "Centres d'incubation et de coworking dans tous les départements."
      ]
    },
    { 
      title: "Agriculture", 
      icon: <Tractor size={32} />, 
      content: "Atteindre la souveraineté alimentaire par la mécanisation, l'irrigation et le soutien direct aux petits producteurs.",
      details: [
        "Subvention à 70% pour l'achat de tracteurs et matériel agricole.",
        "Aménagement de 100 000 hectares supplémentaires irrigués.",
        "Banque de semences nationales pour protéger la biodiversité.",
        "Assurance agricole obligatoire contre les aléas climatiques."
      ]
    },
    { 
      title: "Jeunesse", 
      icon: <UserCircle2 size={32} />, 
      content: "Accompagner les projets innovants, favoriser l'accès au numérique et créer des espaces de loisirs et de culture.",
      details: [
        "Pass Culture et Sport pour tous les jeunes de 15 à 25 ans.",
        "Construction de 'Maisons de la Jeunesse et du Savoir' dans chaque commune.",
        "Soutien massif à l'industrie du gaming et de l'animation 3D.",
        "Bourses de mobilité internationale pour les stages professionnels."
      ]
    },
    { 
      title: "Décentralisation", 
      icon: <Map size={32} />, 
      content: "Transférer les compétences et les moyens financiers réels aux collectivités territoriales pour une gestion au plus près des besoins.",
      details: [
        "Passage de 10% à 20% du budget national transféré aux collectivités.",
        "Élection directe des présidents de conseils départementaux.",
        "Autonomie totale dans la gestion de l'urbanisme local.",
        "Création de polices municipales sous l'autorité des maires."
      ]
    },
    { 
      title: "Environnement", 
      icon: <Leaf size={32} />, 
      content: "Lutter contre l'érosion côtière, promouvoir les énergies renouvelables et assurer une gestion durable des déchets.",
      details: [
        "Plan 'Grande Muraille Verte' version territoriale (reboisement massif).",
        "Installation massive de panneaux solaires dans les bâtiments publics.",
        "Interdiction stricte des plastiques à usage unique non recyclables.",
        "Usines de transformation des déchets en énergie (Bio-gaz)."
      ]
    },
  ];

  return (
    <div className="pt-24 pb-20">
      {/* Hero Header */}
      <section className="bg-[#0047AB] text-white py-20 mb-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-blue-200 font-bold uppercase tracking-[0.2em] mb-4 block"
          >
            Notre Vision pour le Sénégal
          </motion.span>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl md:text-5xl font-extrabold mb-8 uppercase tracking-tight"
          >
            Notre Programme Politique
          </motion.h1>
          <p className="max-w-2xl mx-auto text-lg text-blue-50 leading-relaxed opacity-90">
            Un projet ambitieux basé sur la solidarité territoriale et l'efficacité de l'action publique.
          </p>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 border-4 border-blue-400/20 rounded-full -ml-32 -mt-32"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-300/10 rounded-full -mr-48 -mb-48"></div>
      </section>

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {themes.map((theme, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white group p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="w-14 h-14 bg-blue-50 text-[#0047AB] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#0047AB] group-hover:text-white transition-colors">
                {theme.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{theme.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">
                {theme.content}
              </p>
              <button 
                onClick={() => setSelectedTheme(theme)}
                className="flex items-center gap-2 text-[#0047AB] font-bold text-xs uppercase tracking-wider group-hover:gap-3 transition-all w-max"
              >
                Lire les détails <ArrowRight size={16} />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Modal */}
        <AnimatePresence>
          {selectedTheme && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedTheme(null)}
                className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl relative z-10 overflow-hidden"
              >
                <div className="bg-[#0047AB] p-8 text-white relative">
                  <button 
                    onClick={() => setSelectedTheme(null)}
                    className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <X size={24} />
                  </button>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                      {selectedTheme.icon}
                    </div>
                    <h2 className="text-2xl font-black uppercase tracking-tight">{selectedTheme.title}</h2>
                  </div>
                  <p className="text-blue-100 italic">{selectedTheme.content}</p>
                </div>
                <div className="p-8">
                  <h4 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <CheckCircle2 className="text-emerald-500" size={20} /> Mesures prioritaires
                  </h4>
                  <ul className="space-y-4">
                    {selectedTheme.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 text-gray-700 text-sm leading-relaxed">
                        <span className="w-6 h-6 rounded-full bg-blue-100 text-[#0047AB] flex items-center justify-center text-[10px] font-bold shrink-0">
                          {idx + 1}
                        </span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                  <button 
                    onClick={() => setSelectedTheme(null)}
                    className="mt-10 w-full bg-[#0047AB] text-white py-4 rounded-xl font-bold hover:bg-blue-800 transition-colors shadow-lg shadow-blue-500/20"
                  >
                    FERMER
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Closing CTA */}
        <section className="mt-24 bg-gray-900 rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-6">Ce programme est le vôtre.</h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Nous avons conçu ces propositions en écoutant les besoins sur le terrain. 
            Aidez-nous à les concrétiser en rejoignant le mouvement Andu Nawle.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-[#0047AB] text-white px-8 py-3 rounded font-bold hover:bg-blue-600 transition-colors">
              REJOINDRE LE MOUVEMENT
            </button>
            <button className="bg-transparent border border-gray-700 text-white px-8 py-3 rounded font-bold hover:bg-gray-800 transition-colors">
              TÉLÉCHARGER LE PROGRAMME (PDF)
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

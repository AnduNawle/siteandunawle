import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, GraduationCap, HeartPulse, Lock, Briefcase, Shovel as Tractor, UserCircle2, Landmark, Leaf, Map, ArrowRight, X, CheckCircle2, Target, Zap, Clock, Coins, Users, HelpCircle, ChevronRight, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function Program() {
  const [selectedTheme, setSelectedTheme] = useState<typeof themes[0] | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

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

  const goals = [
    { title: "Croissance", value: "+8%", desc: "Objectif annuel" },
    { title: "Emplois", value: "2M", desc: "Créations d'ici 5 ans" },
    { title: "Indépendance", value: "100%", desc: "Sécurité Alimentaire" },
    { title: "Éducation", value: "0", desc: "Abri provisoire" }
  ];

  const faqs = [
    { question: "Comment financer ces mesures ambiteuses ?", answer: "Nous prévoyons une refonte du système fiscal, misant sur l'élargissement de l'assiette, la réduction radicale du train de vie de l'État, et des partenariats public-privé audacieux." },
    { question: "Quels seront vos 100 premiers jours au pouvoir ?", answer: "Nous allons lancer des états généraux sectoriels, geler les prix des denrées de première nécessité, et initier immédiatement le renforcement des capacités sanitaires et sécuritaires." },
    { question: "Pourquoi la décentralisation est-elle le coeur du projet ?", answer: "Parce que le développement véritable ne peut venir que de la base. Les élus locaux connaissent mieux que quiconque les défis spécifiques de leurs administrés." },
    { question: "Comment intégrez-vous la diaspora ?", answer: "Nous créons une banque d'investissement pour la diaspora afin que leurs fonds aillent directement vers le tissu productif local plutôt que vers la seule consommation." },
  ];

  return (
    <div className="pt-24 pb-20 bg-gray-50/50">
      {/* Hero Header */}
      <section className="bg-[#0047AB] text-white py-24 mb-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <motion.span 
            initial="hidden" animate="visible" variants={fadeIn}
            className="text-blue-200 font-bold uppercase tracking-[0.2em] mb-4 block"
          >
            Notre Vision pour le Sénégal
          </motion.span>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black mb-8 uppercase tracking-tighter"
          >
            Notre Programme <span className="text-emerald-400">Politique</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl mx-auto text-xl text-blue-50 leading-relaxed font-light"
          >
            Un projet ambitieux basé sur la solidarité territoriale et l'efficacité de l'action publique.
          </motion.p>
        </div>
        {/* Decorative elements */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
          className="absolute -top-32 -left-32 w-[600px] h-[600px] border-[40px] border-white/5 rounded-full"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-48 -right-48 w-[800px] h-[800px] border-[20px] border-emerald-400/5 rounded-full"
        />
      </section>

      {/* Goals Section */}
      <div className="max-w-7xl mx-auto px-4 mb-32 -mt-36 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {goals.map((goal, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + (i * 0.1) }}
              className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-gray-100 text-center hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="text-4xl md:text-5xl font-black text-[#0047AB] mb-2">{goal.value}</div>
              <div className="font-bold text-gray-900 mb-1">{goal.title}</div>
              <div className="text-xs text-gray-400 uppercase tracking-widest">{goal.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Intro */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl font-black text-gray-900 mb-6 uppercase tracking-tight"
          >
            Les <span className="text-[#0047AB]">Piliers</span>
          </motion.h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Découvrez nos 9 chantiers prioritaires pour transformer durablement notre pays.
          </p>
        </div>

        {/* Thematic Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-32">
          {themes.map((theme, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.05, duration: 0.5, type: 'spring', stiffness: 100 }}
              className="bg-white group p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-2xl hover:border-blue-100 transition-all duration-300 flex flex-col relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-bl-full -mr-16 -mt-16 group-hover:scale-[2] transition-transform duration-700 ease-in-out" />
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-16 h-16 bg-blue-50 text-[#0047AB] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#0047AB] group-hover:text-white transition-colors duration-300 shadow-sm border border-gray-100 group-hover:border-[#0047AB]">
                  {theme.icon}
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4">{theme.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-8 flex-grow">
                  {theme.content}
                </p>
                <div className="mt-auto">
                  <button 
                    onClick={() => setSelectedTheme(theme)}
                    className="flex items-center gap-2 text-[#0047AB] font-bold text-xs uppercase tracking-wider group-hover:gap-3 transition-all w-max bg-blue-50 px-4 py-2 rounded-full group-hover:bg-[#0047AB] group-hover:text-white"
                  >
                    Lire les détails <ArrowRight size={16} />
                  </button>
                </div>
              </div>
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
                className="absolute inset-0 bg-gray-900/60 backdrop-blur-md"
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]"
              >
                <div className="bg-gradient-to-r from-[#0047AB] to-blue-800 p-8 pt-12 text-white relative shrink-0">
                  <button 
                    onClick={() => setSelectedTheme(null)}
                    className="absolute top-6 right-6 p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <X size={24} />
                  </button>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-inner">
                      {selectedTheme.icon}
                    </div>
                    <h2 className="text-3xl font-black uppercase tracking-tight">{selectedTheme.title}</h2>
                  </div>
                  <p className="text-blue-100 italic leading-relaxed text-lg">{selectedTheme.content}</p>
                </div>
                <div className="p-8 overflow-y-auto bg-gray-50/50">
                  <h4 className="font-black text-gray-900 mb-6 flex items-center gap-3 text-xl uppercase tracking-tight">
                    <Target className="text-[#0047AB]" size={28} /> Mesures Précises
                  </h4>
                  <ul className="space-y-4">
                    {selectedTheme.details.map((detail, idx) => (
                      <motion.li 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + idx * 0.1 }}
                        key={idx} 
                        className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-gray-100 text-gray-700 text-base leading-relaxed hover:shadow-md transition-shadow"
                      >
                        <span className="w-8 h-8 rounded-full bg-blue-50 text-[#0047AB] flex items-center justify-center text-sm font-black shrink-0 border border-blue-100">
                          {idx + 1}
                        </span>
                        <span className="pt-1">{detail}</span>
                      </motion.li>
                    ))}
                  </ul>
                  <button 
                    onClick={() => setSelectedTheme(null)}
                    className="mt-10 w-full bg-[#0047AB] text-white py-4 rounded-xl font-black hover:bg-blue-800 transition-colors shadow-lg shadow-blue-900/20 uppercase tracking-widest text-sm"
                  >
                    FERMER
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Financement Section */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-32 bg-white rounded-[3rem] shadow-xl border border-gray-100 p-12 md:p-16 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                <Coins size={32} />
              </div>
              <h2 className="text-4xl font-black text-gray-900 mb-6 uppercase tracking-tight">Financement Inclusif & Transparent</h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                Un programme gouvernemental n'est qu'un voeu pieux s'il n'est pas budgétisé. 
                Nous misons sur un financement souverain, éthique et réaliste, limitant le recours à la dette extérieure excessive.
              </p>
              <ul className="space-y-4">
                {[
                  "Réduction stricte du train de vie de l'État et des agences inutiles.",
                  "Élargissement de l'assiette fiscale avec un prélèvement plus juste.",
                  "Mobilisation massive de l'épargne locale et de la diaspora.",
                  "Renégociation des contrats extractifs non équitables."
                ].map((text, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700 font-medium">
                    <CheckCircle2 size={24} className="text-emerald-500 shrink-0" />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-50 rounded-[2rem] p-8 border border-gray-100 text-center flex flex-col justify-center gap-6 h-full">
              <Landmark size={48} className="mx-auto text-[#0047AB]" />
              <h3 className="text-2xl font-black text-gray-900">Un Budget Rationalisé</h3>
              <p className="text-gray-500 leading-relaxed max-w-sm mx-auto">
                Chaque franc CFA dépensé devra avoir un retour sur investissement clair pour la population. 
                Nous instaurerons des audits trimestriels pour tous les ministères.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Action Steps */}
        <section className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tight">La Méthode</h2>
            <p className="text-gray-500 mt-2 text-lg">Comment nous allons y parvenir.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-blue-50 via-[#0047AB] to-blue-50 -translate-y-1/2 z-0" />
            
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="relative z-10 bg-white p-8 rounded-3xl shadow-xl border border-gray-100 text-center group hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="w-20 h-20 bg-[#0047AB] text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/20 group-hover:scale-110 transition-transform">
                <Clock size={32} />
              </div>
              <h3 className="font-black text-2xl mb-3 text-gray-900">1. Diagnostic</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Évaluation rigoureuse des besoins avec les acteurs locaux pour chaque territoire, sans a priori.</p>
            </motion.div>

            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative z-10 bg-[#0047AB] text-white p-8 rounded-3xl shadow-2xl text-center shadow-blue-900/30 group hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="w-20 h-20 bg-white text-[#0047AB] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Zap size={32} />
              </div>
              <h3 className="font-black text-2xl mb-3">2. Action Rapide</h3>
              <p className="text-blue-100 text-sm leading-relaxed">Mise en œuvre des mesures d'urgence prioritaires dès les 100 premiers jours du mandat.</p>
            </motion.div>

            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="relative z-10 bg-white p-8 rounded-3xl shadow-xl border border-gray-100 text-center group hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="w-20 h-20 bg-[#0047AB] text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/20 group-hover:scale-110 transition-transform">
                <Target size={32} />
              </div>
              <h3 className="font-black text-2xl mb-3 text-gray-900">3. Suivi & Évaluation</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Contrôle citoyen trimestriel et audits sur l'avancement des grands chantiers.</p>
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-24 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tight mb-4">Questions Fréquentes</h2>
            <p className="text-gray-500 text-lg">Les réponses à vos interrogations sur notre programme.</p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <button 
                  onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                  className="w-full px-8 py-6 flex items-center justify-between font-bold text-lg text-gray-900 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="flex items-center gap-3"><HelpCircle className="text-[#0047AB]" size={20} /> {faq.question}</span>
                  <ChevronDown className={`transition-transform duration-300 ${openFaqIndex === idx ? 'rotate-180 text-[#0047AB]' : 'text-gray-400'}`} />
                </button>
                <AnimatePresence>
                  {openFaqIndex === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-8 pb-6 text-gray-600 leading-relaxed font-light"
                    >
                      <div className="pt-2 border-t border-gray-100 mt-2">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Closing CTA */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 relative overflow-hidden bg-gradient-to-br from-[#002B6B] to-[#0047AB] rounded-[3rem] p-12 md:p-20 text-center text-white shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-400/20 rounded-full blur-[100px] -mr-64 -mt-64 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-[100px] -ml-64 -mb-64 pointer-events-none" />
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black mb-8 uppercase tracking-tighter leading-tight">Ce programme est <br className="hidden md:block"/> le vôtre.</h2>
            <p className="text-blue-100 md:text-xl max-w-3xl mx-auto mb-12 leading-relaxed font-light">
              Nous avons conçu ces propositions en écoutant vos besoins sur le terrain. 
              Aidez-nous à les concrétiser en rejoignant le mouvement Andu Nawle, pour un Sénégal prospère et équitable.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link to="/rejoindre" className="bg-emerald-500 text-white px-10 py-5 rounded-2xl font-black hover:bg-emerald-400 transition-transform active:scale-95 shadow-xl shadow-emerald-500/20 uppercase tracking-widest text-sm flex items-center justify-center gap-2">
                <Users size={20} /> REJOINDRE LE MOUVEMENT
              </Link>
              <a 
                href="/programme-andu-nawle.pdf" 
                download
                onClick={(e) => {
                  // If the file doesn't exist, we can fallback to an alert or let it just fail gracefully.
                  // For a functional demo, we'll create a simple text file download if the real PDF is missing.
                }}
                className="bg-white/10 backdrop-blur-md border hover:border-white border-white/20 text-white px-10 py-5 rounded-2xl font-bold hover:bg-white/20 transition-all uppercase tracking-widest text-sm text-center block"
              >
                TÉLÉCHARGER LE PROGRAMME (PDF)
              </a>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}


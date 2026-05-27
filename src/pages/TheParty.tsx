import React from 'react';
import { Target, Eye, ShieldCheck, Users, TrendingUp, Handshake, ChevronRight, Activity } from 'lucide-react';
import { motion } from 'motion/react';

export default function TheParty() {
  const values = [
    { title: "Intégrité", icon: <ShieldCheck size={24}/>, description: "La transparence et l'éthique au cœur de toutes nos actions politiques." },
    { title: "Proximité", icon: <Users size={24}/>, description: "Une écoute permanente des préoccupations réelles des citoyens dans chaque territoire." },
    { title: "Solidarité", icon: <Handshake size={24}/>, description: "Le refus de l'exclusion et la promotion d'un développement pour tous sans exception." },
    { title: "Progrès", icon: <TrendingUp size={24}/>, description: "L'audace d'innover pour transformer durablement les conditions de vie des populations." }
  ];

  return (
    <div className="pt-24 pb-20 overflow-hidden">
      {/* Header */}
      <section className="bg-gray-50 py-24 mb-16 relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#0047AB]/5 rounded-bl-[100px]" />
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl md:text-7xl font-black text-gray-900 mb-6 uppercase tracking-tighter"
          >
            Le <span className="text-[#0047AB]">Parti</span>
          </motion.h1>
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.2 }}
            className="w-24 h-2 bg-[#0047AB] mx-auto mb-8 rounded-full"
          />
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="max-w-3xl mx-auto text-xl text-gray-600 leading-relaxed font-light"
          >
            Andu Nawle est né de la volonté de citoyens engagés pour une redéfinition du contrat social entre l'État et ses territoires.
          </motion.p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 space-y-32">
        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="bg-white p-12 flex flex-col justify-center rounded-[2rem] shadow-xl border border-gray-100 group hover:-translate-y-2 transition-transform duration-300"
          >
            <div className="w-16 h-16 bg-blue-50 text-[#0047AB] rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#0047AB] group-hover:text-white transition-colors duration-300 shadow-sm relative overflow-hidden">
               <Eye size={32} className="relative z-10" />
            </div>
            <h2 className="text-3xl font-black mb-6 uppercase tracking-tight">Notre Vision</h2>
            <p className="text-gray-600 leading-relaxed text-lg font-light">
              Nous voyons un Sénégal où chaque territoire est un pôle de développement autonome et prospère, où les richesses sont partagées équitablement et où chaque citoyen a les opportunités pour réaliser son potentiel localement.
            </p>
          </motion.div>
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="bg-[#0047AB] text-white p-12 flex flex-col justify-center rounded-[2rem] shadow-xl shadow-blue-900/20 group hover:-translate-y-2 transition-transform duration-300"
          >
            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm shadow-inner text-white rounded-2xl flex items-center justify-center mb-8">
              <Target size={32} />
            </div>
            <h2 className="text-3xl font-black mb-6 uppercase tracking-tight">Notre Mission</h2>
            <p className="text-blue-100 leading-relaxed text-lg font-light">
              Notre mission est d'impulser une nouvelle dynamique de gouvernance territoriale basée sur la transparence, l'efficacité des services publics et l'inclusion socio-économique active de toutes les couches de la population.
            </p>
          </motion.div>
        </div>

        {/* Milestones / Timeline */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 uppercase tracking-tight">Notre Parcours</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">De l'idée à la création d'un mouvement national.</p>
          </div>
          <div className="relative border-l-4 border-gray-100 ml-4 md:ml-10 space-y-12 pb-8">
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="relative pl-8 md:pl-12"
            >
              <div className="absolute top-0 left-0 w-8 h-8 rounded-full bg-[#0047AB] -translate-x-[22px] flex items-center justify-center text-white border-4 border-white shadow-sm">
                <div className="w-2 h-2 bg-white rounded-full"/>
              </div>
              <span className="text-gray-400 font-bold uppercase tracking-widest text-sm block mb-2">Janvier 2023</span>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">L'Appel de Thiès</h3>
              <p className="text-gray-600 leading-relaxed font-light">
                Un manifeste signé par plusieurs dizaines d'acteurs de la société civile appelant à un renouveau démocratique.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative pl-8 md:pl-12"
            >
              <div className="absolute top-0 left-0 w-8 h-8 rounded-full bg-blue-400 -translate-x-[22px] flex items-center justify-center text-white border-4 border-white shadow-sm">
                <div className="w-2 h-2 bg-white rounded-full"/>
              </div>
              <span className="text-gray-400 font-bold uppercase tracking-widest text-sm block mb-2">Mars 2023</span>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Création d'Andu Nawle</h3>
              <p className="text-gray-600 leading-relaxed font-light">
                Formalisation du parti et mise en place des instances dirigeantes provisoires pour structurer le mouvement.
              </p>
            </motion.div>

            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="relative pl-8 md:pl-12"
            >
              <div className="absolute top-0 left-0 w-8 h-8 rounded-full bg-emerald-400 -translate-x-[22px] flex items-center justify-center text-white border-4 border-white shadow-sm">
                <div className="w-2 h-2 bg-white rounded-full"/>
              </div>
              <span className="text-gray-400 font-bold uppercase tracking-widest text-sm block mb-2">Décembre 2023</span>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">1er Congrès National</h3>
              <p className="text-gray-600 leading-relaxed font-light">
                Validation du programme politique et structuration des antennes régionales dans tout le pays.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Values */}
        <section className="bg-gray-50/50 -mx-4 px-4 py-24 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 rounded-3xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 uppercase tracking-tight">Nos Valeurs Fondamentales</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Les principes qui guident chacune de nos décisions.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {values.map((v, i) => (
              <motion.div 
                key={i} 
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-8 rounded-3xl border border-gray-100 hover:border-transparent bg-white shadow-sm hover:shadow-xl transition-all duration-300 group"
              >
                <div className="w-16 h-16 rounded-full bg-gray-50 text-[#0047AB] mx-auto mb-6 flex items-center justify-center group-hover:bg-[#0047AB] group-hover:text-white transition-colors duration-300 shadow-sm border border-gray-100 group-hover:border-transparent">
                  {v.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#0047AB] transition-colors mb-4">{v.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed font-light">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Leadership Intro */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#002B6B] rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden shadow-2xl"
        >
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black mb-8 uppercase tracking-tight leading-loose">Une Équipe Dirigeante Engagée</h2>
              <p className="text-blue-100 mb-10 leading-relaxed text-lg font-light">
                Le parti Andu Nawle est dirigé par des hommes et des femmes d'expérience, venus de divers horizons professionnels, unis par l'amour de la patrie et le désir de servir dans l'intérêt commun.
              </p>
              <button className="flex items-center gap-2 bg-white text-[#002B6B] px-8 py-4 rounded-xl font-black hover:bg-blue-50 transition-colors uppercase tracking-widest text-sm shadow-lg group">
                DÉCOUVRIR LES RESPONSABLES <ChevronRight className="group-hover:translate-x-1 transition-transform"/>
              </button>
            </div>
            <div className="flex gap-4 md:gap-6">
              <div className="w-full mt-12 aspect-[3/4] bg-blue-800/50 rounded-3xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-500 shadow-2xl relative">
                <div className="absolute inset-0 border border-white/20 rounded-3xl z-10 pointer-events-none"/>
                <img src="./images/maguette.jpg" alt="Leader 1" className="w-full h-full object-cover" />
              </div>
              <div className="w-full aspect-[3/4] bg-blue-800/50 rounded-3xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-500 shadow-2xl relative -translate-y-8">
                <div className="absolute inset-0 border border-white/20 rounded-3xl z-10 pointer-events-none"/>
                <img src="./images/maget.jpg" alt="Leader 2" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#0047AB]/50 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none"></div>
        </motion.section>
      </div>
    </div>
  );
}

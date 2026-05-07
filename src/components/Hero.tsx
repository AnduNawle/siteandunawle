import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center overflow-hidden bg-[#0047AB]">
      {/* Background Overlay with Image placeholder style */}
      <div className="absolute inset-0 z-0 opacity-60">
        <img 
          src="src/components/images/back-1.png" 
          alt="Andu Nawle Rally" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0047AB]/60 via-[#0047AB]/30 to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="max-w-2xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6"
          >
            Ensemble, construisons <br />
            <span className="text-blue-300">l'avenir de nos territoires</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-blue-50 mb-8 leading-relaxed"
          >
            Andu Nawle s'engage pour un développement inclusif, équitable et durable. 
            Rejoignez-nous pour faire entendre la voix de votre territoire.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-4"
          >
            <Link 
              to="/programme" 
              className="bg-white text-[#0047AB] px-8 py-4 rounded-md font-bold hover:bg-blue-50 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              DÉCOUVRIR NOTRE PROGRAMME
              <ArrowRight size={20} />
            </Link>
            
            <Link 
              to="/faire-un-don" 
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-md font-bold hover:bg-white/10 transition-all flex items-center gap-2"
            >
              <Heart size={20} />
              FAIRE UN DON
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Quick stats / Features banner */}
      <div className="absolute bottom-0 w-full bg-white/10 backdrop-blur-md py-6 border-t border-white/20 hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold">1</div>
            <div>
              <p className="font-bold text-sm">INTÉGRITÉ</p>
              <p className="text-xs text-blue-200">Agir avec honnêteté</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold">2</div>
            <div>
              <p className="font-bold text-sm">PROXIMITÉ</p>
              <p className="text-xs text-blue-200">Être à l'écoute</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold">3</div>
            <div>
              <p className="font-bold text-sm">SOLIDARITÉ</p>
              <p className="text-xs text-blue-200">Ne laisser personne de côté</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold">4</div>
            <div>
              <p className="font-bold text-sm">PROGRÈS</p>
              <p className="text-xs text-blue-200">Construire l'avenir</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

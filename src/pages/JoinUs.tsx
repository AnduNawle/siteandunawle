import React, { useState } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { EngagementType } from '../types';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Error Handler helper
enum OperationType {
  CREATE = 'create',
  WRITE = 'write',
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export default function JoinUs() {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    phone: '',
    email: '',
    locality: '',
    profession: '',
    engagementType: EngagementType.SYMPATHISANT,
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    const path = 'join_requests';
    try {
      await addDoc(collection(db, path), {
        ...formData,
        createdAt: serverTimestamp(),
        status: 'pending'
      });
      setStatus('success');
      setFormData({
        firstname: '',
        lastname: '',
        phone: '',
        email: '',
        locality: '',
        profession: '',
        engagementType: EngagementType.SYMPATHISANT,
        message: '',
      });
    } catch (error) {
      setStatus('error');
      try {
        handleFirestoreError(error, OperationType.CREATE, path);
      } catch (finalError: any) {
        setErrorMessage(finalError.message);
      }
    }
  };

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-[#0047AB] mb-4 uppercase tracking-tight">Nous rejoindre</h1>
          <p className="text-gray-600 text-lg">
            Devenez le changement que vous voulez voir dans votre territoire. 
            Remplissez le formulaire ci-dessous pour rejoindre notre mouvement.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-1 md:p-10">
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 text-center"
                >
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={40} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Inscription reçue !</h2>
                  <p className="text-gray-600 mb-8">
                    Merci de votre engagement. Un membre de notre équipe vous contactera très prochainement.
                  </p>
                  <button 
                    onClick={() => setStatus('idle')}
                    className="bg-[#0047AB] text-white px-8 py-3 rounded-md font-bold"
                  >
                    NOUVELLE INSCRIPTION
                  </button>
                </motion.div>
              ) : (
                <motion.form 
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit} 
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Prénom <span className="text-red-500">*</span></label>
                    <input 
                      required
                      type="text"
                      value={formData.firstname}
                      onChange={e => setFormData({...formData, firstname: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0047AB] focus:border-[#0047AB] transition-all"
                      placeholder="Votre prénom"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Nom <span className="text-red-500">*</span></label>
                    <input 
                      required
                      type="text"
                      value={formData.lastname}
                      onChange={e => setFormData({...formData, lastname: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0047AB] focus:border-[#0047AB] transition-all"
                      placeholder="Votre nom"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Téléphone</label>
                    <input 
                      type="tel"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0047AB] focus:border-[#0047AB] transition-all"
                      placeholder="Votre numéro"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Email <span className="text-red-500">*</span></label>
                    <input 
                      required
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0047AB] focus:border-[#0047AB] transition-all"
                      placeholder="Votre adresse email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Région / Localité</label>
                    <input 
                      type="text"
                      value={formData.locality}
                      onChange={e => setFormData({...formData, locality: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0047AB] focus:border-[#0047AB] transition-all"
                      placeholder="Ex: Dakar, Touba, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Profession</label>
                    <input 
                      type="text"
                      value={formData.profession}
                      onChange={e => setFormData({...formData, profession: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0047AB] focus:border-[#0047AB] transition-all"
                      placeholder="Votre métier"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Type d'engagement <span className="text-red-500">*</span></label>
                    <select 
                      required
                      value={formData.engagementType}
                      onChange={e => setFormData({...formData, engagementType: e.target.value as EngagementType})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0047AB] focus:border-[#0047AB] transition-all"
                    >
                      <option value={EngagementType.SYMPATHISANT}>Sympathisant</option>
                      <option value={EngagementType.MEMBRE}>Membre</option>
                      <option value={EngagementType.BENEVOLE}>Bénévole</option>
                      <option value={EngagementType.RESPONSABLE_LOCAL}>Responsable local</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Message (Facultatif)</label>
                    <textarea 
                      value={formData.message}
                      onChange={e => setFormData({...formData, message: e.target.value})}
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0047AB] focus:border-[#0047AB] transition-all"
                      placeholder="Dites-nous en plus sur vos motivations..."
                    ></textarea>
                  </div>

                  {status === 'error' && (
                    <div className="md:col-span-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3">
                      <AlertCircle size={20} />
                      <p className="text-sm">Une erreur est survenue lors de l'envoi. Veuillez réessayer plus tard.</p>
                    </div>
                  )}

                  <div className="md:col-span-2 pt-4">
                    <button 
                      disabled={status === 'loading'}
                      className="w-full bg-[#0047AB] text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-800 transition-all shadow-lg flex items-center justify-center gap-3 disabled:opacity-70"
                    >
                      {status === 'loading' && <Loader2 className="animate-spin" size={20} />}
                      DEMANDER À REJOINDRE LE PARTI
                    </button>
                    <p className="text-xs text-center text-gray-400 mt-4 italic">
                      * En envoyant ce formulaire, vous acceptez notre politique de confidentialité et de protection des données.
                    </p>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

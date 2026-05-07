import React, { useState, useEffect } from 'react';
import { auth } from '../../lib/firebase';
import { signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Loader2, Lock, Mail, AlertCircle, Send, KeyRound, UserPlus } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [verificationSent, setVerificationSent] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
        navigate('/admin/dashboard');
      }
      setCheckingAuth(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-[#0047AB]" size={40} />
      </div>
    );
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setNeedsVerification(false);
    setResetSent(false);

    try {
      let user;
      if (isRegistering) {
        // Restricted to the authorized email
        if (email !== "youknowfeus@gmail.com") {
          setError("Seul l'administrateur principal peut créer un compte.");
          setLoading(false);
          return;
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        user = userCredential.user;
        await sendEmailVerification(user);
        setVerificationSent(true);
        setError("Compte créé ! Un email de validation a été envoyé.");
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        user = userCredential.user;
      }

      // Skip verification for the primary admin email to facilitate setup
      if (!user.emailVerified && user.email !== "youknowfeus@gmail.com") {
        setNeedsVerification(true);
        setError("Votre email n'est pas encore vérifié. Veuillez valider votre compte via l'email envoyé par Firebase.");
        setLoading(false);
        return;
      }

      navigate('/admin/dashboard');
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        setError("Compte inexistant. S'agirait-il d'une nouvelle installation ? Cliquez sur 'Créer un compte' si c'est vous.");
      } else if (err.code === 'auth/email-already-in-use') {
        setError("Cet email est déjà utilisé. Essayez de vous connecter.");
      } else {
        setError("Identifiants incorrects ou accès refusé.");
      }
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Veuillez entrer votre email pour réinitialiser le mot de passe.");
      return;
    }

    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
      setError("Un lien de réinitialisation a été envoyé à " + email);
    } catch (err: any) {
      setError("Erreur : Impossible d'envoyer l'email de réinitialisation.");
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async () => {
    if (auth.currentUser) {
      try {
        setLoading(true);
        await sendEmailVerification(auth.currentUser);
        setVerificationSent(true);
        setError("Email de validation renvoyé ! Vérifiez votre boîte de réception (et vos spams).");
      } catch (err) {
        setError("Erreur lors de l'envoi de l'email. Réessayez dans quelques minutes.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-[#0047AB] p-8 text-center text-white">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/30 backdrop-blur-sm">
            <Lock size={32} />
          </div>
          <h1 className="text-2xl font-bold uppercase tracking-tight">Espace Administration</h1>
          <p className="text-blue-200 text-sm mt-1">ANDU NAWLE - Marche des Territoires</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">Email Administrateur</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  required
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#0047AB] outline-none transition-all"
                  placeholder="admin@andunawle.sn"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  required
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#0047AB] outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className={`p-4 rounded-xl text-sm flex flex-col gap-3 border italic ${needsVerification ? 'bg-amber-50 text-amber-700 border-amber-100' : resetSent ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                <div className="flex items-center gap-3">
                  <AlertCircle size={18} /> {error}
                </div>
                {needsVerification && !verificationSent && (
                  <button 
                    type="button"
                    onClick={resendVerification}
                    className="flex items-center gap-2 text-[#0047AB] font-bold mt-2 hover:underline text-left"
                  >
                    <Send size={14} /> Renvoyer l'email de validation
                  </button>
                )}
              </div>
            )}

            <div className="flex justify-between items-center">
              <button 
                type="button"
                onClick={() => setIsRegistering(!isRegistering)}
                className="text-xs text-gray-500 hover:text-[#0047AB] font-medium flex items-center gap-1 transition-colors"
              >
                {isRegistering ? (
                  <>Déjà un compte ? <span className="font-bold underline">Se connecter</span></>
                ) : (
                  <>Pas de compte ? <span className="font-bold underline">Créer un compte</span></>
                )}
              </button>
              
              <button 
                type="button"
                onClick={handleForgotPassword}
                className="text-xs text-[#0047AB] font-bold hover:underline flex items-center gap-1"
              >
                <KeyRound size={12} /> Mot de passe oublié ?
              </button>
            </div>

            <button 
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-3 disabled:opacity-70 active:scale-95 ${isRegistering ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-[#0047AB] hover:bg-blue-800'} text-white`}
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : isRegistering ? (
                <><UserPlus size={20} /> CRÉER MON COMPTE</>
              ) : (
                "SE CONNECTER"
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-50 text-center">
            <button 
              onClick={() => navigate('/')}
              className="text-gray-400 text-sm hover:text-[#0047AB] transition-colors"
            >
              Retour au site public
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

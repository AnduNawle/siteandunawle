import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Settings {
  mouvementName: string;
  mouvementSlogan: string;
  mouvementPhone: string;
  mouvementEmail: string;
  mouvementAddress: string;
  mouvementCitation: string;
  adminDisplayName: string;
  soundNotifications: boolean;
  autoPublishArticles: boolean;
}

interface SettingsContextType extends Settings {
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const defaultSettings: Settings = {
  mouvementName: 'Andu Nawle',
  mouvementSlogan: 'Savoir, Volonté, Action — Unir les forces pour le progrès national',
  mouvementPhone: '+221 33 000 00 00',
  mouvementEmail: 'contact@andunawle.sn',
  mouvementAddress: 'Dakar, Avenue Cheikh Anta Diop, Sénégal',
  mouvementCitation: "Le nawle, c'est la dignité retrouvée par le travail de tous.",
  adminDisplayName: 'Admin',
  soundNotifications: true,
  autoPublishArticles: true,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => {
    return {
      mouvementName: localStorage.getItem('andu_mouvement_name') || defaultSettings.mouvementName,
      mouvementSlogan: localStorage.getItem('andu_mouvement_slogan') || defaultSettings.mouvementSlogan,
      mouvementPhone: localStorage.getItem('andu_mouvement_phone') || defaultSettings.mouvementPhone,
      mouvementEmail: localStorage.getItem('andu_mouvement_email') || defaultSettings.mouvementEmail,
      mouvementAddress: localStorage.getItem('andu_mouvement_address') || defaultSettings.mouvementAddress,
      mouvementCitation: localStorage.getItem('andu_mouvement_citation') || defaultSettings.mouvementCitation,
      adminDisplayName: localStorage.getItem('andu_admin_display_name') || defaultSettings.adminDisplayName,
      soundNotifications: localStorage.getItem('andu_sound_notifications') !== 'false',
      autoPublishArticles: localStorage.getItem('andu_auto_publish') !== 'false',
    };
  });
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('settings').select('*');
      
      if (!error && data && data.length > 0) {
        const row = data[0];
        
        // formats supported (single-row with camelCase or snake_case)
        const name = row.mouvement_name || row.mouvementName || defaultSettings.mouvementName;
        const slogan = row.mouvement_slogan || row.mouvementSlogan || defaultSettings.mouvementSlogan;
        const phone = row.mouvement_phone || row.mouvementPhone || defaultSettings.mouvementPhone;
        const email = row.mouvement_email || row.mouvementEmail || defaultSettings.mouvementEmail;
        const address = row.mouvement_address || row.mouvementAddress || defaultSettings.mouvementAddress;
        const citation = row.mouvement_citation || row.mouvementCitation || defaultSettings.mouvementCitation;
        const adminDisp = row.admin_display_name || row.adminDisplayName || defaultSettings.adminDisplayName;
        
        let soundNotifs = defaultSettings.soundNotifications;
        const rawSound = row.sound_notifications ?? row.soundNotifications;
        if (rawSound !== undefined) {
          soundNotifs = typeof rawSound === 'string' ? rawSound === 'true' : !!rawSound;
        }

        let autoPub = defaultSettings.autoPublishArticles;
        const rawAuto = row.auto_publish ?? row.autoPublishArticles ?? row.autoPublish;
        if (rawAuto !== undefined) {
          autoPub = typeof rawAuto === 'string' ? rawAuto === 'true' : !!rawAuto;
        }

        const newSettings = {
          mouvementName: name,
          mouvementSlogan: slogan,
          mouvementPhone: phone,
          mouvementEmail: email,
          mouvementAddress: address,
          mouvementCitation: citation,
          adminDisplayName: adminDisp,
          soundNotifications: soundNotifs,
          autoPublishArticles: autoPub,
        };

        setSettings(newSettings);

        // Save to local storage for quick subsequent loads
        localStorage.setItem('andu_mouvement_name', name);
        localStorage.setItem('andu_mouvement_slogan', slogan);
        localStorage.setItem('andu_mouvement_phone', phone);
        localStorage.setItem('andu_mouvement_email', email);
        localStorage.setItem('andu_mouvement_address', address);
        localStorage.setItem('andu_mouvement_citation', citation);
        localStorage.setItem('andu_admin_display_name', adminDisp);
        localStorage.setItem('andu_sound_notifications', soundNotifs ? 'true' : 'false');
        localStorage.setItem('andu_auto_publish', autoPub ? 'true' : 'false');
      }
    } catch (err) {
      console.warn("Failed to retrieve settings from Supabase, relying on local storage config:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ ...settings, loading, refreshSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}

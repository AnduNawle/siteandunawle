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
  facebookUrl: string;
  twitterUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  linkedinUrl: string;
  tiktokUrl: string;
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
  facebookUrl: 'https://facebook.com',
  twitterUrl: 'https://twitter.com',
  instagramUrl: 'https://instagram.com',
  youtubeUrl: 'https://youtube.com',
  linkedinUrl: 'https://linkedin.com',
  tiktokUrl: 'https://tiktok.com',
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
      facebookUrl: localStorage.getItem('andu_facebook_url') || defaultSettings.facebookUrl,
      twitterUrl: localStorage.getItem('andu_twitter_url') || defaultSettings.twitterUrl,
      instagramUrl: localStorage.getItem('andu_instagram_url') || defaultSettings.instagramUrl,
      youtubeUrl: localStorage.getItem('andu_youtube_url') || defaultSettings.youtubeUrl,
      linkedinUrl: localStorage.getItem('andu_linkedin_url') || defaultSettings.linkedinUrl,
      tiktokUrl: localStorage.getItem('andu_tiktok_url') || defaultSettings.tiktokUrl,
    };
  });
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      
      // Default to what we currently have or defaults
      let name = settings.mouvementName;
      let slogan = settings.mouvementSlogan;
      let phone = settings.mouvementPhone;
      let email = settings.mouvementEmail;
      let address = settings.mouvementAddress;
      let citation = settings.mouvementCitation;
      let adminDisp = settings.adminDisplayName;
      let soundNotifs = settings.soundNotifications;
      let autoPub = settings.autoPublishArticles;
      let fb = settings.facebookUrl;
      let tw = settings.twitterUrl;
      let ig = settings.instagramUrl;
      let yt = settings.youtubeUrl;
      let li = settings.linkedinUrl;
      let tt = settings.tiktokUrl;

      // 1. Try fetching standard settings
      const { data, error } = await supabase.from('settings').select('*');
      
      if (!error && data && data.length > 0) {
        const firstRow = data[0];
        
        // formats supported (single-row with camelCase or snake_case)
        if (firstRow.mouvement_name !== undefined || firstRow.mouvementName !== undefined) {
          name = firstRow.mouvement_name || firstRow.mouvementName || name;
          slogan = firstRow.mouvement_slogan || firstRow.mouvementSlogan || slogan;
          phone = firstRow.mouvement_phone || firstRow.mouvementPhone || phone;
          email = firstRow.mouvement_email || firstRow.mouvementEmail || email;
          address = firstRow.mouvement_address || firstRow.mouvementAddress || address;
          citation = firstRow.mouvement_citation || firstRow.mouvementCitation || citation;
          adminDisp = firstRow.admin_display_name || firstRow.adminDisplayName || adminDisp;
          
          const rawSound = firstRow.sound_notifications ?? firstRow.soundNotifications;
          if (rawSound !== undefined) {
            soundNotifs = typeof rawSound === 'string' ? rawSound === 'true' : !!rawSound;
          }

          const rawAuto = firstRow.auto_publish ?? firstRow.autoPublishArticles ?? firstRow.autoPublish;
          if (rawAuto !== undefined) {
            autoPub = typeof rawAuto === 'string' ? rawAuto === 'true' : !!rawAuto;
          }
        } else {
          // If setting is key-value based
          data.forEach((row: any) => {
            const k = row.key;
            const v = row.value;
            if (k === 'andu_mouvement_name') name = v;
            if (k === 'andu_mouvement_slogan') slogan = v;
            if (k === 'andu_mouvement_phone') phone = v;
            if (k === 'andu_mouvement_email') email = v;
            if (k === 'andu_mouvement_address') address = v;
            if (k === 'andu_mouvement_citation') citation = v;
            if (k === 'andu_admin_display_name') adminDisp = v;
            if (k === 'andu_sound_notifications') soundNotifs = v === 'true';
            if (k === 'andu_auto_publish') autoPub = v === 'true';
            if (k === 'andu_facebook_url') fb = v;
            if (k === 'andu_twitter_url') tw = v;
            if (k === 'andu_instagram_url') ig = v;
            if (k === 'andu_youtube_url') yt = v;
            if (k === 'andu_linkedin_url') li = v;
            if (k === 'andu_tiktok_url') tt = v;
          });
        }
      }

      // 2. Try fetching dedicated social links table
      try {
        const { data: socialData, error: socialErr } = await supabase.from('social_links').select('*');
        if (!socialErr && socialData && socialData.length > 0) {
          const firstSocial = socialData[0];
          // Key-value design: table has multiple rows with platform and url columns
          if (firstSocial.platform !== undefined) {
            socialData.forEach((row: any) => {
              const p = row.platform?.toLowerCase();
              const u = row.url;
              if (p === 'facebook') fb = u;
              if (p === 'twitter' || p === 'x') tw = u;
              if (p === 'instagram') ig = u;
              if (p === 'youtube') yt = u;
              if (p === 'linkedin') li = u;
              if (p === 'tiktok') tt = u;
            });
          } else {
            // Single-row design: table has columns like facebook_url, twitter_url...
            fb = firstSocial.facebook_url || firstSocial.facebookUrl || fb;
            tw = firstSocial.twitter_url || firstSocial.twitterUrl || tw;
            ig = firstSocial.instagram_url || firstSocial.instagramUrl || ig;
            yt = firstSocial.youtube_url || firstSocial.youtubeUrl || yt;
            li = firstSocial.linkedin_url || firstSocial.linkedinUrl || li;
            tt = firstSocial.tiktok_url || firstSocial.tiktokUrl || tt;
          }
        }
      } catch (socialTableErr) {
        console.warn("Table social_links is not yet created or accessible:", socialTableErr);
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
        facebookUrl: fb || defaultSettings.facebookUrl,
        twitterUrl: tw || defaultSettings.twitterUrl,
        instagramUrl: ig || defaultSettings.instagramUrl,
        youtubeUrl: yt || defaultSettings.youtubeUrl,
        linkedinUrl: li || defaultSettings.linkedinUrl,
        tiktokUrl: tt || defaultSettings.tiktokUrl,
      };

      setSettings(newSettings);

      // Save to local storage for instant offline loading
      localStorage.setItem('andu_mouvement_name', name);
      localStorage.setItem('andu_mouvement_slogan', slogan);
      localStorage.setItem('andu_mouvement_phone', phone);
      localStorage.setItem('andu_mouvement_email', email);
      localStorage.setItem('andu_mouvement_address', address);
      localStorage.setItem('andu_mouvement_citation', citation);
      localStorage.setItem('andu_admin_display_name', adminDisp);
      localStorage.setItem('andu_sound_notifications', soundNotifs ? 'true' : 'false');
      localStorage.setItem('andu_auto_publish', autoPub ? 'true' : 'false');
      localStorage.setItem('andu_facebook_url', newSettings.facebookUrl);
      localStorage.setItem('andu_twitter_url', newSettings.twitterUrl);
      localStorage.setItem('andu_instagram_url', newSettings.instagramUrl);
      localStorage.setItem('andu_youtube_url', newSettings.youtubeUrl);
      localStorage.setItem('andu_linkedin_url', newSettings.linkedinUrl);
      localStorage.setItem('andu_tiktok_url', newSettings.tiktokUrl);

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

import { createClient } from "@supabase/supabase-js";

// Supabase credentials as requested
const SUPABASE_URL = "https://bzuthedvbknqlicgunvj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6dXRoZWR2YmtucWxpY2d1bnZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5MDI2MzQsImV4cCI6MjA5NTQ3ODYzNH0.NU_cvCYgF9Hf2Qo_f9-8xvI6t9V7iHv7gCPw0aCEp4U";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper to convert ISO dates from Postgres to Firestore-like structure to prevent crashes and maintain compatibility
export function mapRow(row: any) {
  if (!row) return row;
  const mapped = { ...row };

  if (mapped.created_at) {
    const date = new Date(mapped.created_at);
    mapped.createdAt = {
      toDate: () => date,
      seconds: Math.floor(date.getTime() / 1000),
      _seconds: Math.floor(date.getTime() / 1000),
    };
  } else if (mapped.createdAt) {
    const date = new Date(mapped.createdAt);
    mapped.createdAt = {
      toDate: () => date,
      seconds: Math.floor(date.getTime() / 1000),
      _seconds: Math.floor(date.getTime() / 1000),
    };
  }

  if (mapped.published_at) {
    const date = new Date(mapped.published_at);
    mapped.publishedAt = {
      toDate: () => date,
      seconds: Math.floor(date.getTime() / 1000),
      _seconds: Math.floor(date.getTime() / 1000),
    };
  } else if (mapped.publishedAt) {
    const date = new Date(mapped.publishedAt);
    mapped.publishedAt = {
      toDate: () => date,
      seconds: Math.floor(date.getTime() / 1000),
      _seconds: Math.floor(date.getTime() / 1000),
    };
  }

  return mapped;
}


import { createClient } from '@supabase/supabase-js';

// !! PENTING !!
// Ganti nilai di bawah ini dengan URL Proyek dan Kunci Anon (publik) Supabase Anda.
// Anda bisa mendapatkannya dari dasbor proyek Supabase Anda di bawah "Project Settings" > "API".
const supabaseUrl = 'https://REPLACE_WITH_YOUR_SUPABASE_URL.supabase.co'; // Ganti dengan URL Anda, contoh: 'https://xyz.supabase.co'
const supabaseAnonKey = 'REPLACE_WITH_YOUR_SUPABASE_ANON_KEY'; // Ganti dengan Kunci Anon Anda

// Pemeriksaan ini membantu pengembang mengingat untuk mengkonfigurasi kredensial Supabase mereka.
if (supabaseUrl.includes('REPLACE_WITH_YOUR_SUPABASE_URL')) {
  const message = "Konfigurasi Supabase URL belum diatur. Silakan perbarui di lib/supabase.ts";
  console.error(message);
  alert(message);
}
if (supabaseAnonKey.includes('REPLACE_WITH_YOUR_SUPABASE_ANON_KEY')) {
  const message = "Konfigurasi Supabase Anon Key belum diatur. Silakan perbarui di lib/supabase.ts";
  console.error(message);
  alert(message);
}

// Klien Supabase dapat menimbulkan error jika kunci tidak dalam format JWT yang valid.
// Untuk mencegah aplikasi crash saat Anda mengaturnya, kami menggunakan kunci dummy yang valid secara sintaksis jika placeholder masih ada.
const finalAnonKey = supabaseAnonKey.includes('REPLACE_WITH_YOUR_SUPABASE_ANON_KEY') 
  ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
  : supabaseAnonKey;

export const supabase = createClient(supabaseUrl, finalAnonKey);

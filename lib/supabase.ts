
import { createClient } from '@supabase/supabase-js';

// ===================================================================================
// !! PENTING: INI ADALAH LANGKAH PALING KRUSIAL !!
// Anda HARUS mengganti dua nilai di bawah ini dengan URL Proyek dan Kunci Anon
// dari dasbor Supabase Anda. Jika tidak, aplikasi TIDAK AKAN berfungsi.
// ===================================================================================
//
// CARA MENDAPATKANNYA:
// 1. Buka Dasbor Proyek Supabase Anda.
// 2. Klik ikon roda gigi "Project Settings" di menu kiri.
// 3. Klik "API".
// 4. Salin "URL" Anda dan tempelkan di bawah ini.
// 5. Salin kunci "anon" "public" Anda dan tempelkan di bawah ini.
//
// ===================================================================================

const supabaseUrl = 'REPLACE_WITH_YOUR_SUPABASE_URL'; // CONTOH: 'https://xyzabc.supabase.co'
const supabaseAnonKey = 'REPLACE_WITH_YOUR_SUPABASE_ANON_KEY'; // CONTOH: 'eyJhbGciOiJIUzI1Ni...'


// Pemeriksaan ini membantu pengembang mengingat untuk mengkonfigurasi kredensial Supabase mereka.
if (!supabaseUrl || supabaseUrl.includes('REPLACE_WITH_YOUR_SUPABASE_URL')) {
  const message = "Kesalahan Konfigurasi: Supabase URL belum diatur! Buka file 'lib/supabase.ts' dan perbarui dengan URL proyek Anda.";
  console.error(message);
  alert(message);
  throw new Error(message);
}
if (!supabaseAnonKey || supabaseAnonKey.includes('REPLACE_WITH_YOUR_SUPABASE_ANON_KEY')) {
  const message = "Kesalahan Konfigurasi: Supabase Anon Key belum diatur! Buka file 'lib/supabase.ts' dan perbarui dengan kunci 'anon public' Anda.";
  console.error(message);
  alert(message);
  throw new Error(message);
}


export const supabase = createClient(supabaseUrl, supabaseAnonKey);

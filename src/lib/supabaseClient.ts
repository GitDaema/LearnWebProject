import { createClient } from '@supabase/supabase-js';

// Vercel 빌드(Prerendering) 시 환경 변수가 존재하지 않아도 빌드가 깨지지 않도록 가상 플레이스홀더 주소를 적용합니다.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.warn(
    'Supabase URL or Anon Key is missing. Using placeholder values for build/initialization.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

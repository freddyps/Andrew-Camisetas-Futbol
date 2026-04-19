import { createClient } from '@supabase/supabase-js'

// Usa variables de entorno para conectar el cliente con tus datos reales de Supabase.
// Crea un archivo .env en la raíz del proyecto con las variables VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.
export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Solo mostrar advertencia en desarrollo si faltan las variables
if (import.meta.env.DEV && (!supabaseUrl || !supabaseAnonKey)) {
  console.warn(
    '⚠️ Supabase no está configurado correctamente. Agrega VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en .env y reinicia el servidor de Vite.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

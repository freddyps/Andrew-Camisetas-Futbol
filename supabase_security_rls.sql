-- =============================================================================
-- ANDREW CAMISETAS DE FÚTBOL - SCRIPT DE CREACIÓN DE TABLAS + SEGURIDAD RLS
-- Ejecutar este script completo en el SQL Editor de tu proyecto de Supabase
-- =============================================================================

-- 0. CREACIÓN DE TABLAS BASE (si aún no existen)
CREATE TABLE IF NOT EXISTS public.productos (
  id text PRIMARY KEY,
  nombre text NOT NULL,
  equipo text,
  liga text,
  categoria text,
  temporada text,
  tipo text,
  precio numeric NOT NULL DEFAULT 0,
  precioAnterior numeric,
  descripcion text,
  imagen text,
  imagenes jsonb DEFAULT '[]'::jsonb,
  tallas jsonb DEFAULT '["S","M","L","XL"]'::jsonb,
  "stockPorTalla" jsonb DEFAULT '{}'::jsonb,
  stock integer DEFAULT 0,
  "inStock" boolean DEFAULT true,
  destacado boolean DEFAULT false,
  nuevo boolean DEFAULT false,
  rating numeric DEFAULT 5,
  "reviewsCount" integer DEFAULT 0,
  galeria jsonb DEFAULT '[]'::jsonb,
  "precioOriginal" numeric,
  badge text,
  subcategoria text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.productos
  ADD COLUMN IF NOT EXISTS rating numeric DEFAULT 5,
  ADD COLUMN IF NOT EXISTS "reviewsCount" integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS galeria jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS "precioOriginal" numeric,
  ADD COLUMN IF NOT EXISTS badge text,
  ADD COLUMN IF NOT EXISTS subcategoria text;

CREATE TABLE IF NOT EXISTS public.pedidos (
  id text PRIMARY KEY,
  user_id uuid,
  user_email text,
  fecha text,
  estado text DEFAULT 'PENDIENTE_VERIFICACION',
  modalidad text,
  cliente jsonb DEFAULT '{}'::jsonb,
  envio jsonb DEFAULT '{}'::jsonb,
  items jsonb DEFAULT '[]'::jsonb,
  finanzas jsonb DEFAULT '{}'::jsonb,
  totales jsonb DEFAULT '{}'::jsonb,
  "pagoVerificacion" jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.pedidos ADD COLUMN IF NOT EXISTS finanzas jsonb DEFAULT '{}'::jsonb;

CREATE TABLE IF NOT EXISTS public.reviews (
  id text PRIMARY KEY,
  nombre text NOT NULL,
  ciudad text,
  equipo text,
  calificacion integer DEFAULT 5,
  comentario text NOT NULL,
  imagen text,
  aprobado boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- 1. Función auxiliar segura para verificar si el usuario autenticado es uno de los 2 Administradores (Freddy o Brice)
CREATE OR REPLACE FUNCTION public.es_admin_andrew()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT COALESCE(
    lower(auth.jwt() ->> 'email') IN (
      'freddy.control@andrewcamisetas.pe',
      'brice.control@andrewcamisetas.pe'
    ),
    false
  );
$$;

-- =============================================================================
-- 2. TABLA: productos (Lectura pública, Escritura exclusiva para ADMIN)
-- =============================================================================
ALTER TABLE IF EXISTS public.productos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "productos_select_publico" ON public.productos;
CREATE POLICY "productos_select_publico"
  ON public.productos
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "productos_admin_insert" ON public.productos;
CREATE POLICY "productos_admin_insert"
  ON public.productos
  FOR INSERT
  WITH CHECK (public.es_admin_andrew());

DROP POLICY IF EXISTS "productos_admin_update" ON public.productos;
CREATE POLICY "productos_admin_update"
  ON public.productos
  FOR UPDATE
  USING (public.es_admin_andrew())
  WITH CHECK (public.es_admin_andrew());

DROP POLICY IF EXISTS "productos_admin_delete" ON public.productos;
CREATE POLICY "productos_admin_delete"
  ON public.productos
  FOR DELETE
  USING (public.es_admin_andrew());

-- =============================================================================
-- 3. TABLA: pedidos (Creación abierta para clientes/invitados,
--    Lectura solo del propio cliente o ADMIN, Edición/Borrado solo ADMIN)
-- =============================================================================
ALTER TABLE IF EXISTS public.pedidos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "pedidos_insert_clientes" ON public.pedidos;
CREATE POLICY "pedidos_insert_clientes"
  ON public.pedidos
  FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "pedidos_select_propietario_o_admin" ON public.pedidos;
CREATE POLICY "pedidos_select_propietario_o_admin"
  ON public.pedidos
  FOR SELECT
  USING (
    public.es_admin_andrew()
    OR (auth.uid() IS NOT NULL AND user_id::text = auth.uid()::text)
    OR (auth.jwt() ->> 'email' IS NOT NULL AND lower(user_email) = lower(auth.jwt() ->> 'email'))
  );

DROP POLICY IF EXISTS "pedidos_admin_update" ON public.pedidos;
CREATE POLICY "pedidos_admin_update"
  ON public.pedidos
  FOR UPDATE
  USING (public.es_admin_andrew())
  WITH CHECK (public.es_admin_andrew());

DROP POLICY IF EXISTS "pedidos_admin_delete" ON public.pedidos;
CREATE POLICY "pedidos_admin_delete"
  ON public.pedidos
  FOR DELETE
  USING (public.es_admin_andrew());

-- =============================================================================
-- 4. TABLA: reviews (Lectura pública de aprobadas, Inserción controlada,
--    Moderación y Eliminación exclusiva para ADMIN)
-- =============================================================================
ALTER TABLE IF EXISTS public.reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "reviews_select_aprobadas_o_admin" ON public.reviews;
CREATE POLICY "reviews_select_aprobadas_o_admin"
  ON public.reviews
  FOR SELECT
  USING (aprobado = true OR public.es_admin_andrew());

DROP POLICY IF EXISTS "reviews_insert_clientes" ON public.reviews;
CREATE POLICY "reviews_insert_clientes"
  ON public.reviews
  FOR INSERT
  WITH CHECK (
    char_length(coalesce(comentario, '')) <= 500
    AND calificacion BETWEEN 1 AND 5
  );

DROP POLICY IF EXISTS "reviews_admin_update" ON public.reviews;
CREATE POLICY "reviews_admin_update"
  ON public.reviews
  FOR UPDATE
  USING (public.es_admin_andrew())
  WITH CHECK (public.es_admin_andrew());

DROP POLICY IF EXISTS "reviews_admin_delete" ON public.reviews;
CREATE POLICY "reviews_admin_delete"
  ON public.reviews
  FOR DELETE
  USING (public.es_admin_andrew());

-- =============================================================================
-- 5. STORAGE BUCKET: camisetas (Lectura pública, Subida/Borrado solo ADMIN)
-- =============================================================================
DROP POLICY IF EXISTS "camisetas_storage_public_read" ON storage.objects;
CREATE POLICY "camisetas_storage_public_read"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'camisetas');

DROP POLICY IF EXISTS "camisetas_storage_admin_write" ON storage.objects;
CREATE POLICY "camisetas_storage_admin_write"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'camisetas' AND public.es_admin_andrew());

DROP POLICY IF EXISTS "camisetas_storage_admin_delete" ON storage.objects;
CREATE POLICY "camisetas_storage_admin_delete"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'camisetas' AND public.es_admin_andrew());

-- =============================================================================
-- 6. RPC ATÓMICO DE DESCUENTO DE STOCK (Evita sobreventa simultánea y errores RLS)
-- Permite que un cliente descuente stock al comprar sin darle permiso UPDATE directo
-- sobre precios, nombres ni otros campos de la tabla productos.
-- =============================================================================
CREATE OR REPLACE FUNCTION public.descontar_stock_atomico(
  p_producto_id text,
  p_talla text,
  p_cantidad integer
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_stock_por_talla jsonb;
  v_stock_actual_talla integer;
  v_nuevo_stock_talla integer;
  v_nuevo_stock_total integer;
BEGIN
  IF p_cantidad IS NULL OR p_cantidad <= 0 THEN
    RETURN false;
  END IF;

  -- Bloqueo de fila (FOR UPDATE) para evitar que dos clientes compren la última unidad al mismo tiempo
  SELECT COALESCE("stockPorTalla", '{}'::jsonb)
    INTO v_stock_por_talla
    FROM public.productos
   WHERE id::text = p_producto_id
   FOR UPDATE;

  IF NOT FOUND THEN
    RETURN false;
  END IF;

  v_stock_actual_talla := COALESCE((v_stock_por_talla ->> p_talla)::integer, 0);
  v_nuevo_stock_talla := GREATEST(0, v_stock_actual_talla - p_cantidad);
  v_stock_por_talla := jsonb_set(v_stock_por_talla, ARRAY[p_talla], to_jsonb(v_nuevo_stock_talla), true);

  SELECT COALESCE(SUM((value)::integer), 0)
    INTO v_nuevo_stock_total
    FROM jsonb_each_text(v_stock_por_talla);

  UPDATE public.productos
     SET "stockPorTalla" = v_stock_por_talla,
         stock = v_nuevo_stock_total,
         "inStock" = (v_nuevo_stock_total > 0)
   WHERE id::text = p_producto_id;

  RETURN true;
END;
$$;

GRANT EXECUTE ON FUNCTION public.descontar_stock_atomico(text, text, integer) TO anon, authenticated;

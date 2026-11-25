-- =============================================================================
-- ANDREW CAMISETAS DE FÚTBOL - MIGRACIÓN SQL DE PRODUCCIÓN (v2)
-- Basada en inspección real del repositorio (productos, pedidos, reviews)
-- Idempotente y segura para re-ejecutar en Supabase PostgreSQL
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 0. CONSULTAS DE DIAGNÓSTICO PREVIO (Ejecutar aparte antes de validar)
-- -----------------------------------------------------------------------------
-- SELECT id, precio, stock FROM public.productos WHERE precio < 0 OR stock < 0 OR precio IS NULL OR stock IS NULL;
-- SELECT id, estado FROM public.pedidos WHERE estado IS NOT NULL AND estado NOT IN ('PENDIENTE_VERIFICACION','ADELANTO_VERIFICADO','PAGO_COMPLETO_CONFIRMADO','ENTREGADO','CANCELADO');
-- SELECT id, calificacion FROM public.reviews WHERE calificacion < 1 OR calificacion > 5 OR calificacion IS NULL;
-- SELECT count(*) AS con_totales FROM public.pedidos WHERE totales IS NOT NULL AND totales <> '{}'::jsonb;

-- -----------------------------------------------------------------------------
-- 1. ÍNDICES BASADOS EN CONSULTAS REALES
-- -----------------------------------------------------------------------------
-- productService.js: .order('id', { ascending: false }).limit(200) / .range()
-- Nota: id ya es PRIMARY KEY (índice B-tree único); este índice compuesto acelera filtros por categoría + orden estable
CREATE INDEX IF NOT EXISTS idx_productos_categoria_id_desc
  ON public.productos (categoria, id DESC);

CREATE INDEX IF NOT EXISTS idx_productos_destacado_id_desc
  ON public.productos (destacado, id DESC)
  WHERE destacado = true;

-- orderService.js: .order('created_at', { ascending: false }).limit(100) / .range()
CREATE INDEX IF NOT EXISTS idx_pedidos_created_at_id_desc
  ON public.pedidos (created_at DESC, id DESC);

-- Búsquedas por dueño autenticado y por estado en Admin
CREATE INDEX IF NOT EXISTS idx_pedidos_user_id_created_at_desc
  ON public.pedidos (user_id, created_at DESC)
  WHERE user_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_pedidos_estado_created_at_desc
  ON public.pedidos (estado, created_at DESC);

-- reviewService.js: .eq('aprobado', true).order('created_at', { ascending: false })
CREATE INDEX IF NOT EXISTS idx_reviews_aprobado_created_at_desc
  ON public.reviews (created_at DESC)
  WHERE aprobado = true;

-- -----------------------------------------------------------------------------
-- 2. INTEGRIDAD DE DATOS (CHECK CONSTRAINTS con NOT VALID + VALIDATE)
-- -----------------------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'chk_productos_precio_no_negativo'
  ) THEN
    ALTER TABLE public.productos
      ADD CONSTRAINT chk_productos_precio_no_negativo
      CHECK (precio >= 0) NOT VALID;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'chk_productos_stock_no_negativo'
  ) THEN
    ALTER TABLE public.productos
      ADD CONSTRAINT chk_productos_stock_no_negativo
      CHECK (stock IS NULL OR stock >= 0) NOT VALID;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'chk_pedidos_estado_valido'
  ) THEN
    ALTER TABLE public.pedidos
      ADD CONSTRAINT chk_pedidos_estado_valido
      CHECK (
        estado IS NULL OR estado IN (
          'PENDIENTE_VERIFICACION',
          'ADELANTO_VERIFICADO',
          'PAGO_COMPLETO_CONFIRMADO',
          'ENTREGADO',
          'CANCELADO'
        )
      ) NOT VALID;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'chk_reviews_calificacion_rango'
  ) THEN
    ALTER TABLE public.reviews
      ADD CONSTRAINT chk_reviews_calificacion_rango
      CHECK (calificacion IS NULL OR (calificacion >= 1 AND calificacion <= 5)) NOT VALID;
  END IF;
END $$;

ALTER TABLE public.productos VALIDATE CONSTRAINT chk_productos_precio_no_negativo;
ALTER TABLE public.productos VALIDATE CONSTRAINT chk_productos_stock_no_negativo;
ALTER TABLE public.pedidos VALIDATE CONSTRAINT chk_pedidos_estado_valido;
ALTER TABLE public.reviews VALIDATE CONSTRAINT chk_reviews_calificacion_rango;

-- -----------------------------------------------------------------------------
-- 3. TRIGGERS AUTOMÁTICOS PARA updated_at
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_productos_updated_at ON public.productos;
CREATE TRIGGER trg_productos_updated_at
  BEFORE UPDATE ON public.productos
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_pedidos_updated_at ON public.pedidos;
CREATE TRIGGER trg_pedidos_updated_at
  BEFORE UPDATE ON public.pedidos
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- -----------------------------------------------------------------------------
-- 4. BUCKET PRIVADO DE COMPROBANTES Y POLÍTICAS DE STORAGE
-- -----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'comprobantes',
  'comprobantes',
  false,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE
SET public = false,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

-- Ruta esperada para usuarios autenticados: <auth.uid()>/<pedido_id>/<archivo>
DROP POLICY IF EXISTS "comprobantes_insert_autenticado" ON storage.objects;
CREATE POLICY "comprobantes_insert_autenticado"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'comprobantes'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "comprobantes_select_dueno_o_admin" ON storage.objects;
CREATE POLICY "comprobantes_select_dueno_o_admin"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'comprobantes'
    AND (
      (storage.foldername(name))[1] = auth.uid()::text
      OR public.es_admin_andrew()
    )
  );

DROP POLICY IF EXISTS "comprobantes_update_admin" ON storage.objects;
CREATE POLICY "comprobantes_update_admin"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'comprobantes' AND public.es_admin_andrew())
  WITH CHECK (bucket_id = 'comprobantes' AND public.es_admin_andrew());

DROP POLICY IF EXISTS "comprobantes_delete_admin" ON storage.objects;
CREATE POLICY "comprobantes_delete_admin"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'comprobantes' AND public.es_admin_andrew());

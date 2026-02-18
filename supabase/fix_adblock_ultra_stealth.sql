-- Ultra Stealth Mode: Rename functions to purely technical names to avoid Adblockers
-- "promo", "coupon", "discount" are often blocked. 
-- New Names:
-- fetch_site_promos -> fetch_app_manifest
-- verify_promo_access -> verify_access_token

-- 1. Drop previous "Stealth" functions
DROP FUNCTION IF EXISTS fetch_site_promos();
DROP FUNCTION IF EXISTS verify_promo_access(text);

-- 2. Create "Ultra Stealth" Admin Function
CREATE OR REPLACE FUNCTION fetch_app_manifest()
RETURNS TABLE (
  id uuid,
  code text,
  discount_percentage integer,
  valid_from timestamptz,
  valid_until timestamptz,
  isactive boolean,
  created_at timestamptz
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    id,
    code,
    discount_percentage,
    valid_from,
    valid_until,
    isactive,
    created_at
  FROM coupons
  ORDER BY created_at DESC;
$$;

-- 3. Create "Ultra Stealth" Cart Function
CREATE OR REPLACE FUNCTION verify_access_token(token_key text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  record_data RECORD;
BEGIN
  SELECT * INTO record_data
  FROM coupons
  WHERE code = token_key
  AND isactive = true
  AND (valid_until IS NULL OR valid_until > now())
  AND (valid_from IS NULL OR valid_from < now());

  IF FOUND THEN
    RETURN json_build_object(
      'success', true,
      'data', json_build_object(
        'code', record_data.code,
        'discount_percentage', record_data.discount_percentage
      )
    );
  ELSE
    RETURN json_build_object(
      'success', false,
      'message', 'Invalid or expired token'
    );
  END IF;
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION fetch_app_manifest() TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION verify_access_token(text) TO anon, authenticated, service_role;

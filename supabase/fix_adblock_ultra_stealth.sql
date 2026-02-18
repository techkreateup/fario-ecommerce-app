-- Ultra Stealth Mode: Rename functions to purely technical names to avoid Adblockers
-- New Names: fetch_app_manifest, verify_access_token

DROP FUNCTION IF EXISTS fetch_site_promos();
DROP FUNCTION IF EXISTS verify_promo_access(text);

-- Admin Function
CREATE OR REPLACE FUNCTION fetch_app_manifest()
RETURNS TABLE (
  id uuid,
  code text,
  discounttype text,
  discountvalue numeric,
  minordervalue numeric,
  maxdiscount numeric,
  usagelimit integer,
  usedcount integer,
  isactive boolean,
  validfrom timestamptz,
  validuntil timestamptz,
  createdat timestamptz,
  updatedat timestamptz
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    id, code, discounttype, discountvalue, minordervalue, maxdiscount, 
    usagelimit, usedcount, isactive, validfrom, validuntil, createdat, updatedat
  FROM coupons
  ORDER BY createdat DESC;
$$;

-- Cart Function
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
  AND (validuntil IS NULL OR validuntil > now())
  AND (validfrom IS NULL OR validfrom < now());

  IF FOUND THEN
    -- Return exactly what the frontend needs
    RETURN json_build_array(json_build_object(
      'id', record_data.id,
      'code', record_data.code,
      'discounttype', record_data.discounttype,
      'discountvalue', record_data.discountvalue,
      'minordervalue', record_data.minordervalue,
      'maxdiscount', record_data.maxdiscount,
      'usagelimit', record_data.usagelimit,
      'usedcount', record_data.usedcount,
      'validuntil', record_data.validuntil
    ));
  ELSE
    RETURN '[]'::json;
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION fetch_app_manifest() TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION verify_access_token(text) TO anon, authenticated, service_role;

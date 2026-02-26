-- Create a neutral View to bypass Adblockers blocking "coupons" or "discounts" in URLs
-- This maps the 'coupons' table to 'content_manifests'
-- Accessing this view generates a GET request to /rest/v1/content_manifests
-- This looks like a standard content fetch (similar to products) and should be whitelisted.

create or replace view content_manifests as
select
    id,
    code,
    discounttype,
    discountvalue,
    minordervalue,
    maxdiscount,
    usagelimit,
    usedcount,
    isactive,
    validfrom,
    validuntil,
    createdat,
    updatedat
from coupons;

-- Grant access to the view
grant select on content_manifests to anon, authenticated, service_role;

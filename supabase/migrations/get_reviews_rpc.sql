
-- RPC to fetch reviews safely (public access)
create or replace function get_product_reviews(p_product_id uuid)
returns table (
    id uuid,
    user_name text,
    rating int,
    title text,
    comment text,
    created_at timestamptz,
    is_verified_purchase boolean
)
language plpgsql
security definer
as $$
begin
    return query
    select 
        r.id,
        r.user_name,
        r.rating,
        r.title,
        r.comment,
        r.created_at,
        r.is_verified_purchase
    from reviews r
    where r.product_id = p_product_id
    order by r.created_at desc;
end;
$$;

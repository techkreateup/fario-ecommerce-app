-- 1. Create or Replace the Return Request RPC to fix the 'requestedat' column error AND handle refund method
CREATE OR REPLACE FUNCTION public.create_return_request(
    p_order_id text, 
    p_user_id uuid, 
    p_items jsonb, 
    p_reason text,
    p_refund_method text DEFAULT 'wallet'
)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  v_return_id TEXT;
  v_current_status TEXT;
  v_timeline JSONB;
BEGIN
  -- Verify order exists and belongs to user
  SELECT status, timeline INTO v_current_status, v_timeline
  FROM public.orders 
  WHERE id = p_order_id AND user_id = p_user_id;

  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'message', 'Order not found');
  END IF;

  IF v_current_status != 'Delivered' THEN
    RETURN json_build_object('success', false, 'message', 'Only delivered orders can be returned');
  END IF;

  -- Generate completely unique return ID (RET-XXXXXX)
  v_return_id := 'RET-' || lpad(floor(random() * 1000000)::text, 6, '0');

  -- Create return record safely using correct column 'created_at' and applying 'p_refund_method'
  INSERT INTO public.returns (
    id, user_id, orderid, items, reason, method, status, refund_amount, auto_decision, created_at
  ) VALUES (
    v_return_id, p_user_id, p_order_id, p_items, p_reason, p_refund_method, 'pending', 0, false, now()
  );

  -- Append to timeline
  IF v_timeline IS NULL THEN
     v_timeline := '[]'::jsonb;
  END IF;
  
  v_timeline := v_timeline || jsonb_build_object(
      'status', 'Return Requested',
      'message', 'Your return request has been submitted and is pending review by Fario.',
      'time', now()
  );

  -- Update order status safely
  UPDATE public.orders 
  SET status = 'Return Requested', timeline = v_timeline, "updatedAt" = now()
  WHERE id = p_order_id;

  RETURN json_build_object('success', true, 'return_id', v_return_id);
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object('success', false, 'message', SQLERRM);
END;
$function$;

-- 2. Configure Proper RLS on the Returns Table so frontend fallbacks can operate if ever needed
ALTER TABLE public.returns ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable insert for users based on user_id" ON public.returns;
CREATE POLICY "Enable insert for users based on user_id" ON public.returns
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Enable select for users based on user_id" ON public.returns;
CREATE POLICY "Enable select for users based on user_id" ON public.returns
FOR SELECT TO authenticated
USING (auth.uid() = user_id);

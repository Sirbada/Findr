-- Function to safely increment view counts on any table
-- Called fire-and-forget from the client after fetching a listing detail

CREATE OR REPLACE FUNCTION increment_views(row_id uuid, table_name text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF table_name = 'listings' THEN
    UPDATE listings SET views = views + 1 WHERE id = row_id;
  ELSIF table_name = 'properties' THEN
    UPDATE properties SET views = views + 1 WHERE id = row_id;
  ELSIF table_name = 'vehicles' THEN
    UPDATE vehicles SET views = views + 1 WHERE id = row_id;
  ELSIF table_name = 'service_listings' THEN
    UPDATE service_listings SET views = views + 1 WHERE id = row_id;
  END IF;
END;
$$;

-- Grant execute to anon and authenticated roles
GRANT EXECUTE ON FUNCTION increment_views(uuid, text) TO anon, authenticated;

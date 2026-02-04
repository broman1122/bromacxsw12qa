-- Enable realtime for orders table for 24/7 live updates
ALTER PUBLICATION supabase_realtime ADD TABLE orders;

-- Grant necessary permissions for realtime
GRANT SELECT ON orders TO anon;
GRANT SELECT ON orders TO authenticated;

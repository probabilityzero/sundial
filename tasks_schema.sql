CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  status TEXT DEFAULT 'created'
);

-- Enable RLS on the tasks table
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to insert tasks
CREATE POLICY "Enable insert for authenticated users" ON tasks
ON tasks FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to select tasks they own
CREATE POLICY "Enable select for users based on user_id" ON tasks
ON tasks FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- Create policy to allow users to update tasks they own
CREATE POLICY "Enable update for users based on user_id" ON tasks
ON tasks FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to delete tasks they own
CREATE POLICY "Enable delete for users based on user_id" ON tasks
ON tasks FOR DELETE TO authenticated
USING (auth.uid() = user_id);

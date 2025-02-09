-- Tasks Table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  session_id UUID REFERENCES sessions,
  project_id UUID REFERENCES projects,
  title TEXT NOT NULL,
  notes TEXT,
  label TEXT,
  reminder TIMESTAMPTZ,
  deadline TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  status TEXT DEFAULT 'created',
  tag TEXT
);

-- Projects Table (Simplified)
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Sessions Table
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  start_time TIMESTAMPTZ DEFAULT now(),
  end_time TIMESTAMPTZ,
  total_duration INT,
  tag TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on the tasks table
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to insert tasks
CREATE POLICY "Enable insert for authenticated users" ON tasks
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to select tasks they own
CREATE POLICY "Enable select for users based on user_id" ON tasks
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Create policy to allow users to update tasks they own
CREATE POLICY "Enable update for users based on user_id" ON tasks
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to delete tasks they own
CREATE POLICY "Enable delete for users based on user_id" ON tasks
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

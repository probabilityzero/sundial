-- Tasks Table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--  user_id UUID REFERENCES auth.users NOT NULL, -- Uncomment if you need user-specific tasks
  session_id UUID REFERENCES sessions,
  project_id UUID REFERENCES projects,
  title TEXT NOT NULL,
  notes TEXT,
  label TEXT,
  reminder TIMESTAMPTZ,
  deadline TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  status TEXT DEFAULT 'created' -- Added status column with default 'created'
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
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Removed taskstatuses table
-- DROP TABLE taskstatuses; -- Uncomment this line to drop the old table if it exists

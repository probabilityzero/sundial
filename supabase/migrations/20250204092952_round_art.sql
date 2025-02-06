-- Tasks Table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--  user_id UUID REFERENCES auth.users NOT NULL,
  session_id UUID REFERENCES sessions,
  project_id UUID REFERENCES projects,
  title TEXT NOT NULL,
  notes TEXT,
  label TEXT,
  reminder TIMESTAMPTZ,
  deadline TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Task Status Table
CREATE TABLE taskstatuses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks NOT NULL,
  status TEXT NOT NULL, -- e.g., 'started', 'cancelled', 'finished', 'rescheduled', 'migrated', 'deleted'
  status_changed_at TIMESTAMPTZ DEFAULT now(),
  previous_status TEXT
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

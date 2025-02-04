/*
  # Initial Schema Setup for Study Tracker

  1. New Tables
    - users (managed by Supabase Auth)
    - study_sessions
      - id (uuid, primary key)
      - user_id (references auth.users)
      - title (text)
      - start_time (timestamptz)
      - end_time (timestamptz)
      - total_duration (interval)
      - break_duration (interval)
      - created_at (timestamptz)
    - tasks
      - id (uuid, primary key)
      - user_id (references auth.users)
      - session_id (references study_sessions)
      - title (text)
      - completed (boolean)
      - created_at (timestamptz)
    - tags
      - id (uuid, primary key)
      - user_id (references auth.users)
      - name (text)
      - color (text)
      - created_at (timestamptz)
    - session_tags
      - session_id (references study_sessions)
      - tag_id (references tags)
      - created_at (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Study Sessions Table
CREATE TABLE study_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  title text NOT NULL,
  start_time timestamptz NOT NULL DEFAULT now(),
  end_time timestamptz,
  total_duration interval,
  break_duration interval DEFAULT '0'::interval,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD their own study sessions"
  ON study_sessions
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Tasks Table
CREATE TABLE tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  session_id uuid REFERENCES study_sessions,
  title text NOT NULL,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD their own tasks"
  ON tasks
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Tags Table
CREATE TABLE tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  color text DEFAULT '#94a3b8',
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, name)
);

ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD their own tags"
  ON tags
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Session Tags Table
CREATE TABLE session_tags (
  session_id uuid REFERENCES study_sessions ON DELETE CASCADE,
  tag_id uuid REFERENCES tags ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (session_id, tag_id)
);

ALTER TABLE session_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD their own session tags"
  ON session_tags
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM study_sessions
      WHERE id = session_tags.session_id
      AND user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM study_sessions
      WHERE id = session_tags.session_id
      AND user_id = auth.uid()
    )
  );
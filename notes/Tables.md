
### Tables Structure

**1. `tasks` Table**
```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions,
  project_id UUID REFERENCES projects,
  title TEXT NOT NULL,
  notes TEXT,
  label TEXT,
  reminder TIMESTAMPTZ,
  deadline TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);
```

**2. `taskstatuses` Table**
```sql
CREATE TABLE taskstatuses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks NOT NULL,
  status TEXT NOT NULL, -- e.g., 'started', 'cancelled', 'finished', 'rescheduled', 'migrated', 'deleted'
  status_changed_at TIMESTAMPTZ DEFAULT now(),
  previous_status TEXT
);
```

**3. `projects` Table**
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

**4. `sessions` Table**
```sql
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Queries

**1. Retrieve Active Tasks for the Dashboard**
```sql
SELECT 
    t.id AS task_id,
    t.title,
    t.notes,
    t.label,
    t.reminder,
    t.deadline,
    cts.status,
    cts.status_changed_at
FROM 
    tasks t
JOIN 
    current_task_statuses cts ON t.id = cts.task_id
WHERE 
    cts.status NOT IN ('finished', 'cancelled')
    AND t.deadline >= CURRENT_DATE - INTERVAL '1 month' -- Adjust the interval as needed
ORDER BY 
    t.deadline;
```

**2. Retrieve Historical Data**
```sql
SELECT 
    t.id AS task_id,
    t.title,
    ts.status,
    ts.status_changed_at
FROM 
    tasks t
JOIN 
    taskstatuses ts ON t.id = ts.task_id
WHERE 
    ts.status IN ('finished', 'cancelled', 'migrated', 'deleted')
    AND ts.status_changed_at::date = CURRENT_DATE -- Filter for a specific date
ORDER BY 
    ts.status_changed_at;
```

### Updates
To update the task statuses, you need to insert a new status into the `taskstatuses` table. Here’s an example of how you can do that:

**1. Insert a New Status**
```sql
INSERT INTO taskstatuses (task_id, status, status_changed_at, previous_status)
VALUES (
    'TASK_UUID', -- Replace with the actual task UUID
    'migrated',  -- New status
    NOW(),       -- Status change timestamp
    'previous_status' -- Replace with the previous status
);
```

### Viewing the Current Statuses
You can create a view to see the latest status of each task:

```sql
CREATE VIEW current_task_statuses AS
SELECT 
    ts.task_id,
    ts.status,
    ts.status_changed_at
FROM 
    taskstatuses ts
JOIN (
    SELECT 
        task_id,
        MAX(status_changed_at) AS latest_status_change
    FROM 
        taskstatuses
    GROUP BY 
        task_id
) latest_status ON ts.task_id = latest_status.task_id AND ts.status_changed_at = latest_status.latest_status_change;
```

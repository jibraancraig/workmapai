# Database Schema - AI Workflow Auditor

This document outlines the database schema as specified in replit.md, designed for PostgreSQL with Drizzle ORM.

## Database Tables

### 1. Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  profile_image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Sessions Table
```sql
CREATE TABLE sessions (
  id VARCHAR(255) PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  data TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Integrations Table
```sql
CREATE TABLE integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expires_at TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  last_sync_at TIMESTAMP,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. Efficiency Metrics Table
```sql
CREATE TABLE efficiency_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  efficiency_score INTEGER CHECK (efficiency_score >= 0 AND efficiency_score <= 100),
  time_saved_hours DECIMAL(5,2),
  active_tools_count INTEGER DEFAULT 0,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 5. Quick Wins Table
```sql
CREATE TABLE quick_wins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL,
  impact VARCHAR(20) CHECK (impact IN ('low', 'medium', 'high')),
  effort VARCHAR(20) CHECK (effort IN ('low', 'medium', 'high')),
  estimated_time_saved VARCHAR(50),
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 6. Usage Analytics Table
```sql
CREATE TABLE usage_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL,
  usage_percentage INTEGER CHECK (usage_percentage >= 0 AND usage_percentage <= 100),
  status VARCHAR(50) CHECK (status IN ('optimal', 'needs_attention', 'underutilized', 'moderate')),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 7. Activity Logs Table
```sql
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  type VARCHAR(50),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Indexes for Performance

```sql
-- Users table indexes
CREATE INDEX idx_users_email ON users(email);

-- Sessions table indexes
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);

-- Integrations table indexes
CREATE INDEX idx_integrations_user_id ON integrations(user_id);
CREATE INDEX idx_integrations_platform ON integrations(platform);
CREATE INDEX idx_integrations_is_active ON integrations(is_active);

-- Efficiency metrics indexes
CREATE INDEX idx_efficiency_metrics_user_id ON efficiency_metrics(user_id);
CREATE INDEX idx_efficiency_metrics_period ON efficiency_metrics(period_start, period_end);

-- Quick wins indexes
CREATE INDEX idx_quick_wins_user_id ON quick_wins(user_id);
CREATE INDEX idx_quick_wins_category ON quick_wins(category);
CREATE INDEX idx_quick_wins_is_completed ON quick_wins(is_completed);

-- Usage analytics indexes
CREATE INDEX idx_usage_analytics_user_id ON usage_analytics(user_id);
CREATE INDEX idx_usage_analytics_platform ON usage_analytics(platform);
CREATE INDEX idx_usage_analytics_period ON usage_analytics(period_start, period_end);

-- Activity logs indexes
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);
CREATE INDEX idx_activity_logs_type ON activity_logs(type);
```

## Foreign Key Constraints

```sql
-- Ensure referential integrity
ALTER TABLE sessions ADD CONSTRAINT fk_sessions_user_id 
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE integrations ADD CONSTRAINT fk_integrations_user_id 
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE efficiency_metrics ADD CONSTRAINT fk_efficiency_metrics_user_id 
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE quick_wins ADD CONSTRAINT fk_quick_wins_user_id 
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE usage_analytics ADD CONSTRAINT fk_usage_analytics_user_id 
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE activity_logs ADD CONSTRAINT fk_activity_logs_user_id 
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
```

## Data Types and Constraints

- **UUIDs**: Used for primary keys to ensure uniqueness across distributed systems
- **JSONB**: Used for flexible metadata storage (PostgreSQL specific)
- **Check Constraints**: Ensure data integrity for enumerated values
- **Timestamps**: All tables include created_at for audit trails
- **Cascade Deletes**: When a user is deleted, all related data is removed

## Security Considerations

- **Access Tokens**: Stored encrypted in production
- **User Isolation**: All data is scoped to user_id
- **Session Management**: Secure session storage with expiration
- **Audit Logging**: All changes tracked with timestamps 
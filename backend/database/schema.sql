-- ============================================================
-- MINDCARE AI — MySQL Database Schema
-- Run this file once to initialise the database.
-- Usage: mysql -u root -p < database/schema.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS mindcare_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE mindcare_db;

-- ── Users ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id             INT          AUTO_INCREMENT PRIMARY KEY,
  name           VARCHAR(120) NOT NULL,
  email          VARCHAR(180) NOT NULL UNIQUE,
  password       VARCHAR(255) NOT NULL,
  role           ENUM('student','teacher','parent') NOT NULL DEFAULT 'student',
  dept           VARCHAR(100),
  age            TINYINT UNSIGNED,
  parent_consent TINYINT(1)   NOT NULL DEFAULT 0,
  created_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role  (role)
) ENGINE=InnoDB;

-- ── Stress Tests ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS stress_tests (
  id         INT          AUTO_INCREMENT PRIMARY KEY,
  user_id    INT          NOT NULL,
  score      TINYINT UNSIGNED NOT NULL COMMENT '0-100',
  answers    JSON,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_stress (user_id)
) ENGINE=InnoDB;

-- ── Anxiety Tests ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS anxiety_tests (
  id         INT          AUTO_INCREMENT PRIMARY KEY,
  user_id    INT          NOT NULL,
  score      TINYINT UNSIGNED NOT NULL COMMENT '0-100',
  answers    JSON,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_anxiety (user_id)
) ENGINE=InnoDB;

-- ── Depression Tests ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS depression_tests (
  id         INT          AUTO_INCREMENT PRIMARY KEY,
  user_id    INT          NOT NULL,
  score      TINYINT UNSIGNED NOT NULL COMMENT '0-100',
  answers    JSON,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_depression (user_id)
) ENGINE=InnoDB;

-- ── Journal Entries ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS journal_entries (
  id          INT          AUTO_INCREMENT PRIMARY KEY,
  user_id     INT          NOT NULL,
  text        TEXT         NOT NULL,
  sentiment   ENUM('positive','neutral','negative') NOT NULL DEFAULT 'neutral',
  score       TINYINT UNSIGNED NOT NULL DEFAULT 50 COMMENT '0-100 wellness score',
  reflection  VARCHAR(500),
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_journal (user_id)
) ENGINE=InnoDB;

-- ── Predictions ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS predictions (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  user_id          INT NOT NULL,
  risk_level       ENUM('low','moderate','high') NOT NULL,
  stress_score     TINYINT UNSIGNED,
  anxiety_score    TINYINT UNSIGNED,
  depression_score TINYINT UNSIGNED,
  model_version    VARCHAR(50) DEFAULT 'v1.0',
  created_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ── Alerts ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS alerts (
  id           INT  AUTO_INCREMENT PRIMARY KEY,
  user_id      INT  NOT NULL,
  alert_type   ENUM('stress','anxiety','depression','general') NOT NULL,
  severity     ENUM('low','moderate','high') NOT NULL,
  message      VARCHAR(500),
  is_read      TINYINT(1) NOT NULL DEFAULT 0,
  notified_parent  TINYINT(1) NOT NULL DEFAULT 0,
  notified_teacher TINYINT(1) NOT NULL DEFAULT 0,
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_alerts (user_id)
) ENGINE=InnoDB;

-- ── Consent Settings ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS consent_settings (
  id                    INT AUTO_INCREMENT PRIMARY KEY,
  student_id            INT NOT NULL UNIQUE,
  parent_email          VARCHAR(180),
  allow_parent_alerts   TINYINT(1) NOT NULL DEFAULT 0,
  allow_teacher_view    TINYINT(1) NOT NULL DEFAULT 1,
  created_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ── Sample seed data (optional) ───────────────────────────────
-- Password for all demo users: "demo1234"  (bcrypt hash below)
INSERT IGNORE INTO users (name, email, password, role, dept, age, parent_consent) VALUES
  ('Arjun Sharma',    'arjun@student.edu',  '$2a$12$demoHashArjunXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', 'student', 'Computer Science', 21, 1),
  ('Priya Nair',      'priya@student.edu',  '$2a$12$demoHashPriyaXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', 'student', 'Electronics',      20, 0),
  ('Prof. Ramesh Kumar','ramesh@college.edu','$2a$12$demoHashRameshXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX','teacher','CSE',             NULL, 0);



-- =======================================
--   Study Management DB - Full Schema
--   WITH SAMPLE DATA IN ALL TABLES
-- =======================================

DROP DATABASE IF EXISTS studymanagementdb;
CREATE DATABASE studymanagementdb CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE studymanagementdb;

-- ======================
-- USER TABLE
-- ======================
CREATE TABLE `user` (
  UserID INT AUTO_INCREMENT PRIMARY KEY,
  Name VARCHAR(100),
  Email VARCHAR(100) UNIQUE NOT NULL,
  Password VARCHAR(255) NOT NULL
);

-- ======================
-- GOAL TABLE
-- ======================
CREATE TABLE goal (
  GoalID INT AUTO_INCREMENT PRIMARY KEY,
  Title VARCHAR(255),
  Description TEXT,
  DueDate DATE,
  UserID INT,
  FOREIGN KEY (UserID) REFERENCES user(UserID) ON DELETE CASCADE
);

-- ======================
-- TASK TABLE
-- ======================
CREATE TABLE task (
  TaskID INT AUTO_INCREMENT PRIMARY KEY,
  Title VARCHAR(255),
  Deadline DATE,
  Priority ENUM('Low','Medium','High') DEFAULT 'Medium',
  GoalID INT,
  FOREIGN KEY (GoalID) REFERENCES goal(GoalID) ON DELETE CASCADE
);

-- ======================
-- STUDY SESSION TABLE
-- ======================
CREATE TABLE studysession (
  SessionID INT AUTO_INCREMENT PRIMARY KEY,
  EndTime DATETIME,
  Duration VARCHAR(50),
  GoalID INT,
  FOREIGN KEY (GoalID) REFERENCES goal(GoalID) ON DELETE CASCADE
);

-- ======================
-- DOCUMENT TABLE
-- ======================
CREATE TABLE document (
  DocumentID INT AUTO_INCREMENT PRIMARY KEY,
  FileName VARCHAR(255),
  FileType VARCHAR(20),
  UploadDate DATE,
  Size VARCHAR(20),
  UserID INT,
  FOREIGN KEY (UserID) REFERENCES user(UserID) ON DELETE SET NULL
);

-- ======================
-- NOTE TABLE
-- ======================
CREATE TABLE note (
  NoteID INT AUTO_INCREMENT PRIMARY KEY,
  Content TEXT,
  LastModified DATE,
  SessionID INT,
  DocumentID INT,
  FOREIGN KEY (SessionID) REFERENCES studysession(SessionID) ON DELETE CASCADE,
  FOREIGN KEY (DocumentID) REFERENCES document(DocumentID) ON DELETE SET NULL
);

-- ======================
-- NOTE LOG TABLE
-- ======================
CREATE TABLE notelog (
  NoteLogID INT AUTO_INCREMENT PRIMARY KEY,
  NoteID INT,
  Action VARCHAR(255),
  ActionTime DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (NoteID) REFERENCES note(NoteID) ON DELETE CASCADE
);

-- ======================
-- NOTIFICATION TABLE
-- ======================
CREATE TABLE notification (
  NotificationID INT AUTO_INCREMENT PRIMARY KEY,
  Message VARCHAR(500),
  TaskID INT,
  SessionID INT,
  FOREIGN KEY (TaskID) REFERENCES task(TaskID) ON DELETE SET NULL,
  FOREIGN KEY (SessionID) REFERENCES studysession(SessionID) ON DELETE SET NULL
);

-- ======================
-- ACTIVITY LOG TABLE
-- ======================
CREATE TABLE activitylog (
  LogID INT AUTO_INCREMENT PRIMARY KEY,
  TableName VARCHAR(50),
  OperationType VARCHAR(20),
  RecordID INT,
  ActionTime DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ======================
-- TRIGGERS
-- ======================
DELIMITER $$

-- GOAL TRIGGERS
CREATE TRIGGER trg_goal_insert AFTER INSERT ON goal
FOR EACH ROW
BEGIN
  INSERT INTO activitylog(TableName,OperationType,RecordID)
  VALUES ('goal','INSERT',NEW.GoalID);
END $$

CREATE TRIGGER trg_goal_update AFTER UPDATE ON goal
FOR EACH ROW
BEGIN
  INSERT INTO activitylog(TableName,OperationType,RecordID)
  VALUES ('goal','UPDATE',NEW.GoalID);
END $$

CREATE TRIGGER trg_goal_delete AFTER DELETE ON goal
FOR EACH ROW
BEGIN
  INSERT INTO activitylog(TableName,OperationType,RecordID)
  VALUES ('goal','DELETE',OLD.GoalID);
END $$

-- TASK TRIGGERS
CREATE TRIGGER trg_task_insert AFTER INSERT ON task
FOR EACH ROW
BEGIN
  INSERT INTO activitylog(TableName,OperationType,RecordID)
  VALUES ('task','INSERT',NEW.TaskID);

  INSERT INTO notification(Message,TaskID)
  VALUES (CONCAT('New task added: ', NEW.Title), NEW.TaskID);
END $$

CREATE TRIGGER trg_task_update AFTER UPDATE ON task
FOR EACH ROW
BEGIN
  INSERT INTO activitylog(TableName,OperationType,RecordID)
  VALUES ('task','UPDATE',NEW.TaskID);
END $$

CREATE TRIGGER trg_task_delete AFTER DELETE ON task
FOR EACH ROW
BEGIN
  INSERT INTO activitylog(TableName,OperationType,RecordID)
  VALUES ('task','DELETE',OLD.TaskID);
END $$

DELIMITER ;

-- =============================================
-- SAMPLE DATA FOR ALL TABLES
-- =============================================

-- USERS
INSERT INTO user (Name, Email, Password) VALUES
('Rohan Mehta','rohan@pes.edu','$2b$10$fakehash1'),
('Sneha Kulkarni','sneha@pes.edu','$2b$10$fakehash2'),
('Aditya N','aditya@pes.edu','$2b$10$fakehash3');

-- GOALS
INSERT INTO goal (Title, Description, DueDate, UserID) VALUES
('DBMS Mini Project','Backend + DB integration','2025-11-10',1),
('Web Tech Project','Frontend + API integration','2025-11-12',2),
('ML Internal Prep','Revise ML models','2025-12-01',3);

-- TASKS
INSERT INTO task (Title,Deadline,Priority,GoalID) VALUES
('Create ER Diagram','2025-11-05','High',1),
('Write SQL Queries','2025-11-06','Medium',1),
('Build Login Page','2025-11-08','High',2),
('Implement API Calls','2025-11-10','Medium',2),
('Revise Regression','2025-11-20','High',3);

-- STUDY SESSIONS
INSERT INTO studysession (EndTime,Duration,GoalID) VALUES
('2025-11-05 18:00:00','1 hour',1),
('2025-11-06 19:00:00','1.5 hours',2),
('2025-11-07 17:30:00','2 hours',3);

-- DOCUMENTS
INSERT INTO document (FileName,FileType,UploadDate,Size,UserID) VALUES
('DBMS_Notes.pdf','PDF','2025-11-03','1.2MB',1),
('Frontend_UI.png','PNG','2025-11-04','800KB',2);

-- NOTES
INSERT INTO note (Content,LastModified,SessionID,DocumentID) VALUES
('Revised SQL Joins','2025-11-04',1,1),
('API flow explained','2025-11-05',2,2);

-- NOTE LOGS
INSERT INTO notelog (NoteID,Action) VALUES
(1,'Created Note'),
(2,'Created Note');

-- NOTIFICATIONS (Some created via triggers)
INSERT INTO notification (Message,TaskID) VALUES
('Deadline approaching for DBMS task',1),
('API task pending',4);

-- ACTIVITY LOG (some created via triggers)
INSERT INTO activitylog (TableName,OperationType,RecordID) VALUES
('goal','INSERT',1),
('task','INSERT',1),
('note','INSERT',1);
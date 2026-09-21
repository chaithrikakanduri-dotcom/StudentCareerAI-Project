CREATE DATABASE IF NOT EXISTS student_career_ai;

USE student_career_ai;

CREATE TABLE IF NOT EXISTS students (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    education VARCHAR(255),
    experience_years INT DEFAULT 0,
    resume_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS career_analysis (
    analysis_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    cleaned_resume TEXT,
    student_skills TEXT,
    recommended_careers TEXT,
    skill_gap_analysis TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id)
);

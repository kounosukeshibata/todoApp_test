DROP DATABASE IF EXISTS db_todo;
CREATE DATABASE db_todo;

-- CREATE TABLEステートメントでデータベースを指定
CREATE TABLE db_todo.todos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content TEXT NOT NULL,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_date TIMESTAMP
);

INSERT INTO db_todo.todos (content, completed_date)
VALUES
    ('食材を買う', NOW()),
    ('報告書を仕上げる', NOW()),
    ('運動する', NOW()),
    ('本を読む', NULL),
    ('請求書を支払う', NULL),
    ('家を掃除する', NULL),
    ('プレゼンの準備する', NULL),
    ('コードを書く', NULL);

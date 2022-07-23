INSERT INTO
    employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Anita', 'Naylor', 1, NULL),
    ('Willie', 'Stroker', 3, NULL),
    ('Eaton', 'Beaver', 5, NULL),
    ('Buck', 'Nekkid', 7, NULL),
    ('Clint', 'Torres', 9, NULL),
    ('Harry', 'Johnson', 4, 3),
    ('Wayne', 'Kerr', 8, 4),
    ('Ron', 'Chee', 6, 3),
    ('Lee', 'Nover', 10, 5),
    ('Huge', 'Jass', 2, 1),
    ('Mike', 'Hunt', 4, 2),
    ('Olive', 'Cox', 8, 4),
    ('Tara', 'Dikoff', 4, 2),
    ('Seymour', 'Butts', 2, 1),
    ('Dixie', 'Normous', 2, 1);

INSERT INTO
    role (title, salary, department_id)
VALUES
    ('Sales Manager', 300000, 5),
    ('Sales Associte', 50000, 5),
    ('Server Admin', 100000, 2),
    ('Junior Server Specialist', 60000, 2),
    ('Head of Human Resources', 65000, 3),
    ('Temp Human Resources', 30000, 3),
    ('Lead of Accounting', 85000, 4),
    ('Accounting Associte', 64000, 4),
    ('Marketing  Manager', 250000, 1),
    ('Marketing Associate', 150000, 1);

INSERT INTO
    department (name)
VALUES
    ('Marketing'),
    ('IT'),
    ('Human Resources'),
    ('Accounting'),
    ('Sales');
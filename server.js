//require in your dependencies
const mysql = require("mysql");
const inquirer = require("inquirer");
require("console.table");

// connect to mysql

const connection = mysql.createConnection({
  host: "localhost",
  port: "3306",
  user: "root",
  password: "Nicholas21#",
  database: "employee_tracker_db",
});

connection.connect(function (err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  firstPrompt();
});

// inquirer prompt for the menu
function firstPrompt() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "userChoice",
        message: "Please select an option?",
        choices: [
          "View All Employees",
          "View Employees By Department",
          "View All Roles",
          "View All Departments",
          "Add Employee",
          "Remove Employee",
          "Update Employee Role",
          "Add Role",
          "Add Department",
          "Exit",
        ],
      },
    ])
    .then((res) => {
      console.log(res.userChoice);
      // use the choice to call the function which will return the infrom from the query
      if (res.userChoice === "View All Employees") {
        viewAllEmployees();
      } else if (res.userChoice === "View Employees By Department") {
        viewEmployeesByDepartment();
      } else if (res.userChoice === "View All Roles") {
        viewRoles();
      } else if (res.userChoice === "View All Departments") {
        viewDepartments();
      } else if (res.userChoice === "Add Employee") {
        addEmployee();
      } else if (res.userChoice === "Remove Employee") {
        removeEmployee();
      } else if (res.userChoice === "Update Employee Role") {
        updateEmployeeRole();
      } else if (res.userChoice === "Add Role") {
        addRole();
      } else if (res.userChoice === "Add Department") {
        addDepartment();
      } else {
        connection.end();
      }
    })
    .catch((err) => {
      if (err) throw err;
    });
}

// view all employees

function viewAllEmployees() {
  let query = `SELECT 
        employee.id, 
        employee.first_name, 
        employee.last_name, 
        role.title, 
        department.name department, 
        role.salary, 
        CONCAT(manager.first_name, ' ', manager.last_name)  manager
    FROM employee
    LEFT JOIN role
        ON employee.role_id = role.id
    LEFT JOIN department
        ON department.id = role.department_id
    LEFT JOIN employee manager
        ON manager.id = employee.manager_id`;

  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    firstPrompt();
  });
}

//View all EE by dept
function viewEmployeesByDepartment() {
  let query = `SELECT 
        department.id, 
        department.name, 
        role.salary
    FROM employee
    LEFT JOIN role 
        ON employee.role_id = role.id
    LEFT JOIN department
        ON department.id = role.department_id
    GROUP BY department.id, department.name, role.salary`;

  connection.query(query, (err, res) => {
    if (err) throw err;
    const deptChoices = res.map((choices) => ({
      value: choices.id,
      name: choices.name,
    }));
    console.table(res);
    getDept(deptChoices);
  });
}

function getDept(deptChoices) {
  inquirer
    .prompt([
      {
        type: "list",
        name: "department",
        message: "Departments: ",
        choices: deptChoices,
      },
    ])
    .then((res) => {
      let query = `SELECT 
                        employee.id, 
                        employee.first_name, 
                        employee.last_name, 
                        role.title, 
                        department.name
                    FROM employee
                    JOIN role
                        ON employee.role_id = role.id
                    JOIN department
                        ON department.id = role.department_id
                    WHERE department.id = ?`;

      connection.query(query, res.department, (err, res) => {
        if (err) throw err;
        firstPrompt();
        console.table(res);
      });
    });
}

//view all roles
function viewRoles() {
  let query = `SELECT * FROM role`;
  connection.query(query, (err, res) => {
    if (err) throw err;
    const role = res.map(({ id, title, salary, department_id }) => ({
      id: id,
      title: `${title}`,
      salary: `${salary}`,
      department_id: `${department_id}`,
    }));

    console.table(res);
    firstPrompt();
  });
}

//view all departments
function viewDepartments() {
  let query = `SELECT * FROM department`;
  connection.query(query, (err, res) => {
    if (err) throw err;
    const role = res.map(({ id, name }) => ({
      id: id,
      name: `${name}`,
    }));

    console.table(res);
    firstPrompt();
  });
}

function addEmployee() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "firstName",
        message: "Employee First Name: ",
      },
      {
        type: "input",
        name: "lastName",
        message: "Employee Last Name: ",
      },
      {
        type: "input",
        name: "roleId",
        message: "Employee Role: ",
      },
      {
        type: "input",
        name: "managerId",
        message: "Please enter the employee's managers ID",
      },
    ])
    .then((res) => {
      let query = `INSERT INTO employee SET ?`;
      connection.query(
        query,
        {
          first_name: res.firstName,
          last_name: res.lastName,
          role_id: res.roleId,
          manager_id: res.managerId,
        },
        (err, res) => {
          if (err) throw err;
          firstPrompt();
        }
      );
    });
}

// remove an employee from the DB
function removeEmployee() {
  let query = `SELECT
      employee.id, 
      employee.first_name, 
      employee.last_name
  FROM employee`;

  connection.query(query, (err, res) => {
    if (err) throw err;
    const employee = res.map(({ id, first_name, last_name }) => ({
      value: id,
      name: `${id} ${first_name} ${last_name}`,
    }));
    console.table(res);
    getDelete(employee);
  });
}

function getDelete(employee) {
  inquirer
    .prompt([
      {
        type: "list",
        name: "employee",
        message: "Employee To Be Deleted: ",
        choices: employee,
      },
    ])
    .then((res) => {
      let query = `DELETE FROM employee WHERE ?`;
      connection.query(query, { id: res.employee }, (err, res) => {
        if (err) throw err;
        firstPrompt();
      });
    });
}

//update employees role
function updateEmployeeRole() {
  let query = `SELECT 
                    employee.id,
                    employee.first_name, 
                    employee.last_name, 
                    role.title, 
                    department.name, 
                    role.salary, 
                    CONCAT(manager.first_name, ' ', manager.last_name) AS manager
                FROM employee
                JOIN role
                    ON employee.role_id = role.id
                JOIN department
                    ON department.id = role.department_id
                JOIN employee manager
                    ON manager.id = employee.manager_id`;

  connection.query(query, (err, res) => {
    if (err) throw err;
    const employee = res.map(({ id, first_name, last_name }) => ({
      value: id,
      name: `${first_name} ${last_name}`,
    }));
    console.table(res);
    updateRole(employee);
  });
}

function updateRole(employee) {
  let query = `SELECT 
    role.id, 
    role.title, 
    role.salary 
  FROM role`;

  connection.query(query, (err, res) => {
    if (err) throw err;
    let roleChoices = res.map(({ id, title, salary }) => ({
      value: id,
      title: `${title}`,
      salary: `${salary}`,
    }));
    console.table(res);
    getUpdatedRole(employee, roleChoices);
  });
}

function getUpdatedRole(employee, roleChoices) {
  inquirer
    .prompt([
      {
        type: "list",
        name: "employee",
        message: `Please select the employee to update their role. `,
        choices: employee,
      },
      {
        type: "list",
        name: "role",
        message: "Please select a new role for the employee. ",
        choices: roleChoices,
      },
    ])
    .then((res) => {
      const employeeChoice = res.employee;
      const newRole = res.role;
      let query = `UPDATE employee SET role_id = "${newRole}" WHERE id = ${employeeChoice}`;
      connection.query(query, [res.role, res.employee], (err, res) => {
        if (err) throw err;
      });
      console.table(res);
      firstPrompt();
    });
}

//add a new role
function addRole() {
  var query = `SELECT 
      department.id, 
      department.name, 
      role.salary
    FROM employee
    JOIN role
      ON employee.role_id = role.id
    JOIN department
      ON department.id = role.department_id
    `;

  connection.query(query, (err, res) => {
    if (err) throw err;
    const department = res.map(({ id, name }) => ({
      value: id,
      name: `${id} ${name}`,
    }));
    console.table(res);
    addToRole(department);
  });
}

function addToRole(department) {
  inquirer
    .prompt([
      {
        type: "input",
        name: "title",
        message: "Role title: ",
      },
      {
        type: "input",
        name: "salary",
        message: "Role Salary: ",
      },
      {
        type: "list",
        name: "department",
        message: "Department: ",
        choices: department,
      },
    ])
    .then((res) => {
      let query = `INSERT INTO role SET ?`;

      connection.query(
        query,
        {
          title: res.title,
          salary: res.salary,
          department_id: res.department,
        },
        (err, res) => {
          if (err) throw err;
          firstPrompt();
        }
      );
    });
}

// add a department
function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "Department Name: ",
      },
    ])
    .then((res) => {
      let query = `INSERT INTO department SET ?`;
      connection.query(query, { name: res.name }, (err, res) => {
        if (err) throw err;
        //console.log(res);
        firstPrompt();
      });
    });
}

const data = {
  employees: require("../model/employees.json"),
  setEmployees: function (data) {
    this.employees = data;
  },
};

const getAllEmployees = (req, res) => {
  res.json(data.employees);
};

const createNewEmployee = (req, res) => {
  const newEmployee = {
    Id: data.employees[data.employees.length - 1].Id + 1 || 1,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
  };
  // Add validation
  if (!req.body?.firstname || !req.body?.lastname) {
    return res
      .status(400)
      .json({ message: "First and last names are required" });
  }

  data.setEmployees([...data.employees, newEmployee]);
  res.status(201).json(data.employees);
};

const updateEmployee = (req, res) => {
  const employee = data.employees.find(
    (emp) => emp.Id === parseInt(req.body.Id)
  );
  if (!employee) {
    return res
      .status(400)
      .json({ message: `Employee ID ${req.body.Id} not found` });
  }
  if (req.body.firstname) employee.firstname = req.body.firstname;
  if (req.body.lastname) employee.lastname = req.body.lastname;
  const filteredArray = data.employees.filter(
    (emp) => emp.Id !== parseInt(req.body.Id)
  );
  const unsortedArray = [...filteredArray, employee];
  data.setEmployees(
    unsortedArray.sort((a, b) => (a.Id > b.Id ? 1 : a.Id < b.Id ? -1 : 0))
  );
  res.json(data.employees);
};

const deleteEmployee = (req, res) => {
  const employee = data.employees.find(
    (emp) => emp.Id === parseInt(req.body.Id)
  );
  if (!employee) {
    return res
      .status(400)
      .json({ message: `Employee ID ${req.body.Id} not found` });
  }
  const filteredArray = data.employees.filter(
    (emp) => emp.Id !== parseInt(req.body.Id)
  );
  data.setEmployees([...filteredArray]);
  res.json(data.employees);
};
// get data of one employee
const getEmployee = (req, res) => {
  const employee = data.employees.find(
    (emp) => emp.Id === parseInt(req.params.id)
  );
  if (!employee) {
    return res
      .status(400)
      .json({ message: `Employee ID ${req.params.Id} not found` });
  }
  res.json(employee);
};

module.exports = {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee,
};

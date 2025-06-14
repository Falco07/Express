const express = require("express");
const router = express.Router();
const employeesController = require("../../controllers/employeesController");
const ROLES_LIST = require('../../config/roles_list')
const verifyRoles = require('../../middleware/verifyRoles')

router
  .route("/")
  .get( employeesController.getAllEmployees)
  // Handles POST requests to /employees to add a new employee
  .post(verifyRoles(ROLES_LIST.admin,ROLES_LIST.editor),employeesController.createNewEmployee)
  //  Handles PUT requests to /employees to update an existing employee.
  .put(verifyRoles(ROLES_LIST.admin,ROLES_LIST.editor),employeesController.updateEmployee)
  //  Handles DELETE requests to /employees to remove an employee.
  .delete(verifyRoles(ROLES_LIST.admin),employeesController.deleteEmployee);
// retrieve one specific employee using their ID
router.route("/:id").get(employeesController.getEmployee);

module.exports = router;

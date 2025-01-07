const express = require("express");
const router = express.Router();
const { getAllTables,checkTableAvailability } = require("../Controller/Tables");
router.get('/',getAllTables);
router.get('/checkAvailability',checkTableAvailability);


module.exports = router;

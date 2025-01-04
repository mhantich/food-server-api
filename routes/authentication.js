const express = require("express");
const router = express.Router();
const { login } = require("../Controller/authentication.js");

router.post("/login", login);

router.get("/profile",(req,res)=>{
    res.send('hello');
});
module.exports = router;
const express = require('express');
const router = express.Router();
const versionsController = require('../../controllers/versionsControllController');


router.route('/')    
    .put(versionsController.addNewSkill)   
    .post(versionsController.updateSkill)
    .get(versionsController.listSkills)
    

module.exports = router;
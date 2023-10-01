const skillDb = {
    skill: require('../model/versions.json'),
    setSkill: function (skillDb) { this.skill = skillDb }
}
const today = new Date();
const fsPromises = require('fs').promises;
const path = require('path');

const updateVersion=(version , versionLevel) =>{
    /**
     * Update the version of 
     */
    const splittedVersion = version.split(".")
    switch(versionLevel) {
        case 1:
            splittedVersion[2] = 1 + parseInt(splittedVersion[2]);
            break;
        case 2:
            splittedVersion[1] = 1 + parseInt(splittedVersion[1]);
            break;
        case 3:
            splittedVersion[0] = 1 +parseInt(splittedVersion[1]);
        default:
                              
    }
    let newVersion =  splittedVersion.toString().replaceAll(",",".")
    return newVersion
}

const updateSkill = async (req, res) =>{
    /**
     * 
     */
       
    const foundSkill= skillDb.skill.find(skill => skill.skillName === req.body.skillName);
    if (!foundSkill) {
        return res.status(400).json({ 'message': 'No skill found!' });
    };
    
    foundSkill.log.push({        
        id : foundSkill.log.pop().id +1,
        date : today,        
        shorttext : req.body.log.shorttext,
        description : req.body.log.description        
    });

    const  versionLevel = req.body.log.versionLevel
    const version = foundSkill.version
    
    if (versionLevel) {
        const newVersion = updateVersion(version, versionLevel)
        foundSkill.version = newVersion
    };    
       
    await fsPromises.writeFile(
        path.join(__dirname, '..', 'model', 'versions.json'),
        JSON.stringify(skillDb.skill)
    );

    const returnJson= {
        version : foundSkill.version,
        Logid : foundSkill.log.pop().id +1

    }
    res.json(returnJson);
}

const addNewSkill = async (req, res) => {   
    let initialVersion = req.body.initialVersion
    console.log(initialVersion)
    if (!initialVersion){
        initialVersion = '1.0.0'
    }

    const newSkill = {
        id: skillDb.skill?.length ? skillDb.skill[skillDb.skill.length - 1].id + 1 : 1,
        skillName: req.body.skillName,
        version: initialVersion,
        description: req.body.description,        
        createDate: today,
        log : today,
        log: [{
            id: 1,
            date: today,
            shorttext: req.body.log.shorttext,
            description: req.body.log.description
        }]
        
    };
    
    if (!newSkill.skillName) {
        return res.status(400).json({ 'message': 'Skill name is required.' });
    }
    const foundSkill= skillDb.skill.find(skill => skill.skillName === newSkill.skillName);

    if (foundSkill) {        
        return res.status(400).json({ 'message': 'Skill is allready exist' });
    }else{
        skillDb.setSkill([...skillDb.skill, newSkill]);
        await fsPromises.writeFile(
        path.join(__dirname, '..', 'model', 'versions.json'),
        JSON.stringify(skillDb.skill)
        
    );  
    
    res.status(201).json(newSkill);
    }        
}

const listSkills = async (req, res) => {

    len = skillDb.skill.length;
    skillArray = []    
    for (let i = 0; i < skillDb.skill.length; i++){    

        skillArray.push(skillDb.skill[i]["skillName"])
    }

    res.status(201).json({"ListOfSkills":skillArray})
   }     

module.exports = {
    addNewSkill,
    updateSkill,
    listSkills}
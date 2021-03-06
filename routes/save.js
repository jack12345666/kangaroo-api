let express = require('express');
let router = express.Router();
let saveData = require('../services/save');

router.get('/allsave', async (req, res) => {
    await saveData.allSave(req, res);
})
router.get('/saveCountByCid', async (req, res) => {
    await saveData.getSaveByCid(req, res);
})
router.get('/saveByUid', async (req, res) => {
    await saveData.toSaveByUid(req, res)
})
router.post('/isSaveContent', async (req, res) => {
    await saveData.isSaveContent(req, res);
})
router.get('/saveSign', async (req, res) => {
    await saveData.saveSign(req, res);
})
router.get('/getSaveByUid', async (req, res) => {
    await saveData.getSaveByUid(req, res)
})

module.exports = router;
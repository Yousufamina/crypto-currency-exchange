const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const contentController = require("../controllers/ContentController");
const userController = require("../controllers/UsersController");
const faqController = require("../controllers/FaqController");

/*
Contents API
*/
router.post('/createContent',contentController.createContent);
router.put('/updateContent/:id',contentController.updateContent);
router.get('/getAllContents' , contentController.getAllContents);+
router.get('/getAllContentsForWeb' , contentController.getAllContentsForWeb);
router.get('/content/:id',contentController.getContentById);
router.post('/delete/content',contentController.deleteContent);

router.post('/addNotes',contentController.addNotes);
router.post('/updateNotes',contentController.editNotesByContentId);
router.post('/viewNotesByContentId',contentController.viewNotesByContentId);
router.post('/viewAllNotes',contentController.viewAllNotes);
router.post('/deleteNotes' ,contentController.deleteNotes);
router.post('/delete/notes',contentController.deleteNotesById);


router.post('/addFavorite',contentController.addFavorite);
router.post('/removeFavorite',contentController.removeFavorite);
router.get('/getAllFavorites/:id',contentController.getAllFavorites);

router.post('/addPosition',contentController.addPosition);

// website content
// router.post('/createWebsiteContent',contentController.createWebsiteContent);
// router.put('/updateWebsiteContent/:id',contentController.updateWebsiteContent);
// router.get('/getAllWebsiteContents' , contentController.getAllWebsiteContents);
// router.get('/websiteContent/:id',contentController.getWebsiteContentById);
// router.post('/delete/websiteContent',contentController.deleteWebsiteContent);


//faq
router.post('/addFaq',faqController.addFaq);
router.put('/updateFaq/:id',faqController.updateFaq);
router.post('/delete/faq',faqController.deleteFaq);
router.get('/getAllFaq',faqController.getAllFaq);
router.get('/getFaq/:id',faqController.getFaqById);

//aboutUS
router.post('/addAboutUs',faqController.addAboutUs);
router.put('/updateAboutUs/:id',faqController.updateAboutUs);
router.get('/getAboutUs',faqController.getAboutUs);


module.exports = router;
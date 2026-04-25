// JOURNAL ROUTES
const express  = require("express");
const router   = express.Router();
const { save, getEntries, getJournalEntries } = require("../controllers/journalController");
const { protect }          = require("../middleware/auth");

router.use(protect);

router.post("/", save);
router.get("/",  getEntries);
router.get("/:userId", getJournalEntries);

module.exports = router;

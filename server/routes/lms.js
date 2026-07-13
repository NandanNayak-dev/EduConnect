import express from 'express';
import userAuthentication from '../middleware/userAuthentication.js';
import {
    createClass, joinClass, getClasses,
    addMaterial, getMaterials,
    addAnnouncement, getAnnouncements,
    addPoll, getPolls, votePoll
} from '../controller/lms.js';

const router = express.Router();

// All LMS routes require authentication
router.use(userAuthentication);

// Classes
router.post('/classes', createClass);
router.post('/classes/join', joinClass);
router.get('/classes', getClasses);

// Materials
router.post('/materials', addMaterial);
router.get('/materials', getMaterials);

// Announcements
router.post('/announcements', addAnnouncement);
router.get('/announcements', getAnnouncements);

// Polls
router.post('/polls', addPoll);
router.get('/polls', getPolls);
router.patch('/polls/vote', votePoll);

export default router;

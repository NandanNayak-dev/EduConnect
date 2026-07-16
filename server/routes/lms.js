import express from 'express';
import userAuthentication from '../middleware/userAuthentication.js';
import uploadFile from '../middleware/uploadFile.js';
import {
    createClass, joinClass, getClasses, getClassStudents,
    addMaterial, getMaterials, deleteMaterial,
    addAnnouncement, getAnnouncements, deleteAnnouncement,
    addPoll, getPolls, votePoll, deletePoll,
    addVideo, getVideos, deleteVideo,
    addAssignment, getAssignments, submitAssignment, getSubmissions, evaluateSubmission
} from '../controller/lms.js';

const router = express.Router();

// All LMS routes require authentication
router.use(userAuthentication);

// Classes
router.post('/classes', createClass);
router.post('/classes/join', joinClass);
router.get('/classes', getClasses);
router.get('/classes/:classId/students', getClassStudents);

// Materials
router.post('/materials', uploadFile.single('materials'), addMaterial);
router.get('/materials', getMaterials);
router.delete('/materials/:id', deleteMaterial);

// Announcements
router.post('/announcements', addAnnouncement);
router.get('/announcements', getAnnouncements);
router.delete('/announcements/:id', deleteAnnouncement);

// Polls
router.post('/polls', addPoll);
router.get('/polls', getPolls);
router.patch('/polls/vote', votePoll);
router.delete('/polls/:id', deletePoll);

// Videos
router.post('/videos', uploadFile.single('videos'), addVideo);
router.get('/videos', getVideos);
router.delete('/videos/:id', deleteVideo);

// --- Assignments & Submissions ---
router.post('/assignments', uploadFile.single('assignments'), addAssignment);
router.get('/assignments', getAssignments);
router.post('/assignments/submit', uploadFile.single('submissions'), submitAssignment);
router.get('/assignments/submissions', getSubmissions);
router.patch('/assignments/submissions/:id/evaluate', evaluateSubmission);

export default router;

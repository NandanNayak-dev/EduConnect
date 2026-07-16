import MaterialModel from '../models/materialSchema.js';
import AnnouncementModel from '../models/announcementSchema.js';
import PollModel from '../models/pollSchema.js';
import ClassModel from '../models/classSchema.js';
import VideoModel from '../models/videoSchema.js';
import AssignmentModel from '../models/assignmentSchema.js';
import SubmissionModel from '../models/submissionSchema.js';
import MessageModel from '../models/messageSchema.js';

// --- Classes ---
export const createClass = async (req, res) => {
    try {
        if (req.user.role !== 'teacher') return res.status(403).json({ status: false, message: "Only teachers can create classes" });
        const { name, description } = req.body;
        if (!name) return res.status(400).json({ status: false, message: "Class name is required" });

        // Generate a 6-character random alphanumeric join code
        const joinCode = Math.random().toString(36).substring(2, 8).toUpperCase();

        const newClass = new ClassModel({
            name,
            description,
            joinCode,
            teacherId: req.user._id,
            students: []
        });

        await newClass.save();
        res.status(201).json({ status: true, message: "Class created successfully", class: newClass });
    } catch (error) {
        console.error('Error creating class:', error);
        res.status(500).json({ status: false, message: "Internal Server Error: " + error.message });
    }
};

export const joinClass = async (req, res) => {
    try {
        if (req.user.role !== 'student') return res.status(403).json({ status: false, message: "Only students can join classes" });
        const { joinCode } = req.body;
        if (!joinCode) return res.status(400).json({ status: false, message: "Join code is required" });

        const targetClass = await ClassModel.findOne({ joinCode: joinCode.toUpperCase() });
        if (!targetClass) return res.status(404).json({ status: false, message: "Invalid join code" });

        if (targetClass.students.includes(req.user._id)) {
            return res.status(400).json({ status: false, message: "You are already enrolled in this class" });
        }

        targetClass.students.push(req.user._id);
        await targetClass.save();

        res.status(200).json({ status: true, message: "Successfully joined the class", class: targetClass });
    } catch (error) {
        res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};

export const getClasses = async (req, res) => {
    try {
        let classes;
        if (req.user.role === 'teacher') {
            classes = await ClassModel.find({ teacherId: req.user._id }).populate('teacherId', 'fullName email').sort({ createdAt: -1 });
        } else if (req.user.role === 'student') {
            classes = await ClassModel.find({ students: req.user._id }).populate('teacherId', 'fullName email').sort({ createdAt: -1 });
        } else {
            classes = [];
        }
        res.status(200).json({ status: true, classes });
    } catch (error) {
        res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};

export const getClassStudents = async (req, res) => {
    try {
        const { classId } = req.params;
        const targetClass = await ClassModel.findById(classId).populate('students', 'fullName email');
        if (!targetClass) return res.status(404).json({ status: false, message: "Class not found" });
        res.status(200).json({ status: true, students: targetClass.students });
    } catch (error) {
        res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};

// --- Materials ---
export const addMaterial = async (req, res) => {
    try {
        if (req.user.role !== 'teacher') return res.status(403).json({ status: false, message: "Only teachers can upload materials" });
        const { title, description, link, classId } = req.body;
        if (!title || !description || !classId) return res.status(400).json({ status: false, message: "Title, description, and classId are required" });
        let fileUrl = "";
        if (req.file) { fileUrl = `${req.file.filename}`; }

        const material = new MaterialModel({ title, description, link, fileUrl, classId, teacherId: req.user._id });
        await material.save();
        res.status(201).json({ status: true, message: "Material added successfully", material });
    } catch (error) {
        res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};

export const getMaterials = async (req, res) => {
    try {
        const { classId } = req.query;
        if (!classId) return res.status(400).json({ status: false, message: "classId query parameter is required" });
        const materials = await MaterialModel.find({ classId }).populate('teacherId', 'fullName email').sort({ createdAt: -1 });
        res.status(200).json({ status: true, materials });
    } catch (error) {
        res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};

export const deleteMaterial = async (req, res) => {
    try {
        if (req.user.role !== 'teacher') return res.status(403).json({ status: false, message: "Only teachers can delete materials" });
        await MaterialModel.findByIdAndDelete(req.params.id);
        res.status(200).json({ status: true, message: "Material deleted" });
    } catch (error) {
        res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};

// --- Announcements ---
export const addAnnouncement = async (req, res) => {
    try {
        if (req.user.role !== 'teacher') return res.status(403).json({ status: false, message: "Only teachers can post announcements" });
        const { title, content, classId, urgent } = req.body;
        if (!title || !content || !classId) return res.status(400).json({ status: false, message: "Title, content, and classId are required" });

        const announcement = new AnnouncementModel({ title, content, urgent: !!urgent, classId, teacherId: req.user._id });
        await announcement.save();
        res.status(201).json({ status: true, message: "Announcement posted", announcement });
    } catch (error) {
        res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};

export const getAnnouncements = async (req, res) => {
    try {
        const { classId } = req.query;
        if (!classId) return res.status(400).json({ status: false, message: "classId query parameter is required" });
        const announcements = await AnnouncementModel.find({ classId }).populate('teacherId', 'fullName email').sort({ createdAt: -1 });
        res.status(200).json({ status: true, announcements });
    } catch (error) {
        res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};

export const deleteAnnouncement = async (req, res) => {
    try {
        if (req.user.role !== 'teacher') return res.status(403).json({ status: false, message: "Only teachers can delete announcements" });
        await AnnouncementModel.findByIdAndDelete(req.params.id);
        res.status(200).json({ status: true, message: "Announcement deleted" });
    } catch (error) {
        res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};

// --- Polls ---
export const addPoll = async (req, res) => {
    try {
        if (req.user.role !== 'teacher') return res.status(403).json({ status: false, message: "Only teachers can create polls" });
        const { question, options, classId } = req.body; 
        if (!question || !options || options.length < 2 || !classId) return res.status(400).json({ status: false, message: "Question, classId, and at least 2 options required" });

        const formattedOptions = options.map(opt => ({ text: opt, votes: 0 }));
        const poll = new PollModel({ question, options: formattedOptions, classId, teacherId: req.user._id });
        await poll.save();
        res.status(201).json({ status: true, message: "Poll created", poll });
    } catch (error) {
        res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};

export const getPolls = async (req, res) => {
    try {
        const { classId } = req.query;
        if (!classId) return res.status(400).json({ status: false, message: "classId query parameter is required" });
        const polls = await PollModel.find({ classId }).populate('teacherId', 'fullName email').sort({ createdAt: -1 });
        res.status(200).json({ status: true, polls });
    } catch (error) {
        res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};

export const votePoll = async (req, res) => {
    try {
        const { pollId, optionId } = req.body;
        const poll = await PollModel.findById(pollId);
        
        if (!poll) return res.status(404).json({ status: false, message: "Poll not found" });
        if (poll.votedBy.includes(req.user._id)) return res.status(400).json({ status: false, message: "You have already voted" });

        const option = poll.options.id(optionId);
        if (!option) return res.status(404).json({ status: false, message: "Option not found" });

        option.votes += 1;
        poll.votedBy.push(req.user._id);
        await poll.save();

        res.status(200).json({ status: true, message: "Vote cast successfully", poll });
    } catch (error) {
        res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};

export const deletePoll = async (req, res) => {
    try {
        if (req.user.role !== 'teacher') return res.status(403).json({ status: false, message: "Only teachers can delete polls" });
        await PollModel.findByIdAndDelete(req.params.id);
        res.status(200).json({ status: true, message: "Poll deleted" });
    } catch (error) {
        res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};

// --- Videos ---
export const addVideo = async (req, res) => {
    try {
        if (req.user.role !== 'teacher') return res.status(403).json({ status: false, message: "Only teachers can upload videos" });
        const { title, description, classId } = req.body;
        if (!title || !description || !classId) return res.status(400).json({ status: false, message: "Title, description, and classId are required" });
        if (!req.file) return res.status(400).json({ status: false, message: "Video file is required" });

        const fileUrl = `${req.file.filename}`;
        const video = new VideoModel({ title, description, fileUrl, classId, teacherId: req.user._id });
        await video.save();
        res.status(201).json({ status: true, message: "Video uploaded successfully", video });
    } catch (error) {
        console.error('Error uploading video:', error);
        res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};

export const getVideos = async (req, res) => {
    try {
        const { classId } = req.query;
        if (!classId) return res.status(400).json({ status: false, message: "classId query parameter is required" });
        const videos = await VideoModel.find({ classId }).populate('teacherId', 'fullName email').sort({ createdAt: -1 });
        res.status(200).json({ status: true, videos });
    } catch (error) {
        res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};

export const deleteVideo = async (req, res) => {
    try {
        if (req.user.role !== 'teacher') return res.status(403).json({ status: false, message: "Only teachers can delete videos" });
        await VideoModel.findByIdAndDelete(req.params.id);
        res.status(200).json({ status: true, message: "Video deleted" });
    } catch (error) {
        res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};

// --- Assignments ---
export const addAssignment = async (req, res) => {
    try {
        if (req.user.role !== 'teacher') return res.status(403).json({ status: false, message: "Only teachers can post assignments" });
        const { title, description, classId } = req.body;
        if (!title || !description || !classId) return res.status(400).json({ status: false, message: "Missing required fields" });

        let fileUrl = null;
        if (req.file) fileUrl = `${req.file.filename}`;

        const assignment = new AssignmentModel({ title, description, fileUrl, classId, teacherId: req.user._id });
        await assignment.save();
        res.status(201).json({ status: true, message: "Assignment created", assignment });
    } catch (error) {
        res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};

export const getAssignments = async (req, res) => {
    try {
        const { classId } = req.query;
        if (!classId) return res.status(400).json({ status: false, message: "classId is required" });
        let assignments = await AssignmentModel.find({ classId }).populate('teacherId', 'fullName email').sort({ createdAt: -1 });
        
        if (req.user.role === 'student') {
            const assignmentIds = assignments.map(a => a._id);
            const submissions = await SubmissionModel.find({ studentId: req.user._id, assignmentId: { $in: assignmentIds } });
            
            assignments = assignments.map(a => {
                const submission = submissions.find(s => s.assignmentId.toString() === a._id.toString());
                return { ...a.toObject(), submissionStatus: submission ? (submission.evaluated ? 'evaluated' : 'submitted') : 'pending' };
            });
        }

        res.status(200).json({ status: true, assignments });
    } catch (error) {
        res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};

// --- Submissions ---
export const submitAssignment = async (req, res) => {
    try {
        if (req.user.role !== 'student') return res.status(403).json({ status: false, message: "Only students can submit assignments" });
        const { assignmentId } = req.body;
        if (!assignmentId) return res.status(400).json({ status: false, message: "assignmentId is required" });
        if (!req.file) return res.status(400).json({ status: false, message: "Submission file is required" });

        const existingSubmission = await SubmissionModel.findOne({ assignmentId, studentId: req.user._id });
        if (existingSubmission) return res.status(400).json({ status: false, message: "You have already submitted this assignment" });

        const fileUrl = `${req.file.filename}`;
        const submission = new SubmissionModel({ assignmentId, studentId: req.user._id, fileUrl });
        await submission.save();
        res.status(201).json({ status: true, message: "Assignment submitted", submission });
    } catch (error) {
        res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};

export const getSubmissions = async (req, res) => {
    try {
        if (req.user.role !== 'teacher') return res.status(403).json({ status: false, message: "Only teachers can view submissions" });
        const { assignmentId } = req.query;
        if (!assignmentId) return res.status(400).json({ status: false, message: "assignmentId is required" });
        const submissions = await SubmissionModel.find({ assignmentId }).populate('studentId', 'fullName email usn').sort({ submittedAt: -1 });
        res.status(200).json({ status: true, submissions });
    } catch (error) {
        res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};

export const evaluateSubmission = async (req, res) => {
    try {
        if (req.user.role !== 'teacher') return res.status(403).json({ status: false, message: "Only teachers can evaluate submissions" });
        const { id } = req.params;
        const { evaluated } = req.body;
        
        const submission = await SubmissionModel.findByIdAndUpdate(id, { evaluated }, { new: true });
        if (!submission) return res.status(404).json({ status: false, message: "Submission not found" });
        
        res.status(200).json({ status: true, message: "Submission evaluated status updated", submission });
    } catch (error) {
        res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};

// --- Messages ---
export const sendMessage = async (req, res) => {
    try {
        if (req.user.role !== 'teacher') return res.status(403).json({ status: false, message: "Only teachers can send direct messages" });
        const { classId, receiverId, content } = req.body;
        if (!classId || !receiverId || !content) return res.status(400).json({ status: false, message: "classId, receiverId, and content are required" });

        const message = new MessageModel({ classId, senderId: req.user._id, receiverId, content });
        await message.save();
        res.status(201).json({ status: true, message: "Message sent successfully", data: message });
    } catch (error) {
        res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { classId } = req.query;
        if (!classId) return res.status(400).json({ status: false, message: "classId is required" });

        let query = { classId };
        if (req.user.role === 'student') {
            query.receiverId = req.user._id;
        } else if (req.user.role === 'teacher') {
            query.senderId = req.user._id;
        }

        const messages = await MessageModel.find(query)
            .populate('senderId', 'fullName email')
            .populate('receiverId', 'fullName email usn')
            .sort({ createdAt: -1 });
            
        res.status(200).json({ status: true, messages });
    } catch (error) {
        res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};

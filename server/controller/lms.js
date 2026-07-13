import MaterialModel from '../models/materialSchema.js';
import AnnouncementModel from '../models/announcementSchema.js';
import PollModel from '../models/pollSchema.js';
import ClassModel from '../models/classSchema.js';

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

// --- Materials ---
export const addMaterial = async (req, res) => {
    try {
        if (req.user.role !== 'teacher') return res.status(403).json({ status: false, message: "Only teachers can upload materials" });
        const { title, description, link, classId } = req.body;
        if (!title || !description || !classId) return res.status(400).json({ status: false, message: "Title, description, and classId are required" });

        const material = new MaterialModel({ title, description, link, classId, teacherId: req.user._id });
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

// --- Announcements ---
export const addAnnouncement = async (req, res) => {
    try {
        if (req.user.role !== 'teacher') return res.status(403).json({ status: false, message: "Only teachers can post announcements" });
        const { title, content, classId } = req.body;
        if (!title || !content || !classId) return res.status(400).json({ status: false, message: "Title, content, and classId are required" });

        const announcement = new AnnouncementModel({ title, content, classId, teacherId: req.user._id });
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

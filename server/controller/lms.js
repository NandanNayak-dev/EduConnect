import MaterialModel from '../models/materialSchema.js';
import AnnouncementModel from '../models/announcementSchema.js';
import PollModel from '../models/pollSchema.js';

// --- Materials ---
export const addMaterial = async (req, res) => {
    try {
        if (req.user.role !== 'teacher') return res.status(403).json({ status: false, message: "Only teachers can upload materials" });
        const { title, description, link } = req.body;
        if (!title || !description) return res.status(400).json({ status: false, message: "Title and description are required" });

        const material = new MaterialModel({ title, description, link, teacherId: req.user._id });
        await material.save();
        res.status(201).json({ status: true, message: "Material added successfully", material });
    } catch (error) {
        res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};

export const getMaterials = async (req, res) => {
    try {
        const materials = await MaterialModel.find().populate('teacherId', 'fullName email').sort({ createdAt: -1 });
        res.status(200).json({ status: true, materials });
    } catch (error) {
        res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};

// --- Announcements ---
export const addAnnouncement = async (req, res) => {
    try {
        if (req.user.role !== 'teacher') return res.status(403).json({ status: false, message: "Only teachers can post announcements" });
        const { title, content } = req.body;
        if (!title || !content) return res.status(400).json({ status: false, message: "Title and content are required" });

        const announcement = new AnnouncementModel({ title, content, teacherId: req.user._id });
        await announcement.save();
        res.status(201).json({ status: true, message: "Announcement posted", announcement });
    } catch (error) {
        res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};

export const getAnnouncements = async (req, res) => {
    try {
        const announcements = await AnnouncementModel.find().populate('teacherId', 'fullName email').sort({ createdAt: -1 });
        res.status(200).json({ status: true, announcements });
    } catch (error) {
        res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};

// --- Polls ---
export const addPoll = async (req, res) => {
    try {
        if (req.user.role !== 'teacher') return res.status(403).json({ status: false, message: "Only teachers can create polls" });
        const { question, options } = req.body; // options should be an array of strings e.g. ["Yes", "No"]
        if (!question || !options || options.length < 2) return res.status(400).json({ status: false, message: "Question and at least 2 options required" });

        const formattedOptions = options.map(opt => ({ text: opt, votes: 0 }));
        const poll = new PollModel({ question, options: formattedOptions, teacherId: req.user._id });
        await poll.save();
        res.status(201).json({ status: true, message: "Poll created", poll });
    } catch (error) {
        res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};

export const getPolls = async (req, res) => {
    try {
        const polls = await PollModel.find().populate('teacherId', 'fullName email').sort({ createdAt: -1 });
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

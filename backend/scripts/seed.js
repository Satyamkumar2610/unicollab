const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/user');
const Project = require('./models/project');
const bcrypt = require('bcryptjs');

dotenv.config();

const dummyUsers = [
    {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        password: 'password123',
        university: 'Stanford University',
        major: 'Computer Science',
        skills: ['React', 'Node.js', 'Python'],
        bio: 'Passionate full-stack developer looking for interesting projects.'
    },
    {
        name: 'Bob Smith',
        email: 'bob@example.com',
        password: 'password123',
        university: 'MIT',
        major: 'Artificial Intelligence',
        skills: ['Python', 'TensorFlow', 'PyTorch'],
        bio: 'AI enthusiast focused on deep learning and computer vision.'
    },
    {
        name: 'Charlie Davis',
        email: 'charlie@example.com',
        password: 'password123',
        university: 'UC Berkeley',
        major: 'Data Science',
        skills: ['SQL', 'R', 'Tableau'],
        bio: 'Data wizard who loves uncovering insights from big data.'
    }
];

const dummyProjects = [
    {
        title: 'AI-Powered Study Assistant',
        description: 'A web application that uses GPT-4 to help students summarize notes and generate flashcards automatically. We are looking for frontend developers and prompt engineers.',
        requiredSkills: ['React', 'OpenAI API', 'Node.js'],
        maxMembers: 4,
        category: 'ai-ml',
        status: 'active'
    },
    {
        title: 'Campus Event Aggregator',
        description: 'Mobile app to track all university events in one place. Features include RSVP, calendar integration, and social sharing.',
        requiredSkills: ['React Native', 'Firebase', 'UI/UX Design'],
        maxMembers: 5,
        category: 'mobile-app',
        status: 'planning'
    },
    {
        title: 'Sustainable Energy Research',
        description: 'Analyzing campus energy consumption patterns to propose sustainable alternatives. Need data analysts and researchers.',
        requiredSkills: ['Data Analysis', 'Python', 'Research'],
        maxMembers: 3,
        category: 'research',
        status: 'active'
    },
    {
        title: 'Decentralized Voting System',
        description: 'Blockchain-based voting system for student council elections to ensure transparency and security.',
        requiredSkills: ['Solidity', 'Web3.js', 'React'],
        maxMembers: 4,
        category: 'web-development',
        status: 'planning'
    },
    {
        title: 'VR Campus Tour',
        description: 'Virtual reality experience for prospective students to tour the campus from anywhere in the world.',
        requiredSkills: ['Unity', 'C#', '3D Modeling'],
        maxMembers: 6,
        category: 'web-development',
        status: 'active'
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        await User.deleteMany({});
        await Project.deleteMany({});
        console.log('Cleared existing data');

        const createdUsers = [];
        for (const user of dummyUsers) {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            const newUser = await User.create({ ...user, password: hashedPassword });
            createdUsers.push(newUser);
        }
        console.log(`Created ${createdUsers.length} users`);

        for (let i = 0; i < dummyProjects.length; i++) {
            const project = dummyProjects[i];
            const owner = createdUsers[i % createdUsers.length]; // Rotate owners

            await Project.create({
                ...project,
                owner: owner._id,
                members: [owner._id], // Owner is automatically a member
                deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
            });
        }
        console.log(`Created ${dummyProjects.length} projects`);

        console.log('Database seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDB();

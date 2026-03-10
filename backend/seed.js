const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Subject = require('./models/Subject');
const Module = require('./models/Module');

dotenv.config();

const subjectsData = [
    {
        title: "Applied Physics",
        semester: "Physics/Chemistry Cycle",
        modules: ["Module 1", "Module 2", "Module 3", "Module 4", "Module 5"]
    },
    {
        title: "Applied Chemistry",
        semester: "Physics/Chemistry Cycle",
        modules: ["Module 1", "Module 2", "Module 3", "Module 4", "Module 5"]
    },
    {
        title: "Introduction to AI and Applications",
        semester: "Physics/Chemistry Cycle",
        modules: ["Module 1", "Module 2", "Module 3", "Module 4", "Module 5"]
    },
    {
        title: "Basic Electronics",
        semester: "Physics/Chemistry Cycle",
        modules: ["Module 1", "Module 2", "Module 3", "Module 4", "Module 5"]
    },
    {
        title: "Mathematics-1",
        semester: "Physics/Chemistry Cycle",
        modules: ["Module 1", "Module 2", "Module 3", "Module 4", "Module 5"]
    },
    {
        title: "Mathematics-2",
        semester: "Physics/Chemistry Cycle",
        modules: ["Module 1", "Module 2", "Module 3", "Module 4", "Module 5"]
    },
    {
        title: "Principles of Programming Using C",
        semester: "Physics/Chemistry Cycle",
        modules: ["Module 1", "Module 2", "Module 3", "Module 4", "Module 5"]
    },
    {
        title: "Principles of Programming Using Python",
        semester: "Physics/Chemistry Cycle",
        modules: ["Module 1", "Module 2", "Module 3", "Module 4", "Module 5"]
    },
    {
        title: "Operating Systems",
        semester: "Third Semester",
        modules: ["Module 1", "Module 2", "Module 3", "Module 4", "Module 5"]
    },
    {
        title: "Mathematics - III For CSE",
        semester: "Third Semester",
        modules: ["Module 1", "Module 2", "Module 3", "Module 4", "Module 5"]
    },
    {
        title: "Digital Design And Computer Organization",
        semester: "Third Semester",
        modules: ["Module 1", "Module 2", "Module 3", "Module 4", "Module 5"]
    },
    {
        title: "Data Structures and Applications",
        semester: "Third Semester",
        modules: ["Module 1", "Module 2", "Module 3", "Module 4", "Module 5"]
    },
    {
        title: "Object Oriented Programming with Java",
        semester: "Third Semester",
        modules: ["Module 1", "Module 2", "Module 3", "Module 4", "Module 5"]
    },
    {
        title: "Analysis and Design of Algorithms",
        semester: "Fourth Semester",
        modules: ["Module 1", "Module 2", "Module 3", "Module 4", "Module 5"]
    },
    {
        title: "Biology For Computer Engineers",
        semester: "Fourth Semester",
        modules: ["Module 1", "Module 2", "Module 3", "Module 4", "Module 5"]
    },
    {
        title: "Database Management Systems",
        semester: "Fourth Semester",
        modules: ["Module 1", "Module 2", "Module 3", "Module 4", "Module 5"]
    },
    {
        title: "Mathematics - IV Linear Algebra",
        semester: "Fourth Semester",
        modules: ["Module 1", "Module 2", "Module 3", "Module 4", "Module 5"]
    },
    {
        title: "Microcontrollers",
        semester: "Fourth Semester",
        modules: ["Module 1", "Module 2", "Module 3", "Module 4", "Module 5"]
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB for seeding...");

        // Clear existing subjects and modules to avoid overlap as requested
        await Subject.deleteMany({});
        await Module.deleteMany({});
        console.log("Cleared existing Subjects and Modules.");

        for (const s of subjectsData) {
            const subject = new Subject({ title: s.title, semester: s.semester });
            const savedSubject = await subject.save();
            console.log(`Created Subject: ${savedSubject.title}`);

            for (let i = 0; i < s.modules.length; i++) {
                const module = new Module({
                    title: s.modules[i],
                    subject: savedSubject._id,
                    order: i + 1
                });
                await module.save();
            }
            console.log(`  - Created ${s.modules.length} modules for ${s.title}`);
        }

        console.log("Seeding completed successfully!");
        process.exit();
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
};

seedDB();

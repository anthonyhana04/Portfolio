// components/assets/data/projectsData.js
import assets from '../../utils/assets';

export const projectsData = [
  {
    id: 1,
    title: "AI & ML Engineer",
    description: "Engineering high-throughput AI systems for autonomous email marketing at LTV.ai. Orchestrating LLM prompting strategies and async response caching to scale generation.",
    tech: ["TypeScript", "PostgreSQL", "AWS", "LLMOps"],
    link: "https://ltv.ai/",
    type: "Work"
  },
  {
    id: 2,
    title: "MacPad",
    description: "Feather‑light, all‑native notepad designed exclusively for macOS. Built with SwiftUI for a modern interface and AppKit for rock‑solid integration.",
    tech: ["Swift", "AppKit", "SwiftUI"],
    link: "https://github.com/anthonyhana04/MacPad",
    type: "Project"
  },
  {
    id: 3,
    title: "Software Architect",
    description: "Designing internal tools and CI/CD pipelines for McMaster Start Coding. Leading workshops to empower students with industry-standard development practices.",
    tech: ["Elm", "Haskell", "JavaScript", "CI/CD"],
    type: "Volunteer"
  },
  {
    id: 4,
    title: "LavaLock",
    description: "Leverages the chaotic entropy of lava lamps and Google Gemini's API to generate distinct visual variations. These are cryptographically processed to derive secure, unpredictable seeds for 2FA and password generation.",
    tech: ["Go", "C++", "Swift", "AWS", "PostgreSQL"],
    link: "https://github.com/anthonyhana04/LavaLock_DH_XII",
    award: "DeltaHacks XII Winner",
    type: "Project"
  }
];

// grab proj id
export const getProjectById = (id) => {
  return projectsData.find(project => project.id === id);
};

// grab proj category
export const getProjectsByCategory = (category) => {
  return projectsData.filter(project => project.category === category);
};

// grab proj tech
export const getProjectsByTech = (technology) => {
  return projectsData.filter(project =>
    project.tech.some(tech =>
      tech.toLowerCase().includes(technology.toLowerCase())
    )
  );
};

// grab unique categories
export const getAllCategories = () => {
  return [...new Set(projectsData.map(project => project.category))];
};

// grab unique tech
//export const getAllTechnologies = () => {
//  const allTech = projectsData.flatMap(project => project.tech);
//  return [...new Set(allTech)].sort();
//};

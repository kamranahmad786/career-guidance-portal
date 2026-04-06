/**
 * recommendationService.js
 * Maps Top 3 parameters to careers, courses, and structured roadmaps.
 */

const careerMapping = {
  "Coding / Programming": {
    careers: ["Software Developer", "Full Stack Engineer", "Backend Architect"],
    courses: ["JavaScript & React Mastery", "Data Structures & Algorithms", "Node.js Backend Essentials"],
    roadmapSteps: [
      "Learn syntax basics (Python/JS)",
      "Master logical problem solving (DSA)",
      "Build 3-5 real-world portfolio projects",
      "Apply for junior developer roles or internships"
    ]
  },
  "Robotics & AI": {
    careers: ["Robotics Engineer", "AI Researcher", "IoT Solutions Architect"],
    courses: ["Python for Machine Learning", "Arduino & Raspberry Pi Basics", "TensorFlow & Keras Certification"],
    roadmapSteps: [
      "Learn Python and basic math for AI",
      "Experiment with microcontrollers (Arduino)",
      "Build an autonomous robot or AI model",
      "Specialization in Mechatronics or Deep Learning"
    ]
  },
  "Design (UI/UX / Graphics)": {
    careers: ["UI/UX Designer", "Product Designer", "Graphic Illustrator"],
    courses: ["Figma Design Systems", "Adobe Creative Suite Foundations", "Psychology of Design"],
    roadmapSteps: [
      "Master design tools (Figma/Adobe)",
      "Learn color theory and typography",
      "Build a case-study based design portfolio",
      "Networking on platforms like Dribbble/Behance"
    ]
  },
  "Arts & Creativity (Drawing, Painting)": {
    careers: ["Fine Artist", "Art Director", "Concept Artist for Games"],
    courses: ["Advanced Sketching Techniques", "Digital Painting Fundamentals", "Art History & Curation"],
    roadmapSteps: [
      "Dedicate daily hours to technical practice",
      "Develop a unique artistic signature style",
      "Exhibit work in local galleries or online",
      "Master digital art tools for commercial roles"
    ]
  },
  "Music (Singing / Instruments)": {
    careers: ["Music Composer", "Professional Vocalist", "Sound Engineer"],
    courses: ["Music Theory Essentials", "Digital Audio Workstation (DAW) Training", "Instrument Specialization"],
    roadmapSteps: [
      "Achieve certification in your instrument/voice",
      "Learn recording and production software",
      "Perform at live events or build a YouTube presence",
      "Collaborate with labels or independent artists"
    ]
  },
  "Dance & Performing Arts": {
    careers: ["Choreographer", "Professional Dancer", "Theater Producer"],
    courses: ["Contemporary Dance Pedagogy", "Stage Presence & acting", "Choreography Design"],
    roadmapSteps: [
      "Intensify physical training and flexibility",
      "Join a professional dance troupe or theater Group",
      "Create original performances and showcases",
      "Pursue professional certification in Performing Arts"
    ]
  },
  "Sports & Physical Activities": {
    careers: ["Professional Athlete", "Sports Coach", "Physiotherapist"],
    courses: ["Sports Management", "Kinesiology & Physical Education", "Leadership in Coaching"],
    roadmapSteps: [
      "Focus on professional-grade physical conditioning",
      "Enter competitive tournaments and championships",
      "Obtain coaching or physiotherapy certifications",
      "Move towards expert coaching or management roles"
    ]
  },
  "Business & Entrepreneurship": {
    careers: ["Product Manager", "Startup Founder", "Business Analyst"],
    courses: ["Lean Startup Methodology", "Foundations of Marketing", "Financial Management"],
    roadmapSteps: [
      "Identify a problem and research its market",
      "Create a Minimum Viable Product (MVP)",
      "Learn networking and fundraising basics",
      "Scale the business through data-driven growth"
    ]
  },
  "Science & Research": {
    careers: ["Scientific Researcher", "Data scientist", "Biotechnologist"],
    courses: ["Scientific Method & Research Ethics", "Statistical Analysis (R/SPSS)", "Molecular Biology Basics"],
    roadmapSteps: [
      "Focus on strong STEM academic foundations",
      "Participate in laboratory or research projects",
      "Publish findings in journals or competitions",
      "Pursue a Master’s or PhD for advanced research"
    ]
  },
  "Communication & Public Speaking": {
    careers: ["Public Relations Specialist", "Journalist", "Corporate Trainer"],
    courses: ["Advanced Rhetoric & Persuasion", "Journalistic Writing", "Strategic Communication"],
    roadmapSteps: [
      "Join debating societies or public speaking clubs",
      "Practice content writing and storytelling",
      "Internalize audience psychology and presence",
      "Take leadership roles in corporate or media settings"
    ]
  },
  "Social Work & Leadership (Politics / NGO)": {
    careers: ["NGO Director", "Political Consultant", "Community Organizer"],
    courses: ["Human Rights Law", "Non-Profit Management", "Public Policy Analysis"],
    roadmapSteps: [
      "Volunteer for local NGOs or social causes",
      "Lead student or community organizations",
      "Learn policy research and implementation",
      "Run for office or manage social-impact projects"
    ]
  },
  "Media & Film Making": {
    careers: ["Film Director", "Content Creator", "Cinematographer"],
    courses: ["Cinematography & Lighting", "Video Editing (Premiere/Final Cut)", "Screenwriting Essentials"],
    roadmapSteps: [
      "Start creating short films or digital content",
      "Learn technical aspects (Camera/Editing)",
      "Build a showreel of distinct video projects",
      "Pitch projects to production houses/platforms"
    ]
  }
};

const getRecommendations = (topParameters) => {
  const finalCareers = new Set();
  const finalCourses = new Set();
  const roadmapItems = [];

  // Add specialized hybrid logic (Combined Interests)
  const isCiding = topParameters.includes("Coding / Programming");
  const isDesign = topParameters.includes("Design (UI/UX / Graphics)");
  const isRobotics = topParameters.includes("Robotics & AI");

  if (isCiding && isDesign) {
    finalCareers.add("UX Engineer");
    finalCareers.add("Frontend Architect");
  }
  if (isCiding && isRobotics) {
    finalCareers.add("Embedded Systems Engineer");
    finalCareers.add("Automation Architect");
  }

  // Base mapping for all top params
  topParameters.forEach(param => {
    const data = careerMapping[param];
    if (data) {
      data.careers.forEach(c => finalCareers.add(c));
      data.courses.forEach(c => finalCourses.add(c));
      roadmapItems.push(...data.roadmapSteps);
    }
  });

  // Unique roadmap steps (de-duplicate or summarize)
  const roadmapString = Array.from(new Set(roadmapItems))
    .slice(0, 6) // Select first 6 logical steps
    .map((step, index) => `Step ${index + 1}: ${step}`)
    .join('\n');

  return {
    careers: Array.from(finalCareers).slice(0, 5), // Return top 5
    courses: Array.from(finalCourses).slice(0, 5),
    roadmap: roadmapString
  };
};

module.exports = {
  getRecommendations
};

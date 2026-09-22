/* config.js - Site Metadata & Backend (Supabase/LocalStorage) Configuration */

const SITE_CONFIG = {
  name: "Sachchidanand Yadav",
  title: "Machine Learning Intern @ FlyRank AI | CSE Student",
  tagline: "Turning data into decisions, and ideas into working code.",
  email: "snsachidanand784@gmail.com",
  linkedin: "https://linkedin.com/in/784sachchidanandyadav",
  github: "https://github.com/sachchidanand-yadav",
  location: "Greater Delhi Area, India",

  // Supabase Configuration (Replace with your actual Supabase URL and Anon Key in Admin Panel or here)
  supabaseUrl: localStorage.getItem("SY_SUPABASE_URL") || "",
  supabaseKey: localStorage.getItem("SY_SUPABASE_KEY") || "",

  // Fallback initial certificates dataset
  initialCertificates: [
    {
      id: "cert-1",
      title: "Introduction to Generative AI Studio",
      issuer: "Google Cloud / Coursera",
      date: "2025",
      description: "Explored generative AI concepts, prompt engineering, and LLM foundations.",
      badgeColor: "from-blue-500 to-indigo-600"
    },
    {
      id: "cert-2",
      title: "Data Visualization & Analytics",
      issuer: "Kaggle / IBM",
      date: "2025",
      description: "Mastered storytelling through Python visualization libraries Matplotlib and Seaborn.",
      badgeColor: "from-teal-400 to-cyan-500"
    },
    {
      id: "cert-3",
      title: "Getting Started with Basics of Python",
      issuer: "Guvi / SkillUp",
      date: "2024",
      description: "Core data structures, object-oriented principles, and algorithmic thinking in Python.",
      badgeColor: "from-purple-500 to-pink-500"
    },
    {
      id: "cert-4",
      title: "English Language Proficiency Certificate",
      issuer: "EF SET / Institutional",
      date: "2024",
      description: "Advanced professional writing, communication, and presentation skills.",
      badgeColor: "from-emerald-400 to-green-600"
    },
    {
      id: "cert-5",
      title: "Inter-College Debate Competition Award",
      issuer: "HIET Greater Noida",
      date: "2024",
      description: "First runner-up in debate on AI ethics and technology's role in future society.",
      badgeColor: "from-amber-400 to-orange-500"
    }
  ],

  // Fallback initial resume metadata
  initialResume: {
    url: "#",
    filename: "Sachchidanand_Yadav_Resume.pdf",
    lastUpdated: "Sept 2026"
  }
};

// Global Supabase client instance (if configured)
let supabaseClient = null;

function initSupabase() {
  const url = localStorage.getItem("SY_SUPABASE_URL");
  const key = localStorage.getItem("SY_SUPABASE_KEY");
  if (url && key && window.supabase) {
    try {
      supabaseClient = window.supabase.createClient(url, key);
      console.log("Supabase initialized successfully.");
    } catch (err) {
      console.warn("Supabase init error:", err);
    }
  }
}

// Attempt init on load
if (window.supabase) {
  initSupabase();
}

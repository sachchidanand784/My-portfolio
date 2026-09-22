/* chatbot.js - Interactive AI Assistant Widget */

(function () {
  const chatbotHTML = `
    <div class="chatbot-widget" id="chatbot-widget">
      <button class="chatbot-toggle" id="chatbot-toggle" title="Chat with AI Assistant" aria-label="Open AI Assistant Chat">
        <i class="lucide-bot"></i>
      </button>
      
      <div class="chatbot-panel" id="chatbot-panel">
        <div class="chatbot-header">
          <div class="chatbot-info">
            <div class="chatbot-avatar">
              <i class="lucide-sparkles"></i>
            </div>
            <div>
              <div style="font-weight: 700; font-size: 0.95rem;">SY-AI Assistant</div>
              <div style="font-size: 0.75rem; color: #00e676; display: flex; align-items: center; gap: 4px;">
                <span style="width:6px; height:6px; border-radius:50%; background:#00e676; display:inline-block;"></span> Online | Ask about Sachchidanand
              </div>
            </div>
          </div>
          <button id="chatbot-close" style="color: var(--text-muted); font-size: 1.1rem;">
            <i class="lucide-x"></i>
          </button>
        </div>

        <div class="chatbot-messages" id="chat-messages">
          <div class="chat-msg bot">
            👋 Hi there! I'm Sachchidanand's AI Portfolio Assistant. Ask me anything about his ML internships, data projects, tech skills, or education!
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px;" id="chat-chips">
            <button class="tech-chip chat-chip" style="font-size: 0.75rem; padding: 0.25rem 0.6rem;">💼 Experience</button>
            <button class="tech-chip chat-chip" style="font-size: 0.75rem; padding: 0.25rem 0.6rem;">⚡ Skills</button>
            <button class="tech-chip chat-chip" style="font-size: 0.75rem; padding: 0.25rem 0.6rem;">📊 Projects</button>
            <button class="tech-chip chat-chip" style="font-size: 0.75rem; padding: 0.25rem 0.6rem;">✉️ Contact</button>
          </div>
        </div>

        <div class="chatbot-input-area">
          <input type="text" id="chat-input" class="chatbot-input" placeholder="Ask about skills, projects, resume..." />
          <button id="chat-send" class="chatbot-send-btn">
            <i class="lucide-send"></i>
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', chatbotHTML);

  const toggleBtn = document.getElementById('chatbot-toggle');
  const closeBtn = document.getElementById('chatbot-close');
  const panel = document.getElementById('chatbot-panel');
  const sendBtn = document.getElementById('chat-send');
  const input = document.getElementById('chat-input');
  const messagesContainer = document.getElementById('chat-messages');

  toggleBtn.addEventListener('click', () => panel.classList.toggle('open'));
  closeBtn.addEventListener('click', () => panel.classList.remove('open'));

  // Pre-programmed Knowledge Base for QA
  const knowledgeBase = [
    {
      keywords: ["flyrank", "internship", "work", "experience", "job", "aictc", "era"],
      response: "Sachchidanand is currently a **Machine Learning Intern at FlyRank AI** (June 2026–Present). Previously, he was a Data Analyst Intern at AICTE (New Delhi) analyzing education datasets, and a Design Thinking Intern at ERA Foundation (Lucknow, Project Kalam Pragati)."
    },
    {
      keywords: ["skill", "python", "pandas", "machine learning", "ml", "tools", "c", "c++", "seaborn"],
      response: "Sachchidanand specializes in **Python, Pandas, NumPy, Matplotlib, Seaborn, basic Machine Learning models**, along with C, HTML/CSS/JS, and prototyping tools like Tinkercad & Figma."
    },
    {
      keywords: ["project", "airbnb", "netflix", "data analysis"],
      response: "Key projects include:\n1. 🏨 **Airbnb Hotel Booking Analysis**: Analyzing booking patterns, pricing trends, and customer preferences using Python & Pandas.\n2. 🎬 **Netflix Data Analysis**: Viewing trends, content ratings, and genre popularity visualized with Seaborn & Matplotlib."
    },
    {
      keywords: ["education", "college", "degree", "hi-tech", "btech", "cse", "school", "nielit"],
      response: "Sachchidanand is pursuing **B.Tech in Computer Science Engineering (2023–2027)** at Hi-Tech Institute of Engineering & Technology. He also completed his O-Level in Computer from NIELIT (2022–2023)."
    },
    {
      keywords: ["contact", "email", "linkedin", "hire", "message", "reach"],
      response: "You can reach Sachchidanand via email at **snsachidanand784@gmail.com** or connect on LinkedIn at **linkedin.com/in/784sachchidanandyadav**. He is based in Greater Delhi Area, India!"
    },
    {
      keywords: ["resume", "cv", "download"],
      response: "You can click the 'Download Resume' button in the Hero section or Admin panel to get Sachchidanand's latest PDF resume!"
    }
  ];

  function getBotResponse(userMsg) {
    const text = userMsg.toLowerCase();
    for (let item of knowledgeBase) {
      if (item.keywords.some(kw => text.includes(kw))) {
        return item.response;
      }
    }
    return "I'm trained on Sachchidanand's ML internships, Data projects (Airbnb/Netflix), Python skills, and CSE background. Try asking about his skills, experience at FlyRank AI, or projects!";
  }

  function appendMessage(sender, text) {
    const div = document.createElement('div');
    div.className = `chat-msg ${sender}`;
    div.innerHTML = text.replace(/\n/g, '<br/>');
    messagesContainer.appendChild(div);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function handleSend() {
    const text = input.value.trim();
    if (!text) return;

    appendMessage('user', text);
    input.value = '';

    setTimeout(() => {
      const reply = getBotResponse(text);
      appendMessage('bot', reply);
    }, 400);
  }

  sendBtn.addEventListener('click', handleSend);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSend();
  });

  // Handle Quick Chips
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('chat-chip')) {
      const promptText = e.target.textContent.replace(/[^\w\s]/gi, '').trim();
      input.value = promptText;
      handleSend();
    }
  });
})();

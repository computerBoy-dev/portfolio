// === API KEY LOADER ===
let apiKeys = {
  groqKey: "",
  telegramBotToken: "",
  telegramChatId: ""
};

async function loadAPIKeys() {
  try {
    const res = await fetch("api.json");
    const json = await res.json();
    apiKeys = json;
  } catch (err) {
    console.error("❌ Failed to load API keys", err);
  }
}

// === CURSOR AURA FOLLOW ===
const cursorAura = document.querySelector('.cursor-aura');
document.addEventListener('mousemove', (e) => {
  cursorAura.style.left = `${e.clientX}px`;
  cursorAura.style.top = `${e.clientY}px`;
});
document.querySelectorAll('a, button, input, textarea, select, label, .contact-btn, .hover-hide-cursor')
  .forEach(el => {
    el.addEventListener('mouseenter', () => cursorAura.classList.add('hide'));
    el.addEventListener('mouseleave', () => cursorAura.classList.remove('hide'));
  });

// === LOGO FADE ===
function animateLogo(hover) {
  const logoText = document.getElementById("logo-text");
  if (!logoText) return;
  logoText.style.opacity = "0";
  setTimeout(() => {
    logoText.textContent = hover ? "i'm aaryan </>" : "aaryan";
    logoText.style.opacity = "1";
  }, 150);
}

// === TOGGLE CHATBOT ===
async function openChatbot() {
  const overlay = document.getElementById("chatbotOverlay");
  const modal = document.getElementById("chatbotModal");
  const chatBody = document.getElementById("chatBody");

  overlay.classList.add("show");
  setTimeout(() => modal.classList.add("show"), 10);
  chatBody.innerHTML = "";

  const typing = document.createElement("div");
  typing.className = "chatbot-message bot";
  typing.textContent = "Typing...";
  chatBody.appendChild(typing);

  try {
    const greet = await fetchGroqResponse("Give a friendly short greeting message as portfolio chatbot.");
    typing.textContent = greet;
  } catch {
    typing.textContent = "Hi there! I'm Vironica. Ask me anything about Aaryan.";
  }
}

function closeChatbot() {
  document.getElementById("chatbotModal").classList.remove("show");
  document.getElementById("chatbotOverlay").classList.remove("show");
}

// === GROQ CHATBOT FUNCTION ===
async function fetchGroqResponse(userMessage) {
  const apiUrl = "https://api.groq.com/openai/v1/chat/completions";

  const requestData = {
    model: "llama3-70b-8192",
    messages: [
      {
        role: "system",
content: `
You are Vironica AI — a helpful, friendly chatbot created for Aaryan's personal portfolio website.

You speak fluently in Hindi and English (and understand Bhojpuri natively). You represent Aaryan — not just as a developer, but as a passionate, self-driven creator.

Here’s who Aaryan is:
- A high school graduate preparing for college, but already building real-world tech solutions with love and clarity.
- He builds full-stack web apps, AI tools, browser-based games, Firebase-powered mobile apps, and more.
- Aaryan isn't in the rat race — he truly understands engineering, feels it, and crafts with heart. He loves building tools that help real people, especially the common man.
- His philosophy: "Jab tak todega nahi, tab tak chhodega nahi." (I won't stop until I break through.)
- He is a multidisciplinary builder — frontend, backend, games, AI — all from scratch.
- His favorite project is CodeGap: a VS Code-style web IDE with file nesting, tab-based editing, Firestore sync, and real-time preview.
- He also built a Bhagavad Gita AI chatbot and several creative prototypes.

You are his personal tech assistant. 
Your job is to:
- Answer visitor questions about Aaryan’s projects, skills, passions, and future.
- Keep replies friendly, short, clear, and natural (1–3 sentences).
- Stay in character — never talk about how you were built or AI limitations.
- If someone flirts, jokes too much, or goes off-topic: say playfully, “Haha, I’m flattered 😄 but I’m here to talk about Aaryan only!”

You must sound smart, respectful, youthful, and a little witty — just like Aaryan’s vibe.
`.trim()

      },
      {
        role: "user",
        content: userMessage
      }
    ]
  };

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKeys.groqKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(requestData)
  });

  const data = await response.json();
  return data?.choices?.[0]?.message?.content?.trim() || "I'm not sure how to respond to that.";
}

// === SEND MESSAGE ===
async function sendMessage() {
  const input = document.getElementById("chatInput");
  const chatBody = document.getElementById("chatBody");
  const message = input.value.trim();
  if (!message) return;

  const userMsg = document.createElement("div");
  userMsg.className = "chatbot-message user";
  userMsg.textContent = message;
  chatBody.appendChild(userMsg);

  const botMsg = document.createElement("div");
  botMsg.className = "chatbot-message bot";
  botMsg.textContent = "Typing...";
  chatBody.appendChild(botMsg);
  chatBody.scrollTop = chatBody.scrollHeight;

  input.value = "";

  try {
    const response = await fetchGroqResponse(message);
    botMsg.textContent = response;
  } catch {
    botMsg.textContent = "Oops! Something went wrong.";
  }

  chatBody.scrollTop = chatBody.scrollHeight;
}

document.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && document.activeElement.id === "chatInput") {
    sendMessage();
  }
});

const placeholderTexts = [
  "Ask about Aaryan's projects...",
  "What tech stacks does Aaryan use?",
  "Can I see Aaryan's resume?",
  "Tell me about Aaryan's skills...",
  "Who is Aaryan, really?",
  "Has Aaryan done any internships?",
  "Show Aaryan’s certifications...",
  "Which programming languages does Aaryan know?",
  "What makes Aaryan different?",
  "Ask me anything about Aaryan's journey...",
  "What projects is Aaryan most proud of?",
  "Is Aaryan open to collaborations?",
  "Tell me a fun fact about Aaryan...",
  "Does Aaryan build apps or websites?",
  "Can I see Aaryan’s GitHub or LinkedIn?",
  "What’s Aaryan currently working on?",
];

const chatInput = document.getElementById("chatInput");

let shuffledPlaceholders = [...placeholderTexts];
let currentIndex = 0;

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

shuffleArray(shuffledPlaceholders);

setInterval(() => {
  chatInput.setAttribute("placeholder", shuffledPlaceholders[currentIndex]);
  currentIndex++;

  if (currentIndex >= shuffledPlaceholders.length) {
    shuffleArray(shuffledPlaceholders);
    currentIndex = 0;
  }
}, 3000);

// === HERO TEXT ===
async function fetchHeroText() {
  const headingEl = document.getElementById("hero-heading");
  const taglineEl = document.getElementById("hero-tagline");

  headingEl.classList.add("skeleton");
  taglineEl.classList.add("skeleton");

  const requestData = {
    model: "llama3-70b-8192",
    messages: [
      {
        role: "system",
        content: `
          You're a creative AI writing engaging website hero content for Aaryan - a developer who builds websites, AI tools, and smart tech.
          Return two lines:
          - First line: A short, catchy 3-6 word heading that fits a portfolio
          - Second line: A 1-line motivational tagline (max 10 words)
          Use no markdown, no quotes. Keep it clean.
        `.trim()
      },
      {
        role: "user",
        content: "Give me one heading and tagline for hero section. no salutation"
      }
    ]
  };

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKeys.groqKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestData)
    });

    const data = await res.json();
    const lines = data.choices[0].message.content.trim().split("\n");
    if (lines.length >= 2) {
      headingEl.textContent = lines[0];
      taglineEl.textContent = lines[1];
    } else {
      headingEl.textContent = "Crafting digital experiences.";
      taglineEl.textContent = "Building smart stuff with style.";
    }
  } catch (err) {
    console.error("Failed to fetch hero text", err);
    headingEl.textContent = "Crafting digital experiences.";
    taglineEl.textContent = "Building smart stuff with style.";
  }

  headingEl.classList.remove("skeleton");
  taglineEl.classList.remove("skeleton");
}

// === ABOUT TEXT ===
async function fetchAboutText() {
  const line1 = document.getElementById("about-line-1");
  const line2 = document.getElementById("about-line-2");

  [line1, line2].forEach(el => el.classList.add("skeleton"));

  const requestData = {
    model: "llama3-70b-8192",
    messages: [
      {
        role: "system",
        content: `
You're a branding and personal voice AI copywriter helping Aaryan present himself on his portfolio website.

Reference:
Aaryan is a multidisciplinary developer who builds immersive games, responsive websites, AI systems, mobile apps, and smart IoT devices — all to solve real-world problems creatively.

Generate exactly 2 full-length paragraphs describing Aaryan's personality, skills, passion, and work.

Do NOT include any intro like “Here are two paragraphs…” or formatting hints. Just clean, natural text. No quotes. No headings. No list.
        `.trim()
      },
      {
        role: "user",
        content: "Write 2 clean paragraphs for Aaryan's About section. No formatting or intro."
      }
    ]
  };

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKeys.groqKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestData)
    });

    const data = await res.json();
    const paragraphs = data.choices[0].message.content.trim().split(/\n\s*\n/);

    if (paragraphs.length >= 2) {
      line1.textContent = paragraphs[0];
      line2.textContent = paragraphs[1];
    } else {
      line1.textContent = "Aaryan builds creative solutions — from AI to immersive UI — with a deep passion for technology.";
      line2.textContent = "His journey is driven by curiosity, purpose, and a desire to turn smart ideas into powerful digital products.";
    }
  } catch (err) {
    console.error("Failed to fetch about text", err);
    line1.textContent = "Aaryan builds creative solutions — from AI to immersive UI — with a deep passion for technology.";
    line2.textContent = "His journey is driven by curiosity, purpose, and a desire to turn smart ideas into powerful digital products.";
  }

  [line1, line2].forEach(el => el.classList.remove("skeleton"));
}



// === CONTACT FORM (TELEGRAM) ===
const form = document.getElementById('telegramForm');
const thankYou = document.getElementById('thankYou');

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const phone = form.phone.value.trim();
  const message = form.message.value.trim();

  const text = `
*Portfolio Contact Form Message*

*Name:* ${name}
*Email:* ${email}
*Phone:* ${phone}
*Message:* ${message}

Thank You.
  `;

  fetch(`https://api.telegram.org/bot${apiKeys.telegramBotToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: apiKeys.telegramChatId,
      text: text,
      parse_mode: 'Markdown'
    })
  })
  .then(response => {
    if (response.ok) {
      form.style.display = 'none';
      thankYou.style.display = 'block';
    } else {
      alert('❌ Failed to send message.');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('⚠️ Network error. Try again.');
  });
});

// === INIT ===
window.addEventListener("DOMContentLoaded", async () => {
  await loadAPIKeys();
  fetchHeroText();
  fetchAboutText();
});

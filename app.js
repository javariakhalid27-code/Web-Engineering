// Dynamic CSS setup jo aapne spinner aur markdown ke liye kiya tha
const styleTag = document.createElement("style");
styleTag.innerHTML = `
  @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  .markdownContent h1, .markdownContent h2, .markdownContent h3 { color: #38bdf8; margin-top: 20px; margin-bottom: 10px; font-weight: 600; }
  .markdownContent ul, .markdownContent ol { padding-left: 20px; margin-bottom: 15px; }
  .markdownContent li { margin-bottom: 8px; color: #cbd5e1; }
  .markdownContent strong { color: #f8fafc; font-weight: 600; }
`;
document.head.appendChild(styleTag);

// Global State management variables
let subject = "";
let topic = "";
let time = "";
let loading = false;

// UI Elements catch karna
const subjectInput = document.getElementById('subjectInput');
const topicInput = document.getElementById('topicInput');
const timeInput = document.getElementById('timeInput');
const generateBtn = document.getElementById('generateBtn');
const resultCard = document.getElementById('resultCard');
const loadingState = document.getElementById('loadingState');
const markdownContent = document.getElementById('markdownContent');

// Input values ko update karne ke liye event listeners
subjectInput.addEventListener('input', (e) => subject = e.target.value);
topicInput.addEventListener('input', (e) => topic = e.target.value);
timeInput.addEventListener('input', (e) => time = e.target.value);

// Main Generate Plan Function
generateBtn.addEventListener('click', async () => {
    if (!subject || !topic || !time) {
        alert("Please fill all fields");
        return;
    }

    loading = true;
    
    // UI update for loading state
    generateBtn.disabled = true;
    generateBtn.innerHTML = `<span style="display: flex; justify-content: center; align-items: center; gap: 10px;">
        <span style="width: 18px; height: 18px; border: 3px solid rgba(15, 23, 42, 0.2); border-top: 3px solid #0f172a; border-radius: 50%; animation: spin 1s linear infinite;"></span> Generating Plan...
    </span>`;
    
    resultCard.style.display = "block";
    loadingState.style.display = "block";
    markdownContent.style.display = "none";
    markdownContent.innerHTML = "";

    try {
        // 🚀 Yahan humne localhost hata kar aapka asli live backend daal diya hai!
        const response = await fetch("https://web-engineering-three.vercel.app/api/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ subject, topic, time }),
        });

        const data = await response.json();
        
        // Markdown formatting apply karne ka simple function
        if (data.plan) {
            markdownContent.innerHTML = formatMarkdown(data.plan);
        } else {
            markdownContent.innerHTML = "❌ Plan nahi ban saka, dobara koshish karein.";
        }
        
        loadingState.style.display = "none";
        markdownContent.style.display = "block";

    } catch (error) {
        console.log("Frontend Error:", error);
        markdownContent.innerHTML = "❌ Backend connection error. Please try again.";
        loadingState.style.display = "none";
        markdownContent.style.display = "block";
    } finally {
        loading = false;
        generateBtn.disabled = false;
        generateBtn.innerHTML = "Generate Plan 🚀";
    }
});

// Simple markdown formatter function (ReactMarkdown ka maza simple JavaScript mein)
function formatMarkdown(text) {
    return text
        .replace(/### (.*?)\n/g, '<h3>$1</h3>')
        .replace(/## (.*?)\n/g, '<h2>$1</h2>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\* (.*?)\n/g, '<li>$1</li>')
        .replace(/- (.*?)\n/g, '<li>$1</li>')
        .replace(/\n/g, '<br>');
}

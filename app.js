const styleTag = document.createElement("style");
styleTag.innerHTML = `
  @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  .markdownContent h1, .markdownContent h2, .markdownContent h3 { color: #38bdf8; margin-top: 20px; margin-bottom: 10px; font-weight: 600; }
  .markdownContent ul, .markdownContent ol { padding-left: 20px; margin-bottom: 15px; }
  .markdownContent li { margin-bottom: 8px; color: #cbd5e1; }
  .markdownContent strong { color: #f8fafc; font-weight: 600; }
`;
document.head.appendChild(styleTag);

let subject = "";
let topic = "";
let time = "";
let loading = false;

const subjectInput = document.getElementById('subjectInput');
const topicInput = document.getElementById('topicInput');
const timeInput = document.getElementById('timeInput');
const generateBtn = document.getElementById('generateBtn');
const resultCard = document.getElementById('resultCard');
const loadingState = document.getElementById('loadingState');
const markdownContent = document.getElementById('markdownContent');

subjectInput.addEventListener('input', (e) => subject = e.target.value);
topicInput.addEventListener('input', (e) => topic = e.target.value);
timeInput.addEventListener('input', (e) => time = e.target.value);

generateBtn.addEventListener('click', async () => {
    if (!subject || !topic || !time) {
        alert("Please fill all fields");
        return;
    }

    loading = true;
    generateBtn.disabled = true;
    generateBtn.innerHTML = `<span style="display: flex; justify-content: center; align-items: center; gap: 10px;">
        <span style="width: 18px; height: 18px; border: 3px solid rgba(15, 23, 42, 0.2); border-top: 3px solid #0f172a; border-radius: 50%; animation: spin 1s linear infinite;"></span> Generating Plan...
    </span>`;
    
    resultCard.style.display = "block";
    loadingState.style.display = "block";
    markdownContent.style.display = "none";
    markdownContent.innerHTML = "";

    try {
        // 🚀 Aapka exact live Vercel backend route connect kar diya hai
        const response = await fetch("https://web-engineering-project-7r7v.vercel.app/generate-plan", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ subject, topic, time }),
        });

        const data = await response.json();
        
        // Agar response data.result mein aa raha hai to use check karein
        const planText = data.result || data.plan;
        
        if (planText) {
            markdownContent.innerHTML = formatMarkdown(planText);
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

function formatMarkdown(text) {
    return text
        .replace(/### (.*?)\n/g, '<h3>$1</h3>')
        .replace(/## (.*?)\n/g, '<h2>$1</h2>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\* (.*?)\n/g, '<li>$1</li>')
        .replace(/- (.*?)\n/g, '<li>$1</li>')
        .replace(/\n/g, '<br>');
}

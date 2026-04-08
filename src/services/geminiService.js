import axios from "axios";

const GEMINI_API_KEY = "AIzaSyBuFV8c4egV_incFWiKi3xnLe4s54ND6qk";

const GEMINI_URL =
    "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent";

async function callGemini(prompt) {
    try {
        const response = await axios.post(
            `${GEMINI_URL}?key=${GEMINI_API_KEY}`,
            {
                contents: [
                    {
                        parts: [{ text: prompt }]
                    }
                ]
            },
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        return response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    } catch (error) {
        console.log("Gemini API Error:", error.response?.data || error.message);
        return "AI service unavailable right now.";
    }
}

export const geminiService = {
    async analyzeHealthReport(symptoms, patientInfo) {

        const prompt = `
You are ASHA AI health assistant for rural India.

Patient:
Age: ${patientInfo?.age || "Not specified"}
Gender: ${patientInfo?.gender || "Not specified"}
Location: ${patientInfo?.state || "India"}

Symptoms:
${symptoms}

Provide:
1. Possible conditions
2. Immediate care advice
3. Whether doctor visit is urgent
4. Home remedies
5. Recommended facility (PHC / CHC / District Hospital)
`;

        return callGemini(prompt);
    }
};
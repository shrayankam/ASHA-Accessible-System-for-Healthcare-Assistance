import axios from "axios";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

const GEMINI_URL =
    "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent";


// 🔹 Gemini API call
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

        let text =
            response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
            "कोई उत्तर प्राप्त नहीं हुआ।";

        // remove unwanted formatting
        text = text.replace(/\*\*/g, "");

        return text;

    } catch (error) {
        console.log("Gemini API Error:", error.response?.data || error.message);
        return "AI सेवा अभी उपलब्ध नहीं है। कृपया बाद में प्रयास करें।";
    }
}


// 🔹 Firestore se ASHA worker fetch
async function getAshaWorker() {
    try {
        const querySnapshot = await getDocs(collection(db, "asha_workers"));

        const workers = [];

        querySnapshot.forEach((doc) => {
            workers.push(doc.data());
        });

        if (workers.length > 0) {
            const randomWorker =
                workers[Math.floor(Math.random() * workers.length)];
            return randomWorker;
        }

        return null;

    } catch (error) {
        console.log("Error fetching ASHA worker:", error);
        return null;
    }
}


export const geminiService = {

    async analyzeHealthReport(symptoms, patientInfo) {

        const prompt = `
You are ASHA AI, a health assistant supporting rural communities in India.

Patient Details:
Age: ${patientInfo?.age || "Not specified"}
Gender: ${patientInfo?.gender || "Not specified"}
Location: ${patientInfo?.state || "India"}

Symptoms:
${symptoms}

Provide health guidance in clear and simple Hindi.

Structure the response like this:

सम्भावित समस्या:
लक्षणों के आधार पर क्या समस्या हो सकती है, संक्षेप में बताएं।

क्या करें:
अभी मरीज को क्या करना चाहिए, सरल सलाह दें।

डॉक्टर की आवश्यकता:
बताएं कि डॉक्टर को दिखाना जरूरी है या नहीं।

घरेलू उपाय:
1 या 2 सुरक्षित घरेलू उपाय बताएं।

स्वास्थ्य केंद्र:
जरूरत होने पर PHC, CHC या जिला अस्पताल जाने की सलाह दें।

उत्तर छोटा और साफ रखें। लंबे पैराग्राफ न लिखें।
Avoid symbols like **.
`;

        // 🔹 Gemini response
        const aiResponse = await callGemini(prompt);

        // 🔹 ASHA worker fetch
        const worker = await getAshaWorker();

        let finalResponse = aiResponse;

        if (worker) {
            finalResponse += `

ASHA/Doctor कार्यकर्ता संपर्क:
${worker.name} - ${worker.phone}`;
        }

        return finalResponse;
    }
};
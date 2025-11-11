import axios from "axios";

const MODEL = "gemini-2.5-flash";
const API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/" +
  MODEL +
  ":generateContent";

const generateAiSummary = async (req, res) => {
  try {
    const { diagnosis, doctorName } = req.body;

    if (!diagnosis || typeof diagnosis !== "string") {
      return res.status(400).json({ error: "Diagnosis must be a string!" });
    }
    if (!doctorName || typeof doctorName !== "string") {
      return res.status(400).json({ error: "doctorName must be a string!" });
    }

    const prompt = `
      Write a 3, friendly, and reassuring paragraph medical summary for a patient 
      diagnosed with "${diagnosis}". Mention the doctor by name ("${doctorName}"). 
      Keep it concise and readable, like this example:

      "This patient has been following up regularly for body pain. Condition appears stable. Continued medication and follow-up with Dr. Rafey is recommended."

      Include a bit more detail if needed, but do NOT generate a full letter. Output atleast three paragraph.

      - Mention the doctor by name: "${doctorName}".
      - Do NOT include any placeholders like [object Object] or undefined.
      - Output should be suitable to read as part of a PDF report.
    `;

    const response = await axios.post(
      `${API_URL}?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      }
    );

    const summary =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      "No response from Gemini";

    res.json({ diagnosis, doctorName, summary });
  } catch (error) {
    console.error("Gemini API Error:", error.response?.data || error.message);
    res
      .status(500)
      .json({ error: "Failed to generate summary from Gemini API." });
  }
};

export default generateAiSummary;

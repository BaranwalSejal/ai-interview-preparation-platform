import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [role, setRole] = useState("");
  const [skills, setSkills] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const generateQuestions = async () => {
    if (!role || !skills) {
      alert("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/generate-questions",
        {
          role,
          skills,
        }
      );

      setQuestions(response.data.questions);
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="container">
        <h1>AI Interview Preparation Platform</h1>

        <p className="subtitle">
          Generate personalized interview questions based on your role and
          skills.
        </p>

        <input
          type="text"
          placeholder="Enter Role (e.g. Java Developer)"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />

        <input
          type="text"
          placeholder="Enter Skills (e.g. Java, OOPs, DSA)"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
        />

        <button onClick={generateQuestions}>
          {loading ? "Generating..." : "Generate Questions"}
        </button>

        {questions.length > 0 && (
          <div className="questions-section">
            <h2>Generated Questions</h2>

            {questions.map((q, index) => (
              <div className="question-card" key={index}>
                {q}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
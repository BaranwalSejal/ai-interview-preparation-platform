import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [role, setRole] = useState("");
  const [skills, setSkills] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() =>{
    const savedHistory = localStorage.getItem("interviewHistory");

    console.log("Saved history:",
      savedHistory);
    if(savedHistory){
      setHistory(JSON.parse(savedHistory));
    }
  },[]);

  useEffect(()=>{

    console.log("Saving History:",
      history);
    localStorage.setItem(
      "interviewHistory",
      JSON.stringify(history)
    );
  },[history]);

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
      setScore(null);
      setAnswer("");
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyQuestion = (question) => {
    navigator.clipboard.writeText(question);
    alert("Question copied!");
  };

  const evaluateAnswer = () => {
    if (!answer.trim()) {
      alert("Please enter an answer.");
      return;
    }

    const answerLength = answer.trim().length;

    let generatedScore;
    let generatedFeedback;

    if(answerLength < 50){
      generatedScore = 4;

      generatedFeedback ={
        strengths: [
          "Answer is concise."
        ],
        improvements:[
          "Add more technical details",
          "Explain concepts more clearly"
        ]   
      };
    }
    else if(answerLength < 150){
      generatedScore = 7

      generatedFeedback ={
        strengths:[
          "Good attempt",
          "Some technical explanatio included"
        ],
        improvements:[
          "Add examples",
          "Expand the explanation"
        ]
      };
    }
    else{
      generatedScore = 9;

      generatedFeedback = {
        strengths: [
          "Detailed Answer",
          "Good explanation depth"
        ],
        improvements:[
          "Add industry examples",
          "Improve answer structure further"
        ]
      };
    }

    setScore(generatedScore);
    setFeedback(generatedFeedback);

    setHistory((prevHistory) =>[
      {
        role,
        score: generatedScore,
      date: new Date().toLocaleString(),
      },
      ...prevHistory,
    ]);
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

        <button
          onClick={generateQuestions}
          disabled={loading}
          className={loading ? "loading" : ""}
        >
          {loading ? "Generating..." : "Generate Questions"}
        </button>

        {questions.length > 0 && (
          <div className="questions-section">
            <h2>Generated Questions ({questions.length})</h2>

            {questions.map((q, index) => (
              <div className="question-card" key={index}>
                <div className="question-header">
                  <strong>Q{index + 1}</strong>

                  <button
                    className="copy-btn"
                    onClick={() => copyQuestion(q)}
                  >
                    📋 Copy
                  </button>
                </div>

                <p>{q}</p>
              </div>
            ))}

            <textarea
              placeholder="Write your answer here..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            ></textarea>

            <button onClick={evaluateAnswer}>
              Evaluate Answer
            </button>

            {score && (
              <div className="score-card">
                <h3>Interview Score: {score}/10</h3>
               <h4>Strengths</h4>
            <ul>
              {feedback?.strengths.map((item, index) => (
                <li key={index}>✔ {item}</li>
              ))}
            </ul>

             <h4>Areas for Improvement</h4>
            <ul>
              {feedback?.improvements.map((item, index) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
          </div>
                    )}

            {history.length > 0 && (
              <div className="history-section">
                <h2>Interview History</h2>

                {history.map((item, index) =>(
                <div className="history-card" key = {index}>
                  <h4>{item.role}</h4>

                  <p> ⭐ Score: {item.score}/10</p>

                  <small>{item.date}</small>
                </div>  
                ))}
              </div>
            )}

           
                  </div>
                )}
              </div>
            </div>
          );
        }

        export default App;
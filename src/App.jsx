import {useState} from 'react';
import axios from 'axios';

function App() {
  const [role, setRole] = useState("");
  const [skills, setSkills] = useState("");
  const [questions, setQuestions] = useState([]);

  const generateQuestions = async () => {

    const response = await axios.post("http://localhost:5000/generate-questions", {
      role,
      skills
    });

    setQuestions(response.data.questions);
  };

  return(
    <div>
    <h1>AI Interview Preparation Platform</h1>

    <input type="text" placeholder = "Enter role" value ={role} onChange={(e) => setRole(e.target.value)} />
    <br></br>

    <input type="text" placeholder ="Enter skills" value={skills} onChange={(e) => setSkills(e.target.value)} />
    <br></br>

    <button onClick={generateQuestions}>Generate Questions</button>
    
    <ul>
      {questions.map((q,index) =>(
        <li key={index}>{q}</li>
      ))}
    </ul>

    </div>
  );
}
export default App;
 
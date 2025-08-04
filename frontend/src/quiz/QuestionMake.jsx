import "react"
import {useState} from "react"
import {Mcq} from "./Mcq.jsx"
import { useApi } from "../utils/api.js"

export function QuestionMake() {
    //syntax: question set to null, setQuestion is a function to update question
    const [question, setQuestion] = useState(null)
    const [topic, setTopic] = useState("Chem/Phys")
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const {makeRequest} = useApi()
    
    //function to generate a question
    const generateQuestion = async () => {
        //request is loading, clear previous errors
        setIsLoading(true)
        setError(null)
        try {
            //calls /api/generate-question using makeRequest (await pauses execution until the request returns data)
            const data = await makeRequest('generate-question', {
                method: 'POST',
                body: JSON.stringify({topic})
            })
            setQuestion(data)
        } catch (e) {
            setError('Failed to generate challenge')
        } finally {
            setIsLoading(false)
        }
    }

    return <div className = "question-container">
        <h2>Generate MCAT Question!</h2>

        <div className = "topic-selector">
            <label htmlFor = "topic">Select Topic</label>
            <select id = "topic" value = {topic} onChange = {(e) => setTopic(e.target.value)} disabled = {isLoading}>
                <option value = "Chem/Phys"> Chem/Phys </option>
                <option value = "CARS"> CARS </option>
                <option value = "Bio/Biochem"> Bio/Biochem </option>
                <option value = "Psych/Soc"> Psych/Soc </option>
            </select>
        </div>

        <button onClick = {generateQuestion} className = "generate-button">{isLoading ? "Generating Question" : "Generate Question"}</button>

        {error && <div className="error-message">
            <p>{error}</p>
        </div>}

        {question && <Mcq key = {question.id} Mcq question = {question}/>}

    </div>
}
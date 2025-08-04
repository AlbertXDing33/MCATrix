import "react"
import {useState} from "react"

//represents one individual question
export function Mcq({question, explanation = false}) {
    //safety if question does have options
    if (!question || !question.options) return <div>Invalid question data</div>

    const [selectedAnswer, setSelectedAnswer] = useState(null)
    const [showExplanation, setShowExplanation] = useState(explanation)

    //Want to check if options are a string to parse into JSON
    const options = typeof question.options === "string" ? JSON.parse(question.options) : question.options

    const handleOptionSelect = (index) => {
        if (selectedAnswer !== null) return;
        setSelectedAnswer(index)
        setShowExplanation(true)
    }

    const getOptionClass = (index) => {
        //User has not selected an option
        if (selectedAnswer === null) return "option"

        //If the index is = correct answer
        if (index === question.correct_answer_id) {
            return "option correct"
        }

        //If the selected Option is equal to an index that is wrong
        if (selectedAnswer === index && index !== question.correct_answer_id) {
            return "option incorrect"
        }
        return "option"
    }

    return <div className = "question-display">
        <h4>{question.overview}</h4>
        <p><strong>Topic</strong>: {question.topic}</p>
        <p className = "question-title">{question.title}</p>
        <div className = "options">
            {options.map((option, index) => (
                <div className = {getOptionClass(index)} key = {index} onClick={() => handleOptionSelect(index)}>
                    {option}
                </div>
            ))}
        </div>
        
        {/*display the explanation if showExplanation is True and an answer is selected */}
        {showExplanation && selectedAnswer !== null && 
            (<div className = "explanation">
                <h5>Explanation</h5>
                <p>{question.explanation}</p>
            </div>)}
    </div>
}
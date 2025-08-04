import "react"
import { useState, useEffect } from "react"
import { Mcq } from "../quiz/Mcq.jsx"
import { useApi } from "../utils/api.js"

export function History() {
    const [history, setHistory] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const {makeRequest} = useApi()
    const [expandedId, setExpandedId] = useState(null) //for collapsible questions

    //As soon as History component mounts, call fetchHistory
    useEffect(() => {
        fetchHistory()
    }, [])

    const fetchHistory = async () => {
        setIsLoading(true)
        setError(null)
        try {
            const data = await makeRequest('history')
            setHistory(data.questions)
        } catch (e) {
            setError('Failed to load history.')
        } finally {
            setIsLoading(false)
        }
    }

    const deleteHistory = async () => {
        setIsLoading(true)
        setError(null)
        try {
            const data = await makeRequest('delete-history', {method: 'POST'})
            setHistory([])
        } catch (e) {
            setError('Failed to delete history.')
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return <div className = "loading"> Loading History </div>
    }

    if (error) {
        return <div className = "error-message">
                <p>{error}</p>
                <button onCLick = {fetchHistory}>Retry</button>
            </div>
    }

    {/*If no history, say No Question History otherwise, render all multiple choice questions*/}
    return <div className = "history">
        <h3>History</h3>
        <button onClick = {deleteHistory} className="clear-history-button"> Clear History </button>
        {history.length === 0 ? (<p>No Question History</p>) : (
        <div className="history-list">
            {/*Loops through each question in history, wrapping each question with a div*/}
            {history.map((question) => (
                <div key={question.id} className = "history-bar">
                    {/*if expandedId is null, set it to the question id and display the Mcq question. Otherswise, display the overview and dateCreated.*/}
                    <div className = "history-summary" onClick={() => setExpandedId(expandedId === question.id ? null : question.id)}>
                        <strong>{question.overview}</strong>
                        <span className = "history-date">{new Date(question.dateCreated).toLocaleString()}</span>
                    </div>
                    {/**conditionally show the full question */}
                    {expandedId === question.id && (<Mcq question={question} showExplanation />)}
                </div>
            ))}
        </div>
        )}
    </div>
}
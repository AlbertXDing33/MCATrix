from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel
from sqlalchemy.orm import Session
import json
from ..database.db import (create_question, get_all_user_questions, delete_history_for_user)
from ..authentication.authenticate import authenticate_and_get_user_details
from ..database.tables import get_db
from ..AI.ai_generator import generate_question_AI
import traceback
from fastapi import status
from fastapi.responses import JSONResponse

#Allows code to be module and have different routes in different files
router = APIRouter()

#gets user history
@router.get('/history')
async def history(request: Request, db : Session = Depends(get_db)):
    user_details = authenticate_and_get_user_details(request)
    userID = user_details.get('user_id')
    questions = get_all_user_questions(db, userID)
    return {'questions': questions}

#Define expected input for generate-question post request
class QuestionRequest(BaseModel):
    topic : str

    class Config:
        json_schema_extra = {'example': {'topic' : 'Chem/Phys'}}

#deletes user history
@router.post('/delete-history')
async def delete_history(request: Request, db : Session = Depends(get_db)):
    user_details = authenticate_and_get_user_details(request)
    userID = user_details.get('user_id')
    delete_history_for_user(db, userID)
    return JSONResponse(content={"message": "History deleted successfully."}, status_code=status.HTTP_200_OK)

#Generates a question
@router.post('/generate-question')
async def generate_question(request: QuestionRequest, request_obj: Request, db: Session = Depends(get_db)):
    try:
        user_details = authenticate_and_get_user_details(request_obj)
        userID = user_details.get('user_id')
        question_data = generate_question_AI(request.topic)

        new_question = create_question(
            db = db,
            topic = request.topic,
            userCreated = userID,
            overview = question_data['overview'],
            title = question_data['title'],
            options = json.dumps(question_data['options']),
            correct_answer_id = question_data['correct_answer_id'],
            explanation = question_data['explanation']
        )
        
        db.commit() #verify that this is needed
        
        return {
            'id': new_question.id,
            'overview': new_question.overview,
            'topic': request.topic,
            'title': new_question.title,
            'options': json.loads(new_question.options),
            'correct_answer_id': new_question.correct_answer_id,
            'explanation': new_question.explanation,
        }
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=400, detail=f"Internal Error: {str(e)}")
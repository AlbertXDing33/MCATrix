import os
import json
from openai import OpenAI
from typing import Dict, Any

#initiate OpenAI client
client = OpenAI(api_key = os.getenv('OPENAI_API_KEY'))

def generate_question_AI(topic) -> Dict[str, Any]:
    prompt = """You are an expert Medical College Admission Test(MCAT) question writer.
    Your task is to generate a sample MCAT question with four muliple choice answers.
    Each question should closely follow the specified topic, as each topic given will be an
    official category on the MCAT. Make sure the options are plausible but with only one clearly
    correct answer if somebody has studied. Also generate a overview of the question which is less than
    6 words.

    For Chem/Phys: Focus on applying chemistry or physics concepts (e.g., thermodynamics, kinematics) to biological or laboratory scenarios.
    For CARS: Write a question based on a short passage that tests reading comprehension, reasoning, and inference. Focus heavily on scientific research, experimental data, or detailed theoretical frameworks.
    For Bio/Biochem: Emphasize molecular biology or biochemistry concepts, such as enzyme kinetics, metabolic pathways, or gene expression.
    For Psych/Soc: Test foundational concepts in psychology or sociology, such as behavior, mental health, social structures, or research methods.

    Also write an explanation clearly explaining which of the four multiple choice answers is correct and why.

    Return the question in the following JSON format:
    {   
        "overview": "The question overview",
        "title": "The question title",
        "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
        "correct_answer_id": 0, //Index of correct answer (0-3)
        "explanation": "Detailed explanation of why the correct answer is right"
    }
    """
    try:
        response = client.chat.completions.create(
            model = 'gpt-4.1-mini-2025-04-14',
            messages = [
                #Sets behavior of the model to be an MCAT question writer 
                {'role' : 'system', 'content': prompt},
                #Sets the task of the model to be generating a {topic} MCAT question
                {'role': 'user', 'content': f"Generate a {topic} MCAT question"}
            ],
            response_format = {'type': 'json_object'},
            temperature = 0.65,
            n=1 #only want one plausible response
        )

        #response.choices is a list
        content = response.choices[0].message.content
        question_data = json.loads(content)

        #verify all required fields
        required_fields = ['overview', 'title', 'options', 'correct_answer_id', 'explanation']
        for field in required_fields:
            if field not in question_data:
                raise ValueError(f'Missing required field: {field}')
        
        return question_data
    
    except Exception as e:
        return str(e)
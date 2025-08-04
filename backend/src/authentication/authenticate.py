#File is for backend authentication logic using Clerk API
from fastapi import HTTPException
import os #access .env
from dotenv import load_dotenv
from clerk_backend_api import Clerk, AuthenticateRequestOptions

#looking .env and gives access to its variables
load_dotenv()

#creates instance of Clerk Client and uses secret key to authorize API requests to Clerk
clerksdk = Clerk(bearer_auth = os.getenv("CLERK_SECRET_KEY"))

#takes request sent from frontend to backend to verify the user with Clerk
def authenticate_and_get_user_details(request):
    try:
        #looks at request, finds JWT token, and use secret key to check if request is valid
        #requestState contains: is_signed_in, session_id, user_id, payload, and token
        requestState = clerksdk.authenticate_request(request, AuthenticateRequestOptions())
        #If not signed in, send error
        if not requestState.is_signed_in:
            raise HTTPException(status_code = 401, detail = "Invalid token")
        
        #JWT token that was sent can be decoded, user is under the field "sub"
        userID = requestState.payload.get("sub")

        return {"user_id": userID}

    except Exception as e:
        raise HTTPException(status_code = 500, detail = str(e))
from src.app import app

#True if running server.py directly from main
if __name__ == "__main__":
    import uvicorn
    
    #Starts uvicorn server to host this FastAPI app at port 8000
    #Accessible on local network
    uvicorn.run(app, host = "0.0.0.0", port = 8000)
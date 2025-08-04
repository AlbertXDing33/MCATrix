#Python classes that represent SQL tables
from sqlalchemy import Column, Integer, String, DateTime, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os

#adjust to connect to cloud
#Creates the SQLAlchemy database engine (handles connections to the DB)
postgresql_pw = os.getenv('POSTGRESQL_PW')
engine = create_engine(f'postgresql://postgres:{postgresql_pw}@localhost:5432/MCATrix', echo=True)

#Creates base class for models(which define tables)
Base = declarative_base()

#Questions database
class Questions(Base):
    __tablename__ = 'questions'

    id = Column(Integer, primary_key = True)
    topic = Column(String, nullable = False)
    dateCreated = Column(DateTime, default = datetime.now)
    userCreated = Column(String, nullable = False)
    overview = Column(String, nullable = False)
    title = Column(String, nullable = False)
    options = Column(String, nullable = False)
    correct_answer_id = Column(Integer, nullable = False)
    explanation = Column(String, nullable = False)

#Uses engine to actually create SQL tables defined above
Base.metadata.create_all(engine)

# Creates a session factory that gives a new DB session connected to the engine
SessionLocal = sessionmaker(autocommit = False, autoflush = False, bind = engine)

#yields a session for use in route handlers and auto closes the database connection after finishing
#prevents resource leaks
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# HTTP SERVER


import json
from threading import Thread
from typing import List

from flask import Flask, request
from flask_compress import Compress
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

from models import SimulateRequest
from simulator import Simulator
from store import QRangeStore


class Base(DeclarativeBase):
    pass


############################## Application Configuration ##############################

app = Flask(__name__)
CORS(app, origins=['http://localhost:3030'])

compress = Compress()
compress.init_app(app)

db = SQLAlchemy(model_class=Base)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
db.init_app(app)


############################## Database Models ##############################


class Simulation(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    data: Mapped[str]


with app.app_context():
    db.create_all()


############################## API Endpoints ##############################


@app.get('/')
def health():
    return '<p>Sedaro Nano API - running!</p>'


@app.get('/simulation')
def get_data():
    limit = request.args.get('limit')

    simulation: List[Simulation] = (
        Simulation.query.order_by(Simulation.id.desc()).limit(limit=int(limit)).all()
    )

    return [json.loads(s.data) for s in simulation]


@app.post('/simulation')
def simulate():
    limit = request.args.get('limit')

    payload = SimulateRequest(request.get_json())
    if not payload:
        print('failed to parse json from request')
        return 'bad request', 400

    # Create store and simulator
    simulator = Simulator(
        store=QRangeStore(),
        init=payload,
    )

    # Run simulation
    simulation_data = simulator.simulate()

    # Don't hold up response with commit to DB, for speed. Would not do this if strong consistency is required in the system, but figured the entire simulation should fail if it can't commit in a real world situation.
    for _ in range(0, int(limit), 1):
        Thread(target=session_commit, args=(Simulation(data=simulation_data),)).start()

    return ''


def session_commit(simulation: Simulation):
    with app.app_context():
        db.session.add(simulation)
        db.session.commit()

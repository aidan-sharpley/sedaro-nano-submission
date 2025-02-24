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
    # Get most recent simulation from database
    simulation: List[Simulation] = (
        Simulation.query.order_by(Simulation.id.desc()).limit(2).all()
    )

    print('hm')
    print([s.data for s in simulation])
    print(len([s.data for s in simulation]))

    return [json.loads(s.data) for s in simulation]


@app.post('/simulation')
def simulate():
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
    Thread(target=session_commit, args=(Simulation(data=simulation_data),)).start()

    return app.response_class(response=simulation_data, mimetype='application/json')


def session_commit(simulation: Simulation):
    with app.app_context():
        db.session.add(simulation)
        db.session.commit()

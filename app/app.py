# HTTP SERVER


import json
from typing import List

from flask import Flask, request
from flask_compress import Compress
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

from models import Body, SimulateRequest
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

    # Run batch of simulations with additional increments
    for i in range(0, int(limit), 1):
        payload.Body1 = increment_input(payload.Body1, payload.Batch, i)
        payload.Body2 = increment_input(payload.Body2, payload.Batch, i)

        # Create store and simulator
        simulator = Simulator(
            store=QRangeStore(),
            init=payload,
        )

        # Run simulation
        simulation_data = simulator.simulate()

        # Roll up sim runs
        db.session.add(Simulation(data=simulation_data))

    # Return after commit so we know exactly when to refresh with the hacky refresh workaround in the UI.
    db.session.commit()

    return ''


def increment_input(input: Body, incr: Body, idx: int):
    return Body(
        agentId=input.agentId,
        x=input.x + (incr.x * idx),
        y=input.y + (incr.y * idx),
        z=input.z + (incr.z * idx),
        vx=input.vx + (incr.vx * idx),
        vy=input.vy + (incr.vy * idx),
        vz=input.vz + (incr.vz * idx),
        mass=input.mass + (incr.mass * idx),
    )

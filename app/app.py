# HTTP SERVER

import json

from flask import Flask, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

from models import Body, LegacySimulateRequest
from simulator import Simulator
from store import QRangeStore


class Base(DeclarativeBase):
    pass


############################## Application Configuration ##############################

app = Flask(__name__)
CORS(app, origins=['http://localhost:3030'])

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
    simulation: Simulation = Simulation.query.order_by(Simulation.id.desc()).first()
    return simulation.data if simulation else []


@app.post('/simulation')
def simulate():
    try:
        json_object = request.get_json()
        if not json_object:
            print('failed to parse due to empty request')
            return 'bad request', 400

        # payloadDict = json.loads(payload)

        payload = LegacySimulateRequest(
            Body1=Body(**json_object['Body1']), Body2=Body(**json_object['Body2'])
        )

        print('wakka wakka')
        print(payload.Body1.id)
        print(type(payload.Body1))

    except Exception as e:
        print(f'failed to parse, {e}')
        return 'bad request', 400

    # print(req.Body1.id)
    # data = request.get_json()  # Get the JSON data from the request
    # user_dict = json.loads(data)  # Convert JSON to dictionary
    # user = User(**user_dict)  # Convert dictionary to class instance

    # TODO
    # payload = request.json
    # payload: SimulateRequest = request.json  # type: ignore
    # if len(cast(SimulateRequest, request.json).data) == 0:
    #     print(f'failed to parse body of request, {request}, {request.json}')
    #     return 'Failed to parse request', 400
    #  TODO ^^^^

    # Create store and simulator
    # initial_universe = {agentId: state for agentId, state in enumerate(init)}
    simulator = Simulator(
        store=QRangeStore(),
        init=payload,
    )

    # Run simulation
    simulator.simulate()

    # Save data to database
    simulation = Simulation(data=json.dumps(store.store))
    db.session.add(simulation)
    db.session.commit()

    return store.store

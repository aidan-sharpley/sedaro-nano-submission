# HTTP SERVER


import jsonpickle
from flask import Flask, request
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
    return jsonpickle.loads(simulation.data) if simulation else []


@app.post('/simulation')
def simulate():
    payload = SimulateRequest(request.get_json())
    if not payload:
        print('failed to parse json from request')
        return 'bad request', 400

    print('wakka wakka')
    print(payload.Body1.agentId)
    print(payload.Body2)
    print(payload)
    print(type(payload))

    # Create store and simulator
    simulator = Simulator(
        store=QRangeStore(),
        init=payload,
    )

    # Run simulation
    simulator.simulate()

    print('simmlated')

    # Save data to database
    simulation = Simulation(data=simulator.marshalStoreContents())
    # simulation = Simulation(data=json.dumps(store.store))
    # storeData = json.dumps([s for s in store.store])
    # simulation = Simulation(data=storeData)

    # self.store: list[tuple[int, int, dict[str, Body]]]

    # simulation = Simulation(data=store.store)
    db.session.add(simulation)
    db.session.commit()

    # print(store.store[-1])
    # print(store.store[-1][2]['Body2'].mass)

    # return store.store
    # return jsonpickle.dumps(store.store)
    return simulation.data

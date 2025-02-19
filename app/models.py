class Body:
    x: float
    y: float
    z: float
    vx: float
    vy: float
    vz: float
    mass: float


class TimeBody(Body):
    time: float
    timeStep: float


class SimulateRequest:
    Body1: Body
    Body2: Body

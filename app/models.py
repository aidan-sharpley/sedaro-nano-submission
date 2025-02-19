DEFAULT_TIME_VALUE = 0
DEFAULT_TIME_STEP_VALUE = 0.01


class Body(object):
    def __init__(
        self,
        id: int = 0,
        x: float = 0,
        y: float = 0,
        z: float = 0,
        vx: float = 0,
        vy: float = 0,
        vz: float = 0,
        mass: float = 0,
        time: float = DEFAULT_TIME_VALUE,
        timeStep: float = DEFAULT_TIME_STEP_VALUE,
    ):
        self.id = id
        self.x = x
        self.y = y
        self.z = z
        self.vx = vx
        self.vy = vy
        self.vz = vz
        self.mass = mass
        self.time = time
        self.timeStep = timeStep

    # def __repr__(self):
    #     return f'Body(id={self.id}, x={self.x}, y={self.y}, z={self.z}, vx={self.vx}, vy={self.vy}, vz={self.vz}, mass={self.mass}, time={self.time}, timeStep={self.timeStep})'


class SimulateRequest(object):
    data: list[Body]


class LegacySimulateRequest(object):
    def __init__(self, Body1: Body, Body2: Body):
        self.Body1 = Body1
        self.Body2 = Body2

    # def __repr__(self):
    #     return f'LegacySimulateRequest(Body1={self.Body1}, Body2={self.Body2})'

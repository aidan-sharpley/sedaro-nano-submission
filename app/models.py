from types import SimpleNamespace

DEFAULT_TIME_VALUE = 0
DEFAULT_TIME_STEP_VALUE = 0.01


class Body(SimpleNamespace):
    def __init__(
        self,
        agentId: int = 0,
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
        self.agentId = agentId
        self.x = x
        self.y = y
        self.z = z
        self.vx = vx
        self.vy = vy
        self.vz = vz
        self.mass = mass
        self.time = time
        self.timeStep = timeStep


class SimulateRequest:
    def __init__(self, data: list[Body]):
        self.data = [Body(**x) for x in data]


class LegacySimulateRequest(object):
    def __init__(self, Body1: Body, Body2: Body):
        self.Body1 = Body1
        self.Body2 = Body2

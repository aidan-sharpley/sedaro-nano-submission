from dataclasses import dataclass

DEFAULT_TIME_VALUE = 0
DEFAULT_TIME_STEP_VALUE = 0.01


@dataclass
class Body:
    agentId: str
    x: float
    y: float
    z: float
    vx: float
    vy: float
    vz: float
    mass: float
    time: float = DEFAULT_TIME_VALUE
    timeStep: float = DEFAULT_TIME_STEP_VALUE


class SimulateRequest:
    def __init__(self, data: dict[str, Body]):
        if len(data.keys()) != 2:
            raise Exception(f'bad body dict length, {data}')

        self.Body1: Body = Body(**data['Body1'])
        if not self.Body1:
            raise Exception('bad body1')

        self.Body2: Body = Body(**data['Body2'])
        if not self.Body2:
            raise Exception('bad body2')

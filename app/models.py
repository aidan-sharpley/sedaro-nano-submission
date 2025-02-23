from dataclasses import dataclass

DEFAULT_TIME_VALUE = 0
DEFAULT_TIME_STEP_VALUE = 0.01


@dataclass
class Body:
    agentId: str = ''
    x: float = 0
    y: float = 0
    z: float = 0
    vx: float = 0
    vy: float = 0
    vz: float = 0
    mass: float = 0
    time: float = DEFAULT_TIME_VALUE
    timeStep: float = DEFAULT_TIME_STEP_VALUE


class SimulateRequest:
    def __init__(self, data: dict[str, Body]):
        if len(data.keys()) != 3:
            raise Exception(f'missing body(s), {data}')

        self.Body1: Body = Body(**data['Body1'])
        if not self.Body1:
            raise Exception('bad body1')

        self.Body2: Body = Body(**data['Body2'])
        if not self.Body2:
            raise Exception('bad body2')

        self.Batch: Body = Body(**data['Batch'])
        if not self.Batch:
            raise Exception('bad batch')

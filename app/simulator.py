# SIMULATOR

from functools import reduce
from operator import __or__

from models import Body
from modsim import propagate
from store import QRangeStore

DEFAULT_SIMULATION_DECR = 0.001


class Simulator:
    """
    A Simulator is used to simulate the propagation of agents in the universe.
    This class is *not* pure. It mutates the data store in place and maintains internal state.

    It is given an initial state of the following form:
    ```
    {
        'agentId': {
            'time': <time of instantiation>,
            'timeStep': <time step for propagation>,
            **otherSimulatedProperties,
        },
        **otherAgents,
    }
    ```

    Args:
        store (QRangeStore): The data store in which to save the simulation results.
        init (list[Body]): The initial state of the universe.
    """

    def __init__(self, store: QRangeStore, init: dict[str, Body]):
        self.store = store
        # range where value should show up
        store[-999999999, 0] = init
        self.init = init
        self.times = {agent_id: state.time for agent_id, state in init.items()}

    def read(self, t: float) -> dict[int, Body]:
        try:
            data = self.store[t]
            print('reading rainbow')
            print(data)
        except IndexError:
            data = []
        return reduce(__or__, data, {})  # combine all data into one dictionary

    def simulate(self, iterations: int = 500):
        print('in simulacrum')
        print(self.init)
        print(self.store)
        print(self.times)

        for _ in range(iterations):
            # TODO parallel?
            for agentId in self.init.keys():
                t = self.times[agentId]
                universe = self.read(t - DEFAULT_SIMULATION_DECR)
                print('brekky')
                print(universe)
                print(agentId)
                print(t)
                # Check new simulated universe if
                # it is back to initial state.
                if set(universe) == set(self.init):
                    print('we are equal ')
                    newState = propagate(agentId, universe)
                    self.store[t, newState.time] = {agentId: newState}
                    self.times[agentId] = newState.time

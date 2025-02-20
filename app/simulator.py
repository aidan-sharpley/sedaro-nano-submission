# SIMULATOR

from functools import reduce
from operator import __or__

from models import Body, SimulateRequest
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

    def __init__(self, store: QRangeStore, init: SimulateRequest):
        initialUniverseDict = {
            init.Body1.agentId: init.Body1,
            init.Body2.agentId: init.Body2,
        }

        self.store = store
        # range where value should show up
        store[-999999999, 0] = initialUniverseDict
        self.init = initialUniverseDict
        self.initialSet = set(initialUniverseDict)
        self.times = {
            init.Body1.agentId: init.Body1.time,
            init.Body2.agentId: init.Body2.time,
        }

        self.primaryAgentIdx = init.Body1.agentId
        self.secondaryAgentIdx = init.Body2.agentId

    def read(self, t: float) -> dict[str, Body]:
        try:
            data = self.store[t]
            print('reading rainbow')
            print(data)
        except IndexError:
            data = []
        return reduce(__or__, data, {})  # combine all data into one dictionary

    def simulateAgent(self, primaryAgentId: str, secondaryAgentId: str):
        t = self.times[primaryAgentId]
        universe = self.read(t - DEFAULT_SIMULATION_DECR)
        print('brekky')
        print(universe)
        print(primaryAgentId)
        print(t)
        # Check new simulated universe if
        # it is back to initial state.
        if set(universe) == self.initialSet:
            print('we are equal ')
            newState = propagate(
                self_state=universe[primaryAgentId],
                other_state=universe[secondaryAgentId],
            )
            print(newState)
            self.store[t, newState.time] = {primaryAgentId: newState}
            self.times[primaryAgentId] = newState.time

    def simulate(self, iterations: int = 500):
        print('in simulacrum')
        # print(self.init)
        # print(self.store)
        # print(self.times)

        # Agent order seems important, we go 1 and then 2.
        for _ in range(iterations):
            self.simulateAgent(
                primaryAgentId=self.primaryAgentIdx,
                secondaryAgentId=self.secondaryAgentIdx,
            )
            self.simulateAgent(
                primaryAgentId=self.secondaryAgentIdx,
                secondaryAgentId=self.primaryAgentIdx,
            )
            # for agentId in self.init:
            # t = self.times[agentId]
            # universe = self.read(t - DEFAULT_SIMULATION_DECR)
            # print('brekky')
            # print(universe)
            # print(agentId)
            # print(t)
            # # Check new simulated universe if
            # # it is back to initial state.
            # if set(universe) == self.initialSet:
            #     print('we are equal ')
            #     newState = propagate(agentId, universe)
            #     print(newState)
            #     self.store[t, newState.time] = {agentId: newState}
            #     self.times[agentId] = newState.time

            # TODO parallel?
            # for agentId in self.init:
            #     t = self.times[agentId]
            #     universe = self.read(t - DEFAULT_SIMULATION_DECR)
            #     print('brekky')
            #     print(universe)
            #     print(agentId)
            #     print(t)
            #     # Check new simulated universe if
            #     # it is back to initial state.
            #     if set(universe) == self.initialSet:
            #         print('we are equal ')
            #         newState = propagate(agentId, universe)
            #         print(newState)
            #         self.store[t, newState.time] = {agentId: newState}
            #         self.times[agentId] = newState.time

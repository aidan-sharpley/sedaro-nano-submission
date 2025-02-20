# SIMULATOR

import json
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
        # Time leading up to 0 has initial values for both agents.
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
        except IndexError:
            data = []
        return reduce(__or__, data, {})  # combine all data into one dictionary

    def simulateAgent(self, primaryAgentId: str, secondaryAgentId: str):
        """
        simulateAgent runs the simulation with primary and secondary agent
        id retrieving the state for propagation calculations.

        Args:
            primaryAgentId (str): _description_
            secondaryAgentId (str): _description_
        """
        t = self.times[primaryAgentId]
        universe = self.read(t - DEFAULT_SIMULATION_DECR)

        # Check new simulated universe if
        # it is back to initial state.
        if set(universe) == self.initialSet:
            newState = propagate(
                self_state=universe[primaryAgentId],
                other_state=universe[secondaryAgentId],
            )
            self.store[t, newState.time] = {primaryAgentId: newState}
            self.times[primaryAgentId] = newState.time

    def simulate(self, iterations: int = 500):
        """
        simulate runs agent 1 and then agent 2 simulation
        for each iteration.

        Args:
            iterations (int, optional): _description_. Defaults to 500.
        """
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

    def marshalStoreContents(self) -> str:
        return json.dumps(self.store.marshalStore)

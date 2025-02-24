# SIMULATOR

import json
from dataclasses import asdict
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
        init (SimulateRequest): The initial state of the universe.
    """

    def __init__(self, store: QRangeStore, init: SimulateRequest):
        initialUniverseDict = {
            init.Body1.agentId: init.Body1,
            init.Body2.agentId: init.Body2,
        }

        store[-999999999, 0] = initialUniverseDict

        self.store = store
        self.init = initialUniverseDict
        self.times = {
            init.Body1.agentId: init.Body1.time,
            init.Body2.agentId: init.Body2.time,
        }

        self.primaryAgentIdx = init.Body1.agentId
        self.secondaryAgentIdx = init.Body2.agentId

    def read(self, t: float) -> dict[str, Body]:
        # Short circuit default value setting for store in original code.
        if t < 0:
            return self.init

        lookup = self.store[t]

        # Roll up results and data for all agents
        # that have propagated time ranges upat time in store..
        return reduce(__or__, lookup, {})  # combine all data into one dictionary

    def simulate_agent(self, primary_agent_id: str, secondary_agent_id: str):
        """
        simulateAgent runs the simulation with primary and secondary agent
        id retrieving the state for propagation calculations.

        Args:
            primary_agent_id (str): _description_
            secondary_agent_id (str): _description_
        """
        t = self.times[primary_agent_id]
        decremented_time = t - DEFAULT_SIMULATION_DECR

        # If the second body is not "caught up" in the time series
        # we need to propagate the secondary and make sure
        # `t` falls within the range of both primary and secondary bodies
        # before we can propagate the primary.
        if self.times[secondary_agent_id] <= decremented_time:
            return

        # Primary and secondary times overlap, we can propagate primary.
        universe = self.read(decremented_time)

        new_state = propagate(
            self_state=universe[primary_agent_id],
            other_state=universe[secondary_agent_id],
        )
        self.store[t, new_state.time] = {primary_agent_id: new_state}
        self.times[primary_agent_id] = new_state.time

    def simulate(self, iterations: int = 500):
        """
        simulate runs agent 1 and then agent 2 simulation
        for each iteration.

        Args:
            iterations (int, optional): _description_. Defaults to 500.
        """
        for _ in range(iterations):
            self.simulate_agent(
                primary_agent_id=self.primaryAgentIdx,
                secondary_agent_id=self.secondaryAgentIdx,
            )
            self.simulate_agent(
                primary_agent_id=self.secondaryAgentIdx,
                secondary_agent_id=self.primaryAgentIdx,
            )

        return self.marshal_store_contents()

    def marshal_store_contents(self) -> str:
        # Need to marshal the nested Body classes.
        return json.dumps(
            [
                (low, high, {k: asdict(v) for k, v in val.items()})
                for (low, high, val) in self.store.store
            ]
        )

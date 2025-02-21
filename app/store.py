# DATA STRUCTURE

import doctest

from models import Body


class QRangeStore:
    """
    A Q-Range KV Store mapping left-inclusive, right-exclusive ranges [low, high) to values.
    Reading from the store returns the collection of values whose ranges contain the query.
    ```
    0  1  2  3  4  5  6  7  8  9
    [A      )[B)            [E)
    [C   )[D   )
           ^       ^        ^  ^
    ```
    >>> store = QRangeStore()
    >>> store[0, 3] = 'Record A'
    >>> store[3, 4] = 'Record B'
    >>> store[0, 2] = 'Record C'
    >>> store[2, 4] = 'Record D'
    >>> store[8, 9] = 'Record E'
    >>> store[2, 0] = 'Record F'
    Traceback (most recent call last):
    IndexError: Invalid Range.
    >>> store[2.1]
    ['Record A', 'Record D']
    >>> store[8]
    ['Record E']
    >>> store[5]
    Traceback (most recent call last):
    IndexError: Not found.
    >>> store[9]
    Traceback (most recent call last):
    IndexError: Not found.
    """

    def __init__(self):
        self.store: list[tuple[int | float, int | float, dict[str, Body]]] = []

    def __setitem__(self, rng: tuple[float, float], value: dict[str, Body]):
        try:
            (low, high) = rng
        except (TypeError, ValueError):
            raise IndexError('Invalid Range: must provide a low and high value.')

        if not low < high:
            raise IndexError('Invalid Range.')

        self.store.append((low, high, value))

    def __getitem__(self, key: int | float):
        ret = [v for (low, high, v) in self.store if low <= key < high]
        if not ret:
            raise IndexError('Not found.')
        return ret


doctest.testmod()

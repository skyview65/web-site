"""Entry point so ``python -m tradingbot ...`` works."""

import sys

from tradingbot.cli import main

if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))

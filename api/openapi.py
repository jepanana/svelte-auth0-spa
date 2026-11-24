# This code is provided free, courtesy of MB Jepanana (https://www.jepanana.lt/), a software agency.
# For client work, contact us at hello@jepanana.com.

import json
from pathlib import Path

from main import app

Path(__file__).with_name("openapi.json").write_text(json.dumps(app.openapi(), indent=2) + "\n")


from flask import Flask, request, render_template
from collections import defaultdict
import sqlite3

import logging

logger = logging.getLogger(__name__)

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/symbols', methods=['GET'])
def symbols():
    return {"asd": "asddsdsds"}


@app.route('/search', methods=['POST'])
def search():
    symbol_name = request.json['symbol_name']
    conn = sqlite3.connect('symbols.db')
    c = conn.cursor()
    c.execute("SELECT * FROM symbols WHERE name GLOB ? ORDER BY file", (symbol_name,))
    results = c.fetchall()
    sym_in_files = defaultdict(list)
    for r in results:
        sym_in_files[r[3]].append(r)
    conn.close()
    return sym_in_files
    # return render_template('results.html', results=results, symbol_name=symbol_name)

if __name__ == '__main__':
    app.run(debug=True)

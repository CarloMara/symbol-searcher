
from flask import Flask, request, render_template
import sqlite3

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/symbols', methods=['GET'])
def symbols():
    return {"asd": "asddsdsds"}


@app.route('/search', methods=['POST'])
def search():
    symbol_name = request.form['symbol_name']
    conn = sqlite3.connect('symbols.db')
    c = conn.cursor()
    c.execute("SELECT * FROM symbols WHERE name GLOB ?", (symbol_name,))
    results = c.fetchall()
    conn.close()
    return render_template('results.html', results=results, symbol_name=symbol_name)

if __name__ == '__main__':
    app.run(debug=True)

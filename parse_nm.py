
import re
import os
import sqlite3
import logging

logger = logging.getLogger(__name__)

def store_symbols(symbols):
    conn = sqlite3.connect('symbols.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS symbols
                 (address TEXT, type TEXT, name TEXT, file TEXT)''')

    for symbol in symbols:
        c.execute("INSERT INTO symbols VALUES (?, ?, ?, ?)",
                  (symbol['address'], symbol['type'], symbol['name'], symbol['file']))

    conn.commit()
    conn.close()


def parse_nm_output(file_path):
    with open(file_path, 'r') as f:
        symbols = []

        for line in f.readlines():
            if line.startswith("./"):
                logger.debug(f"New file: {line}, #sym {len(symbols)}")
                store_symbols(symbols)
                symbols = []
                path = line
                continue
                
            match = re.match(r'^([0-9a-fA-F]+) (\w) (.+)$', line.strip())
            if match:
                address, symbol_type, name = match.groups()
                symbols.append({
                    'address': address,
                    'type': symbol_type,
                    'name': name,
                    'file': os.path.basename(path)
                })

elf_file = "/home/carlo/Documents/pp/reverse/quartus_syms"
parse_nm_output(elf_file)

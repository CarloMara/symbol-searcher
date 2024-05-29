
const textbox = document.getElementById('wow_many_syms');
const table = document.getElementById('such_table');


let startX, startWidthColumn1, startWidthColumn2;


// let resizer = document.querySelector('.resizer');
// resizer.addEventListener('mousedown', initResize);

textbox.addEventListener('input', handleInput);
textbox.addEventListener('keydown', handleKeydown);



function initResize(e) {
    const column1 = document.querySelector('.column-1');
    const column2 = document.querySelector('.column-2');
    startX = e.clientX;
    startWidthColumn1 = column1.offsetWidth;
    startWidthColumn2 = column2.offsetWidth;

    window.addEventListener('mousemove', resizeColumns);
    window.addEventListener('mouseup', stopResize);
}

function resizeColumns(e) {
    const column1 = document.querySelector('.column-1');
    const column2 = document.querySelector('.column-2');
    const dx = e.clientX - startX;
    const newWidthColumn1 = startWidthColumn1 + dx;
    const newWidthColumn2 = startWidthColumn2 - dx;
    document.documentElement.style.setProperty('--c1', newWidthColumn1+"px");
    document.documentElement.style.setProperty('--c2', newWidthColumn2+"px");


    column1.style.width = 'var(--c1)';
    column2.style.width = 'var(--c2)';
}

function stopResize() {
    window.removeEventListener('mousemove', resizeColumns);
    window.removeEventListener('mouseup', stopResize);
}

function clearTable() {
  // Remove all rows except the first one
  while (table.rows.length >=1) {
    table.deleteRow(0);
  }
}


async function fetchData(sym) {
    try {
        const href = window.location.href;
        const response = await fetch(href + "search", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ symbol_name:  sym})
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        clearTable();
        const data = await response.json();
        const mainTable = document.querySelector('.container table');

        // Assuming the response is an array of objects
        Object.entries(data).forEach(([key, value]) => {
          console.log(`Key: ${key}, Value: ${value}`);
          // Create a new row
          const newRow = document.createElement('tr');
          newRow.classList.add('biig-rows');

          // Column 1 content
          const column1Content = document.createElement('td');
          column1Content.classList.add('column', 'column-1');
          column1Content.textContent = key;

          // Column 2 content
          const column2Content = document.createElement('td');
          column2Content.classList.add('column', 'column-2');

          // Create inner table
          const innerTable = document.createElement('table');
          value.forEach(sym => {
            const innerRow = document.createElement('tr');
            const address = document.createElement('td');
            address.textContent = sym[0];
            address.classList.add('sym_address')

            const type = document.createElement('td');
            type.textContent = sym[1];
            type.classList.add('sym_type')

            const name = document.createElement('td');
            name.textContent = sym[2];
            name.classList.add('sym_name')
            

            innerRow.appendChild(name);
            innerRow.appendChild(type);
            innerRow.appendChild(address);

            innerTable.appendChild(innerRow);
          });
          column2Content.appendChild(innerTable);

          // Append columns to the new row
          newRow.appendChild(column1Content);
          const resizer = document.createElement('td');
          resizer.classList.add('resizer')
          resizer.addEventListener('mousedown', initResize);
          newRow.appendChild(resizer); // Empty cell for the resizer
          newRow.appendChild(column2Content);

          // Append the new row to the main table
          mainTable.appendChild(newRow);
        });        
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

let lastPrintedTime = 0;

function handleInput(event) {
    const currentTime = new Date().getTime();
    if (currentTime - lastPrintedTime >= 100 && event.target.value.length > 6) { // 1000 milliseconds = 1 second
        fetchData(event.target.value);
        lastPrintedTime = currentTime;
    }
}

function handleKeydown(event) {
    if (event.key === 'Enter') {
        fetchData(event.target.value);
    }
}
// Get the textbox element

// Attach the input event listener to the textbox
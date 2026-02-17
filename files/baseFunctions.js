const table = document.getElementById("evalTable");
const weightRow = document.getElementById("weightRow");
const tbody = table.querySelector("tbody");

let propertyCount = 0;

document.getElementById("addCol").onclick = () => addColumn();
document.getElementById("addRow").onclick = () => addRow();

function addColumn() {
    propertyCount++;
    const name = prompt("Property name:", "Fact" + propertyCount);
    if (!name) return;

    const th = document.createElement("th");
    th.textContent = name;
    headerRow.insertBefore(th, headerRow.lastElementChild);

    const weightTh = document.createElement("th");
    const weightInput = document.createElement("input");
    weightInput.type = "number";
    weightInput.value = 1;
    weightInput.step = "0.1";
    weightInput.oninput = calculateAll;
    weightTh.appendChild(weightInput);
    weightRow.insertBefore(weightTh, weightRow.lastElementChild);

    [...tbody.rows].forEach(row => {
        const td = document.createElement("td");
        const input = document.createElement("input");
        input.type = "number";
        input.oninput = calculateRow.bind(null, row);
        td.appendChild(input);
        row.insertBefore(td, row.lastElementChild);
    });
}

function addRow() {
    const row = document.createElement("tr");

    const nameTd = document.createElement("td");
    const nameInput = document.createElement("input");
    nameInput.className = "nameInput";
    nameTd.appendChild(nameInput);
    row.appendChild(nameTd);

    for (let i = 0; i < propertyCount; i++) {
        const td = document.createElement("td");
        const input = document.createElement("input");
        input.type = "number";
        input.oninput = calculateRow.bind(null, row);
        td.appendChild(input);
        row.appendChild(td);
    }

    const totalTd = document.createElement("td");
    totalTd.className = "totalCell";
    totalTd.textContent = "0";
    row.appendChild(totalTd);

    tbody.appendChild(row);
}

function getWeights() {
    return [...weightRow.children]
        .slice(1, -1)
        .map(th => parseFloat(th.firstChild.value) || 0);
}

function calculateRow(row) {
    const weights = getWeights();
    const inputs = [...row.children].slice(1, -1);

    let total = 0;
    inputs.forEach((td, i) => {
        const val = parseFloat(td.firstChild.value) || 0;
        total += val * weights[i];
    });

    row.lastElementChild.textContent = total.toFixed(2);
}

function calculateAll() {
    [...tbody.rows].forEach(row => calculateRow(row));
}

const table=document.getElementById("evalTable");
const headerRow=document.getElementById("headerRow");
const weightRow=document.getElementById("weightRow");
const tbody=table.querySelector("tbody");
let propertyCount=0;

const STORAGE_KEY="weightedTableData";

document.getElementById("addCol").onclick=()=>{addColumn();save()};
document.getElementById("addRow").onclick=()=>{addRow();save()};
document.getElementById("reset").onclick=()=>{localStorage.removeItem(STORAGE_KEY);location.reload()};

function addColumn(name="Property",weight=1){
propertyCount++;
const th=document.createElement("th");
th.innerHTML=`${name} <button class='deleteBtn'>×</button>`;
th.querySelector("button").onclick=()=>removeColumn(th.cellIndex);
headerRow.insertBefore(th,headerRow.lastElementChild);

const weightTh=document.createElement("th");
const weightInput=document.createElement("input");
weightInput.type="number";weightInput.value=weight;weightInput.step="0.1";
weightInput.oninput=()=>{calculateAll();save()};
weightTh.appendChild(weightInput);
weightRow.insertBefore(weightTh,weightRow.lastElementChild);

[...tbody.rows].forEach(row=>{
const td=document.createElement("td");
const input=document.createElement("input");
input.type="number";
input.oninput=()=>{calculateRow(row);save()};
td.appendChild(input);
row.insertBefore(td,row.lastElementChild);
});
}

function removeColumn(index){
headerRow.deleteCell(index);
weightRow.deleteCell(index);
[...tbody.rows].forEach(r=>r.deleteCell(index));
propertyCount--;calculateAll();save();
}

function addRow(name=""){
const row=document.createElement("tr");

const nameTd=document.createElement("td");
const nameInput=document.createElement("input");
nameInput.className="nameInput";nameInput.value=name;
nameInput.oninput=save;
nameTd.appendChild(nameInput);
const del=document.createElement("button");
del.textContent="×";del.className="deleteBtn";
del.onclick=()=>{row.remove();calculateAll();save()};
nameTd.appendChild(del);
row.appendChild(nameTd);

for(let i=0;i<propertyCount;i++){
const td=document.createElement("td");
const input=document.createElement("input");
input.type="number";
input.oninput=()=>{calculateRow(row);save()};
td.appendChild(input);
row.appendChild(td);
}

const totalTd=document.createElement("td");
totalTd.className="totalCell";
totalTd.textContent="0";
row.appendChild(totalTd);

tbody.appendChild(row);
}

function getWeights(){return[...weightRow.children].slice(1,-1).map(th=>parseFloat(th.firstChild.value)||0)}

function calculateRow(row){
const weights=getWeights();
const inputs=[...row.children].slice(1,-1);
let total=0;
inputs.forEach((td,i)=>{const val=parseFloat(td.firstChild.value)||0;total+=val*weights[i]});
row.lastElementChild.textContent=total.toFixed(2);
highlightBest();
}

function calculateAll(){[...tbody.rows].forEach(row=>calculateRow(row));highlightBest()}

function highlightBest(){
let best=-Infinity,bestRow=null;
[...tbody.rows].forEach(r=>{r.classList.remove("best");const v=parseFloat(r.lastElementChild.textContent)||0;if(v>best){best=v;bestRow=r}});
if(bestRow)bestRow.classList.add("best");
}

function save(){
const data={weights:getWeights(),headers:[...headerRow.children].slice(1,-1).map(th=>th.textContent.trim()),rows:[...tbody.rows].map(r=>({name:r.children[0].querySelector("input").value,values:[...r.children].slice(1,-1).map(td=>td.firstChild.value)}))};
localStorage.setItem(STORAGE_KEY,JSON.stringify(data));
}

function load(){
const raw=localStorage.getItem(STORAGE_KEY);if(!raw)return;
const data=JSON.parse(raw);
data.headers.forEach((h,i)=>addColumn(h,data.weights[i]));
data.rows.forEach(r=>{addRow(r.name);const row=tbody.lastElementChild;r.values.forEach((v,i)=>row.children[i+1].firstChild.value=v)});
calculateAll();
}

load();

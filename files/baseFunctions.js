const table=document.getElementById("evalTable");
const headerRow=document.getElementById("headerRow");
const weightRow=document.getElementById("weightRow");
const tbody=table.querySelector("tbody");
let propertyCount=0;
const STORAGE_KEY="weightedTableData";

document.getElementById("addCol").onclick=()=>{addColumn();save()};
document.getElementById("addRow").onclick=()=>{addRow();save()};
document.getElementById("reset").onclick=()=>{localStorage.removeItem(STORAGE_KEY);location.hash="";location.reload()};
document.getElementById("share").onclick=shareLink;

function addColumn(name="Property",weight=1){
propertyCount++;
const th=document.createElement("th");
const input=document.createElement("input");
input.className="headerInput";input.value=name;input.oninput=save;
const del=document.createElement("button");del.textContent="×";del.className="deleteBtn";del.onclick=()=>removeColumn(th.cellIndex);
th.append(input,del);
headerRow.insertBefore(th,headerRow.lastElementChild);

const weightTh=document.createElement("th");
const w=document.createElement("input");w.type="number";w.value=weight;w.step="0.1";w.oninput=()=>{calculateAll();save()};
weightTh.appendChild(w);
weightRow.insertBefore(weightTh,weightRow.lastElementChild);

[...tbody.rows].forEach(row=>{
const td=document.createElement("td");
const i=document.createElement("input");i.type="number";i.oninput=()=>{calculateRow(row);save()};
td.appendChild(i);row.insertBefore(td,row.lastElementChild);
});
}

function removeColumn(index){headerRow.deleteCell(index);weightRow.deleteCell(index);[...tbody.rows].forEach(r=>r.deleteCell(index));propertyCount--;calculateAll();save()}

function addRow(name=""){
const row=document.createElement("tr");
const nameTd=document.createElement("td");
const nameInput=document.createElement("input");nameInput.className="nameInput";nameInput.value=name;nameInput.oninput=save;
const del=document.createElement("button");del.textContent="×";del.className="deleteBtn";del.onclick=()=>{row.remove();calculateAll();save()};
nameTd.append(nameInput,del);row.appendChild(nameTd);

for(let i=0;i<propertyCount;i++){const td=document.createElement("td");const inp=document.createElement("input");inp.type="number";inp.oninput=()=>{calculateRow(row);save()};td.appendChild(inp);row.appendChild(td)}

const totalTd=document.createElement("td");totalTd.className="totalCell";totalTd.textContent="0";row.appendChild(totalTd);

tbody.appendChild(row);
}

function getWeights(){return[...weightRow.children].slice(1,-1).map(th=>parseFloat(th.firstChild.value)||0)}

function calculateRow(row){const weights=getWeights();const inputs=[...row.children].slice(1,-1);let total=0;inputs.forEach((td,i)=>{const val=parseFloat(td.firstChild.value)||0;total+=val*weights[i]});row.lastElementChild.dataset.total=total;row.lastElementChild.textContent=total.toFixed(2);highlightBest()}
function calculateAll(){[...tbody.rows].forEach(row=>calculateRow(row));highlightBest()}

function highlightBest(){
const rows=[...tbody.rows];rows.forEach(r=>r.classList.remove("best"));
rows.sort((a,b)=>(b.lastElementChild.dataset.total||0)-(a.lastElementChild.dataset.total||0));
rows.forEach((r,i)=>{const cell=r.lastElementChild;cell.innerHTML=`${Number(cell.dataset.total||0).toFixed(2)}<span class='rank'>${i+1}${ordinal(i+1)}</span>`});
if(rows[0])rows[0].classList.add("best");
}
function ordinal(n){return n==1?"st":n==2?"nd":n==3?"rd":"th"}

function save(){const data={weights:getWeights(),headers:[...headerRow.children].slice(1,-1).map(th=>th.querySelector("input").value),rows:[...tbody.rows].map(r=>({name:r.children[0].querySelector("input").value,values:[...r.children].slice(1,-1).map(td=>td.firstChild.value)}))};localStorage.setItem(STORAGE_KEY,JSON.stringify(data))}

function shareLink(){const data=localStorage.getItem(STORAGE_KEY);if(!data)return;const encoded=btoa(encodeURIComponent(data));location.hash=encoded;navigator.clipboard.writeText(location.href)}

function load(){
let raw=null;
if(location.hash.length>1){try{raw=decodeURIComponent(atob(location.hash.substring(1)));}catch{}}
if(!raw)raw=localStorage.getItem(STORAGE_KEY);
if(!raw)return;
const data=JSON.parse(raw);
data.headers.forEach((h,i)=>addColumn(h,data.weights[i]));
data.rows.forEach(r=>{addRow(r.name);const row=tbody.lastElementChild;r.values.forEach((v,i)=>row.children[i+1].firstChild.value=v)});
calculateAll();
}
load();

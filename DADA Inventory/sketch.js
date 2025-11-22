// ------------------------ FIREBASE ------------------------
const firebaseConfig = {
  apiKey: "AIzaSyAuWCelzmOrkGJnm1rky81gh23dhBxBM7E",
  authDomain: "inventory-23906.firebaseapp.com",
  projectId: "inventory-23906",
  storageBucket: "inventory-23906.firebasestorage.app",
  messagingSenderId: "692625511622",
  appId: "1:692625511622:web:6995fc9d44b0ff132e33c7"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ------------------------ DATA ------------------------
let inventory = {}, logs = [], totalRevenue = 0;

// ------------------------ INPUTS & BUTTONS ------------------------
let codeInput, priceInput, countInput;
let purchaseInput, paymentInput;
let addButton, purchaseButton, saveButton, clearButton;

// ------------------------ SCROLLABLE DIVS ------------------------
let inventoryDiv, logDiv;

// ------------------------ ERROR & POPUP ------------------------
let errorDiv, popupDiv;

// ------------------------ DRAG SCROLL ------------------------
let isDraggingInventory = false, invStartY = 0, invScrollStart = 0;
let isDraggingLog = false, logStartY = 0, logScrollStart = 0;

// ------------------------ SETUP ------------------------
function setup() {
  noCanvas();
  loadFromFirebase();

  // Inputs
  codeInput = createInput("").attribute("placeholder", "Item Code");
  priceInput = createInput("").attribute("placeholder", "Price");
  countInput = createInput("").attribute("placeholder", "Count");
  codeInput.position(20, 20); priceInput.position(150,20); countInput.position(250,20);

  addButton = createButton("Add Item").position(380, 20).mousePressed(addItem);

  purchaseInput = createInput("").attribute("placeholder", "Codes: LO89, KO90").position(20, 60);
  paymentInput = createInput("").attribute("placeholder", "Payment Method").position(250, 60);
  purchaseButton = createButton("Process Purchase").position(20, 100).mousePressed(processPurchase);

  saveButton = createButton("Export to TXT").position(160, 100).mousePressed(exportToText);

  clearButton = createButton("Clear All Data").position(300, 100);
  clearButton.style("background-color","#f66").style("color","white").style("padding","8px 12px").style("border-radius","6px");
  clearButton.mousePressed(clearAllData);

  errorDiv = createDiv("").position(20,140).style("color","red").style("font-weight","bold");

  // Inventory div
  inventoryDiv = createDiv("").position(20,170).size(560,220).style("overflow-y","scroll").style("background","#fff").style("padding","10px").style("border","1px solid #aaa").style("border-radius","8px");
  inventoryDiv.mousePressed(()=>{isDraggingInventory=true;invStartY=mouseY;invScrollStart=inventoryDiv.elt.scrollTop;});
  inventoryDiv.mouseReleased(()=>{isDraggingInventory=false;});

  // Log div
  logDiv = createDiv("").position(20,400).size(560,300).style("overflow-y","scroll").style("background","#fff").style("padding","10px").style("border","1px solid #aaa").style("border-radius","8px");
  logDiv.mousePressed(()=>{isDraggingLog=true;logStartY=mouseY;logScrollStart=logDiv.elt.scrollTop;});
  logDiv.mouseReleased(()=>{isDraggingLog=false;});

  // Popup div
  popupDiv = createDiv("").style("display","none").style("position","fixed").style("top","20%").style("left","50%").style("transform","translateX(-50%)").style("background","#ffd").style("padding","15px").style("border","2px solid #999").style("border-radius","10px").style("z-index","1000");

  renderInventory();
  renderLogs();
}

// ------------------------ FIREBASE ------------------------
function saveToFirebase(){
  const data = { inventory, logs, totalRevenue };
  db.collection("inventoryApp").doc("data").set(data);
}
function loadFromFirebase(){
  db.collection("inventoryApp").doc("data").get().then(docSnap=>{
    if(docSnap.exists){
      const data = docSnap.data();
      inventory = data.inventory||{};
      logs = data.logs||[];
      totalRevenue = data.totalRevenue||0;
      renderInventory(); renderLogs();
    }
  });
}

// ------------------------ INVENTORY ------------------------
function addItem(){
  let code=codeInput.value().trim().toUpperCase();
  let price=parseFloat(priceInput.value());
  let count=parseInt(countInput.value());
  if(code && !isNaN(price) && !isNaN(count)){
    if(!inventory[code]) inventory[code]={price,count,sold:0};
    else{ inventory[code].price=price; inventory[code].count+=count; }
    errorDiv.html("");
  } else errorDiv.html("Invalid inventory input!");
  codeInput.value(""); priceInput.value(""); countInput.value="";
  renderInventory(); renderLogs(); saveToFirebase();
}

// ------------------------ PURCHASE ------------------------
function processPurchase(){
  errorDiv.html("");
  let rawInput=purchaseInput.value();
  let payment=paymentInput.value().trim();
  if(!rawInput){ errorDiv.html("Enter codes to purchase."); return; }
  if(!payment){ errorDiv.html("Please enter a payment method."); return; }

  let codes=rawInput.split(",").map(c=>c.trim().toUpperCase()).filter(c=>c!=="");
  let needed={}, missing=[], outOfStock=[];
  for(let c of codes) needed[c]=(needed[c]||0)+1;
  for(let code in needed){
    if(!inventory[code]) missing.push(code);
    else if(inventory[code].count<needed[code]) outOfStock.push(`${code} (need ${needed[code]}, have ${inventory[code].count})`);
  }
  if(missing.length || outOfStock.length){
    let msg="";
    if(missing.length) msg+="Missing: "+missing.join(", ")+". ";
    if(outOfStock.length) msg+="Out of stock: "+outOfStock.join(", ");
    errorDiv.html(msg); return;
  }

  let total=0;
  for(let c of codes){ inventory[c].count-=1; inventory[c].sold+=1; total+=inventory[c].price; }
  totalRevenue+=total;

  let logEntry={text:`${new Date().toLocaleString()} | ${codes.join(", ")} | $${total.toFixed(2)} | ${payment}`};
  logs.unshift(logEntry);
  showPopup(logEntry.text);

  purchaseInput.value(""); paymentInput.value="";
  renderInventory(); renderLogs(); saveToFirebase();
}

// ------------------------ CLEAR ALL DATA ------------------------
function clearAllData(){
  const password = prompt("Enter password to clear all data:");
  if(password==="Coffee"){
    if(confirm("Are you sure you want to permanently delete ALL data?")){
      inventory={}; logs=[]; totalRevenue=0;
      renderInventory(); renderLogs();
      saveToFirebase();
      alert("All data cleared successfully!");
    }
  } else alert("Incorrect password. Data not cleared.");
}

// ------------------------ RENDER ------------------------
function renderInventory(){
  inventoryDiv.html("");
  let sorted=Object.keys(inventory).sort();
  if(sorted.length===0){ inventoryDiv.html("<i>No inventory yet.</i>"); return; }
  for(let code of sorted){
    let item=inventory[code];
    let row=createDiv(`<b>${code}</b> — $${item.price} — Left: ${item.count} — Sold: ${item.sold} — Revenue: $${(item.sold*item.price).toFixed(2)}`);
    row.parent(inventoryDiv); row.style("margin-bottom","6px");
    let del=createButton("Delete"); del.parent(row);
    del.mousePressed(()=>{ delete inventory[code]; renderInventory(); renderLogs(); saveToFirebase(); });
  }
}

function renderLogs(){
  logDiv.html("");
  if(logs.length===0) logDiv.html("<i>No transactions yet.</i>");
  else logs.forEach((entry,i)=>{
    let row=createDiv(entry.text); row.parent(logDiv); row.style("margin-bottom","6px");
    let del=createButton("X"); del.parent(row);
    del.mousePressed(()=>{
      let match=entry.text.match(/\$(\d+(\.\d+)?)/);
      if(match) totalRevenue-=parseFloat(match[1]);
      logs.splice(i,1); renderLogs(); saveToFirebase();
    });
  });
  let revDiv=createDiv(`<b>Total Revenue: $${totalRevenue.toFixed(2)}</b>`);
  revDiv.parent(logDiv); revDiv.style("margin-top","10px").style("color","green");
}

// ------------------------ EXPORT ------------------------
function exportToText(){
  let content="=== Inventory ===\n\n";
  let sorted=Object.keys(inventory).sort();
  for(let code of sorted){
    let i=inventory[code];
    content+=`${code} | Price: ${i.price} | Count: ${i.count} | Sold: ${i.sold} | Revenue: ${(i.sold*i.price).toFixed(2)}\n`;
  }
  content+="\n=== Logs (Newest First) ===\n\n";
  for(let entry of logs) content+=entry.text+"\n";
  saveStrings([content],"inventory_log.txt");
}

// ------------------------ POPUP ------------------------
function showPopup(text){
  popupDiv.html("");
  let p=createP(text); p.parent(popupDiv);
  let closeBtn=createButton("X"); closeBtn.parent(popupDiv);
  closeBtn.mousePressed(()=>{ popupDiv.style("display","none"); });
  popupDiv.style("display","block").style("text-align","center");
}

// ------------------------ DRAW ------------------------
function draw(){
  if(isDraggingInventory) inventoryDiv.elt.scrollTop=invScrollStart+(invStartY-mouseY);
  if(isDraggingLog) logDiv.elt.scrollTop=logScrollStart+(logStartY-mouseY);
}

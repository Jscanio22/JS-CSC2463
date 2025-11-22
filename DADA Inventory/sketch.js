// ------------------------ GLOBALS ------------------------
let db;
let inventory = {}, logs = [], totalRevenue = 0;

let codeInput, priceInput, countInput;
let purchaseInput, paymentInput;
let addButton, purchaseButton, saveButton, clearButton;

let inventoryDiv, logDiv;
let errorDiv, popupDiv;

let isDraggingInventory=false, invStartY=0, invScrollStart=0;
let isDraggingLog=false, logStartY=0, logScrollStart=0;

// ------------------------ FIREBASE ------------------------
const firebaseConfig = {
  apiKey: "AIzaSyAuWCelzmOrkGJnm1rky81gh23dhBxBM7E",
  authDomain: "inventory-23906.firebaseapp.com",
  projectId: "inventory-23906",
  storageBucket: "inventory-23906.firebasestorage.app",
  messagingSenderId: "692625511622",
  appId: "1:692625511622:web:6995fc9d44b0ff132e33c7"
};

function initFirebase(){
  firebase.initializeApp(firebaseConfig);
  db = firebase.firestore();
}

// ------------------------ SETUP ------------------------
function setup(){
  noCanvas();
  initFirebase();
  loadFromFirebase();

  // --- Inputs ---
  codeInput = createInput("").attribute("placeholder","Item Code").position(20,20).style("width","100px");
  priceInput = createInput("").attribute("placeholder","Price").position(130,20).style("width","80px");
  countInput = createInput("").attribute("placeholder","Count").position(220,20).style("width","80px");
  addButton = createButton("Add Item").position(310,20).mousePressed(addItem);

  purchaseInput = createInput("").attribute("placeholder","Codes: LO89, KO90").position(20,60).style("width","200px");
  paymentInput = createInput("").attribute("placeholder","Payment Method").position(230,60).style("width","120px");
  purchaseButton = createButton("Process Purchase").position(360,60).mousePressed(processPurchase);

  saveButton = createButton("Export to TXT").position(20,100).mousePressed(exportToText);
  clearButton = createButton("Clear All Data").position(130,100).style("background-color","#f66").style("color","white").style("padding","6px 12px").style("border-radius","6px").mousePressed(clearAllData);

  errorDiv = createDiv("").position(20,140).style("color","red").style("font-weight","bold");

  inventoryDiv = createDiv("").position(20,170).size(560,200).style("overflow-y","scroll").style("background","#fff").style("padding","10px").style("border","1px solid #aaa").style("border-radius","8px");
  inventoryDiv.mousePressed(()=>{isDraggingInventory=true; invStartY=mouseY; invScrollStart=inventoryDiv.elt.scrollTop;});
  inventoryDiv.mouseReleased(()=>{isDraggingInventory=false;});

  logDiv = createDiv("").position(20,380).size(560,250).style("overflow-y","scroll").style("background","#fff").style("padding","10px").style("border","1px solid #aaa").style("border-radius","8px");
  logDiv.mousePressed(()=>{isDraggingLog=true; logStartY=mouseY; logScrollStart=logDiv.elt.scrollTop;});
  logDiv.mouseReleased(()=>{isDraggingLog=false;});

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
  db.collection("inventoryApp").doc("data").get()
    .then(docSnap=>{
      if(docSnap.exists){
        const data = docSnap.data();
        inventory = data.inventory || {};
        logs = data.logs || [];
        totalRevenue = data.totalRevenue || 0;
        renderInventory();
        renderLogs();
      }
    }).catch(err=>{ console.error("Firebase load error:", err); });
}

// ------------------------ INVENTORY ------------------------
function addItem(){
  let code = codeInput.value().trim().toUpperCase();
  let price = parseFloat(priceInput.value());
  let count = parseInt(countInput.value());
  if(code && !isNaN(price) && !isNaN(count)){
    if(!inventory[code]) inventory[code]={price,count,sold:0};
    else { inventory[code].price=price; inventory[code].count+=count; }
    errorDiv.html("");
  } else errorDiv.html("Invalid inventory input!");
  codeInput.value(""); priceInput.value(""); countInput.value="";
  renderInventory(); saveToFirebase();
}

// ------------------------ PURCHASE ------------------------
function processPurchase(){
  errorDiv.html("");
  let rawInput = purchaseInput.value();
  let payment = paymentInput.value().trim();
  if(!rawInput){ errorDiv.html("Enter codes to purchase."); return; }
  if(!payment){ errorDiv.html("Please enter a payment method."); return; }

  let codes = rawInput.split(",").map(c=>c.trim().toUpperCase()).filter(c=>c!=="");
  let needed = {}, missing=[], outOfStock=[];
  for(let c of codes) n

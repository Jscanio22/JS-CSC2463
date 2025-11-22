// ------------------------ GLOBALS ------------------------
let db;
let inventory = {}, logs = [], totalRevenue = 0;

let codeInput, priceInput, countInput;
let purchaseInput, paymentInput;
let addButton, purchaseButton, saveButton, clearButton;

let inventoryDiv, logDiv;
let errorDiv, popupDiv;

let isDraggingInventory = false, invStartY = 0, invScrollStart = 0;
let isDraggingLog = false, logStartY = 0, logScrollStart = 0;

// ------------------------ FIREBASE ------------------------
const firebaseConfig = {
  apiKey: "AIzaSyAuWCelzmOrkGJnm1rky81gh23dhBxBM7E",
  authDomain: "inventory-23906.firebaseapp.com",
  projectId: "inventory-23906",
  storageBucket: "inventory-23906.firebasestorage.app",
  messagingSenderId: "692625511622",
  appId: "1:692625511622:web:6995fc9d44b0ff132e33c7"
};

function initFirebase() {
  // This works only if compat scripts are loaded BEFORE sketch.js
  firebase.initializeApp(firebaseConfig);
  db = firebase.firestore();
  console.log("Firebase initialized!");
}

// ------------------------ SETUP ------------------------
function setup() {
  noCanvas();
  initFirebase();
  loadFromFirebase();

  // --- Inventory Inputs ---
  codeInput = createInput("").attribute("placeholder", "Item Code").position(20, 20).style("width", "100px");
  priceInput = createInput("").attribute("placeholder", "Price").position(130, 20).style("width", "80px");
  countInput = createInput("").attribute("placeholder", "Count").position(220, 20).style("width", "80px");
  addButton = createButton("Add Item").position(310, 20).mousePressed(addItem);

  // --- Purchase Inputs ---
  purchaseInput = createInput("").attribute("placeholder", "Codes: LO89, KO90").position(20, 60).style("width", "200px");
  paymentInput = createInput("").attribute("placeholder", "Payment Method").position(230, 60).style("width", "120px");
  purchaseButton = createButton("Process Purchase").position(360, 60).mousePressed(processPurchase);

  // --- Export & Clear ---
  saveButton = createButton("Export to TXT").position(20, 100).mousePressed(exportToText);
  clearButton = createButton("Clear All Data").pos

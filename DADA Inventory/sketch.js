window.onload = () => {
  new p5(mainSketch);
};

const mainSketch = (p) => {
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
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    console.log("Firebase initialized!");
  }

  // ------------------------ SETUP ------------------------
  p.setup = () => {
    p.noCanvas();
    initFirebase();
    loadFromFirebase();

    // --- Inventory Inputs ---
    codeInput = p.createInput("").attribute("placeholder", "Item Code").position(20, 20).style("width", "100px");
    priceInput = p.createInput("").attribute("placeholder", "Price").position(130, 20).style("width", "80px");
    countInput = p.createInput("").attribute("placeholder", "Count").position(220, 20).style("width", "80px");
    addButton = p.createButton("Add Item").position(310, 20).mousePressed(addItem);

    // --- Purchase Inputs ---
    purchaseInput = p.createInput("").attribute("placeholder", "Codes: LO89, KO90").position(20, 60).style("width", "200px");
    paymentInput = p.createInput("").attribute("placeholder", "Payment Method").position(230, 60).style("width", "120px");
    purchaseButton = p.createButton("Process Purchase").position(360, 60).mousePressed(processPurchase);

    // --- Export & Clear ---
    saveButton = p.createButton("Export to TXT").position(20, 100).mousePressed(exportToText);
    clearButton = p.createButton("Clear All Data").position(130, 100)
      .style("background-color", "#f66").style("color", "white")
      .style("padding", "6px 12px").style("border-radius", "6px")
      .mousePressed(clearAllData);

    // --- Error Message ---
    errorDiv = p.createDiv("").position(20, 140).style("color", "red").style("font-weight", "bold");

    // --- Inventory & Log Divs ---
    inventoryDiv = p.createDiv("").position(20, 170).size(560, 200)
      .style("overflow-y", "scroll").style("background", "#fff").style("padding", "10px")
      .style("border", "1px solid #aaa").style("border-radius", "8px");
    inventoryDiv.mousePressed(() => { isDraggingInventory = true; invStartY = p.mouseY; invScrollStart = inventoryDiv.elt.scrollTop; });
    inventoryDiv.mouseReleased(() => { isDraggingInventory = false; });

    logDiv = p.createDiv("").position(20, 380).size(560, 250)
      .style("overflow-y", "scroll").style("background", "#fff").style("padding", "10px")
      .style("border", "1px solid #aaa").style("border-radius", "8px");
    logDiv.mousePressed(() => { isDraggingLog = true; logStartY = p.mouseY; logScrollStart = logDiv.elt.scrollTop; });
    logDiv.mouseReleased(() => { isDraggingLog = false; });

    // --- Popup ---
    popupDiv = p.createDiv("").style("display", "none")
      .style("position", "fixed").style("top", "20%").style("left", "50%")
      .style("transform", "translateX(-50%)").style("background", "#ffd").style("padding", "15px")
      .style("border", "2px solid #999").style("border-radius", "10px").style("z-index", "1000");

    renderInventory();
    renderLogs();
  };

  // ------------------------ FIREBASE FUNCTIONS ------------------------
  function saveToFirebase() {
    db.collection("inventoryApp").doc("data").set({ inventory, logs, totalRevenue });
  }

  function loadFromFirebase() {
    db.collection("inventoryApp").doc("data").get()
      .then(docSnap => {
        if (docSnap.exists) {
          const data = docSnap.data();
          inventory = data.inventory || {};
          logs = data.logs || [];
          totalRevenue = data.totalRevenue || 0;
          renderInventory();
          renderLogs();
        }
      }).catch(err => console.error("Firebase load error:", err));
  }

  // ------------------------ INVENTORY ------------------------
  function addItem() {
    let code = codeInput.value().trim().toUpperCase();
    let price = parseFloat(priceInput.value());
    let count = parseInt(countInput.value());
    if (code && !isNaN(price) && !isNaN(count)) {
      if (!inventory[code]) inventory[code] = { price, count, sold: 0 };
      else { inventory[code].price = price; inventory[code].count += count; }
      errorDiv.html("");
    } else errorDiv.html("Invalid inventory input!");
    codeInput.value(""); priceInput.value(""); countInput.value = "";
    renderInventory(); saveToFirebase();
  }

  // ------------------------ PURCHASE ------------------------
  function processPurchase() {
    errorDiv.html("");
    let rawInput = purchaseInput.value();
    let payment = paymentInput.value().trim();
    if (!rawInput) { errorDiv.html("Enter codes to purchase."); return; }
    if (!payment) { errorDiv.html("Please enter a payment method."); return; }

    let codes = rawInput.split(",").map(c => c.trim().toUpperCase()).filter(c => c !== "");
    let needed = {}, missing = [], outOfStock = [];
    for (let c of codes) needed[c] = (needed[c] || 0) + 1;
    for (let code in needed) {
      if (!inventory[code]) missing.push(code);
      else if (inventory[code].count < needed[code]) outOfStock.push(`${code} (need ${needed[code]}, have ${inventory[code].count})`);
    }
    if (missing.length || outOfStock.length) {
      let msg = "";
      if (missing.length) msg += "Missing: " + missing.join(", ") + ". ";
      if (outOfStock.length) msg += "Out of stock: " + outOfStock.join(", ");
      errorDiv.html(msg); return;
    }

    let total = 0;
    for (let c of codes) { inventory[c].count -= 1; inventory[c].sold += 1; total += inventory[c].price; }
    totalRevenue += total;

    let logEntry = { text: `${new Date().toLocaleString()} | ${codes.join(", ")} | $${total.toFixed(2)} | ${payment}` };
    logs.unshift(logEntry);
    showPopup(logEntry.text);

    purchaseInput.value(""); paymentInput.value = "";
    renderInventory(); renderLogs(); saveToFirebase();
  }

  // ------------------------ CLEAR ALL ------------------------
  function clearAllData() {
    const password = prompt("Enter password to clear all data:");
    if (password === "Coffee") {
      if (confirm("Are you sure you want to permanently delete ALL data?")) {
        inventory = {}; logs = []; totalRevenue = 0;
        renderInventory(); renderLogs();
        saveToFirebase();
        alert("All data cleared successfully!");
      }
    } else alert("Incorrect password. Data not cleared.");
  }

  // ------------------------ RENDER ------------------------
  function renderInventory() {
    inventoryDiv.html("");
    let sorted = Object.keys(inventory).sort();
    if (sorted.length === 0) { inventoryDiv.html("<i>No inventory yet.</i>"); return; }
    for (let code of sorted) {
      let item = inventory[code];
      let row = p.createDiv(`<b>${code}</b> — $${item.price} — Left: ${item.count} — Sold: ${item.sold} — Revenue: $${(item.sold * item.price).toFixed(2)}`);
      row.parent(inventoryDiv); row.style("margin-bottom", "6px");
      let del = p.createButton("Delete"); del.parent(row);
      del.mousePressed(() => { delete inventory[code]; renderInventory(); renderLogs(); saveToFirebase(); });
    }
  }

  function renderLogs() {
    logDiv.html("");
    if (logs.length === 0) logDiv.html("<i>No transactions yet.</i>");
    else logs.forEach((entry, i) => {
      let row = p.createDiv(entry.text); row.parent(logDiv); row.style("margin-bottom", "6px");
      let del = p.createButton("X"); del.parent(row);
      del.mousePressed(() => {
        let match = entry.text.match(/\$(\d+(\.\d+)?)/);
        if (match) totalRevenue -= parseFloat(match[1]);
        logs.splice(i, 1); renderLogs(); saveToFirebase();
      });
    });
    let revDiv = p.createDiv(`<b>Total Revenue: $${totalRevenue.toFixed(2)}</b>`);
    revDiv.parent(logDiv); revDiv.style("margin-top", "10px").style("color", "green");
  }

  // ------------------------ EXPORT ------------------------
  function exportToText() {
    let content = "=== Inventory ===\n\n";
    let sorted = Object.keys(inventory).sort();
    for (let code of sorted) {
      let i = inventory[code];
      content += `${code} | Price: ${i.price} | Count: ${i.count} | Sold: ${i.sold} | Revenue: ${(i.sold * i.price).toFixed(2)}\n`;
    }
    content += "\n=== Logs (Newest First) ===\n\n";
    for (let entry of logs) content += entry.text + "\n";
    p.saveStrings([content], "inventory_log.txt");
  }

  // ------------------------ POPUP ------------------------
  function showPopup(text) {
    popupDiv.html("");
    let pTag = p.createP(text); pTag.parent(popupDiv);
    let closeBtn = p.createButton("X"); closeBtn.parent(popupDiv);
    closeBtn.mousePressed(() => { popupDiv.style("display", "none"); });
    popupDiv.style("display", "block").style("text-align", "center");
  }

  // ------------------------ DRAW ------------------------
  p.draw = () => {
    if (isDraggingInventory) inventoryDiv.elt.scrollTop = invScrollStart + (invStartY - p.mouseY);
    if (isDraggingLog) logDiv.elt.scrollTop = logScrollStart + (logStartY - p.mouseY);
  };
};

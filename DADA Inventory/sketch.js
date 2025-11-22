let inventory = {};
let logs = [];
let totalRevenue = 0;

// Inputs
let codeInput, priceInput, countInput;
let purchaseInput, paymentInput;

// Buttons
let addButton, purchaseButton, saveButton;

// Scrollable divs
let inventoryDiv, logDiv;

// Error and popup
let errorDiv, popupDiv;

function setup() {
  loadData(); // Load saved data first

  createCanvas(600, 100);
  textSize(14);

  // Inventory inputs
  codeInput = createInput("").attribute("placeholder", "Item Code");
  codeInput.position(20, 20);

  priceInput = createInput("").attribute("placeholder", "Price");
  priceInput.position(150, 20);

  countInput = createInput("").attribute("placeholder", "Count");
  countInput.position(250, 20);

  addButton = createButton("Add Item");
  addButton.position(380, 20);
  addButton.mousePressed(addItem);

  // Purchase inputs
  purchaseInput = createInput("").attribute("placeholder", "Codes: LO89, KO90");
  purchaseInput.position(20, 60);

  paymentInput = createInput("").attribute("placeholder", "Payment Method");
  paymentInput.position(250, 60);

  purchaseButton = createButton("Process Purchase");
  purchaseButton.position(20, 100);
  purchaseButton.mousePressed(processPurchase);

  saveButton = createButton("Export to TXT");
  saveButton.position(160, 100);
  saveButton.mousePressed(exportToText);

  // Error div
  errorDiv = createDiv("");
  errorDiv.position(20, 140);
  errorDiv.style("color", "red");
  errorDiv.style("font-weight", "bold");

  // Scrollable inventory div
  inventoryDiv = createDiv("").position(20, 170).size(560, 220).style("overflow-y", "scroll").style("background", "#fff").style("padding", "10px").style("border", "1px solid #aaa").style("border-radius", "8px");

  // Scrollable log div
  logDiv = createDiv("").position(20, 400).size(560, 300).style("overflow-y", "scroll").style("background", "#fff").style("padding", "10px").style("border", "1px solid #aaa").style("border-radius", "8px");

  // Popup div for most recent transaction
  popupDiv = createDiv("").style("display", "none").style("position", "fixed").style("top", "20%").style("left", "50%").style("transform", "translateX(-50%)").style("background", "#ffd").style("padding", "15px").style("border", "2px solid #999").style("border-radius", "10px").style("z-index", "1000");

  document.body.style.overflow = "scroll";

  renderInventory();
  renderLogs();
}

// ------------------------ SAVE / LOAD ------------------------

function saveData() {
  let data = {
    inventory: inventory,
    logs: logs,
    totalRevenue: totalRevenue
  };
  localStorage.setItem('inventoryData', JSON.stringify(data));
}

function loadData() {
  let data = localStorage.getItem('inventoryData');
  if (data) {
    let parsed = JSON.parse(data);
    inventory = parsed.inventory || {};
    logs = parsed.logs || [];
    totalRevenue = parsed.totalRevenue || 0;
  }
}

// ------------------------ INVENTORY ------------------------

function addItem() {
  let code = codeInput.value().trim().toUpperCase();
  let price = parseFloat(priceInput.value());
  let count = parseInt(countInput.value());

  if (code && !isNaN(price) && !isNaN(count)) {
    if (!inventory[code]) {
      inventory[code] = { price, count, sold: 0 };
    } else {
      inventory[code].price = price;
      inventory[code].count += count;
    }
    errorDiv.html("");
  } else {
    errorDiv.html("Invalid inventory input!");
  }

  codeInput.value("");
  priceInput.value("");
  countInput.value("");
  renderInventory();
  renderLogs();
  saveData();
}

// ------------------------ PURCHASE ------------------------

function processPurchase() {
  errorDiv.html("");

  let rawInput = purchaseInput.value();
  let payment = paymentInput.value().trim();

  if (!rawInput) {
    errorDiv.html("Enter codes to purchase.");
    return;
  }

  if (!payment) {
    errorDiv.html("Please enter a payment method.");
    return;
  }

  let codes = rawInput.split(",").map(c => c.trim().toUpperCase()).filter(c => c !== "");

  let needed = {};
  let missing = [];
  let outOfStock = [];

  for (let c of codes) needed[c] = (needed[c] || 0) + 1;

  for (let code in needed) {
    if (!inventory[code]) missing.push(code);
    else if (inventory[code].count < needed[code]) outOfStock.push(`${code} (need ${needed[code]}, have ${inventory[code].count})`);
  }

  if (missing.length || outOfStock.length) {
    let msg = "";
    if (missing.length) msg += "Missing: " + missing.join(", ") + ". ";
    if (outOfStock.length) msg += "Out of stock: " + outOfStock.join(", ");
    errorDiv.html(msg);
    return;
  }

  // Apply purchase
  let total = 0;
  for (let c of codes) {
    inventory[c].count -= 1;
    inventory[c].sold += 1;
    total += inventory[c].price;
  }
  totalRevenue += total;

  let logEntry = {
    text: `${new Date().toLocaleString()} | ${codes.join(", ")} | $${total.toFixed(2)} | ${payment}`
  };

  logs.unshift(logEntry);
  showPopup(logEntry.text);

  purchaseInput.value("");
  paymentInput.value("");

  renderInventory();
  renderLogs();
  saveData();
}

// ------------------------ RENDER ------------------------

function renderInventory() {
  inventoryDiv.html("");
  let sorted = Object.keys(inventory).sort();
  if (sorted.length === 0) {
    inventoryDiv.html("<i>No inventory yet.</i>");
    return;
  }

  for (let code of sorted) {
    let item = inventory[code];
    let row = createDiv(`<b>${code}</b> — $${item.price} — Left: ${item.count} — Sold: ${item.sold} — Revenue: $${(item.sold*item.price).toFixed(2)}`);
    row.parent(inventoryDiv);
    row.style("margin-bottom", "6px");

    let del = createButton("Delete");
    del.parent(row);
    del.mousePressed(() => {
      delete inventory[code];
      renderInventory();
      renderLogs();
      saveData();
    });
  }
}

function renderLogs() {
  logDiv.html("");
  if (logs.length === 0) {
    logDiv.html("<i>No transactions yet.</i>");
  } else {
    logs.forEach((entry, i) => {
      let row = createDiv(entry.text);
      row.parent(logDiv);
      row.style("margin-bottom", "6px");

      let del = createButton("X");
      del.parent(row);
      del.mousePressed(() => {
        // Subtract this log's total from revenue
        let match = entry.text.match(/\$(\d+(\.\d+)?)/);
        if (match) totalRevenue -= parseFloat(match[1]);
        logs.splice(i, 1);
        renderLogs();
        saveData();
      });
    });
  }

  // Total revenue at bottom
  let revDiv = createDiv(`<b>Total Revenue: $${totalRevenue.toFixed(2)}</b>`);
  revDiv.parent(logDiv);
  revDiv.style("margin-top", "10px");
  revDiv.style("color", "green");
}

// ------------------------ EXPORT ------------------------

function exportToText() {
  let content = "=== Inventory ===\n\n";
  let sorted = Object.keys(inventory).sort();
  for (let code of sorted) {
    let i = inventory[code];
    content += `${code} | Price: ${i.price} | Count: ${i.count} | Sold: ${i.sold} | Revenue: ${(i.sold*i.price).toFixed(2)}\n`;
  }

  content += "\n=== Logs (Newest First) ===\n\n";
  for (let entry of logs) {
    content += entry.text + "\n";
  }

  saveStrings([content], "inventory_log.txt");
}

// ------------------------ POPUP ------------------------

function showPopup(text) {
  popupDiv.html("");
  let p = createP(text);
  p.parent(popupDiv);

  let closeBtn = createButton("X");
  closeBtn.parent(popupDiv);
  closeBtn.mousePressed(() => {
    popupDiv.style("display", "none");
  });

  popupDiv.style("display", "block");
  popupDiv.style("text-align", "center");
}

function draw() {
  background(240);
}

const viewerForm = document.getElementById("viewerForm");
const viewerList = document.getElementById("viewerList");

let viewers = JSON.parse(localStorage.getItem("viewers")) || [];
displayViewers();

viewerForm.addEventListener("submit", e => {
    e.preventDefault();
    const formData = new FormData(viewerForm);
    const newViewer = {
        name: formData.get("name"),
        amount: formData.get("amount"),
        whatsapp: formData.get("whatsapp"),
        id: Date.now()
    };
    viewers.push(newViewer);
    localStorage.setItem("viewers", JSON.stringify(viewers));
    viewerForm.reset();
    displayViewers();
});

function displayViewers() {
    viewerList.innerHTML = "";
    viewers.forEach(viewer => {
        const container = document.createElement("div");
        container.className = "bg-white p-4 rounded shadow flex justify-between items-center gap-4";

        const info = document.createElement("div");
        info.innerHTML = `
      <p><strong>Nom :</strong> ${viewer.name}</p>
      <p><strong>Montant :</strong> $${viewer.amount}</p>
      <p><strong>WhatsApp :</strong> ${viewer.whatsapp}</p>
      <div id="qrcode-${viewer.id}" class="mt-2"></div>
    `;

        const buttons = document.createElement("div");
        buttons.className = "flex flex-col gap-2";

        const sendBtn = document.createElement("button");
        sendBtn.textContent = "🎟️ Envoyer Ticket";
        sendBtn.className = "bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700";
        sendBtn.onclick = () => {
            generateQRCode(viewer);
            sendWhatsApp(viewer);
        };

        const delBtn = document.createElement("button");
        delBtn.textContent = "🗑️ Supprimer";
        delBtn.className = "bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700";
        delBtn.onclick = () => {
            viewers = viewers.filter(v => v.id !== viewer.id);
            localStorage.setItem("viewers", JSON.stringify(viewers));
            displayViewers();
        };

        buttons.append(sendBtn, delBtn);
        container.append(info, buttons);
        viewerList.appendChild(container);
    });
}

function generateQRCode(viewer) {
    const containerId = `qrcode-${viewer.id}`;
    const qrText = `🎟️ RBM Billet\nNom: ${viewer.name}\nMontant: $${viewer.amount}`;
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    QRCode.toCanvas(document.createElement("canvas"), qrText, { width: 100 }, (err, canvas) => {
        if (!err) container.appendChild(canvas);
    });
}



const teamForm = document.getElementById("teamForm");
const teamList = document.getElementById("teamList");

let teams = JSON.parse(localStorage.getItem("teams")) || [];
displayTeams();

teamForm.addEventListener("submit", e => {
    e.preventDefault();
    const formData = new FormData(teamForm);
    const newTeam = {
        team: formData.get("team"),
        captain: formData.get("captain"),
        phone: formData.get("phone"),
        id: Date.now()
    };
    teams.push(newTeam);
    localStorage.setItem("teams", JSON.stringify(teams));
    teamForm.reset();
    displayTeams();
});

function displayTeams() {
  teamList.innerHTML = "";
  teams.forEach(team => {
    const container = document.createElement("div");
    container.className = "bg-white p-4 rounded shadow flex justify-between items-center gap-4";

    const info = document.createElement("div");
    info.innerHTML = `
      <p><strong>Équipe :</strong> ${team.team}</p>
      <p><strong>Capitaine :</strong> ${team.captain}</p>
      <p><strong>Téléphone :</strong> ${team.phone}</p>
    `;

    const delBtn = document.createElement("button");
    delBtn.textContent = "🗑️ Supprimer";
    delBtn.className = "bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700";
    delBtn.onclick = () => {
      teams = teams.filter(t => t.id !== team.id);
      localStorage.setItem("teams", JSON.stringify(teams));
      displayTeams();
    };

    const badgeBtn = document.createElement("button");
    badgeBtn.textContent = "🖨️ Imprimer Badge";
    badgeBtn.className = "bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700";
    badgeBtn.onclick = () => printBadge(team);

    const buttons = document.createElement("div");
    buttons.className = "flex flex-col gap-2";
    buttons.append(badgeBtn, delBtn);

    container.append(info, buttons);
    teamList.appendChild(container);
  });
}

function printBadge(team) {
  const win = window.open('', 'Imprimer le badge', 'height=500,width=400');
  const qrCanvas = document.createElement("canvas");
  const qrText = `Équipe: ${team.team}\nCapitaine: ${team.captain}\nTel: ${team.phone}`;

  QRCode.toCanvas(qrCanvas, qrText, { width: 100 }, (err, canvas) => {
    if (!err) {
      const dataURL = canvas.toDataURL();

      win.document.write(`
        <html>
          <head>
            <title>Badge Équipe</title>
            <style>
              body { font-family: Arial, sans-serif; text-align: center; }
              .badge {
                border: 2px solid #333;
                padding: 20px;
                margin: 20px;
                width: 300px;
              }
              .logo {
                width: 80px;
                margin-bottom: 10px;
              }
              .qrcode {
                margin-top: 10px;
              }
            </style>
          </head>
          <body onload="window.print(); window.close();">
            <div class="badge">
              <img src="./img/RBM LOGO.png" alt="Logo RBM" class="logo" />
              <h2>🎟️ Badge Équipe</h2>
              <p><strong>Équipe :</strong> ${team.team}</p>
              <p><strong>Capitaine :</strong> ${team.captain}</p>
              <p><strong>WhatsApp :</strong> ${team.phone}</p>
              <div class="qrcode">
                <img src="${dataURL}" />
              </div>
            </div>
          </body>
        </html>
      `);
    }
  });
}
function startQRScanner() {
  const scanner = new Html5Qrcode("reader");

  scanner.start(
    { facingMode: "environment" }, // Utilise la caméra arrière sur mobile
    {
      fps: 10,
      qrbox: { width: 250, height: 250 },
    },
    qrCodeMessage => {
      document.getElementById("scanResult").innerText = "";
      validateQR(qrCodeMessage);
      scanner.stop().then(() => {
        console.log("Scanner arrêté après lecture.");
      });
    },
    errorMessage => {
      // console.log(`Erreur: ${errorMessage}`); // Désactiver si trop verbeux
    }
  ).catch(err => {
    console.error("Impossible de démarrer la caméra : ", err);
  });
}

// ========== SCAN QR ==========

function startQRScanner() {
  const scanner = new Html5Qrcode("reader");

  scanner.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: 250 },
    qrCodeMessage => {
      document.getElementById("scanResult").innerText = "";
      validateQR(qrCodeMessage);
      scanner.stop();
    },
    error => {}
  ).catch(err => console.error("Camera error:", err));
}

function validateQR(qrText) {
  let viewers = JSON.parse(localStorage.getItem("viewers")) || [];
  let teams = JSON.parse(localStorage.getItem("teams")) || [];

  const viewerIndex = viewers.findIndex(v => qrText.includes(v.name) && qrText.includes(v.whatsapp));
  const teamIndex = teams.findIndex(t => qrText.includes(t.team) && qrText.includes(t.captain));

  const resultEl = document.getElementById("scanResult");

  if (viewerIndex !== -1) {
    const viewer = viewers[viewerIndex];
    if (viewer.validated) {
      resultEl.innerHTML = `⚠️ <strong>${viewer.name}</strong> a déjà été validé !<br>🚫 Accès refusé.`;
    } else {
      viewers[viewerIndex].validated = true;
      viewers[viewerIndex].validatedAt = new Date().toISOString();
      localStorage.setItem("viewers", JSON.stringify(viewers));
      addToHistory("spectateur", viewer.name, viewer.whatsapp);
      resultEl.innerHTML = `✅ Spectateur validé : <strong>${viewer.name}</strong><br>🕒 ${new Date().toLocaleString()}`;
      displayHistory();
    }
  } else if (teamIndex !== -1) {
    const team = teams[teamIndex];
    if (team.validated) {
      resultEl.innerHTML = `⚠️ Équipe <strong>${team.team}</strong> déjà validée !<br>🚫 Accès refusé.`;
    } else {
      teams[teamIndex].validated = true;
      teams[teamIndex].validatedAt = new Date().toISOString();
      localStorage.setItem("teams", JSON.stringify(teams));
      addToHistory("équipe", team.team, team.phone);
      resultEl.innerHTML = `✅ Équipe validée : <strong>${team.team}</strong><br>🕒 ${new Date().toLocaleString()}`;
      displayHistory();
    }
  } else {
    resultEl.innerHTML = `❌ QR Code non reconnu<br>Veuillez vérifier le billet.`;
  }
}

function addToHistory(type, name, phone) {
  const history = JSON.parse(localStorage.getItem("scanHistory")) || [];
  history.push({ type, name, phone, date: new Date().toISOString() });
  localStorage.setItem("scanHistory", JSON.stringify(history));
}

function displayHistory() {
  const data = JSON.parse(localStorage.getItem("scanHistory")) || [];
  const table = document.createElement("table");
  table.className = "min-w-full text-sm text-left border";

  const thead = `
    <thead class="bg-gray-200">
      <tr>
        <th class="p-2 border">Type</th>
        <th class="p-2 border">Nom</th>
        <th class="p-2 border">Téléphone</th>
        <th class="p-2 border">Date</th>
      </tr>
    </thead>
  `;

  const tbody = `
    <tbody>
      ${data.map(row => `
        <tr>
          <td class="p-2 border">${row.type}</td>
          <td class="p-2 border">${row.name}</td>
          <td class="p-2 border">${row.phone}</td>
          <td class="p-2 border">${new Date(row.date).toLocaleString()}</td>
        </tr>
      `).join('')}
    </tbody>
  `;

  table.innerHTML = thead + tbody;
  document.getElementById("historyTable").innerHTML = "";
  document.getElementById("historyTable").appendChild(table);
}

function exportCSV() {
  const data = JSON.parse(localStorage.getItem("scanHistory")) || [];
  if (!data.length) return alert("Aucun scan à exporter.");

  const csv = [
    ["Type", "Nom", "Téléphone", "Date"],
    ...data.map(row => [row.type, row.name, row.phone, row.date])
  ].map(e => e.join(",")).join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `historique_scans_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// ========== AUTO LOAD ==========
window.onload = () => {
  startQRScanner();
  displayHistory();
};
function afficherEquipe(team) {
  const teamList = document.getElementById("teamList");

  const card = document.createElement("div");
  card.className = "bg-white rounded-2xl shadow-md p-5 transition transform hover:scale-[1.02] hover:shadow-lg duration-300";

  card.innerHTML = `
    <h3 class="text-xl font-semibold text-gray-800">⚽ ${team.team}</h3>
    <p class="text-sm text-gray-500 mt-1">👨‍✈️ Capitaine : ${team.captain}</p>
    <p class="text-sm text-gray-500">📱 WhatsApp : ${team.phone}</p>
  `;

  teamList.appendChild(card);
}

  const toggleButton = document.getElementById("toggleButton");

  let isExpanded = false;

  function renderViewers(limit = 4) {
    viewerList.innerHTML = "";

    const toDisplay = isExpanded ? viewers : viewers.slice(0, limit);

    toDisplay.forEach((viewer, index) => {
      const card = document.createElement("div");
      card.className = "p-4 bg-gray-100 rounded-md shadow-md border border-gray-200";

      card.innerHTML = `
        <h3 class="text-lg font-semibold text-gray-700">${viewer.name}</h3>
        <p class="text-sm text-gray-600">📍 ${viewer.address}</p>
        <p class="text-sm text-gray-600">📞 ${viewer.whatsapp}</p>
        <p class="text-sm text-gray-600">✉️ ${viewer.email}</p>

        <div class="mt-4 flex gap-2">
          <button onclick="sendTicket(${index})" class="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-sm rounded">🎫 Envoyer Ticket</button>
          <button onclick="deleteViewer(${index})" class="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded">🗑️ Supprimer</button>
        </div>
      `;

      viewerList.appendChild(card);
    });

    toggleButton.style.display = viewers.length > 4 ? "block" : "none";
    toggleButton.textContent = isExpanded ? "Réduire" : "Afficher tout";
  }

  function sendTicket(index) {
    const viewer = viewers[index];
    // Message SANS obligation d'adresse si non fournie
    let message = `🎫 Bonjour ${viewer.name}, vous êtes bien inscrit(e) au show du tournoi !%0A`;
    message += `Montant payé: $${viewer.amount}%0A`;
    if (viewer.address) {
      message += `Adresse: ${viewer.address}%0A`;
    }
    message += `Téléphone: +${viewer.whatsapp}`;

    const whatsappURL = `https://wa.me/+${viewer.whatsapp}?text=${message}`;
    window.open(whatsappURL, "_blank");
  }

  function deleteViewer(index) {
    if (confirm("❗ Voulez-vous vraiment supprimer ce spectateur ?")) {
      viewers.splice(index, 1);
      localStorage.setItem("viewers", JSON.stringify(viewers));
      renderViewers();
    }
  }

  toggleButton.addEventListener("click", () => {
    isExpanded = !isExpanded;
    renderViewers();
  });

  // Initial render
  renderViewers();
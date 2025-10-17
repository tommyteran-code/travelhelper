document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("modal");
  const modalBody = document.getElementById("modal-body");
  const modalTitle = document.getElementById("modal-title");
  const closeBtn = document.getElementById("modal-close");

  // === Apertura del modal ===
  document.querySelectorAll(".open-modal").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const card = e.target.closest(".card");
      const title = card.querySelector("strong").textContent;
      const content = card.querySelector(".card-details").innerHTML;

      modalTitle.textContent = title;
      modalBody.innerHTML = content;
      modal.style.display = "flex";
      modal.setAttribute("aria-hidden", "false");

      inicializarFuncionesModal(); // 👈 activa funciones según el contenido cargado
    });
  });

  // === Cierre del modal ===
  closeBtn.addEventListener("click", cerrarModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) cerrarModal();
  });

  function cerrarModal() {
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
  }

  // ===============================
  // Inicializa funciones del modal
  // ===============================
  function inicializarFuncionesModal() {

    // --- Cotización USD/ARS ---
    const cotBtn = modalBody.querySelector("#cot_btn");
    if (cotBtn) {
      cotBtn.onclick = async () => {
        const monto = parseFloat(modalBody.querySelector("#cot_monto").value);
        const out = modalBody.querySelector("#cot_out");
        out.textContent = "Cargando...";
        try {
          const res = await fetch("https://api.exchangerate.host/latest?base=USD&symbols=ARS");
          const data = await res.json();
          const tasa = data.rates.ARS;
          out.textContent = `${monto} USD = ${(monto * tasa).toFixed(2)} ARS`;
        } catch {
          out.textContent = "Error al obtener cotización.";
        }
      };
    }

    // --- Propinas ---
    const propBtn = modalBody.querySelector("#prop_btn");
    if (propBtn) {
      propBtn.onclick = () => {
        const total = parseFloat(modalBody.querySelector("#prop_total").value);
        const pct = parseFloat(modalBody.querySelector("#prop_pct").value);
        const out = modalBody.querySelector("#prop_out");
        if (isNaN(total) || isNaN(pct)) {
          out.textContent = "Complete ambos campos.";
          return;
        }
        const propina = (total * pct) / 100;
        out.textContent = `Propina sugerida: ${propina.toFixed(2)}`;
      };
    }

    // --- Zonas horarias ---
    const tzOrigen = modalBody.querySelector("#tz_origen");
    const tzDestino = modalBody.querySelector("#tz_destino");
    const tzBtn = modalBody.querySelector("#tz_btn");
    const tzOut = modalBody.querySelector("#tz_out");

    if (tzOrigen && tzDestino && tzBtn) {
      const zonas = [
        "America/Argentina/Buenos_Aires",
        "America/New_York",
        "Europe/London",
        "Europe/Paris",
        "Asia/Tokyo",
        "America/Mexico_City",
        "America/Santiago",
        "America/Lima",
        "Australia/Sydney",
      ];

      // cargar opciones solo una vez
      if (!tzOrigen.children.length) {
        zonas.forEach((z) => {
          const opt1 = document.createElement("option");
          const opt2 = document.createElement("option");
          opt1.value = opt2.value = z;
          opt1.textContent = opt2.textContent = z.replaceAll("_", " ");
          tzOrigen.appendChild(opt1);
          tzDestino.appendChild(opt2);
        });
        tzOrigen.value = "America/Argentina/Buenos_Aires";
        tzDestino.value = "Europe/London";
      }

      tzBtn.onclick = async () => {
        const origen = tzOrigen.value;
        const destino = tzDestino.value;
        const horaLocal = modalBody.querySelector("#tz_local_time").value;

        if (!horaLocal) {
          tzOut.textContent = "Ingrese una hora.";
          return;
        }

        try {
          const [res1, res2] = await Promise.all([
            fetch(`https://worldtimeapi.org/api/timezone/${origen}`),
            fetch(`https://worldtimeapi.org/api/timezone/${destino}`),
          ]);
          const data1 = await res1.json();
          const data2 = await res2.json();

          const [h, m] = horaLocal.split(":").map(Number);
          const toMins = (t) => {
            const sign = t[0] === "-" ? -1 : 1;
            const [hh, mm] = t.slice(1).split(":").map(Number);
            return sign * (hh * 60 + mm);
          };

          const diff = toMins(data2.utc_offset) - toMins(data1.utc_offset);
          let total = h * 60 + m + diff;
          total = ((total % 1440) + 1440) % 1440;
          const newH = Math.floor(total / 60).toString().padStart(2, "0");
          const newM = (total % 60).toString().padStart(2, "0");

          tzOut.textContent = `En ${destino.replaceAll("_", " ")} son las ${newH}:${newM}`;
        } catch {
          tzOut.textContent = "Error al convertir hora.";
        }
      };
    }

    // --- Frases ---
    const fraseBtn = modalBody.querySelector("#frase_btn");
    if (fraseBtn) {
      const frases = {
        en: [
          { frase: "How are you today?", significado: "¿Cómo estás hoy?" },
          { frase: "Where is the airport?", significado: "¿Dónde está el aeropuerto?" },
          { frase: "Can you help me?", significado: "¿Puedes ayudarme?" },
          { frase: "I need a doctor", significado: "Necesito un médico" },
        ],
        es: [
          { frase: "¿Dónde está el baño?", significado: "Where is the bathroom?" },
          { frase: "Necesito ayuda urgente", significado: "I need urgent help" },
          { frase: "¿Cuánto cuesta esto?", significado: "How much is this?" },
          { frase: "Me siento muy bien", significado: "I feel very good" },
        ],
        pt: [
          { frase: "Onde fica o hotel?", significado: "¿Dónde queda el hotel?" },
          { frase: "Quanto isso custa?", significado: "¿Cuánto cuesta eso?" },
          { frase: "Preciso de um médico", significado: "Necesito un médico" },
          { frase: "Pode me ajudar?", significado: "¿Puedes ayudarme?" },
        ],
        fr: [
          { frase: "Où est la gare?", significado: "¿Dónde está la estación?" },
          { frase: "Combien ça coûte?", significado: "¿Cuánto cuesta?" },
          { frase: "Je ne parle pas bien", significado: "No hablo bien" },
          { frase: "Pouvez-vous m'aider?", significado: "¿Puede ayudarme?" },
        ],
      };

      fraseBtn.onclick = () => {
        const lang = modalBody.querySelector("#lang_frase").value;
        const out = modalBody.querySelector("#frase_out");
        const arr = frases[lang];
        const aleatoria = arr[Math.floor(Math.random() * arr.length)];
        out.innerHTML = `<strong>${aleatoria.frase}</strong><br><small>${aleatoria.significado}</small>`;
      };
    }

    // --- Presupuesto diario ---
    const presBtn = modalBody.querySelector("#pres_btn");
    if (presBtn) {
      presBtn.onclick = () => {
        const total = parseFloat(modalBody.querySelector("#pres_total").value);
        const dias = parseInt(modalBody.querySelector("#pres_days").value);
        const out = modalBody.querySelector("#pres_out");
        if (!total || !dias) {
          out.textContent = "Complete ambos campos.";
          return;
        }
        out.textContent = `Podés gastar ${(total / dias).toFixed(2)} por día.`;
      };
    }
  }
});



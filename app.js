document.addEventListener("DOMContentLoaded", async () => {
  initControls(document);

  // Cotización inicial del dólar
  async function initShowRate() {
    try {
      const res = await fetch("https://api.exchangerate.host/latest?base=USD&symbols=ARS");
      const data = await res.json();
      const rate = data.rates.ARS.toFixed(2);
      document.getElementById("usd_rate").textContent = `1 USD = ${rate} ARS`;
    } catch (err) {
      document.getElementById("usd_rate").textContent = "Error al obtener cotización";
    }
  }
  initShowRate();
});

function initControls(root) {
  if (root.__attached) return;
  root.__attached = true;

  // ============================
  // 🔹 COTIZADOR USD → ARS
  // ============================
  const amountInput = root.querySelector("#usd_amount");
  const convertBtn = root.querySelector("#usd_convert");
  const resultDiv = root.querySelector("#usd_result");

  if (convertBtn) {
    convertBtn.addEventListener("click", async () => {
      const amount = parseFloat(amountInput.value) || 0;
      if (amount <= 0) {
        resultDiv.textContent = "Ingrese un valor válido (1-1000 USD)";
        return;
      }
      try {
        const res = await fetch("https://api.exchangerate.host/latest?base=USD&symbols=ARS");
        const data = await res.json();
        const rate = data.rates.ARS;
        const total = (amount * rate).toFixed(2);
        resultDiv.textContent = `${amount} USD = ${total} ARS`;
      } catch (e) {
        resultDiv.textContent = "Error al obtener la cotización";
      }
    });
  }

  // ============================
  // 🔹 CALCULADORA DE PROPINAS
  // ============================
  const tipInput = root.querySelector("#tip_amount");
  const tipPercent = root.querySelector("#tip_percent");
  const tipBtn = root.querySelector("#tip_calc");
  const tipResult = root.querySelector("#tip_result");

  if (tipBtn) {
    tipBtn.addEventListener("click", () => {
      const amount = parseFloat(tipInput.value) || 0;
      const percent = parseFloat(tipPercent.value) || 10;
      const tip = (amount * percent / 100).toFixed(2);
      const total = (amount + parseFloat(tip)).toFixed(2);
      tipResult.textContent = `Propina: ${tip} — Total: ${total}`;
    });
  }

  // ============================
  // 🔹 CONVERSOR DE MEDIDAS
  // ============================
  const convInput = root.querySelector("#conv_value");
  const convFrom = root.querySelector("#conv_from");
  const convTo = root.querySelector("#conv_to");
  const convBtn = root.querySelector("#conv_btn");
  const convResult = root.querySelector("#conv_result");

  const factors = {
    km: 1000,
    m: 1,
    cm: 0.01,
    kg: 1,
    g: 0.001
  };

  if (convBtn) {
    convBtn.addEventListener("click", () => {
      const val = parseFloat(convInput.value);
      const from = convFrom.value;
      const to = convTo.value;
      if (isNaN(val)) {
        convResult.textContent = "Ingrese un valor válido";
        return;
      }
      const res = (val * (factors[from] / factors[to])).toFixed(4);
      convResult.textContent = `${val} ${from} = ${res} ${to}`;
    });
  }

  // ============================
  // 🔹 ZONA HORARIA
  // ============================
  const tzSelect = root.querySelector("#tz_city");
  const tzBtn = root.querySelector("#tz_btn");
  const tzResult = root.querySelector("#tz_result");

  if (tzBtn) {
    tzBtn.addEventListener("click", async () => {
      const city = tzSelect.value;
      try {
        const res = await fetch(`https://worldtimeapi.org/api/timezone/${city}`);
        const data = await res.json();
        const hora = new Date(data.datetime).toLocaleTimeString();
        tzResult.textContent = `Hora local en ${city.split('/')[1]}: ${hora}`;
      } catch (e) {
        tzResult.textContent = "Error al obtener hora";
      }
    });
  }

  // ============================
  // 🔹 CLIMA
  // ============================
  const weatherInput = root.querySelector("#weather_city");
  const weatherBtn = root.querySelector("#weather_btn");
  const weatherResult = root.querySelector("#weather_result");

  if (weatherBtn) {
    weatherBtn.addEventListener("click", async () => {
      let city = weatherInput.value.trim();
      if (!city) {
        weatherResult.textContent = "Ingrese una ciudad";
        return;
      }

      // ✅ Corrige tildes y mayúsculas
      city = city.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

      try {
        const res = await fetch(`https://wttr.in/${city}?format=3`);
        const data = await res.text();
        weatherResult.textContent = data;
      } catch (e) {
        weatherResult.textContent = "Error al obtener clima";
      }
    });
  }

  // ============================
  // 🔹 FRASES ÚTILES
  // ============================
  const frases = {
    en: ["Hello!", "How much does it cost?", "Where is the bathroom?"],
    es: ["¡Hola!", "¿Cuánto cuesta?", "¿Dónde está el baño?"],
    fr: ["Bonjour!", "Combien ça coûte?", "Où sont les toilettes?"]
  };

  const fraseBtn = root.querySelector("#frase_btn");
  const fraseLang = root.querySelector("#lang_frase");
  const fraseResult = root.querySelector("#frase_result");

  if (fraseBtn) {
    fraseBtn.addEventListener("click", () => {
      const lang = fraseLang.value;
      const arr = frases[lang] || [];
      fraseResult.textContent = arr[Math.floor(Math.random() * arr.length)];
    });
  }

  // ============================
  // 🔹 MODAL (Copia de funciones)
  // ============================
  const modalBtn = root.querySelector("#open_modal");
  const modal = document.querySelector("#modal");
  const modalContent = modal?.querySelector(".modal-content");

  if (modalBtn && modal && modalContent) {
    modalBtn.addEventListener("click", () => {
      modal.style.display = "block";
      const clone = document.querySelector("#app").cloneNode(true);

      // Prefijo IDs para evitar conflictos
      clone.querySelectorAll("[id]").forEach(el => {
        el.id = "modal_" + el.id;
      });

      modalContent.innerHTML = "";
      modalContent.appendChild(clone);
      initControls(clone);
    });

    modal.addEventListener("click", e => {
      if (e.target === modal) modal.style.display = "none";
    });
  }
}
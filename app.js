document.addEventListener("DOMContentLoaded", () => {
  // ============================
  // 🔹 MOSTRAR / OCULTAR SECCIONES
  // ============================
  const openButtons = document.querySelectorAll(".open-modal");
  openButtons.forEach(btn => {
    btn.addEventListener("click", e => {
      const card = e.target.closest(".card");
      const details = card.querySelector(".card-details");

      // Cierra todas las demás secciones
      document.querySelectorAll(".card-details").forEach(d => {
        d.style.display = "none";
      });

      // Muestra esta
      details.style.display = "block";
      details.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // ============================
  // 🔹 COTIZADOR USD → ARS
  // ============================
  const cotBtn = document.getElementById("cot_btn");
  if (cotBtn) {
    cotBtn.addEventListener("click", async () => {
      const monto = parseFloat(document.getElementById("cot_monto").value);
      const out = document.getElementById("cot_out");
      if (isNaN(monto) || monto <= 0) {
        out.textContent = "Ingrese un monto válido (1-1000)";
        return;
      }
      try {
        const res = await fetch("https://api.exchangerate.host/latest?base=USD&symbols=ARS");
        const data = await res.json();
        const rate = data.rates.ARS;
        out.textContent = `${monto} USD = ${(monto * rate).toFixed(2)} ARS`;
      } catch (err) {
        out.textContent = "Error al obtener cotización";
      }
    });
  }

  // ============================
  // 🔹 CALCULADORA DE PROPINAS
  // ============================
  const propBtn = document.getElementById("prop_btn");
  if (propBtn) {
    propBtn.addEventListener("click", () => {
      const total = parseFloat(document.getElementById("prop_total").value);
      const pct = parseFloat(document.getElementById("prop_pct").value);
      const out = document.getElementById("prop_out");
      if (isNaN(total) || isNaN(pct)) {
        out.textContent = "Ingrese valores válidos";
        return;
      }
      const propina = (total * pct / 100).toFixed(2);
      out.textContent = `Propina: ${propina} | Total: ${(total + parseFloat(propina)).toFixed(2)}`;
    });
  }

  // ============================
  // 🔹 CONVERSOR DE ZONA HORARIA
  // ============================
  const tzBtn = document.getElementById("tz_btn");
  if (tzBtn) {
    const selOrigen = document.getElementById("tz_origen");
    const selDestino = document.getElementById("tz_destino");
    const out = document.getElementById("tz_out");
    const localInput = document.getElementById("tz_local_time");

    // Carga de zonas horarias
    fetch("https://worldtimeapi.org/api/timezone")
      .then(r => r.json())
      .then(zonas => {
        zonas.forEach(z => {
          const opt1 = new Option(z, z);
          const opt2 = new Option(z, z);
          selOrigen.add(opt1);
          selDestino.add(opt2);
        });
        const guess = Intl.DateTimeFormat().resolvedOptions().timeZone;
        selOrigen.value = guess;
      });

    tzBtn.addEventListener("click", async () => {
      try {
        const origen = selOrigen.value;
        const destino = selDestino.value;
        const res = await fetch(`https://worldtimeapi.org/api/timezone/${destino}`);
        const data = await res.json();
        const horaDestino = new Date(data.datetime).toLocaleTimeString();
        out.textContent = `Hora en ${destino}: ${horaDestino}`;
      } catch (e) {
        out.textContent = "Error al obtener hora";
      }
    });
  }

  // ============================
  // 🔹 CONVERSOR DE MEDIDAS
  // ============================
  const convBtn = document.getElementById("conv_btn");
  if (convBtn) {
    convBtn.addEventListener("click", () => {
      const val = parseFloat(document.getElementById("conv_val").value);
      const tipo = document.getElementById("conv_tipo").value;
      const out = document.getElementById("conv_out");
      if (isNaN(val)) {
        out.textContent = "Ingrese un número válido";
        return;
      }
      let res;
      switch (tipo) {
        case "km_miles": res = (val * 0.621371).toFixed(2) + " mi"; break;
        case "miles_km": res = (val / 0.621371).toFixed(2) + " km"; break;
        case "kg_lbs": res = (val * 2.20462).toFixed(2) + " lb"; break;
        case "lbs_kg": res = (val / 2.20462).toFixed(2) + " kg"; break;
        case "c_f": res = ((val * 9/5) + 32).toFixed(1) + " °F"; break;
        case "f_c": res = ((val - 32) * 5/9).toFixed(1) + " °C"; break;
      }
      out.textContent = res;
    });
  }

  // ============================
  // 🔹 CLIMA RÁPIDO
  // ============================
  const climaBtn = document.getElementById("clima_btn");
  if (climaBtn) {
    climaBtn.addEventListener("click", async () => {
      const ciudad = document.getElementById("city_clima").value.trim();
      const out = document.getElementById("clima_out");
      if (!ciudad) {
        out.textContent = "Ingrese una ciudad";
        return;
      }
      try {
        const res = await fetch(`https://wttr.in/${encodeURIComponent(ciudad)}?format=3`);
        const data = await res.text();
        out.textContent = data;
      } catch {
        out.textContent = "Error al obtener clima";
      }
    });
  }

  // ============================
  // 🔹 PRESUPUESTO DIARIO
  // ============================
  const presBtn = document.getElementById("pres_btn");
  if (presBtn) {
    presBtn.addEventListener("click", () => {
      const total = parseFloat(document.getElementById("pres_total").value);
      const days = parseInt(document.getElementById("pres_days").value);
      const out = document.getElementById("pres_out");
      if (isNaN(total) || isNaN(days) || days <= 0) {
        out.textContent = "Datos inválidos";
        return;
      }
      const porDia = (total / days).toFixed(2);
      out.textContent = `Podés gastar ${porDia} por día.`;
    });
  }

  // ============================
  // 🔹 DIVISOR DE CUENTA
  // ============================
  const splitBtn = document.getElementById("split_btn");
  if (splitBtn) {
    splitBtn.addEventListener("click", () => {
      const total = parseFloat(document.getElementById("split_total").value);
      const people = parseInt(document.getElementById("split_people").value);
      const out = document.getElementById("split_out");
      if (isNaN(total) || isNaN(people) || people <= 0) {
        out.textContent = "Datos inválidos";
        return;
      }
      out.textContent = `Cada persona paga ${(total / people).toFixed(2)}`;
    });
  }

  // ============================
  // 🔹 FRASES ÚTILES
  // ============================
  const fraseBtn = document.getElementById("frase_btn");
  if (fraseBtn) {
    fraseBtn.addEventListener("click", () => {
      const lang = document.getElementById("lang_frase").value;
      const out = document.getElementById("frase_out");
      const frases = {
        en: ["Hello!", "Where is the bathroom?", "How much is this?", "Thank you!"],
        pt: ["Olá!", "Onde fica o banheiro?", "Quanto custa?", "Obrigado!"],
        fr: ["Bonjour!", "Où sont les toilettes?", "Combien ça coûte?", "Merci!"],
        es: ["¡Hola!", "¿Dónde está el baño?", "¿Cuánto cuesta?", "Gracias!"]
      };
      const arr = frases[lang];
      out.textContent = arr[Math.floor(Math.random() * arr.length)];
    });
  }
});


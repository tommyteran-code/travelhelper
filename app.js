// Esperar a que el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  const openButtons = document.querySelectorAll(".open-modal");
  const modal = document.getElementById("modal");
  const modalContent = document.querySelector(".modal-content");
  const closeModalBtn = document.getElementById("close-modal");

  // === FUNCIONES AL ABRIR CADA MODAL ===
  function inicializarFuncionesDelModal(modalBody) {

    // === 1. COTIZADOR USD → ARS ===
    const cotBtn = modalBody.querySelector("#cot_btn");
    if (cotBtn) {
      const cotMonto = modalBody.querySelector("#cot_monto");
      const cotOut = modalBody.querySelector("#cot_out");
      cotBtn.addEventListener("click", async () => {
        const monto = parseFloat(cotMonto.value);
        if (isNaN(monto) || monto <= 0) {
          cotOut.textContent = "Ingrese un monto válido.";
          return;
        }
        cotOut.textContent = "Consultando...";
        try {
          const res = await fetch("https://api.exchangerate.host/latest?base=USD&symbols=ARS");
          const data = await res.json();
          const rate = data.rates.ARS;
          cotOut.textContent = `${monto} USD = ${(monto * rate).toFixed(2)} ARS`;
        } catch (e) {
          cotOut.textContent = "Error al obtener cotización.";
        }
      });
    }

    // === 2. CALCULADORA DE PROPINAS ===
    const propBtn = modalBody.querySelector("#prop_btn");
    if (propBtn) {
      const total = modalBody.querySelector("#prop_total");
      const pct = modalBody.querySelector("#prop_pct");
      const out = modalBody.querySelector("#prop_out");
      propBtn.addEventListener("click", () => {
        const monto = parseFloat(total.value);
        const porcentaje = parseFloat(pct.value);
        if (isNaN(monto) || isNaN(porcentaje)) {
          out.textContent = "Ingrese valores válidos.";
          return;
        }
        const propina = (monto * porcentaje) / 100;
        out.textContent = `Propina: ${propina.toFixed(2)} — Total: ${(monto + propina).toFixed(2)}`;
      });
    }

    // === 3. CONVERSOR DE ZONA HORARIA ===
    const tzBtn = modalBody.querySelector("#tz_btn");
    if (tzBtn) {
      const tzOut = modalBody.querySelector("#tz_out");
      const tzOrigen = modalBody.querySelector("#tz_origen");
      const tzDestino = modalBody.querySelector("#tz_destino");
      const tzLocal = modalBody.querySelector("#tz_local_time");

      if (tzOrigen && tzOrigen.options.length === 0) {
        const zonas = [
          "America/Argentina/Buenos_Aires",
          "America/New_York",
          "Europe/London",
          "Asia/Tokyo",
          "Pacific/Auckland",
          "America/Mexico_City",
          "Europe/Madrid",
          "America/Santiago",
          "Asia/Dubai",
          "America/Lima"
        ];
        zonas.forEach((z) => {
          const opt1 = document.createElement("option");
          const opt2 = document.createElement("option");
          opt1.value = opt2.value = z;
          opt1.textContent = opt2.textContent = z;
          tzOrigen.appendChild(opt1);
          tzDestino.appendChild(opt2.cloneNode(true));
        });
        tzOrigen.value = "America/Argentina/Buenos_Aires";
        tzDestino.value = "Europe/London";
      }

      tzBtn.addEventListener("click", () => {
        try {
          const hora = tzLocal.value;
          const [h, m] = hora.split(":");
          const fecha = new Date();
          fecha.setHours(h);
          fecha.setMinutes(m);

          const zonaDestino = tzDestino.value;
          const options = {
            timeZone: zonaDestino,
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          };

          const horaConvertida = new Intl.DateTimeFormat("es-AR", options).format(fecha);
          tzOut.textContent = `Hora en ${zonaDestino}: ${horaConvertida}`;
        } catch (e) {
          tzOut.textContent = "Error al convertir hora.";
        }
      });
    }

    // === 4. CONVERSOR DE MEDIDAS ===
    const convBtn = modalBody.querySelector("#conv_btn");
    if (convBtn) {
      const convVal = modalBody.querySelector("#conv_val");
      const convTipo = modalBody.querySelector("#conv_tipo");
      const convOut = modalBody.querySelector("#conv_out");
      convBtn.addEventListener("click", () => {
        const val = parseFloat(convVal.value);
        let res;
        switch (convTipo.value) {
          case "km_miles": res = val * 0.621371; break;
          case "miles_km": res = val / 0.621371; break;
          case "kg_lbs": res = val * 2.20462; break;
          case "lbs_kg": res = val / 2.20462; break;
          case "c_f": res = (val * 9) / 5 + 32; break;
          case "f_c": res = ((val - 32) * 5) / 9; break;
        }
        convOut.textContent = `Resultado: ${res.toFixed(2)}`;
      });
    }

    // === 5. CLIMA ===
    const climaBtn = modalBody.querySelector("#clima_btn");
    if (climaBtn) {
      const cityInput = modalBody.querySelector("#city_clima");
      const climaOut = modalBody.querySelector("#clima_out");
      climaBtn.addEventListener("click", async () => {
        const ciudad = cityInput.value.trim();
        if (!ciudad) {
          climaOut.textContent = "Ingrese una ciudad.";
          return;
        }
        climaOut.textContent = "Consultando clima...";
        try {
          const res = await fetch(`https://wttr.in/${ciudad}?format=j1`);
          const data = await res.json();
          const cond = data.current_condition[0];
          climaOut.textContent = `🌡️ ${cond.temp_C}°C, ${cond.weatherDesc[0].value}. Sensación: ${cond.FeelsLikeC}°C.`;
        } catch (err) {
          climaOut.textContent = "Error al obtener el clima.";
        }
      });
    }

    // === 6. PRESUPUESTO DIARIO ===
    const presBtn = modalBody.querySelector("#pres_btn");
    if (presBtn) {
      const presTotal = modalBody.querySelector("#pres_total");
      const presDays = modalBody.querySelector("#pres_days");
      const presOut = modalBody.querySelector("#pres_out");
      presBtn.addEventListener("click", () => {
        const total = parseFloat(presTotal.value);
        const days = parseInt(presDays.value);
        if (isNaN(total) || isNaN(days) || days <= 0) {
          presOut.textContent = "Ingrese valores válidos.";
          return;
        }
        const diario = total / days;
        presOut.textContent = `Puedes gastar ${diario.toFixed(2)} por día.`;
      });
    }

    // === 7. DIVISOR DE CUENTA ===
    const splitBtn = modalBody.querySelector("#split_btn");
    if (splitBtn) {
      const total = modalBody.querySelector("#split_total");
      const people = modalBody.querySelector("#split_people");
      const out = modalBody.querySelector("#split_out");
      splitBtn.addEventListener("click", () => {
        const t = parseFloat(total.value);
        const p = parseInt(people.value);
        if (isNaN(t) || isNaN(p) || p <= 0) {
          out.textContent = "Ingrese valores válidos.";
          return;
        }
        out.textContent = `Cada persona paga: ${(t / p).toFixed(2)}`;
      });
    }

    // === 8. FRASES ÚTILES ===
    const fraseBtn = modalBody.querySelector("#frase_btn");
    if (fraseBtn) {
      const fraseOut = modalBody.querySelector("#frase_out");
      fraseBtn.addEventListener("click", () => {
        const frases = [
          ["Time flies so fast", "El tiempo pasa rápido"],
          ["Travel broadens mind", "Viajar abre la mente"],
          ["Collect moments not things", "Colecciona momentos, no cosas"],
          ["Dream explore discover live", "Sueña, explora, descubre, vive"],
          ["Adventure awaits brave souls", "La aventura espera a los valientes"],
        ];
        const f = frases[Math.floor(Math.random() * frases.length)];
        fraseOut.textContent = `"${f[0]}" → ${f[1]}`;
      });
    }
  }

  // === ABRIR MODAL ===
  openButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const card = e.target.closest(".card");
      const details = card.querySelector(".card-details").innerHTML;

      modalContent.innerHTML = details;
      modal.classList.add("show");

      // Llamamos a las funciones dentro del modal
      inicializarFuncionesDelModal(modalContent);
    });
  });

  // === CERRAR MODAL (botón o click afuera) ===
  closeModalBtn.addEventListener("click", () => {
    modal.classList.remove("show");
    modalContent.innerHTML = "";
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("show");
      modalContent.innerHTML = "";
    }
  });
});

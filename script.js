(() => {
  "use strict";

  const data = window.TRIP_DATA;
  if (!data) return;

  const STORAGE = {
    customActivities: "cosmicVirgos.customActivities.v1",
    activityEdits: "cosmicVirgos.activityEdits.v1",
    activityFlags: "cosmicVirgos.activityFlags.v1",
    notes: "cosmicVirgos.notes.v1",
    noteDraft: "cosmicVirgos.noteDraft.v1",
    packing: "cosmicVirgos.packing.v1"
  };

  const defaultNotes = [
    "Vote on the tattoo design and studio before booking.",
    "Choose the birthday dinner and brunch, then reserve for the full group.",
    "Bring the Practical Magic movie-night supplies."
  ];

  const defaultPacking = [
    "Cowboy boots",
    "Pretty dresses and fringe",
    "Witchy-night supplies",
    "Sun hat and sunglasses",
    "Chargers and adapters",
    "Birthday outfit"
  ].map((text) => ({ text, done: false }));

  let customActivities = readJSON(STORAGE.customActivities, []);
  let activityEdits = readJSON(STORAGE.activityEdits, {});
  let activityFlags = readJSON(STORAGE.activityFlags, {});
  let notes = readJSON(STORAGE.notes, defaultNotes);
  let packingItems = readJSON(STORAGE.packing, defaultPacking)
    .map((item) => typeof item === "string" ? { text: item, done: false } : item)
    .filter((item) => item && item.text);
  let selectedActivityId = data.activities[0]?.id || null;
  let toastTimer = null;

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  function readJSON(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  }

  function writeJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      showToast("This browser could not save your update.");
    }
  }

  function escapeHTML(value = "") {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function safeUrl(value = "") {
    try {
      const url = new URL(value);
      return ["http:", "https:"].includes(url.protocol) ? url.href : "";
    } catch {
      return "";
    }
  }

  function refreshIcons() {
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }
  }

  function showToast(message) {
    const toast = $("#toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
  }

  function getActivities() {
    return [...data.activities, ...customActivities].map((activity) => ({
      ...activity,
      ...(activityEdits[activity.id] || {})
    }));
  }

  function getActivity(id) {
    return getActivities().find((activity) => activity.id === id) || null;
  }

  function renderHero() {
    $("#tripDates").textContent = data.trip.datesLabel;
    $("#tripLocation").textContent = data.trip.location;
    $("#tripTagline").textContent = data.trip.tagline;
    $("#statTravelers").textContent = data.trip.travelers;
    $("#statNights").textContent = data.trip.nights;
    $("#heroImage").src = data.images.hero;
    $("#stayImage").src = data.images.stay;

    if (data.privacy?.locked || !data.trip.startDate) {
      $("#daysToGo").textContent = "Locked";
      return;
    }

    const tripStart = parseDateParts(data.trip.startDate);
    const today = new Date();
    const todayUTC = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
    const tripUTC = Date.UTC(tripStart.year, tripStart.month - 1, tripStart.day);
    const days = Math.ceil((tripUTC - todayUTC) / 86400000);
    $("#daysToGo").textContent = days > 0 ? days : days === 0 ? "Today" : "Done";
  }

  function renderFlights() {
    const flightList = $("#flightList");
    flightList.innerHTML = data.flights.map((person) => `
      <section class="flight-person">
        <div class="flight-name-row">
          <strong style="color:${escapeHTML(person.accent)}">${escapeHTML(person.traveler)}</strong>
          <span class="airline-pill">${escapeHTML(person.airline)}</span>
        </div>
        <div class="flight-leg">
          <div>
            <div class="flight-route">${escapeHTML(person.outbound.route)} · ${escapeHTML(person.outbound.flight)}</div>
            <div class="flight-sub">${escapeHTML(person.outbound.date)}${person.outbound.note ? ` · ${escapeHTML(person.outbound.note)}` : ""}</div>
          </div>
          <div class="flight-time">${escapeHTML(person.outbound.time)}</div>
        </div>
        <div class="flight-leg">
          <div>
            <div class="flight-route">${escapeHTML(person.return.route)} · ${escapeHTML(person.return.flight)}</div>
            <div class="flight-sub">${escapeHTML(person.return.date)}</div>
          </div>
          <div class="flight-time">${escapeHTML(person.return.time)}</div>
        </div>
        <div class="flight-meta">
          ${person.confirmation ? `<span>Confirmation: <strong>${escapeHTML(person.confirmation)}</strong></span>` : ""}
          ${person.seatNote ? `<span>${escapeHTML(person.seatNote)}</span>` : ""}
        </div>
      </section>
    `).join("");
    $("#airportNote").textContent = data.airportNote;
  }

  function renderCar() {
    const car = data.car;
    $("#carDetails").innerHTML = `
      <div class="car-brand">${escapeHTML(car.company)}</div>
      <div class="confirmation-box"><span>Confirmation</span><strong>${escapeHTML(car.confirmation)}</strong></div>
      <div class="car-route-block">
        <small>Pick-up</small>
        <strong>${escapeHTML(car.pickup.location)}</strong>
        <span>${escapeHTML(car.pickup.date)}</span>
        <span>${escapeHTML(car.pickup.time)}</span>
      </div>
      <div class="car-route-block">
        <small>Return</small>
        <strong>${escapeHTML(car.return.location)}</strong>
        <span>${escapeHTML(car.return.date)}</span>
        <span>${escapeHTML(car.return.time)}</span>
      </div>
    `;
  }

  function renderStay() {
    const stay = data.stay;
    const url = safeUrl(stay.url);
    $("#stayDetails").innerHTML = `
      <h4 class="stay-title">${escapeHTML(stay.title)}</h4>
      <div class="stay-host">Hosted by ${escapeHTML(stay.host)}</div>
      <ul class="stay-list">
        <li><i data-lucide="house"></i><span>${escapeHTML(stay.type)}</span></li>
        <li><i data-lucide="users"></i><span>${stay.guests} guests · ${stay.bedrooms} bedrooms · ${stay.beds} beds · ${stay.baths} baths</span></li>
        <li><i data-lucide="map-pin"></i><span>${escapeHTML(stay.area)}</span></li>
        ${stay.highlights.map((item) => `<li><i data-lucide="sparkles"></i><span>${escapeHTML(item)}</span></li>`).join("")}
        <li><i data-lucide="key-round"></i><span>${escapeHTML(stay.address)}</span></li>
      </ul>
      ${url ? `<a class="link-inline" href="${url}" target="_blank" rel="noreferrer">Open Airbnb listing ↗</a>` : ""}
    `;
  }

  function renderActivityList() {
    const activities = getActivities();
    const list = $("#activityList");
    list.innerHTML = "";

    activities.forEach((activity) => {
      const flag = activityFlags[activity.id] || {};
      const button = document.createElement("button");
      button.type = "button";
      button.className = `activity-row${activity.id === selectedActivityId ? " active" : ""}`;
      button.dataset.activityId = activity.id;
      button.setAttribute("role", "listitem");

      const icon = document.createElement("i");
      icon.setAttribute("data-lucide", activity.icon || "sparkles");

      const title = document.createElement("strong");
      title.textContent = activity.title;

      const flags = document.createElement("span");
      flags.className = "activity-flag";
      flags.textContent = `${flag.planned ? "Planned" : ""}${flag.planned && flag.favorite ? " · " : ""}${flag.favorite ? "Saved" : ""}`;

      const chevron = document.createElement("i");
      chevron.className = "chevron";
      chevron.setAttribute("data-lucide", "chevron-right");

      button.append(icon, title, flags, chevron);
      button.addEventListener("click", () => selectActivity(activity.id));
      list.appendChild(button);
    });

    refreshIcons();
  }

  function selectActivity(id, announce = false) {
    const activity = getActivity(id);
    if (!activity) return;
    selectedActivityId = id;

    $("#activityTitle").textContent = activity.title;
    $("#activityBestTime").textContent = activity.bestTime || "TBD";
    $("#activityAddress").textContent = activity.address || "TBD";
    $("#activityPhone").textContent = activity.phone || "TBD";
    $("#activityVibe").textContent = activity.vibe || "TBD";
    $("#activityNotes").textContent = activity.reservationNotes || "Add reservation notes when the plan gets more specific.";

    const link = $("#activityLink");
    const cleanLink = safeUrl(activity.link || "");
    if (cleanLink) {
      link.href = cleanLink;
      link.classList.remove("hidden");
    } else {
      link.removeAttribute("href");
      link.classList.add("hidden");
    }

    const flag = activityFlags[id] || {};
    $("#planBtn").innerHTML = flag.planned
      ? '<i data-lucide="calendar-check"></i>In the plan'
      : '<i data-lucide="calendar-plus"></i>Add to plan';
    $("#favoriteBtn").innerHTML = flag.favorite
      ? '<i data-lucide="heart"></i>Saved'
      : '<i data-lucide="heart"></i>Save';

    renderActivityList();
    refreshIcons();
    if (announce) $("#drawResult").textContent = `The hat picked: ${activity.title}`;
  }

  function drawRandomActivity() {
    const activities = getActivities();
    if (!activities.length) return;
    let pool = activities;
    if (activities.length > 1 && selectedActivityId) {
      const withoutCurrent = activities.filter((item) => item.id !== selectedActivityId);
      if (withoutCurrent.length) pool = withoutCurrent;
    }

    const pick = pool[Math.floor(Math.random() * pool.length)];
    const hat = $("#hatButton");
    hat.classList.remove("is-drawing");
    void hat.offsetWidth;
    hat.classList.add("is-drawing");
    $("#drawResult").textContent = "The hat is deciding...";

    window.setTimeout(() => {
      selectActivity(pick.id, true);
      hat.classList.remove("is-drawing");
      $("#activity-hat").scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "center" });
    }, 700);
  }

  function toggleFlag(type) {
    if (!selectedActivityId) return;
    const current = activityFlags[selectedActivityId] || {};
    activityFlags[selectedActivityId] = { ...current, [type]: !current[type] };
    writeJSON(STORAGE.activityFlags, activityFlags);
    selectActivity(selectedActivityId);
    showToast(type === "planned" ? "Plan status updated." : "Saved status updated.");
  }

  function openActivityDialog(mode = "add") {
    const dialog = $("#activityDialog");
    const activity = mode === "edit" ? getActivity(selectedActivityId) : null;

    $("#dialogTitle").textContent = activity ? "Edit activity" : "Add activity";
    $("#activityIdField").value = activity?.id || "";
    $("#activityNameField").value = activity?.title || "";
    $("#activityBestTimeField").value = activity?.bestTime || "";
    $("#activityAddressField").value = activity?.address || "";
    $("#activityPhoneField").value = activity?.phone || "";
    $("#activityVibeField").value = activity?.vibe || "";
    $("#activityLinkField").value = activity?.link || "";
    $("#activityNotesField").value = activity?.reservationNotes || "";

    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
    $("#activityNameField").focus();
  }

  function closeActivityDialog() {
    const dialog = $("#activityDialog");
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
  }

  function saveActivityFromForm(event) {
    event.preventDefault();
    const idField = $("#activityIdField").value.trim();
    const title = $("#activityNameField").value.trim();
    if (!title) {
      showToast("Add an activity name first.");
      return;
    }

    const record = {
      title,
      bestTime: $("#activityBestTimeField").value.trim(),
      address: $("#activityAddressField").value.trim(),
      phone: $("#activityPhoneField").value.trim(),
      vibe: $("#activityVibeField").value.trim(),
      link: safeUrl($("#activityLinkField").value.trim()),
      reservationNotes: $("#activityNotesField").value.trim()
    };

    if (idField) {
      activityEdits[idField] = { ...(activityEdits[idField] || {}), ...record };
      writeJSON(STORAGE.activityEdits, activityEdits);
      selectedActivityId = idField;
      showToast("Activity updated on this browser.");
    } else {
      const id = `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      customActivities.push({
        id,
        icon: "sparkles",
        category: "custom",
        ...record
      });
      writeJSON(STORAGE.customActivities, customActivities);
      selectedActivityId = id;
      showToast("New activity added on this browser.");
    }

    closeActivityDialog();
    selectActivity(selectedActivityId);
  }

  function renderNotes() {
    const list = $("#notesList");
    list.innerHTML = "";
    if (!notes.length) {
      const empty = document.createElement("li");
      empty.innerHTML = "<span>No notes yet. Add the first one.</span>";
      list.appendChild(empty);
      return;
    }

    notes.forEach((note, index) => {
      const li = document.createElement("li");
      const editor = document.createElement("textarea");
      editor.className = "note-editor";
      editor.value = note;
      editor.rows = 2;
      editor.maxLength = 300;
      editor.setAttribute("aria-label", `Edit note: ${note}`);
      editor.addEventListener("input", () => {
        notes[index] = editor.value;
        writeJSON(STORAGE.notes, notes);
        editor.style.height = "auto";
        editor.style.height = `${editor.scrollHeight}px`;
        const status = $("#notesSaveStatus");
        if (status) status.textContent = "Saved just now on this device.";
      });
      window.requestAnimationFrame(() => {
        editor.style.height = "auto";
        editor.style.height = `${editor.scrollHeight}px`;
      });
      const remove = document.createElement("button");
      remove.type = "button";
      remove.setAttribute("aria-label", `Delete note: ${note}`);
      remove.innerHTML = '<i data-lucide="trash-2"></i>';
      remove.addEventListener("click", () => {
        notes.splice(index, 1);
        writeJSON(STORAGE.notes, notes);
        renderNotes();
      });
      li.append(editor, remove);
      list.appendChild(li);
    });
    refreshIcons();
  }

  function addNote(event) {
    event.preventDefault();
    const input = $("#noteInput");
    const value = input.value.trim();
    if (!value) return;
    notes.unshift(value);
    notes = notes.slice(0, 40);
    writeJSON(STORAGE.notes, notes);
    writeJSON(STORAGE.noteDraft, "");
    input.value = "";
    renderNotes();
    showToast("Note saved on this browser.");
  }

  function renderPacking() {
    const list = $("#packingList");
    list.innerHTML = "";

    packingItems.forEach((item, index) => {
      const li = document.createElement("li");
      const label = document.createElement("label");
      const checkbox = document.createElement("input");
      const text = document.createElement("span");
      const remove = document.createElement("button");

      checkbox.type = "checkbox";
      checkbox.checked = Boolean(item.done);
      checkbox.setAttribute("aria-label", `Mark ${item.text} packed`);
      checkbox.addEventListener("change", () => {
        packingItems[index].done = checkbox.checked;
        writeJSON(STORAGE.packing, packingItems);
        li.classList.toggle("done", checkbox.checked);
      });

      text.textContent = item.text;
      label.append(checkbox, text);
      remove.type = "button";
      remove.className = "packing-remove";
      remove.setAttribute("aria-label", `Remove packing item: ${item.text}`);
      remove.innerHTML = '<i data-lucide="x"></i>';
      remove.addEventListener("click", () => {
        packingItems.splice(index, 1);
        writeJSON(STORAGE.packing, packingItems);
        renderPacking();
      });

      li.classList.toggle("done", Boolean(item.done));
      li.append(label, remove);
      list.appendChild(li);
    });
    refreshIcons();
  }

  function addPackingItem(event) {
    event.preventDefault();
    const input = $("#packingInput");
    const text = input.value.trim();
    if (!text) return;
    packingItems.push({ text: text.slice(0, 100), done: false });
    writeJSON(STORAGE.packing, packingItems);
    input.value = "";
    renderPacking();
    showToast("Packing item added.");
  }

  function exportUpdates() {
    const payload = {
      schemaVersion: 1,
      trip: data.trip.title,
      exportedAt: new Date().toISOString(),
      customActivities,
      activityEdits,
      activityFlags,
      notes,
      packingItems
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "nashville-trip-updates.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast("Trip updates exported.");
  }

  function importUpdates(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const payload = JSON.parse(String(reader.result || "{}"));
        if (payload.schemaVersion !== 1) throw new Error("Unsupported file format");
        if (Array.isArray(payload.customActivities)) customActivities = payload.customActivities.slice(0, 100);
        if (payload.activityEdits && typeof payload.activityEdits === "object") activityEdits = payload.activityEdits;
        if (payload.activityFlags && typeof payload.activityFlags === "object") activityFlags = payload.activityFlags;
        if (Array.isArray(payload.notes)) notes = payload.notes.slice(0, 40).map((note) => String(note).slice(0, 300));
        if (Array.isArray(payload.packingItems)) packingItems = payload.packingItems.slice(0, 60)
          .map((item) => typeof item === "string" ? { text: item.slice(0, 100), done: false } : { text: String(item.text || "").slice(0, 100), done: Boolean(item.done) })
          .filter((item) => item.text);

        writeJSON(STORAGE.customActivities, customActivities);
        writeJSON(STORAGE.activityEdits, activityEdits);
        writeJSON(STORAGE.activityFlags, activityFlags);
        writeJSON(STORAGE.notes, notes);
        writeJSON(STORAGE.packing, packingItems);

        if (!getActivity(selectedActivityId)) selectedActivityId = getActivities()[0]?.id || null;
        renderNotes();
        renderPacking();
        renderActivityList();
        if (selectedActivityId) selectActivity(selectedActivityId);
        showToast("Trip updates imported.");
      } catch {
        showToast("That file does not look like a valid trip update export.");
      }
    };
    reader.readAsText(file);
  }

  function bytesFromBase64(value) {
    const binary = window.atob(value);
    return Uint8Array.from(binary, (character) => character.charCodeAt(0));
  }

  async function decryptPrivateDetails(passcode) {
    const bundle = window.ENCRYPTED_TRIP_DETAILS;
    if (!bundle || !window.crypto?.subtle) throw new Error("Private details are unavailable");

    const encoder = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
      "raw",
      encoder.encode(passcode),
      "PBKDF2",
      false,
      ["deriveKey"]
    );
    const key = await window.crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: bytesFromBase64(bundle.salt),
        iterations: bundle.iterations,
        hash: "SHA-256"
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["decrypt"]
    );
    const plaintext = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv: bytesFromBase64(bundle.iv) },
      key,
      bytesFromBase64(bundle.ciphertext)
    );
    return JSON.parse(new TextDecoder().decode(plaintext));
  }

  function openPasscodeDialog() {
    const dialog = $("#passcodeDialog");
    $("#passcodeError").textContent = "";
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
    window.setTimeout(() => $("#passcodeInput").focus(), 50);
  }

  function closePasscodeDialog() {
    const dialog = $("#passcodeDialog");
    $("#passcodeInput").value = "";
    $("#passcodeError").textContent = "";
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
  }

  async function unlockPrivateDetails(event) {
    event.preventDefault();
    const input = $("#passcodeInput");
    const error = $("#passcodeError");
    const button = $("#passcodeForm button[type='submit']");
    error.textContent = "";
    button.disabled = true;
    button.textContent = "Unlocking…";

    try {
      const privateDetails = await decryptPrivateDetails(input.value);
      data.trip = { ...data.trip, ...privateDetails.trip };
      data.flights = privateDetails.flights;
      data.airportNote = privateDetails.airportNote;
      data.car = privateDetails.car;
      data.stay = privateDetails.stay;
      data.privacy.locked = false;

      renderHero();
      renderFlights();
      renderCar();
      renderStay();
      loadWeather();
      const unlockButton = $("#unlockPrivateBtn");
      unlockButton.innerHTML = '<i data-lucide="unlock-keyhole"></i><span>Private details unlocked</span>';
      unlockButton.disabled = true;
      unlockButton.classList.add("is-unlocked");
      refreshIcons();
      closePasscodeDialog();
      showToast("Private trip details unlocked for this tab.");
    } catch {
      error.textContent = "That passcode did not work. Please try again.";
      input.select();
    } finally {
      button.disabled = false;
      button.innerHTML = '<i data-lucide="unlock-keyhole"></i>Unlock';
      refreshIcons();
    }
  }

  async function shareTrip() {
    const shareData = {
      title: data.trip.title,
      text: `${data.trip.title} · ${data.trip.datesLabel}`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(window.location.href);
        showToast("Trip link copied.");
        return;
      }
      showToast("Copy the URL from your browser to share the trip.");
    } catch (error) {
      if (error && error.name !== "AbortError") showToast("Copy the URL from your browser to share the trip.");
    }
  }

  async function loadWeather() {
    const status = $("#weatherStatus");
    const current = $("#currentWeather");
    const grid = $("#weatherGrid");
    const footnote = $("#weatherFootnote");
    const forecastHeading = $("#forecastHeading");
    const privateLocked = Boolean(data.privacy?.locked);
    renderPendingWeather();
    forecastHeading.textContent = privateLocked ? "Travel forecast · unlock dates" : `Travel dates · ${data.trip.datesLabel}`;
    footnote.textContent = privateLocked
      ? "Unlock private details to reveal the travel dates and their automatic forecast."
      : data.weather.seasonalNote;

    const params = new URLSearchParams({
      latitude: String(data.weather.latitude),
      longitude: String(data.weather.longitude),
      current: "temperature_2m,apparent_temperature,weather_code,wind_speed_10m",
      daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
      temperature_unit: "fahrenheit",
      timezone: data.weather.timezone,
      forecast_days: "16"
    });

    try {
      const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);
      if (!response.ok) throw new Error("Weather request failed");
      const payload = await response.json();
      const daily = payload.daily;
      if (!daily || !Array.isArray(daily.time)) throw new Error("Weather payload missing");

      const now = payload.current;
      if (now && Number.isFinite(now.temperature_2m)) {
        const icon = weatherIcon(now.weather_code);
        const feels = Number.isFinite(now.apparent_temperature) ? Math.round(now.apparent_temperature) : "–";
        const wind = Number.isFinite(now.wind_speed_10m) ? Math.round(now.wind_speed_10m) : "–";
        current.innerHTML = `
          <span class="current-label">Nashville right now</span>
          <span class="current-icon" aria-hidden="true">${icon}</span>
          <strong>${Math.round(now.temperature_2m)}°F</strong>
          <span class="current-description">${escapeHTML(weatherDescription(now.weather_code))}</span>
          <small>Feels like ${feels}° · Wind ${wind} mph</small>
        `;
        status.textContent = "Current conditions update automatically whenever the page opens.";
      }

      const tripRows = privateLocked ? [] : daily.time.map((date, index) => ({
        date,
        code: daily.weather_code?.[index],
        high: daily.temperature_2m_max?.[index],
        low: daily.temperature_2m_min?.[index],
        precip: daily.precipitation_probability_max?.[index]
      })).filter((row) => row.date >= data.trip.startDate && row.date <= data.trip.endDate);

      if (tripRows.length === 5) {
        grid.innerHTML = tripRows.map(weatherCardHTML).join("");
        footnote.textContent = "Live weather data from Open-Meteo. Check again before packing because September storms can shift quickly.";
      } else if (!privateLocked) {
        footnote.textContent = `The ${data.trip.datesLabel} forecast will appear here automatically once those dates enter the reliable forecast window. Current Nashville weather is already live above.`;
      }
    } catch {
      status.textContent = "Live weather is temporarily unavailable.";
      current.innerHTML = '<span class="current-label">Nashville right now</span><strong>Refresh to try again</strong>';
      footnote.textContent = `${data.weather.seasonalNote} Refresh later to retry.`;
    }
  }

  function renderPendingWeather() {
    const grid = $("#weatherGrid");
    if (data.privacy?.locked) {
      grid.innerHTML = Array.from({ length: 5 }, () => `
        <div class="weather-day weather-locked">
          <span class="day">Private date</span>
          <span class="weather-icon" aria-hidden="true">🔒</span>
          <strong>Locked</strong>
          <small>Unlock to view</small>
        </div>
      `).join("");
      return;
    }
    const dates = enumerateDates(data.trip.startDate, data.trip.endDate);
    grid.innerHTML = dates.map((date) => `
      <div class="weather-day">
        <span class="day">${escapeHTML(formatShortDate(date))}</span>
        <span class="weather-icon" aria-hidden="true">✧</span>
        <strong>Pending</strong>
        <small>Auto-updates closer to the trip</small>
      </div>
    `).join("");
  }

  function weatherCardHTML(row) {
    const icon = weatherIcon(row.code);
    const high = Number.isFinite(row.high) ? Math.round(row.high) : "-";
    const low = Number.isFinite(row.low) ? Math.round(row.low) : "-";
    const precip = Number.isFinite(row.precip) ? Math.round(row.precip) : "-";
    return `
      <div class="weather-day">
        <span class="day">${escapeHTML(formatShortDate(row.date))}</span>
        <span class="weather-icon" aria-hidden="true">${icon}</span>
        <strong>${high}° / ${low}°</strong>
        <small>${precip}% precip.</small>
      </div>
    `;
  }

  function weatherIcon(code) {
    if (code === 0) return "☀️";
    if ([1, 2].includes(code)) return "🌤️";
    if (code === 3) return "☁️";
    if ([45, 48].includes(code)) return "🌫️";
    if ([51, 53, 55, 56, 57].includes(code)) return "🌦️";
    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "🌧️";
    if ([71, 73, 75, 77, 85, 86].includes(code)) return "🌨️";
    if ([95, 96, 99].includes(code)) return "⛈️";
    return "🌤️";
  }

  function weatherDescription(code) {
    if (code === 0) return "Clear sky";
    if ([1, 2].includes(code)) return "Partly cloudy";
    if (code === 3) return "Cloudy";
    if ([45, 48].includes(code)) return "Foggy";
    if ([51, 53, 55, 56, 57].includes(code)) return "Light rain";
    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "Rain";
    if ([71, 73, 75, 77, 85, 86].includes(code)) return "Snow";
    if ([95, 96, 99].includes(code)) return "Thunderstorms";
    return "Mixed conditions";
  }

  function parseDateParts(dateString) {
    const [year, month, day] = dateString.split("-").map(Number);
    return { year, month, day };
  }

  function enumerateDates(start, end) {
    const startParts = parseDateParts(start);
    const endParts = parseDateParts(end);
    const current = new Date(Date.UTC(startParts.year, startParts.month - 1, startParts.day));
    const last = new Date(Date.UTC(endParts.year, endParts.month - 1, endParts.day));
    const result = [];
    while (current <= last && result.length < 10) {
      result.push(current.toISOString().slice(0, 10));
      current.setUTCDate(current.getUTCDate() + 1);
    }
    return result;
  }

  function formatShortDate(dateString) {
    const parts = parseDateParts(dateString);
    const date = new Date(Date.UTC(parts.year, parts.month - 1, parts.day));
    const dayName = new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: "UTC" }).format(date);
    return `${dayName} ${parts.month}/${parts.day}`;
  }

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function setupNavigation() {
    const navLinks = $$(".nav-link");
    navLinks.forEach((link) => link.addEventListener("click", () => {
      navLinks.forEach((item) => item.classList.remove("active"));
      link.classList.add("active");
    }));
  }

  function bindEvents() {
    $("#drawIdeaBtn").addEventListener("click", drawRandomActivity);
    $("#hatButton").addEventListener("click", drawRandomActivity);
    $("#planBtn").addEventListener("click", () => toggleFlag("planned"));
    $("#favoriteBtn").addEventListener("click", () => toggleFlag("favorite"));
    $("#addActivityBtn").addEventListener("click", () => openActivityDialog("add"));
    $("#editActivityBtn").addEventListener("click", () => openActivityDialog("edit"));
    $("#closeDialogBtn").addEventListener("click", closeActivityDialog);
    $("#cancelDialogBtn").addEventListener("click", closeActivityDialog);
    $("#activityForm").addEventListener("submit", saveActivityFromForm);
    $("#noteForm").addEventListener("submit", addNote);
    $("#noteInput").value = readJSON(STORAGE.noteDraft, "");
    $("#noteInput").addEventListener("input", (event) => {
      writeJSON(STORAGE.noteDraft, event.target.value);
      const status = $("#notesSaveStatus");
      if (status) status.textContent = event.target.value ? "Draft saved on this device." : "Changes save automatically on this device.";
    });
    $("#packingForm").addEventListener("submit", addPackingItem);
    $("#exportBtn").addEventListener("click", exportUpdates);
    $("#importBtn").addEventListener("click", () => $("#importFile").click());
    $("#importFile").addEventListener("change", (event) => {
      importUpdates(event.target.files?.[0]);
      event.target.value = "";
    });
    $("#shareTripBtn").addEventListener("click", shareTrip);
    $("#unlockPrivateBtn").addEventListener("click", openPasscodeDialog);
    $("#closePasscodeBtn").addEventListener("click", closePasscodeDialog);
    $("#passcodeForm").addEventListener("submit", unlockPrivateDetails);
  }

  function init() {
    renderHero();
    renderFlights();
    renderCar();
    renderStay();
    renderActivityList();
    if (selectedActivityId) selectActivity(selectedActivityId);
    renderNotes();
    renderPacking();
    setupNavigation();
    bindEvents();
    refreshIcons();
    loadWeather();
  }

  init();
})();

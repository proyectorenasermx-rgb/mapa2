// 📍 Datos simulados
const lugares = Array.from({ length: 35 }, (_, i) => ({
  nombre: `Lugar ${i + 1}`,
  lat: 19.31 + Math.random() * 0.05,
  lng: -98.88 + Math.random() * 0.05,
  info: `Información del Lugar ${i + 1}`
}));

// 🌍 Mapa
const map = L.map('map').setView([19.31246, -98.88392], 12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
  attribution: '&copy; OpenStreetMap'
}).addTo(map);

// 🟡 Icono
const iconopozos = L.icon({
  iconUrl: 'iconopozos.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40]
});

// 📍 Marcadores
const markers = lugares.map(l =>
  L.marker([l.lat, l.lng], { icon: iconopozos })
    .addTo(map)
    .bindPopup(`<b>${l.nombre}</b><br>${l.info}`)
);

// 📋 Lista
const lista = document.getElementById("lista");
const infoBox = document.getElementById("info-box");

function renderLista(data) {
  lista.innerHTML = "";
  data.forEach(l => {
    const li = document.createElement("li");
    li.textContent = l.nombre;

    li.onclick = () => {
      infoBox.innerHTML = `<strong>${l.nombre}</strong><br>${l.info}`;
      infoBox.classList.remove("hidden");
      map.setView([l.lat, l.lng], 15);
    };

    lista.appendChild(li);
  });
}

renderLista(lugares);

// 🔍 Buscador
const iconSearch = document.getElementById("icon-search");
const searchInput = document.getElementById("search");

iconSearch.onclick = () => {
  searchInput.style.display =
    searchInput.style.display === "block" ? "none" : "block";

  if (searchInput.style.display === "none") {
    searchInput.value = "";
    renderLista(lugares);
  }
  searchInput.focus();
};

searchInput.oninput = () => {
  const term = searchInput.value.toLowerCase();
  renderLista(
    lugares.filter(l => l.nombre.toLowerCase().includes(term))
  );
};

// 📍 Centrar todo
document.getElementById("btn-centro").onclick = () => {
  const group = L.featureGroup(markers);
  map.fitBounds(group.getBounds());
};

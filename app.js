// 📍 Simulación de 35 lugares
const lugares = Array.from({ length: 35 }, (_, i) => ({
  nombre: `Lugar ${i + 1}`,
  lat: 19.31 + Math.random() * 0.05,
  lng: -98.88 + Math.random() * 0.05,
  info: `Información del Lugar ${i + 1}`
}));

// 🌍 Leaflet Mapa
const map = L.map('map').setView([19.31246, -98.88392], 12);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// 🟡 Icono personalizado
const iconopozos = L.icon({
  iconUrl: 'iconopozos.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -35]
});

// 📍Marcadores
const markers = lugares.map(lugar => {
  return L.marker([lugar.lat, lugar.lng], { icon: iconopozos })
    .addTo(map)
    .bindPopup(`<b>${lugar.nombre}</b><br>${lugar.info}`);
});

// 📋 Lista
const lista = document.getElementById("lista");
const infoBox = document.getElementById("info-box");

// Scroll infinito
let mostrar = 0;
const difDesktop = 20;
const difMovil = 5;

function cargarMas(){
  const esMovil = window.innerWidth <= 768;
  const limite = esMovil ? difMovil : difDesktop;
  const fin = Math.min(mostrar + limite, lugares.length);

  for(; mostrar < fin; mostrar++){
    const lugar = lugares[mostrar];
    const li = document.createElement("li");
    li.textContent = lugar.nombre;

    li.addEventListener("click", () => {
      mostrarInfo(lugar, mostrar);
      centerMarker(lugar, mostrar);
    });

    lista.appendChild(li);
  }
}
lista.addEventListener("scroll", () => {
  if(lista.scrollTop + lista.clientHeight >= lista.scrollHeight - 5){
    cargarMas();
  }
});

// 👁 Mostrar info
function mostrarInfo(lugar){
  infoBox.innerHTML = `<strong>${lugar.nombre}</strong><br>${lugar.info}`;
  infoBox.classList.remove("hidden");
}

// 📍 Centrar mapa
function centerMarker(lugar){
  map.setView([lugar.lat, lugar.lng], 15, {
    animate: true
  });
}

// ✨ Buscador
const iconSearch = document.getElementById("icon-search");
const searchInput = document.getElementById("search");

iconSearch.addEventListener("click", () => {
  searchInput.style.display = searchInput.style.display === "block" ? "none" : "block";
  searchInput.focus();
});

searchInput.addEventListener("input", () => {
  const term = searchInput.value.toLowerCase();
  lista.innerHTML = "";
  mostrar = 0;
  const filtrados = lugares.filter(l =>
    l.nombre.toLowerCase().includes(term)
  );
  filtrados.forEach(l => {
    const li = document.createElement("li");
    li.textContent = l.nombre;
    li.addEventListener("click", () => {
      mostrarInfo(l);
      centerMarker(l);
    });
    lista.appendChild(li);
  });
});

// 📍 Botón Centrar Todo
const btnCentro = document.getElementById("btn-centro");
btnCentro.addEventListener("click", () => {
  const group = L.featureGroup(markers);
  map.fitBounds(group.getBounds(), { animate: true });
});

// Inicio
cargarMas();

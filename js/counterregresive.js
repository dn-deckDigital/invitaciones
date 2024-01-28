const targetDate = document.getElementById("date").value;
const divFecha = document.querySelector(".third-text");

document.addEventListener("DOMContentLoaded", function () {
  function updateCountdown() {
    const currentDate = new Date();
    let date = new Date(targetDate);
    const timeDifference = date - currentDate;

    if (timeDifference <= 0) {
      // La fecha objetivo ha pasado, establecer todos los valores a cero
      document.getElementById("days").innerText = "0";
      document.getElementById("hours").innerText = "0";
      document.getElementById("minutes").innerText = "0";
      document.getElementById("seconds").innerText = "0";
    } else {
      const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

      document.getElementById("days").innerText = `${days}`;
      document.getElementById("hours").innerText = `${hours}`;
      document.getElementById("minutes").innerText = `${minutes}`;
      document.getElementById("seconds").innerText = `${seconds}`;
    }
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();
});

setTimeout(cargarVideo, 1000);

function confirmAssit(phone, message) {
  const url = `https://api.whatsapp.com/send?phone=${phone}text=${message}`;
  window.open(url, "_blank");
}

function formatearFecha() {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  const fecha = new Date(targetDate);
  const fechaFormateada = fecha.toLocaleDateString("es-ES", options);

  // Extraer la parte de la hora
  const horaFormateada = fechaFormateada.split(", ")[1];

  // Formatear la cadena final
  const resultado = fechaFormateada.replace(
    ", " + horaFormateada,
    ` | ${horaFormateada.toLowerCase()}`
  );

  divFecha.innerHTML = resultado;
}

formatearFecha();

let player;

// Llamar a la API de YouTube
function cargarVideo() {
  const urlInput = document.getElementById("song").value.split("|")[0];
  const videoId = extraerVideoId(urlInput);

  if (document.getElementById("song").value.split("|")[1] == "true") {
    if (videoId) {
      cargarReproductor(videoId);
    } else {
      alert("La URL de YouTube no es válida");
    }
  } else {
    console.log("Se restringió el audio");
  }
}

// Extraer el ID del video de la URL de YouTube
function extraerVideoId(url) {
  const match = url.match(/[?&]v=([^&]+)/);
  return match && match[1];
}

// Cargar el reproductor de YouTube
function cargarReproductor(videoId) {
  const reproductorDiv = document.getElementById("reproductor");
  reproductorDiv.innerHTML = ""; // Limpiar el contenido anterior

  // Crear el reproductor
  player = new YT.Player("reproductor", {
    height: "360",
    width: "640",
    videoId: videoId,
    playerVars: {
      autoplay: 1, // Reproducción automática
      mute: 0, // Modo silencioso
      controls: 1, // Ocultar controles
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
    },
  });
}

// Iniciar la reproducción una vez que el reproductor esté listo
function onPlayerReady(event) {
    setTimeout(() => {
        event.target.playVideo();
        event.target.unMute();
    }, 1000)
 
}

// Detectar cambios en el estado del reproductor
function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.ENDED) {
    // El video ha llegado al final, reproducir automáticamente de nuevo
    player.seekTo(0);
    player.playVideo();
  }
}

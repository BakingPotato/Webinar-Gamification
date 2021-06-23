function abrirPuntuacion(id) {
    document.getElementById("puntuarForm").body.CD_USUARIO = id;
    document.getElementById("puntuar").style.display = "block";
  }
  
  function cerrarPuntuacion() {
    document.getElementById("puntuar").style.display = "none";
  }
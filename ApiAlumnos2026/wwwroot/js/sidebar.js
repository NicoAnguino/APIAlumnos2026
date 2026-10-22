function initSidebar() {
  const sidebar = document.querySelector(".sidebar");
  const sidebarToggler = document.querySelector(".sidebar-toggler");
  const menuToggler = document.querySelector(".menu-toggler");

  if (!sidebar || !sidebarToggler || !menuToggler) return;

  let collapsedSidebarHeight = "56px";
  let fullSidebarHeight = "calc(100vh)";

  sidebarToggler.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
  });

  const toggleMenu = (isMenuActive) => {
    sidebar.style.height = isMenuActive ? `${sidebar.scrollHeight}px` : collapsedSidebarHeight;
    menuToggler.querySelector("span").innerText = isMenuActive ? "close" : "menu";
  };

  menuToggler.addEventListener("click", () => {
    toggleMenu(sidebar.classList.toggle("menu-active"));
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768) {
      sidebar.style.height = fullSidebarHeight;
    } else {
      sidebar.classList.remove("collapsed");
      sidebar.style.height = "auto";
      toggleMenu(sidebar.classList.contains("menu-active"));
    }
  });
}

function VerificarMenu() {
  const rol = getRol();
  const menuAdmin = document.getElementById("menu-admin");
  const menuDocente = document.getElementById("menu-docente");
   const menuAlumno = document.getElementById("menu-alumno");
  if (rol == "DOCENTE"){
    menuDocente.style.display = "block";
  }
  else if (rol == "ALUMNO") {
    menuAlumno.style.display = "block";
  }
  else{
     menuAdmin.style.display = "block";
  }
}
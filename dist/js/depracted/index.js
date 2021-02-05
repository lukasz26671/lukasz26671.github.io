let sidebar = document.getElementById("sidebar");
let openSidebar = document.getElementById("openSidebar"); //przycisk ktory wlasciwie otwiera sidebar
let closeSidebar = document.getElementById("closebtn"); //przycisk zamykajacy sidebar

openSidebar.addEventListener("click", openNav);
closeSidebar.addEventListener("click", closeNav);

function openNav() {
    sidebar.style.width = "250px";
    openSidebar.style.opacity = "0";
  }

function closeNav() {
  sidebar.style.width = "0";
  setTimeout("openSidebar.style.opacity = '1';", 470);  
}
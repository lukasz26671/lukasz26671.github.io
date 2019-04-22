
function openNav() {
    document.getElementById("sidebar").style.width = "250px";
    document.getElementById("openSideBar").style.opacity = "0";
    
  }
  
  function closeNav() {
    document.getElementById("sidebar").style.width = "0";
    setTimeout("document.getElementById('openSideBar').style.opacity = '1';", 550);
    
  }




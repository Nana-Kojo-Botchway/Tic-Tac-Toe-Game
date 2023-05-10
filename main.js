function addShapeButtonListeners() {
    const xShapeBtn = document.getElementById("x-shape");
    const oShapeBtn = document.getElementById("o-shape");
  
    let activeBtn = null;
  
    xShapeBtn.addEventListener("click", () => {
      if (activeBtn !== xShapeBtn) {
        xShapeBtn.classList.add("active");
        oShapeBtn.classList.remove("active");
        activeBtn = xShapeBtn;
      }
    });
  
    oShapeBtn.addEventListener("click", () => {
      if (activeBtn !== oShapeBtn) {
        oShapeBtn.classList.add("active");
        xShapeBtn.classList.remove("active");
        activeBtn = oShapeBtn;
        makeComputerMove();
      }
    });
  }
  
  addShapeButtonListeners();
  
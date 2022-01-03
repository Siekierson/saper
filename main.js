let size = 9;
let muchBombs = 6;
const wrapper = document.getElementById("field");
const resultAlert = document.getElementById("result");
const setColumns = document.querySelector("input#cols");
const setBombs = document.querySelector("input#bombs");
const starter = document.querySelectorAll(".start");
const counterDisp = document.getElementById("counter");
const resultDiv = document.querySelector(".result");
const pyro = document.querySelector(".pyro");
setColumns.addEventListener("change", (e) => {
  size = Number(e.target.value);
});
setBombs.addEventListener("change", (e) => {
  muchBombs = Number(e.target.value);
});
let counterI = 0;
let interval;
function counter() {
  interval = setInterval(() => {
    counterI++;
    counterDisp.innerHTML = `${Math.floor(counterI / 60)}:${counterI % 60}`;
  }, 1000);
}
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
function generateGameTable() {
  const bombs = [];
  const gameTable = new Array(size);
  for (var i = 0; i < gameTable.length; i++) {
    gameTable[i] = new Array(size);
    for (var j = 0; j < gameTable.length; j++) gameTable[i][j] = null;
  }
  while (bombs.length < muchBombs) {
    var random = { x: getRandomInt(0, size), y: getRandomInt(0, size) };
    if (gameTable[random.y][random.x] === null) {
      bombs.push(random);
      gameTable[random.y][random.x] = "bomb";
    }
  }
  for (var i = 0; i < gameTable.length; i++) {
    for (var j = 0; j < gameTable.length; j++) {
      var counter = 0;
      if (gameTable[i][j] !== "bomb") {
        for (var k = i - 1; k < gameTable.length && k <= i + 1; k++) {
          for (var l = j - 1; l < gameTable.length && l <= j + 1; l++) {
            if (l >= 0 && k >= 0 && gameTable[k][l] == "bomb") {
              counter++;
            }
          }
        }
        gameTable[i][j] = counter;
      }
    }
  }
  return { bombs, gameTable };
}
function addElement(head, info) {
  let newButton = document.createElement("button");
  newButton.setAttribute("bomb", info === "bomb");
  newButton.setAttribute("visible", false);
  const value = info === "bomb" ? "💣" : info;
  newButton.innerHTML = `${value}`;
  newButton.setAttribute("val", info);
  head.appendChild(newButton);
}
function endGame() {
  resultDiv.style.display = "block";
  clearInterval(interval);
  counterI = 0;
}
function game() {
  wrapper.innerHTML = "";
  counterI = 0;
  counter();
  const { bombs, gameTable } = generateGameTable();
  console.log(bombs, gameTable);
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const info = gameTable[i][j];
      addElement(wrapper, info);
    }
    wrapper.innerHTML += "<br>";
  }
  const buttons = document.querySelectorAll("#field>button");
  let trueFlags = 0;
  buttons.forEach((item, index) => {
    item.addEventListener("click", () => {
      item.setAttribute("visible", true);
      if (item.getAttribute("bomb") == "true") {
        buttons.forEach((all) => all.setAttribute("visible", true));
        resultAlert.innerHTML = "przegrałeś wszyscy nie żyją";
        endGame();
      } else if (
        item.attributes.val.value == 0 &&
        item.getAttribute("visible")
      ) {
        item.setAttribute("visible", true);
        (function odkryj(i) {
          for (let left = 0; (i % size) + left >= 0; left--) {
            const verticalIndex = (i % size) + left;
            if (gameTable[Math.floor(i / size)][verticalIndex] === 0) {
              buttons[i + left].setAttribute("visible", true);

              for (let top = -1; Math.floor(i / size) + top >= 0; top--) {
                const columnIndex = Math.floor(i / size) + top;
                if (gameTable[columnIndex][verticalIndex] === 0) {
                  buttons[i + left + top * size].setAttribute("visible", true);
                } else {
                  break;
                }
              }
              for (
                let bottom = 1;
                Math.floor(i / size) + bottom < size;
                bottom++
              ) {
                const columnIndex = Math.floor(i / size) + bottom;
                if (gameTable[columnIndex][verticalIndex] == 0) {
                  buttons[i + left + bottom * size].setAttribute(
                    "visible",
                    true
                  );
                } else {
                  break;
                }
              }
            } else {
              break;
            }
           
          }
          for (let right = 1; size - right > i % size; right++) {
            const verticalIndex = (i % size) + right;
            if (gameTable[Math.floor(i / size)][verticalIndex] === 0) {
              buttons[i + right].setAttribute("visible", true);
              for (let top = -1; Math.floor(i / size) + top >= 0; top--) {
                const columnIndex = Math.floor(i / size) + top;
                if (gameTable[columnIndex][verticalIndex] === 0) {
                  buttons[i + right + top * size].setAttribute("visible", true);
                } else {
                  break;
                }
              }
              for (
                let bottom = 1;
                Math.floor(i / size) + bottom < size;
                bottom++
              ) {
                const columnIndex = Math.floor(i / size) + bottom;
                if (gameTable[columnIndex][verticalIndex] == 0) {
                  buttons[i + right + bottom * size].setAttribute(
                    "visible",
                    true
                  );
                } else {
                  break;
                }
              }
            } else {
              break;
            }
          }

          console.log(Math.floor(i / size), i % size, gameTable);
        })(Number(index));
      }
    });
    item.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      // console.log(item.attributes.bomb.value === false)

      if (counterI !== 0) {
        if (item.attributes.visible.value === "checked") {
          item.setAttribute("visible", false);

          item.innerHTML = item.attributes.val.value;
        } else {
          item.innerHTML = "🚩";
          item.setAttribute("visible", "checked");

          if (item.attributes.bomb.value === "true") trueFlags += 1;
          else trueFlags -= 1;
        }
      }

      if (trueFlags == muchBombs) {
        endGame();
        pyro.style.display = "block";
        resultAlert.innerHTML = "no no wygrałeś";
        buttons.forEach((all) => all.setAttribute("visible", true));
      }
    });
  });
}
starter.forEach((item) =>
  item.addEventListener("click", () => {
    counterI = -1;
    endGame();
    if (counterI == 0) {
      pyro.style.display = "none";
      resultDiv.style.display = "none";
      game();
      resultAlert.innerHTML = "";
    }
  })
);

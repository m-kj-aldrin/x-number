import "../src/custom-elements/index.js";

const number0 = document.createElement("x-number");

document.body.append(number0);

document.body.addEventListener("input", (e) => {
  console.log("body input", e);
});

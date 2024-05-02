import "../src/custom-elements/index.js";
import { CustomNumberElement } from "../src/custom-elements/x-number.js";

const number0 = document.createElement("x-number");
number0.innerHTML = `
<div slot="label">number</div>
`;

document.body.append(number0);

document.body.addEventListener("input", (e) => {
  if (e.target instanceof CustomNumberElement) {
    console.log("number: ", e.target.value);
  }
});

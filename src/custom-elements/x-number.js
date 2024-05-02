const customNumbertemplate = document.createElement("template");
customNumbertemplate.innerHTML = `
<style>
  :host{
    max-width: max-content;
  }
  [contenteditable="true"]{
    /*border: 1px currentColor solid;*/
    border-bottom: 1px currentColor solid;
    min-width: 2ch;
    width: max-content;
  }
  [contenteditable="true"]:focus{
    outline: 1px currentColor solid;
    outline-offset: 2px;
  }
  ::slotted([slot="label"]){
    margin-bottom: 2px;
  }
</style>
<slot name="label"></slot>
<div contenteditable="true"></div>
`;

export class CustomNumberElement extends HTMLElement {
  #value = 0;

  constructor() {
    super();

    this.attachShadow({ mode: "open" });

    this.shadowRoot.append(customNumbertemplate.content.cloneNode(true));

    this.#attachListeners();
  }

  get value() {
    return this.#value;
  }

  set value(value) {
    this.#value = value;
  }

  #attachListeners() {
    this.shadowRoot.addEventListener("input", this.#handelEditInput.bind(this));
  }

  /**@param {HTMLInputEvent} e */
  #handelEditInput(e) {
    if (e.target.contentEditable == "true") {
      e.stopPropagation();
      let matchArray = this.#parseValue(e.target.textContent);

      if (matchArray.length) {
        this.value = parseFloat(matchArray[0]);
        this.dispatchEvent(new InputEvent("input", { bubbles: true }));
      }
    }
  }

  /**@param {string} inputString */
  #parseValue(inputString) {
    // Regex to exclude integers followed directly by a decimal without digits after, and match proper floating point numbers
    const regex = /\b\d+\b(?!\.\d*)(?!\.\b)|\b\d+\.\d+\b/g;
    let matches = inputString.match(regex);

    // Return the matches or an empty array if no matches found
    return matches || [];
  }
}

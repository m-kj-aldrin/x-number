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

/**@param {HTMLElement} elem */
function setCaretAtEnd(elem) {
  const range = document.createRange(); // Create a range (a range is a like the selection but invisible)
  const selection = window.getSelection(); // Get the current selection
  range.selectNodeContents(elem); // Select the entire contents of the element
  range.collapse(false); // Collapse the range to the end point. False means collapse to end rather than the start
  selection.removeAllRanges(); // Remove all selections before we add our new range
  selection.addRange(range); // Add the new range
  elem.focus(); // Optional: if the element can receive focus
}

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
    this.shadowRoot.addEventListener("keydown", this.#handleKeyDown.bind(this));
  }

  #emitInput() {
    this.dispatchEvent(new InputEvent("input", { bubbles: true }));
  }

  #updateEditElement() {
    this.shadowRoot.querySelector(
      "[contenteditable='true']"
    ).textContent = `${this.value}`;
  }

  /**@param {HTMLKeyboardEvent} e  */
  #handleKeyDown(e) {
    let key = e.key;
    if (key == "ArrowUp" || key == "ArrowDown") {
      e.preventDefault();
      let direction = key == "ArrowUp" ? 1 : -1;
      this.value += direction;
      this.#updateEditElement();
      setCaretAtEnd(e.target);
      this.#emitInput();
    }
  }

  /**@param {HTMLInputEvent} e */
  #handelEditInput(e) {
    if (e.target.contentEditable == "true") {
      e.stopPropagation();
      let matchArray = this.#parseValue(e.target.textContent);

      if (matchArray.length) {
        this.value = parseFloat(matchArray[0]);
        this.#emitInput();
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

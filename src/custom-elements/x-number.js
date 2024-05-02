const customNumbertemplate = document.createElement("template");
customNumbertemplate.innerHTML = `
<style>
  :host{
    display: block;
    border: 1px currentColor solid;
  }
  [contenteditable="true"]{
    background-color: red;
  }
</style>
<div contenteditable="true"></div>
`;

export class CustomNumberElement extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });

    this.shadowRoot.append(customNumbertemplate.content.cloneNode(true));

    this.#attachListeners();
  }

  #attachListeners() {
    this.shadowRoot.addEventListener("input", this.#handelEditInput.bind(this));
  }

  /**@param {HTMLInputEvent} e */
  #handelEditInput(e) {
    if (e.target.contentEditable == "true") e.stopPropagation();
  }
}

import { CustomNumberElement } from "./custom-elements/x-number";

declare global {
  interface HTMLElementTagNameMap {
    "x-number": CustomNumberElement;
  }
  interface HTMLInputEvent extends InputEvent {
    target: HTMLElement;
  }
  interface HTMLKeyboardEvent extends KeyboardEvent {
    target: HTMLElement;
  }
}

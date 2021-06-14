import { Suggestions } from "./suggestions.js";

const template = `
<style>
  :host {
    display: flex;
    align-items: center;
  }
  form {
    position: relative;
  }
  ul {
    position: absolute;
    background: white;
    display: none;
    max-width: 90vh;
    overflow-y: auto;
    list-style: none;
    padding: 0.5em;
    margin: .5em 0;
    width: 100%;
    box-shadow: 0 2px 3px #0003;
    border: solid 1px #0003;
    border-top: none;
  }
  ul.is-open {
    display: block;
  }
  li {
    padding: .5em 1em;
  }
  li.is-focused {
    background-color: var(--lightgray);
  }
  input {
    padding: .5em;
    background: none;
    border: solid 2px var(--darkgray);
    border-radius: 4px;
  }
</style>
<form>
  <label>
    Search:
    <input type="search" name="search">
  </label>
</form>
`;
export default class SearchBox extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = template;

    this.form = shadow.querySelector("form");
    this.results = shadow.querySelector("ul");
  }

  async connectedCallback() {
    const data = this.getAttribute("url");
    const response = await fetch(data);
    const json = await response.json();

    const suggestions = new Suggestions(this.form);
    const input = this.form["search"];

    suggestions.load(json);
    suggestions.attachInput(input);

    input.addEventListener("suggestions:select", (e) => {
      input.value = "";
      const suggestion = e.detail;
      document.location = suggestion.data.value;
    });
  }
}

customElements.define("search-box", SearchBox);

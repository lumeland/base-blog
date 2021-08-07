export default class Searcher extends HTMLElement {
  static get observedAttributes() {
    return ["src", "label", "placeholder"];
  }

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = `
    <style>
    :host {
      display: inline-block;
      position: relative;
    }
    div {
      position: absolute;
      width: 100%;
      overflow-y: auto;
      max-height: 500px;
      box-shadow: 0 1px 4px #0003;
    }
    button {
      display: block;
      width: 100%;
      box-sizing: border-box;
      font: inherit;
      border: none;
      padding: 0;
      text-align: inherit;
    }
    button[hidden] {
      display: none;
    }
    </style>
    <label>
      <span part="label"></span>
      <input type="search" autocomplete="off" part="input">
    </label>

    <div part="items" hidden></div>
    `;
    this.input = shadow.querySelector("input");
    this.itemsContainer = shadow.querySelector("div");
    this.label = shadow.querySelector("label > span");

    this.itemsContainer.addEventListener("selected", (event) => {
      this.input.value = event.target.innerText;
      this.itemsContainer.hidden = true;

      this.dispatchEvent(
        new CustomEvent("selected", {
          detail: {
            label: event.target.innerHTML,
            value: event.target.value,
          },
        }),
      );
    });
  }

  set data(data) {
    this.innerHTML = "";

    for (const row of data) {
      const btn = this.ownerDocument.createElement("button");
      btn.innerHTML = row.label || row.value;
      btn.value = row.value;
      btn.setAttribute("part", "item");
      btn.addEventListener("focus", () => this.activeItem = btn);
      btn.addEventListener("mouseenter", () => this.activeItem = btn);
      const search = `${row.search || ""} ${row.label}`;
      btn.dataset.search = slugify(search);
      btn.addEventListener(
        "click",
        () => btn.dispatchEvent(new CustomEvent("selected", { bubbles: true })),
      );
      this.itemsContainer.appendChild(btn);
    }
  }

  connectedCallback() {
    const { input } = this;
    input.addEventListener("input", () => this.search(input.value));
    input.addEventListener("keydown", (event) => {
      switch (event.code) {
        case "ArrowDown": {
          event.preventDefault();
          const item = this.activeItem;
          const result = Array.from(this.resultItems);

          if (item) {
            const key = result.indexOf(item);

            if (result[key + 1]) {
              const activeItem = result[key + 1];
              this.activeItem = activeItem;
              scroll(this.itemsContainer, activeItem);
            }
          } else if (result.length) {
            const activeItem = result[0];
            this.activeItem = activeItem;
            scroll(this.itemsContainer, activeItem);
          }
          break;
        }

        case "ArrowUp": {
          event.preventDefault();
          const item = this.activeItem;

          if (item) {
            const result = Array.from(this.resultItems);
            const key = result.indexOf(item);

            if (key > 0) {
              const activeItem = result[key - 1];
              this.activeItem = activeItem;
              scroll(this.itemsContainer, activeItem);
            }
          }
          break;
        }

        case "Enter":
          const item = this.activeItem;

          if (item) {
            item.click();
          }
          break;

        case "Escape":
          input.value = "";
          this.search("");
          break;
      }
    });
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case "src":
        if (!newValue) {
          this.data = [];
          break;
        }
        fetch(newValue)
          .then((res) => res.json())
          .then((json) => {
            this.data = json;
          });
        break;
      case "label":
        this.label.innerHTML = newValue;
        break;
      case "placeholder":
        this.input.setAttribute("placeholder", newValue);
        break;
    }
  }

  get items() {
    return this.itemsContainer.querySelectorAll(":scope > button");
  }

  get resultItems() {
    return this.itemsContainer.querySelectorAll(
      ":scope > button:not([hidden])",
    );
  }

  get activeItem() {
    return this.itemsContainer.querySelector(':scope > [part~="active"]');
  }

  set activeItem(item) {
    const old = this.activeItem;
    if (old) {
      old.setAttribute("part", "item");
    }
    item.setAttribute("part", "item active");
  }

  search(query) {
    query = slugify(query);

    this.items.forEach((item) => {
      item.hidden = !query || item.dataset.search.indexOf(query) === -1;
    });

    if (!this.focusedItem) {
      const activeItem = this.resultItems[0];

      if (activeItem) {
        this.activeItem = activeItem;
      }
    }

    this.itemsContainer.hidden = !this.itemsContainer.querySelector(
      ":scope > button:not([hidden])",
    );
  }
}

function scroll(parent, item) {
  let scroll;

  const viewbox = parent.getBoundingClientRect();
  const rect = item.getBoundingClientRect();

  if (viewbox.top - rect.top > 0) {
    scroll = item.previousElementSibling ? "start" : "center";
  } else if (viewbox.bottom < rect.bottom) {
    scroll = item.previousElementSibling ? "end" : "center";
  }

  if (scroll) {
    try {
      item.scrollIntoView({
        block: scroll,
      });
    } catch (err) {
      item.scrollIntoView();
    }
  }
}

function slugify(text) {
  return text.toLowerCase()
    .replaceAll(/[^\w]+/g, "");
}

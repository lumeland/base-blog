/**
 * An individual suggestion
 * ------------------------
 */
export class Suggestion {
  constructor(data, parent) {
    this.data = data;
    this.parent = parent;
    this.element = document.createElement("li");
    this.render(this.element);

    this.element.addEventListener("mouseenter", (e) => {
      e.stopPropagation();
      e.preventDefault();

      this.element.dispatchEvent(
        new CustomEvent("suggestion:hover", {
          detail: this,
          bubbles: true,
        }),
      );
    });

    this.element.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();

      this.element.dispatchEvent(
        new CustomEvent("suggestion:click", {
          detail: this,
          bubbles: true,
        }),
      );
    });
  }

  get focused() {
    return this.element.classList.contains("is-focused");
  }

  render(element) {
    element.innerHTML = this.data.label;
  }

  refresh(result, filter) {
    this.blur();

    if (filter(this)) {
      this.parent.element.appendChild(this.element);
      result.push(this);
    } else {
      this.element.remove();
    }
  }

  focus() {
    this.element.classList.add("is-focused");
    this.element.dispatchEvent(
      new CustomEvent("suggestion:focus", {
        detail: this,
        bubbles: true,
      }),
    );
  }

  blur() {
    this.element.classList.remove("is-focused");
    this.element.dispatchEvent(
      new CustomEvent("suggestion:blur", {
        detail: this,
        bubbles: true,
      }),
    );
  }

  scroll() {
    let scroll;

    //Is in a group
    if (this.parent.wrapper) {
      let rectTop, rectBottom;
      const viewbox = this.parent.parent.element.getBoundingClientRect();

      //Is the first element of the group
      if (!this.element.previousElementSibling) {
        rectTop = this.parent.wrapper.getBoundingClientRect();
        rectBottom = this.element.getBoundingClientRect();
      } else {
        rectBottom = rectTop = this.element.getBoundingClientRect();
      }

      if (viewbox.top - rectTop.top > 0) {
        scroll = this.element.previousElementSibling ? "start" : "center";
      } else if (viewbox.bottom < rectBottom.bottom) {
        scroll = this.element.nextElementSibling ? "end" : "center";
      }
    } else {
      const viewbox = this.parent.element.getBoundingClientRect();
      const rect = this.element.getBoundingClientRect();

      if (viewbox.top - rect.top > 0) {
        scroll = this.element.previousElementSibling ? "start" : "center";
      } else if (viewbox.bottom < rect.bottom) {
        scroll = this.element.previousElementSibling ? "end" : "center";
      }
    }

    if (scroll) {
      try {
        this.element.scrollIntoView({
          behavior: "smooth",
          block: scroll,
        });
      } catch (err) {
        this.element.scrollIntoView();
      }
    }
  }
}

/**
 * A group of suggestions
 * ----------------------
 */
export class Group {
  constructor(data, parent) {
    this.data = data;
    this.parent = parent;
    this.suggestions = [];
    this.cache = {};

    this.wrapper = document.createElement("li");
    this.element = document.createElement("ul");

    this.render(this.wrapper);
    this.wrapper.appendChild(this.element);

    if (data.options) {
      this.load(data.options);
    }
  }

  load(data) {
    this.element.innerHTML = "";
    this.suggestions = data.map((d) => this.loadSuggestion(d));
  }

  loadSuggestion(data) {
    if (!this.cache[data.value]) {
      this.cache[data.value] = this.createSuggestion(data, this.element);
    }

    return this.cache[data.value];
  }

  createSuggestion(data) {
    return new Suggestion(data, this);
  }

  render(element) {
    element.innerHTML = `<strong>${this.data.label}</strong>`;
  }

  refresh(result, filter) {
    this.suggestions.forEach((suggestion) =>
      suggestion.refresh(result, filter)
    );

    if (this.element.childElementCount) {
      this.parent.element.appendChild(this.wrapper);
    } else {
      this.wrapper.remove();
    }
  }
}

/**
 * Suggestions
 * -----------
 */
export class Suggestions {
  //Create from a <datalist> or <select> element
  static createFromElement(options, parent) {
    return new Suggestions(parent || options.parentElement).load(
      getOptionsFromElement(options),
    );
  }

  constructor(parent = document.body) {
    this.closed = true;
    this.cache = {
      groups: {},
      suggestions: {},
    };
    this.data = [];
    this.suggestions = [];
    this.focusedIndex = 0;

    this.element = this.render();
    parent.appendChild(this.element);

    this.element.addEventListener("suggestion:hover", (e) => {
      this.focus(
        this.suggestions.findIndex(
          (suggestion) => suggestion === e.detail,
        ),
      );
    });

    this.element.addEventListener("suggestion:click", (e) => {
      this.focus(
        this.suggestions.findIndex(
          (suggestion) => suggestion === e.detail,
        ),
      );
    });
  }

  get focused() {
    const curr = this.suggestions[this.focusedIndex];

    if (curr && curr.focused) {
      return curr;
    }
  }

  attachInput(input) {
    this.input = input;
    this.input.setAttribute("autocomplete", "off");
    this.input.removeAttribute("list");

    this.input.addEventListener("input", (event) => {
      const query = this.input.value;

      if (query) {
        this.filter(query);
      } else {
        this.close();
      }
    });

    let currValue;

    this.input.addEventListener("focus", (event) => {
      currValue = this.input.value;
    });

    const keys = {
      40: "ArrowDown",
      38: "ArrowUp",
      13: "Enter",
      27: "Escape",
    };

    this.input.addEventListener("keydown", (event) => {
      const code = event.code || keys[event.keyCode];

      switch (code) {
        case "ArrowDown":
          event.preventDefault();

          if (!this.closed) {
            if (this.focusedIndex === undefined) {
              this.focus(0);
            } else {
              this.focus(this.focusedIndex + 1);
            }
          } else if (this.element.value) {
            this.open();
          }
          break;

        case "ArrowUp":
          event.preventDefault();

          if (!this.closed) {
            this.focus(this.focusedIndex - 1);
          }
          break;

        case "Enter":
          if (!this.closed) {
            this.select(this.focused);
            event.preventDefault();
          }
          break;

        case "Escape":
          this.close();
          this.element.value = currValue;
          break;
      }
    });

    this.element.addEventListener(
      "suggestion:click",
      (e) => this.select(e.detail),
    );
  }

  render() {
    return document.createElement("ul");
  }

  createSuggestion(data) {
    return new Suggestion(data, this);
  }

  createGroup(data) {
    return new Group(data, this);
  }

  load(data) {
    this.element.innerHTML = "";
    this.data = data.map((data) => {
      if ("options" in data) {
        const cache = this.cache.groups;

        if (!cache[data.label]) {
          cache[data.label] = this.createGroup(data, this.element);
        } else {
          cache[data.label].load(data.options);
        }

        return cache[data.label];
      }

      const cache = this.cache.suggestions;

      if (!cache[data.value]) {
        cache[data.value] = this.createSuggestion(data, this.element);
      }

      return cache[data.value];
    });

    if (this.query) {
      this.filter(this.query, false);
    }

    return this;
  }

  refresh(filter) {
    this.suggestions = [];
    this.data.forEach((suggestion) =>
      suggestion.refresh(this.suggestions, filter)
    );

    if (!this.element.childElementCount) {
      return this.close();
    }

    this.open();
    this.input.dispatchEvent(new CustomEvent("suggestions:refresh"));

    return this;
  }

  focus(index) {
    if (this.suggestions[index]) {
      if (this.suggestions[this.focusedIndex]) {
        this.suggestions[this.focusedIndex].blur();
      }

      this.suggestions[index].focus();
      this.focusedIndex = index;

      if (!this.closed) {
        this.suggestions[index].scroll();
      }
    }

    return this;
  }

  select(suggestion) {
    this.input.value = suggestion.data.value;
    this.input.dispatchEvent(
      new CustomEvent("suggestions:select", { detail: suggestion }),
    );

    return this.close();
  }

  close() {
    this.closed = true;
    this.element.classList.remove("is-open");
    this.input.dispatchEvent(new CustomEvent("suggestions:close"));

    return this;
  }

  open() {
    this.closed = false;
    this.element.classList.add("is-open");
    this.input.dispatchEvent(new CustomEvent("suggestions:open"));

    if (this.focused) {
      this.focused.focus();
    } else if (this.input.value) {
      this.focus(0);
    }

    return this;
  }

  filter(query, clean = true) {
    query = clean ? cleanString(query) : query;

    if (!query.length) {
      return this.close();
    }

    this.query = query;
    query = query.split(" ");

    this.refresh((suggestion) => {
      if (!suggestion.search) {
        suggestion.search = cleanString(
          suggestion.data.search ||
            `${suggestion.data.label} ${suggestion.data.value}`,
        );
      }

      return query.every((q) => suggestion.search.indexOf(q) !== -1);
    });

    return this;
  }

  destroy() {
    this.input.removeEventListener("input");
    this.input.removeEventListener("focus");
    this.input.removeEventListener("keydown");
    this.element.remove();

    return this;
  }
}

/**
 * Create Suggestions loading data with ajax
 * -----------------------------------------
 */
export class AjaxSuggestions extends Suggestions {
  constructor(endpoint, parent) {
    super(parent);
    this.endpoint = endpoint;
    this.cache = {
      groups: {},
      suggestions: {},
    };
  }

  filter(query, clean = false) {
    query = clean ? cleanString(query) : query;

    if (query.length < 2) {
      return this.close();
    }

    if (this.query === query) {
      return this.refresh(() => true);
    }

    this.query = query;

    if (!this.waiting) {
      this.loadData(query)
        .then(() => this.refresh(() => true))
        .then(() => {
          if (this.query && this.query !== query) {
            query = this.query;
            delete this.query;
            this.filter(query);
          }
        });
    }

    return this;
  }

  loadData(query) {
    if (this.cache[query]) {
      this.load(this.cache[query]);
      return Promise.resolve();
    }

    this.waiting = true;

    return getJson(this.endpoint + "?q=" + query)
      .catch((err) => console.error(err))
      .then((data) => {
        this.cache[query] = data;
        this.load(data);

        return new Promise((resolve) =>
          setTimeout(() => {
            this.waiting = false;
            resolve();
          }, 200)
        );
      });
  }
}

/**
 * Helpers
 * -------
 */
function cleanString(str) {
  const replace = {
    a: /á/gi,
    e: /é/gi,
    i: /í/gi,
    o: /ó/gi,
    u: /ú/gi,
  };

  str = str.toLowerCase();

  for (let r in replace) {
    str = str.replace(replace[r], r);
  }

  return str
    .replace(/[^\wñç\s]/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function getOptionsFromElement(element) {
  const data = [];

  element.querySelectorAll("optgroup").forEach((optgroup) => {
    const options = [];

    optgroup.querySelectorAll("option").forEach((option) =>
      options.push(
        Object.assign(
          {
            label: option.label,
            value: option.value,
          },
          option.dataset,
        ),
      )
    );

    data.push({
      label: optgroup.label,
      options: options,
    });
  });

  element.querySelectorAll("option").forEach((option) => {
    if (option.parentElement.tagName !== "OPTGROUP") {
      data.push(
        Object.assign(
          {
            label: option.label,
            value: option.value,
          },
          option.dataset,
        ),
      );
    }
  });

  return data;
}

function getJson(url) {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();

    request.open("GET", url, true);
    request.setRequestHeader("Accept", "application/json");

    request.onload = () => {
      if (request.status >= 200 && request.status < 400) {
        resolve(JSON.parse(request.responseText));
      } else {
        reject(`The request status code is ${request.status}`);
      }
    };

    request.send();
  });
}

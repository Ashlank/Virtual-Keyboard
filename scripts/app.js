class Keyboard {

  elements = {
    keyboard: null,
    keysContainer: null,
    keys: [],
  }

  properties = {
    value: '',
    capsLock: false
  }

  eventHandlers = {
    oninput: null,
    onclose: null,
  }

  init() {
    // Creating the main elements
    this.elements.keyboard = document.createElement("div");
    this.elements.keysContainer = document.createElement("div");

    // Setting up the main elements's classes
    this.elements.keyboard.classList.add("keyboard", "keyboard--hidden");
    this.elements.keysContainer.classList.add("keyboard__keys");

    // Creating the keys, appending the keys to keysContainer, and selecting all the keys
    this.elements.keysContainer.appendChild(this._createKeys());
    this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");

    // Adding to the DOM
    this.elements.keyboard.appendChild(this.elements.keysContainer);
    document.body.appendChild(this.elements.keyboard);

    // Opening the keyboard on all elements with the class "use-keyboard" like inputs or textAreas
    document.querySelectorAll(".use-keyboard").forEach( element => {
      element.addEventListener("focus", () => {
        this.open(element.value, currentValue => {
          element.value = currentValue;
        })
      })
    })

  }

  _createKeys() {

    const fragment = document.createDocumentFragment();
    const keysLayout = [
      "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
      "q", "w", "e", "r", "t", "y", "u", "i", "o", "p",
      "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "ñ", "enter",
      "done", "z", "x", "c", "v", "b", "n", "m", ",", ".", "?",
      "space"
    ];

    // Icons HTML
    const createIcon = (icon) => {
      return `<i class="material-icons">${icon}</i>`
    }

    // Creating the button element for each key
    keysLayout.forEach( key => {
      const keyElement = document.createElement("button");
      const insertBreak = ['backspace', 'p', 'enter', '?'].indexOf(key) !== -1;

      // Adding class and attribute
      keyElement.setAttribute('type', 'button');
      keyElement.classList.add("keyboard__key");

      switch(key){
        case 'backspace':
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIcon('backspace');

          // On click event, delete the last character
          keyElement.addEventListener("click", () => {
            this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);

            this._triggerEvent("oninput");
          });

          break;

        case 'caps':
          keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
          keyElement.innerHTML = createIcon('keyboard_capslock');

          // On click event, toggle the capsLock
          keyElement.addEventListener("click", () => {
            this._toggleCapsLock()

            // Toggle the active class when capsLock change
            keyElement.classList.toggle("keyboard__key--active", this.properties.capsLock);
          });

          break;

        case 'enter':
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIcon('keyboard_return');

          // On click event, jump to the bottom line
          keyElement.addEventListener("click", () => {
            this.properties.value += '\n';

            this._triggerEvent("oninput");
          });

          break;

        case 'space':
          keyElement.classList.add("keyboard__key--extra-wide");
          keyElement.innerHTML = createIcon('space_bar');

          // On click event, add an "space" character
          keyElement.addEventListener("click", () => {
            this.properties.value += ' ';

            this._triggerEvent("oninput");
          });

          break;

        case 'done':
          keyElement.classList.add("keyboard__key--wide", "keyboard__key--dark");
          keyElement.innerHTML = createIcon('check');

          // On click event, close the keyboard
          keyElement.addEventListener("click", () => {
            this.close()

            this._triggerEvent("onclose");
          });

          break;

        default:
          keyElement.textContent = key.toLowerCase();

          keyElement.addEventListener("click", () => {
            this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();

            this._triggerEvent("oninput");
          });

          break;
      }

      fragment.appendChild(keyElement)

      if(insertBreak) {
        fragment.appendChild(document.createElement("br"));
      };

    });

    return fragment;

  }

  _triggerEvent(eventName) {
    if(typeof this.eventHandlers[eventName] === 'function') {
      this.eventHandlers[eventName](this.properties.value);
    }
  }

  _toggleCapsLock() {
    this.properties.capsLock = !this.properties.capsLock;
    for(const key of this.elements.keys) {
      if( key.childElementCount === 0) {
        key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
      }
    }
  }

  open( initialValue , oninput, onclose ) {
    this.elements.keyboard.classList.remove("keyboard--hidden");
    this.properties.value = initialValue;
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
  }

  close() {
    this.elements.keyboard.classList.add("keyboard--hidden");
    this.properties.value = '';
    this.eventHandlers.onclose = null;
    this.eventHandlers.oninput = null;
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const app = new Keyboard;
  app.init();
})
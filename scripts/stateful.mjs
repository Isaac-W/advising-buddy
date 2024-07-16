export default class Stateful {
    #state = {};

    constructor(id=window.location.pathname) {
        this.id = id;
        this.state = this.loadState();
    }

    loadState() {
        return JSON.parse(localStorage.getItem(`state-${this.id}`)) || {};
    }

    saveState() {
        localStorage.setItem(`state-${this.id}`, JSON.stringify(this.state));
    }

    getItem(key) {
        return this.state[key];
    }

    setItem(key, value) {
        this.state[key] = value;
        this.saveState();
    }

    removeItem(key) {
        delete this.state[key];
        this.saveState();
    }

    clear() {
        this.state = {};
        this.saveState();
    }

    static clearAll() {
        for (let key in localStorage) {
            if (key.startsWith('state-')) {
                localStorage.removeItem(key);
            }
        }
    }

    initialize() {
        document.querySelectorAll('[data-state]').forEach((el) => {
            const key = el.getAttribute('data-state');
            const value = this.getItem(key);
            if (value !== undefined) {
                el.value = value;
            }
            el.addEventListener('change', (ev) => {
                console.log('change', key, el.value);
                this.setItem(key, el.value);
            });
        });
        this.saveState();
    }
}

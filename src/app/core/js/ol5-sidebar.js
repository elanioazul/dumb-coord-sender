import Control from 'ol/control/Control';

export default class Sidebar extends Control {

    constructor(opt_options) {

        var defaults = {
            element: null,
            position: 'left'
        }, i, child;

        var options = Object.assign({}, defaults, opt_options);

        var element = options.element;

        super({
            element: options.element,
            target: options.target
        });

        // Attach .sidebar-left/right class
        element.classList.add('sidebar-' + options.position);

        // Find sidebar > div.sidebar-content
        for (i = element.children.length - 1; i >= 0; i--) {
            child = element.children[i];
            if (child.tagName === 'DIV' &&
                    child.classList.contains('sidebar-content')) {
                this._container = child;
            }
        }

        // Find sidebar ul.sidebar-tabs > li, sidebar .sidebar-tabs > ul > li
        this._tabitems = element.querySelectorAll('ul.sidebar-tabs > li, .sidebar-tabs > ul > li');
        for (i = this._tabitems.length - 1; i >= 0; i--) {
            this._tabitems[i]._sidebar = this;
        }

        // Find sidebar > div.sidebar-content > div.sidebar-pane
        this._panes = [];
        this._closeButtons = [];
        for (i = this._container.children.length - 1; i >= 0; i--) {
            child = this._container.children[i];
            if (child.tagName == 'APP-VISOR-SIDEBAR-TAB' &&
            child.getElementsByClassName('sidebar-pane')[0].className == 'sidebar-pane') {
                this._panes.push(child);

                var closeButtons = child.querySelectorAll('.sidebar-close');
                for (var j = 0, len = closeButtons.length; j < len; j++) {
                    this._closeButtons.push(closeButtons[j]);
                }
            }
        }
        //create new private variables for more control
        this._nonOpenableTabs = options.nonOpenableTabs;
        this._largerTabs = options.largerTabs;
    }

    /**
    * Set the map instance the control is associated with.
    * @param {ol.Map} map The map instance.
    */
    setMap(map) {
        var i, child;

        for (i = this._tabitems.length - 1; i >= 0; i--) {
            child = this._tabitems[i];
            var sub = child.querySelector('a');
            if (sub.hasAttribute('href') && sub.getAttribute('href').slice(0,1) == '#') {
                sub.onclick = this._onClick.bind(child);
            }
        }

        for (i = this._closeButtons.length - 1; i >= 0; i--) {
            child = this._closeButtons[i];
            child.onclick = this._onCloseClick.bind(this);
        }
    };

    open(id) {
        var i, child, isANonOpenableTab, isLargerTab;

        // hide old active contents and show new content
        for (i = this._panes.length - 1; i >= 0; i--) {
            child = this._panes[i];
            if (child.id == id)
                child.classList.add('active');
            else if (child.classList.contains('active'))
                child.classList.remove('active');
        }

        // remove old active highlights and set new highlight
        for (i = this._tabitems.length - 1; i >= 0; i--) {
            child = this._tabitems[i];
            if (child.querySelector('a').hash == '#' + id)
                child.classList.add('active');
            else if (child.classList.contains('active'))
                child.classList.remove('active');
        }

        isANonOpenableTab = this._nonOpenableTabs.find(tab => tab.id === id);
        isLargerTab = this._largerTabs.find(tab => tab.id === id);

        // open sidebar (if necessary)
        if (isANonOpenableTab) {
            if (!this.element.classList.contains('collapsed')) {
                this.element.classList.add('collapsed');
            }
            if (this.element.classList.contains('sidebar-large')) {
                this.element.classList.remove('sidebar-large');
            }
        } else if (isLargerTab) {
            this.element.classList.add('sidebar-large');
        } else {
            if (this.element.classList.contains('collapsed')) {
                this.element.classList.remove('collapsed');
            }
            if (this.element.classList.contains('sidebar-large')) {
                this.element.classList.remove('sidebar-large');
            }
        }

        return this;
    };

    close() {
        // remove old active highlights
        for (var i = this._tabitems.length - 1; i >= 0; i--) {
            var child = this._tabitems[i];
            if (child.classList.contains('active'))
                child.classList.remove('active');
        }

        // close sidebar
        if (this.element.classList.contains('sidebar-large')) {
            this.element.classList.remove('sidebar-large');
        }
        if (!this.element.classList.contains('collapsed')) {
            this.element.classList.add('collapsed');
        }

        return this;
    };

    _onClick(evt) {
        evt.preventDefault();
        if (this.classList.contains('active')) {
            this._sidebar.close();
        } else if (!this.classList.contains('disabled')) {
            this._sidebar.open(this.querySelector('a').hash.slice(1));
        }
    };

    _onCloseClick() {
        this.close();
    };
}

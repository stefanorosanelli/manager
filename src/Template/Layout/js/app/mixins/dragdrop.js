/**
 * Mixins: DragdropMixin
 *
 * enables drag/drop events on main element $el
 *
 * TO-DO advanced drag-drop feature... sortable...
 */

export const DragdropMixin = {
    data() {
        return {
            from: {},
            draggedElement: null,
            overElement: null,
            dropElement: null,
            acceptedDrop: [],
            draggableElements: [],
            dragOverFirst: true,
            antiGlitchTimer: null,
        }
    },

    mounted() {
        // search for a specific drop target
        let dropElementInView = this.$el.querySelector('[droppable]');
        if (dropElementInView) {
            this.dropElement = dropElementInView;
            let accepted = dropElementInView.getAttribute('accepted-drop');
            if (accepted) {
                this.acceptedDrop = accepted.split(',');
            }
        } else {
            // if not defined default to main element
            this.dropElement = this.$el;
        }

        // check if at least 1 draggable is defined in component view
        let draggables = this.$el.querySelectorAll('[draggable]');
        if (draggables.length) {
            // if so set up dragstart event
            this.draggableElements = draggables;
            this.$el.addEventListener('dragstart', this.onDragstart, false);
        }

        // setup Drop events
        this.dropElement.addEventListener('drop', this.onDrop, false);
        this.dropElement.addEventListener('dragover', this.onDragover, false);
        this.dropElement.addEventListener('dragleave', this.onDragleave, false);
    },

    destroyed() {
        // clean up
        this.dropElement.removeEventListener('dragover', this.onDragover, false);
        this.dropElement.removeEventListener('dragleave', this.onDragleave, false);
        this.dropElement.removeEventListener('drop', this.onDrop, false);
        if (this.draggableElements.length) {
            this.$el.removeEventListener('dragstart', this.onDragstart, false);
        }
    },

    methods: {
        /**
         * set dragdrop info data in Event property dragdrop.
         * ev.dragdrop = {
         *    dragged, // DOM element
         *    over, // DOM element
         *    drop, // DOM element
         *    data // Custom data
         * }
         *
         * @param {Event} ev mouse event
         * @param {Object} data
         *
         * @return {void}
         */
        setDragdropData(ev, data = null) {
            ev.dragdrop = {
                dragged: this.draggedElement,
                over: this.overElement,
                drop: this.dropElement,
                data,
            }
        },

        /**
         * drag start event callback
         * set current draggedElement
         *
         * @emits Event#dragstart
         *
         * @param {Event} ev mouse event
         *
         * @return {void}
         */
        onDragstart(ev) {
            this.draggedElement = ev.target;
            this.setDragdropData(ev);
            this.$emit('dragstart', ev);
        },


        /**
         * drag over event callback
         * check if current dragged element is accepted by drop target
         * if true set dragover class to drop target and emits events
         *
         * @param {Event} ev mouse event
         *
         * @emits Event#dragover-once first dragover
         * @emits Event#dragover continuous dragover
         *
         * @return {void}
         */
        onDragover(ev) {
            ev.preventDefault();
            ev.stopPropagation();

            // check if draggable is accepted for drop target (if no rules are defined all draggable are accepted)
            if (this.acceptedDrop.length ) {
                const isValid = this.acceptedDrop.reduce((status, query) => status = status || this.draggedElement.matches(query), false);
                if (!isValid) {
                    return;
                }
            }

            window.clearTimeout(this.antiGlitchTimer);
            this.overElement = ev.target;

            // set dragdrop data
            this.setDragdropData(ev);
            this.dropElement.classList.add('dragover');

            if (this.dragOverFirst) {
                this.dragOverFirst = false;
                this.$emit('dragover-once', ev);
            }

            this.$emit('dragover', ev);
        },

        /**
         * drag leave event callback
         * check for false positive (if mouse left element to enter in a child element)
         * if leave is legit removes dragover class from drop target
         * emit dragleave event
         *
         * @param {Event} ev mouse event
         *
         * @emits Event#dragleave
         *
         * @return {void}
         */
        onDragleave(ev) {
            ev.preventDefault();
            ev.stopPropagation();

            this.overElement = null,
            this.setDragdropData(ev);

            this.dragOverFirst = true;
            this.antiGlitchTimer = window.setTimeout(() => {
                this.dropElement.classList.remove('dragover');

                // check mouse location
                if (!this.isOverChild(ev)) {
                    this.$emit('dragleave');
                }
            }, 25);
        },

        /**
         * drop event callback
         * remove dragover class from drop target
         * always emits dragleave
         * check for files in dataTransfer object
         * if true emits drop-files with special payload
         *
         * @param {Event} ev mouse event
         *
         * @emits Event#dragleave
         * @emits Event#drop-files
         * @emits Event#drop
         *
         * @return {void}
         */
        onDrop(ev) {
            ev.preventDefault();
            ev.stopPropagation();
            this.setDragdropData(ev);

            // still emit dragleave and remove class
            this.dropElement.classList.remove('dragover');
            this.$emit('dragleave');

            let files = ev.target.files || ev.dataTransfer.files;

            if (files.length) {
                this.setDragdropData(ev, files);
                this.$emit('drop-files', ev);
            } else {
                this.$emit('drop', ev);
            }
        },

        /**
         * check if mouse coordinates are over any child DOM elements of main dropElement
         *
         * @param {Event} ev mouse event
         *
         * @return {Boolean} true if mouse entered a child element
         */
        isOverChild(event) {
            if (!this.dropElement) {
                return false;
            }
            let rect = this.dropElement.getBoundingClientRect();

            // mouse outside browser
            const actualInnerWidth = document.body.clientWidth;
            const actualInnerHeight = document.body.clientHeight;
            // console.log('event', event.clientX, event.clientY, actualInnerWidth, actualInnerHeight)
            if (event.clientX <= 0 || event.clientY <= 0 || event.clientX > actualInnerWidth || event.clientY > actualInnerHeight) {
                return false;
            }
            // mouse inside child element
            if (event.clientY >= rect.top && event.clientY <= rect.bottom && event.clientX >= rect.left && event.clientX <= rect.right) {
                return true;
            }

            // mouse outside element
            return false;
        },
    }
}

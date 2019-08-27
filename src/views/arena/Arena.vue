<template>

    <div class="arena" :style="'transform: scale('+scale+') translate('+translateX+'px,'+translateY+'px)'"
    @mousedown="mouseDown($event)" @mousemove="mouseMove($event)" @mouseup="mouseUp()" @mouseleave="mouseLeave()"
    @mousewheel="scrollArena($event)">

        <div class="test"></div>

    </div>

</template>


<style lang="scss">
    @import '../Game.sass';
</style>


<script>
export default {
    data() {
        return {
            scale: 1,
            zoomStep: 0.25,

            translateX: 0,
            translateY: 0,

            mouseDownBoolean: false,
            previousX: 0,
            previousY: 0
        }
    },

    methods: {
        scrollArena(event) {
            var direction = 0;
            if (event.deltaY > 0)
                direction = 1;
            else
                direction = -1

            this.scale - direction * this.zoomStep >= 1 &&
            this.scale - direction * this.zoomStep <= 8 ? 
            (this.scale -= direction * this.zoomStep) : null;
        },

        mouseDown(event) {
            this.mouseDownBoolean = true;
            this.previousX = event.clientX;
            this.previousY = event.clientY;
        },
        mouseMove(event) {
            if (this.mouseDownBoolean) {
                this.translateX += event.clientX - this.previousX;
                this.translateY += event.clientY - this.previousY;
                
                this.previousX = event.clientX;
                this.previousY = event.clientY;
            }
        },
        mouseUp() {
            this.mouseDownBoolean = false;
        },
        mouseLeave() {
            this.mouseDownBoolean = false;
        },
    }
}
</script>

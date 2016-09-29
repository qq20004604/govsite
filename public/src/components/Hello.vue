<template>
    <div class="hello">
        <h1  @click="a">{{ msg }}</h1>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                msg: 'Hello Vue1!'
            }
        },
        methods: {
            a: function () {
                console.log("123");
                $("#m").text("123");
            }
        }
    }
</script>

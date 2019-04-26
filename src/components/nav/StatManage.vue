<template>
    <div id="StatManage"></div>
</template>

<script>
    /*eslint no-console: ["error", { allow: ["warn", "error"] }] */
    export default {
        name: "StatManage",
        data() {
            return {
                stat: null
            }
        },
        created() {
            this.httpGet('/count', response => {
                console.warn(response);
            })
        }
    }
</script>

<style scoped>

</style>
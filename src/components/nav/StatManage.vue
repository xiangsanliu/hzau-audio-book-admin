<template>
    <div id="StatManage">
        <div>总播放量：{{stat.amount}}</div>
        <div>总点赞量：{{stat.thumb}}</div>
        <div>总评论量：{{stat.comment}}</div>
    </div>
</template>

<script>
    /*eslint no-console: ["error", { allow: ["warn", "error"] }] */
    export default {
        name: "StatManage",
        data() {
            return {
                stat: {
                    amount: 0,
                    thumb: 0,
                    comment: 0
                }
            }
        },
        created() {
            this.httpGet('/count', response => {
                this.stat = response.content;
            })
        }
    }
</script>

<style scoped>

</style>
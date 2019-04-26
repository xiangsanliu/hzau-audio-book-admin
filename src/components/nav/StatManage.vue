<template>
    <div id="StatManage">
        <div>书籍总播放量：{{stat.bookAmount}}</div>
        <div>短音频总播放量：{{stat.shortAmount}}</div>
        <div>书籍总点赞量：{{stat.bookThumb}}</div>
        <div>短音频总点赞量：{{stat.shortThumb}}</div>
        <div>书籍总评论量：{{stat.bookComment}}</div>
        <div>短音频总评论量：{{stat.shortComment}}</div>
    </div>
</template>

<script>
    /*eslint no-console: ["error", { allow: ["warn", "error"] }] */
    export default {
        name: "StatManage",
        data() {
            return {
                stat: {
                    bookAmount: 0,
                    shortAmount: 0,
                    bookThumb: 0,
                    shortThumb: 0,
                    bookComment: 0,
                    shortComment: 0
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
<template>
    <div id="navigation">
        <el-menu :default-active="activeIndex" active-text-color="#ffffff" background-color="#324057" class="el-menu"
                 mode="horizontal" text-color="#cbcfd4">
            <el-menu-item index="1" @click="router.replace('/book')">
                有声书管理
            </el-menu-item>
            <el-menu-item index="2" @click="router.replace('/bookList')">
                书单管理
            </el-menu-item>
            <el-menu-item index="3" @click="router.replace('/activity')">
                活动管理
            </el-menu-item>
            <el-menu-item index="4" @click="router.replace('/shortAudio')">
                短音频审核
            </el-menu-item>
        </el-menu>
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        name: "Navigation",
        data() {
            return {
                activeIndex: '1',
                router: this.$router
            }
        },
        created() {
            this.$router.replace('/book');
        }
    }
</script>

<style scoped>

</style>

<template>
    <div id="navigation">
        <el-menu :default-active="activeIndex" active-text-color="#ffffff" background-color="#324057" class="el-menu"
                 mode="horizontal" text-color="#cbcfd4">
            <el-menu-item @click="router.replace('/bookManage')" index="1">
                有声书管理
            </el-menu-item>
            <el-menu-item @click="router.replace('/bookListManage')" index="2">
                书单管理
            </el-menu-item>
            <el-menu-item index="3">
                生产材料
            </el-menu-item>
            <el-menu-item index="4">
                培肥配药
            </el-menu-item>
            <el-menu-item index="5">
                生产计划
            </el-menu-item>
            <el-menu-item index="6">
                农作信息
            </el-menu-item>
            <el-menu-item index="7">
                实际采收
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
    }
</script>

<style scoped>

</style>

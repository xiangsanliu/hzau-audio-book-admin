<template>
    <div id="login">
        <el-form :model="user">
            <el-form-item label-width="120px" label="用户名">
                <el-input placeholder="用户名" type="text" v-model="user.username"></el-input>
            </el-form-item>
            <el-form-item label-width="120px" label="密码">
                <el-input placeholder="密码" type="password" v-model="user.password"></el-input>
            </el-form-item>
            <el-button @click="login" type="primary">登录</el-button>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "Login",
        data() {
            return {
                user: {
                    username: '',
                    password: ''
                }
            }
        },
        methods: {
            login: function () {
                let _this = this;
                _this.httpPost('/login', this.user, () => {
                    _this.$router.replace('/book');
                }, responseBean => {
                    _this.$message.error(responseBean.msg);
                })
            }
        }
    }
</script>

<style scoped>

</style>

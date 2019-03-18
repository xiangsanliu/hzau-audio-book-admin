<template>
    <el-container>
        <el-main>
            <el-button @click="addBtnClicked" plain type="primary">添加活动</el-button>

            <el-table :data="activities">
                <el-table-column label="id" prop="id" v-if="false"></el-table-column>
                <el-table-column label="活动标题" prop="name"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button @click="showActivityDetail(scope.row)" plain type="primary">查看</el-button>
                        <el-button @click="editActivity(scope.row)" plain type="primary">编辑</el-button>
                        <el-button @click="removeActivity(scope.row)" plain type="danger">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-dialog title="添加/编辑活动" :visible.sync="editDialogVisible">
                <el-upload
                        class="avatar-uploader"
                        :action="uploadUrl"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                    <img v-if="imageUrl" :src="imageUrl" class="avatar" alt="">
                    <div v-else>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                        <i class="el-icon-plus avatar-uploader-icon"></i>
                    </div>
                </el-upload>
            </el-dialog>

        </el-main>
    </el-container>
</template>

<script>
    /*eslint no-console: ["error", { allow: ["warn", "error"] }] */

    export default {
        name: "ActivityManage",
        data() {
            return {
                editDialogVisible: false,
                activities: [
                    {
                        id: 1,
                        name: '测试主题1',
                        content: '测试内容'
                    }
                ],
                uploadUrl: '',
                baseUploadUrl: '/api/activity/upload/',
                imageUrl: ''
            }
        },
        created() {
            this.reLoadActivities();
        },
        methods: {
            addBtnClicked: function () {
                this.editDialogVisible = true;
                this.uploadUrl = this.baseUploadUrl + '0/非活动';
            },
            reLoadActivities: function () {

            }
            ,
            showActivityDetail: function () {

            }
            ,
            editActivity: function (row) {
                console.warn(row);
            }
            ,
            removeActivity: function (row) {
                console.warn(row);
            }
            ,
            handleAvatarSuccess(response) {
                if (200 === response.status) {
                    this.imageUrl = '/file/' + response.msg + '?' + new Date().getTime();
                } else {
                    this.$message.warning(response.msg);
                }
            }
            ,
            beforeAvatarUpload() {

            }
        }
    }
</script>

<style scoped>
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }

    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
</style>

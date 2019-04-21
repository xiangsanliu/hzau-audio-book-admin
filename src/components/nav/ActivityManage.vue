<template>
    <el-container>
        <el-main>
            <el-button @click="addBtnClicked" plain type="primary">添加活动</el-button>
            <el-table :data="activities">
                <el-table-column label="id" prop="id" v-if="false"></el-table-column>
                <el-table-column label="活动标题" prop="name" width="200" fixed></el-table-column>
                <el-table-column label="活动简介" prop="desc"></el-table-column>
                <el-table-column label="操作" width="200" fixed="right">
                    <template slot-scope="scope">
                        <el-button @click="editActivity(scope.row)" plain type="primary">编辑</el-button>
                        <el-button @click="removeActivity(scope.row)" plain type="danger">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-dialog title="添加/编辑活动" :visible.sync="editDialogVisible">
                <el-form :model="activity" :rules="rules">
                    <el-form-item label-width="120px" label="活动名" prop="name">
                        <el-input placeholder="请输入活动名称" type="text" v-model="activity.name"></el-input>
                    </el-form-item>
                    <el-form-item label-width="120px" label="活动简介" prop="desc">
                        <el-input placeholder="请输入活动简介" type="textarea"
                                  :autosize="{ minRows: 3, maxRows: 5}"
                                  maxlength="255"
                                  v-model="activity.desc"></el-input>
                    </el-form-item>
                    <div style="margin: 20px 0;"></div>
                </el-form>
                <el-upload
                        v-if="null !== activity.id"
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
                <div class="dialog-footer" slot="footer">
                    <el-button @click="clearForm">取 消</el-button>
                    <el-button @click="creatActivity" type="primary">确 定</el-button>
                </div>
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
                activities: [],
                activity: {
                    id: null,
                    name: '',
                    desc: ''
                },
                uploadUrl: '',
                baseUploadUrl: `${this.protoUploadUrl}activity/upload`,
                imageUrl: '',
                rules: {
                    name: [
                        {required: true, message: '请输入活动名', trigger: 'blur'},
                        {max: 50, message: '活动名最长50字', trigger: 'blur'}
                    ],
                    desc: [
                        {max: 255, message: '活动简介最长255字', trigger: 'blur'}
                    ]
                }
            }
        },
        created() {
            this.reLoadActivities();
        },
        methods: {
            addBtnClicked: function () {
                this.clearForm();
                this.editDialogVisible = true;
            },
            reLoadActivities: function () {
                let _this = this;
                _this.httpGet('/activity/getAllActivities', responseBean => {
                    _this.activities = responseBean.content;
                });
            },
            creatActivity: function () {
                let _this = this;
                this.activity.name = this.activity.name.replace(/\s/g, "");
                if (this.activity.name.length > 50) {
                    this.$message.error('活动名最长50字');
                    return;
                }
                if (this.activity.desc.length > 255) {
                    this.$message.error('活动简介最长255字');
                    return;
                }
                _this.httpPost('/activity/editActivity', _this.activity, responseBean => {
                    _this.$message.success(responseBean.msg);
                    _this.reLoadActivities();
                    _this.clearForm();
                })
            },
            editActivity: function (row) {
                this.editDialogVisible = true;
                this.activity.id = row.id;
                this.activity.name = row.name;
                this.activity.desc = row.desc;
                this.uploadUrl = `${this.baseUploadUrl}/${row.id}/${row.name}`;
                if (row.posterUploaded) {
                    this.imageUrl = `${this.fileUrl}activities/${row.name}/${row.name}.jpg?${new Date().getTime()}`;
                } else {
                    this.imageUrl = '';
                }
            },
            removeActivity: function (row) {
                let _this = this;
                _this.removeRecord('/activity/remove/', row.id, responseBean => {
                    _this.$message.success(responseBean.msg);
                    _this.reLoadActivities();
                });
            },
            handleAvatarSuccess(response) {
                if (200 === response.status) {
                    this.imageUrl = this.fileUrl + response.msg + '?' + new Date().getTime();
                } else {
                    this.$message.warning(response.msg);
                }
            },
            beforeAvatarUpload() {

            },
            clearForm: function () {
                this.editDialogVisible = false;
                this.activity.id = null;
                this.activity.name = null;
                this.activity.desc = null;
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

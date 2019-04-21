<template>
    <div id="bookManage">
        <el-container>
            <el-main>
                <el-button @click="editDialogVisible = true" plain type="primary">添加书籍</el-button>
                <el-table :data="books">
                    <el-table-column label="id" prop="id" v-if="false"></el-table-column>
                    <el-table-column label="书名" prop="name"></el-table-column>
                    <el-table-column label="作者" prop="author"></el-table-column>
                    <el-table-column label="简介" prop="desc"></el-table-column>
                    <el-table-column label="来源" prop="source"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button @click="editBook(scope.row)" plain type="primary">编辑</el-button>
                            <el-button @click="manageAudio(scope.row)" plain type="primary">管理音频</el-button>
                            <el-button @click="removeBook(scope.row)" plain type="danger">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-dialog title="添加/编辑书籍" :visible.sync="editDialogVisible" :before-close="clearForm">
                    <img :src="book.picPath" alt=""/>
                    <el-form :model="book" :rules="rules">
                        <el-form-item :label-width="formLabelWidth" label="书名" prop="name">
                            <el-input placeholder="请输入书名" type="text" v-model="book.name"></el-input>
                        </el-form-item>
                        <el-form-item :label-width="formLabelWidth" label="作者" prop="author">
                            <el-input placeholder="请输入作者" type="text" v-model="book.author"></el-input>
                        </el-form-item>
                        <el-form-item :label-width="formLabelWidth" label="封面链接" prop="picPath">
                            <el-input placeholder="请输入封面链接" type="text" v-model="book.picPath"></el-input>
                        </el-form-item>
                        <el-form-item :label-width="formLabelWidth" label="简介" prop="desc">
                            <el-input placeholder="请输入简介" type="textarea" v-model="book.desc"></el-input>
                        </el-form-item>
                    </el-form>
                    <el-upload
                            class="avatar-uploader"
                            :action="imageUploadUrl"
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
                        <el-button @click="createBook" type="primary">确 定</el-button>
                    </div>
                </el-dialog>
                <el-dialog :title="currentBookName" :visible.sync="audioDialogVisible">
                    <el-upload multiple
                               :action="uploadUrl"
                               :file-list="fileList"
                               :on-change="uploadChange"
                               :on-success="uploadSuccess"
                               :before-upload="uploadBefore">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">上传文件不能超过30MB</div>
                    </el-upload>
                    <el-table :data="bookAudios">
                        <el-table-column label="id" prop="id" v-if="false"></el-table-column>
                        <el-table-column label="文件名" prop="name"></el-table-column>
                        <el-table-column label="路径" prop="path" v-if="false"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button @click="playAudio(scope.row)" plain type="primary">播放</el-button>
                                <el-button @click="removeBookAudio(scope.row)" plain type="danger">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-dialog>
                <el-dialog title="播放" :visible.sync="playVisible">
                    <a-player autoplay :music="music"/>
                </el-dialog>
            </el-main>

        </el-container>
    </div>
</template>

<script>
    /*eslint no-console: ["error", { allow: ["warn", "error"] }] */

    import APlayer from 'vue-aplayer';

    export default {
        name: "BookManager",
        components: {
            APlayer
        },
        data() {
            return {
                editDialogVisible: false,
                audioDialogVisible: false,
                playVisible: false,
                books: null,
                currentBookName: null,
                currentBookId: null,
                book: {
                    id: null,
                    name: null,
                    author: null,
                    picPath: null,
                    desc: null,
                    source: null
                },
                uploadUrl: null,
                formLabelWidth: '120px',
                fileList: [],
                bookAudios: null,
                music: null,
                imageUploadUrl: '',
                baseUploadUrl: `${this.protoUploadUrl}book/upload`,
                imageUrl: '',
                rules: {
                    name: [
                        {required: true, message: '请输入书名', trigger: 'blur'},
                        {max: 50, message: '书名长度最长为50', trigger: 'blur'}
                    ],
                    author: [
                        {required: true, message: '请输入作者', trigger: 'blur'},
                        {max: 50, message: '作者长度最长为50', trigger: 'blur'}
                    ],
                    picPath: [
                        {max: 255, message: '书籍封面链接最长为255', trigger: 'blur'}
                    ],
                    desc: [
                        {max: 255, message: '简介最长为255', trigger: 'blur'}
                    ]
                }
            }
        },
        created() {
            this.reloadBook();
        },
        methods: {
            reloadBook: function () {
                let _this = this;
                _this.httpGet('/book/getAllBooks', responseBean => {
                    _this.books = responseBean.content;
                });
            },
            reloadBookAudio: function (id) {
                let _this = this;
                _this.httpGet('/bookAudio/getBookAudiosByBook/' + id, responseBean => {
                    _this.bookAudios = responseBean.content;
                });
            },
            editBook: function (row) {
                this.editDialogVisible = true;
                this.book.id = row.id;
                this.book.name = row.name;
                this.book.author = row.author;
                this.book.picPath = row.picPath;
                this.book.desc = row.desc;
                this.book.source = row.source;
                this.imageUploadUrl = `${this.baseUploadUrl}/${row.id}/${row.name}`;
                if (row.posterUploaded) {
                    this.imageUrl = `${this.fileUrl}/books/${row.name}/${row.name}.jpg?${new Date().getTime()}`
                } else {
                    this.imageUrl = '';
                }
            },
            createBook: function () {
                let _this = this;
                this.book.name = this.book.name.replace(/\s/g, "");
                if (this.book.name.length > 50) {
                    this.$message.warning('书名最长50字');
                    return;
                }
                if (this.book.author.length > 50) {
                    this.$message.warning('作者最长50字');
                    return;
                }
                if (this.book.picPath.length > 255) {
                    this.$message.warning('封面链接最长255字');
                    return;
                }
                if (this.book.desc.length > 255) {
                    this.$message.warning('简介最长255字');
                    return;
                }
                _this.httpPost('/book/editBook', _this.book, responseBean => {
                    _this.$message.success(responseBean.msg);
                    _this.reloadBook();
                    _this.clearForm();
                })
            },
            manageAudio: function (row) {
                this.audioDialogVisible = true;
                this.currentBookName = row.name;
                this.currentBookId = row.id;
                this.uploadUrl = `${this.protoUploadUrl}bookAudio/upload/${row.id}/${row.name}`;
                this.reloadBookAudio(row.id);
            },
            removeBook: function (row) {
                let _this = this;
                _this.removeRecord('/book/remove/', row.id, responseBean => {
                    _this.$message.success(responseBean.msg);
                    _this.reloadBook();
                });

            },
            removeBookAudio: function (row) {
                let _this = this;
                _this.removeRecord('/bookAudio/remove/', row.id, responseBean => {
                    _this.$message.success(responseBean.msg);
                    _this.reloadBookAudio(_this.currentBookId);
                });
            },
            clearForm: function () {
                this.editDialogVisible = false;
                this.book.id = null;
                this.book.name = null;
                this.book.author = null;
                this.book.picPath = null;
                this.book.desc = null;
                this.book.source = null;
            },
            uploadChange: function (file, fileList) {
                this.fileList = fileList.splice(-1);
            },
            uploadSuccess: function (response) {
                if (200 === response.status) {
                    this.reloadBookAudio(this.currentBookId);
                } else {
                    this.$message.warning(response.msg);
                }
            },
            uploadBefore: function (file) {
                if (file.size > 31457280) {
                    this.$message.warning("文件大于30MB!");
                    return false;
                }
                let fileSuffix = file.name.substring(file.name.lastIndexOf('.') + 1);
                if (fileSuffix.toLowerCase() !== 'mp3') {
                    this.$message.warning("所选文件不是音频!");
                    return false;
                }
                return true;
            },
            playAudio: function (row) {
                this.music = {
                    src: this.fileUrl + row.url,
                    title: row.name,
                    artist: ' '
                };
                this.playVisible = true;
            },
            handleAvatarSuccess(response) {
                if (200 === response.status) {
                    this.imageUrl = `${this.fileUrl}/${response.msg}?${new Date().getTime()}`;
                } else {
                    this.$message.warning(response.msg);
                }
            },
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

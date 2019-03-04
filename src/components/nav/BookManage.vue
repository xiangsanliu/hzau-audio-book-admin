<template>
    <div id="bookManage">
        <el-container>
            <el-main>
                <el-button @click="editDialogVisible = true" plain type="primary">
                    添加书籍
                </el-button>
                <el-table :data="books">
                    <el-table-column label="id" prop="id" v-if="false"></el-table-column>
                    <el-table-column label="书名" prop="name"></el-table-column>
                    <el-table-column label="作者" prop="author"></el-table-column>
                    <el-table-column label="简介" prop="desc"></el-table-column>
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
                    <el-form :model="book">
                        <el-form-item :label-width="formLabelWidth" label="书名">
                            <el-input placeholder="请输入书名" type="text" v-model="book.name"></el-input>
                        </el-form-item>
                        <el-form-item :label-width="formLabelWidth" label="作者">
                            <el-input placeholder="请输入作者" type="text" v-model="book.author"></el-input>
                        </el-form-item>
                        <el-form-item :label-width="formLabelWidth" label="封面链接">
                            <el-input placeholder="请输入封面链接" type="text" v-model="book.picPath"></el-input>
                        </el-form-item>
                        <el-form-item :label-width="formLabelWidth" label="简介">
                            <el-input placeholder="请输入简介" type="textarea" v-model="book.desc"></el-input>
                        </el-form-item>
                    </el-form>
                    <div class="dialog-footer" slot="footer">
                        <el-button @click="clearForm">取 消</el-button>
                        <el-button @click="createBook" type="primary">确 定</el-button>
                    </div>
                </el-dialog>
                <el-dialog :title="currentBookName" :visible.sync="audioDialogVisible">
                    <el-upload multiple
                               :action="uploadAction"
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
                                <el-button @click="downloadAudio(scope.row)" plain type="primary">下载</el-button>
                                <el-button @click="removeBookAudio(scope.row)" plain type="danger">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-dialog>
            </el-main>
        </el-container>
    </div>
</template>

<script>
    export default {
        name: "BookManager",
        data() {
            return {
                editDialogVisible: false,
                audioDialogVisible: false,
                books: null,
                currentBookName: null,
                currentBookId: null,
                book: {
                    id: null,
                    name: null,
                    author: null,
                    picPath: null,
                    desc: null
                },
                uploadAction: null,
                formLabelWidth: '120px',
                fileList: [],
                bookAudios: null
            }
        },
        created() {
            this.reloadBook();
        },
        methods: {
            reloadBook: function () {
                let _this = this;
                _this.httpGet('/api/book/getAllBooks', responseBean => {
                    _this.books = responseBean.content;
                });
            },
            reloadBookAudio: function (id) {
                let _this = this;
                _this.httpGet('/api/bookAudio/getBookAudiosByBook/' + id, responseBean => {
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
            },
            createBook: function () {
                let _this = this;
                _this.httpPost('/api/book/editBook', _this.book, responseBean => {
                    _this.$message.success(responseBean.msg);
                    _this.reloadBook();
                    _this.clearForm();
                })
            },
            manageAudio: function (row) {
                let _this = this;
                _this.audioDialogVisible = true;
                _this.currentBookName = row.name;
                _this.currentBookId = row.id;
                _this.uploadAction = '/api/file/upload/bookAudio/' + row.id + '/' + row.name;
                _this.reloadBookAudio(row.id);
            },
            removeBook: function (row) {
                let _this = this;
                _this.removeRecord('/api/book/remove/', row.id, responseBean => {
                    _this.$message.success(responseBean.msg);
                    _this.reloadBook();
                });

            },
            removeBookAudio: function (row) {
                let _this = this;
                this.removeRecord('/api/bookAudio/remove/', row.id, responseBean => {
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
            },
            uploadChange: function (file, fileList) {
                this.fileList = fileList.splice(-1);
            },
            uploadSuccess: function () {
                this.reloadBookAudio(this.currentBookId)
            },
            uploadBefore: function (file) {
                if (file.size > 31457280) {
                    this.$message.error("文件大于30MB!");
                    return false;
                }
                let fileSuffix = file.name.substring(file.name.lastIndexOf('.') + 1);
                /*eslint no-console: ["error", { allow: ["warn", "error"] }] */
                console.warn(fileSuffix);
                if (fileSuffix.toLowerCase() !== 'mp3') {
                    this.$message.error("所选文件不是音频!");
                    return false;
                }
                return true;
            },
            downloadAudio: function (row) {
                window.location.href = '/api/file/download/bookAudio/' + row.id;
            }
        }
    }
</script>

<style scoped>

</style>
<template>
    <div id="bookListManage">
        <el-container>
            <el-main>
                <el-button @click="editDialogVisible = true" plain type="primary">添加书单</el-button>
                <el-table :data="bookLists">
                    <el-table-column label="id" prop="id" v-if="false"></el-table-column>
                    <el-table-column label="书单名" prop="name"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button @click="editBookList(scope.row)" plain type="primary">编辑</el-button>
                            <el-button @click="manageBookList(scope.row)" plain type="primary">管理书单</el-button>
                            <el-button @click="removeBookList(scope.row)" plain type="danger">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-dialog title="添加/编辑书单" :visible.sync="editDialogVisible" :before-close="clearBookList">
                    <el-form :model="bookList">
                        <el-form-item label="书单名">
                            <el-input placeholder="请输入书单名" type="text" v-model="bookList.name"></el-input>
                        </el-form-item>
                    </el-form>
                    <div class="dialog-footer" slot="footer">
                        <el-button @click="clearBookList">取 消</el-button>
                        <el-button @click="createBookList" type="primary">确 定</el-button>
                    </div>
                </el-dialog>
                <el-dialog :title="'管理书单: ' + currentBookListName" :visible.sync="listDialogVisible">
                    <el-row>
                        <el-col :span="12">
                            <el-select v-model="selectedBookId" placeholder="请选择" value="">
                                <el-option
                                        v-for="item in selectingBooks"
                                        :key="item.value"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="12">
                            <el-button @click="addBookToBookList" plain type="primary">添加</el-button>
                        </el-col>
                    </el-row>
                    <el-table :data="books">
                        <el-table-column label="id" prop="id" v-if="false"></el-table-column>
                        <el-table-column label="书名" prop="name"></el-table-column>
                        <el-table-column label="作者" prop="author"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button @click="removeBook(scope.row)" plain type="danger">删除</el-button>
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
        name: "BookListManage",
        data() {
            return {
                editDialogVisible: false,
                listDialogVisible: false,
                bookLists: null,
                bookList: {
                    id: null,
                    name: null
                },
                selectingBooks: null,
                selectedBookId: null,
                books: null,
                currentBookListName: null,
                currentBookListId: null
            }
        },
        created() {
            let _this = this;
            _this.reloadBookList();
            _this.httpGet('/api/book/getAllBooks', responseBean => {
                _this.selectingBooks = responseBean.content;
            })
        },
        methods: {
            reloadBookList: function () {
                let _this = this;
                _this.httpGet('/api/bookList/getAllBookLists', responseBean => {
                    _this.bookLists = responseBean.content;
                });
            },
            reloadBooks: function (id) {
                let _this = this;
                _this.httpGet('/api/bookList/getBooksByBookList/' + id, responseBean => {
                    _this.books = responseBean.content;
                });
            },
            editBookList: function (row) {
                this.editDialogVisible = true;
                this.bookList.id = row.id;
                this.bookList.name = row.name;
            },
            manageBookList: function (row) {
                this.listDialogVisible = true;
                this.currentBookListId = row.id;
                this.currentBookListName = row.name;
                this.reloadBooks(row.id);
            },
            createBookList: function () {
                let _this = this;
                _this.httpPost('/api/bookList/editBookList', _this.bookList, responseBean => {
                    _this.$message.success(responseBean.msg);
                    _this.reloadBookList();
                    _this.clearBookList();
                });
            },
            addBookToBookList: function () {
                let _this = this;
                let added = _this.books.some(item => {
                    return _this.selectedBookId === item.id;
                });
                if (added) {
                    this.$message.info('已添加该书籍');
                    return;
                }
                _this.httpGet('/api/bookList/saveBook/' + this.currentBookListId + '/' + this.selectedBookId, () => {
                    _this.reloadBooks(_this.currentBookListId);
                });
            },
            removeBookList: function (row) {
                let _this = this;
                _this.removeRecord('/api/bookList/remove/', row.id, responseBean => {
                    _this.$message.success(responseBean.msg);
                    _this.reloadBookList();
                });
            },
            removeBook: function (row) {
                let _this = this;
                _this.removeRecord('/api/bookList/removeBook/' + _this.currentBookListId + '/', row.id, responseBean => {
                    _this.$message.success(responseBean.msg);
                    _this.reloadBooks(_this.currentBookListId);
                });
            },
            clearBookList: function () {
                this.editDialogVisible = false;
                this.bookList.id = null;
                this.bookList.name = null;
            }
        }
    }
</script>

<style scoped>

</style>

<template>
    <div id="bookComment">
        <el-container>
            <el-main>
                <el-table :data="comments.slice((currentPage-1)*pageSize,currentPage*pageSize)" style="width: 100%">
                    <el-table-column label="id" prop="id" v-if="false"></el-table-column>
                    <el-table-column width="100" label="书籍名" prop="parentName" fixed></el-table-column>
                    <el-table-column width="450" label="内容" prop="content"></el-table-column>
                    <el-table-column width="100" label="专业班级" prop="majorAndClass"></el-table-column>
                    <el-table-column width="100" label="姓名" prop="name"></el-table-column>
                    <el-table-column width="100" label="QQ" prop="qq"></el-table-column>
                    <el-table-column width="100" label="手机" prop="phoneNum"></el-table-column>
                    <el-table-column width="150" label="评论时间" prop="commentTime">
                        <template slot-scope="scope">
                            <span>{{scope.row.uploadTime.toLocaleString().substring(0, 16).replace('T', ' ')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column width="100" label="状态" prop="status" sortable
                                     :filters="[{text: '未审核', value: '未审核'},
                                            {text: '审核通过', value: '审核通过'},
                                            {text: '审核未通过', value: '审核未通过'}]"
                                     :filter-method="filterStatus">
                    </el-table-column>
                    <el-table-column width="200" label="操作" fixed="right">
                        <template slot-scope="scope">
                            <el-button v-if="scope.row.checked === false || scope.row.approved === false"
                                       @click="approve(scope.row)" plain type="primary">通过
                            </el-button>
                            <el-button v-if="scope.row.checked === false || scope.row.approved === true"
                                       @click="disApprove(scope.row)" plain type="danger">不通过
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div style="text-align: center; margin-top: 30px">
                    <el-pagination background
                                   layout="prev, pager, next"
                                   :page-size="pageSize"
                                   :total="comments.length"
                                   @current-change="handlePageChange">
                    </el-pagination>
                </div>
            </el-main>
        </el-container>
    </div>
</template>

<script>
    export default {
        name: "BookCommentManage",
        data() {
            return {
                comments: [],
                pageSize: 10,
                currentPage: 1
            }
        },
        created() {
            this.reloadComments();
        },
        methods: {
            reloadComments: function () {
                this.httpGet('/comment/getAllBookComment', responseBean => {
                    this.comments = responseBean.content;
                });
            },
            approve: function (row) {
                this.httpGet(`/comment/approveBook/${row.id}`, () => {
                    this.reloadComments();
                });
            },
            disapprove: function (row) {
                this.httpGet(`/comment/disapproveBook/${row.id}`, () => {
                    this.reloadComments();
                });
            },
            filterStatus: function (value, row) {
                return row.status === value;
            },
            handlePageChange: function (currentPage) {
                this.currentPage = currentPage;
            }
        }
    }
</script>

<style scoped>

</style>

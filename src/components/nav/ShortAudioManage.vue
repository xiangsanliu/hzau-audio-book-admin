<template>
    <el-container>
        <el-main>
            <el-table :data="audios.slice((currentPage-1)*pageSize,currentPage*pageSize)" style="width: 100%">
                <el-table-column label="id" prop="id" v-if="false"></el-table-column>
                <el-table-column width="100" label="活动名" prop="actName" fixed></el-table-column>
                <el-table-column width="450" label="内容" prop="content"></el-table-column>
                <el-table-column width="100" label="专业班级" prop="majorAndClass"></el-table-column>
                <el-table-column width="100" label="姓名" prop="name"></el-table-column>
                <el-table-column width="100" label="QQ" prop="qq"></el-table-column>
                <el-table-column width="100" label="手机" prop="phoneNum"></el-table-column>
                <el-table-column width="150" label="上传时间" prop="uploadTime">
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
                <el-table-column width="280" label="操作" fixed="right">
                    <template slot-scope="scope">
                        <el-button @click="playShortAudio(scope.row)" plain type="primary">试听</el-button>
                        <el-button v-if="scope.row.checked === false || scope.row.approved === false"
                                   @click="approve(scope.row)" plain type="primary">通过
                        </el-button>
                        <el-button v-if="scope.row.checked === true && scope.row.approved === false"
                                   @click="showReason(scope.row)" plain type="primary">查看原因
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
                               :total="audios.length"
                               @current-change="handlePageChange">
                </el-pagination>
            </div>
            <el-dialog title="试听" :visible.sync="playVisible">
                <a-player autoplay :music="music"/>
            </el-dialog>
            <el-dialog title="未通过原因" :visible.sync="reasonVisible" :before-close="clearForm">
                <el-form :model="currentShortAudio">
                    <el-form-item label-width="120px" label="原因">
                        <el-input placeholder="不超过20字" type="text" v-model="currentShortAudio.reason"></el-input>
                    </el-form-item>
                </el-form>
                <div v-if="reasonEditable" class="dialog-footer" slot="footer">
                    <el-button @click="clearForm">取 消</el-button>
                    <el-button @click="postReason" type="primary">确 定</el-button>
                </div>
            </el-dialog>
        </el-main>
    </el-container>
</template>

<script>

    /*eslint no-console: ["error", { allow: ["warn", "error"] }] */
    import APlayer from 'vue-aplayer';

    export default {
        name: "ShortAudioManage",
        components: {
            APlayer
        },
        data() {
            return {
                audios: [],
                playVisible: false,
                reasonVisible: false,
                reasonEditable: true,
                music: null,
                pageSize: 10,
                currentShortAudio: {
                    id: null,
                    reason: null,
                    approved: null
                },
                currentPage: 1
            }
        },
        created() {
            this.reloadAudios();
        },
        methods: {
            reloadAudios: function () {
                let _this = this;
                _this.httpGet('/api/shortAudio/getAllShortAudios', responseBean => {
                    _this.audios = responseBean.content;
                });
            },
            playShortAudio: function (row) {
                this.music = {
                    src: `/file/activities/${row.actName}/${row.fileName}`,
                    title: row.actName,
                    artist: ' '
                };
                this.playVisible = true;
            },
            approve: function (row) {
                console.warn(row);
                let _this = this;
                _this.httpGet(`/api/shortAudio/approve/${row.id}`, () => {
                    _this.reloadAudios();
                });
            },
            disApprove: function (row) {
                this.currentShortAudio.id = row.id;
                this.currentShortAudio.approved = false;
                this.reasonVisible = true;
            },
            filterStatus: function (value, row) {
                return row.status === value;
            },
            handlePageChange: function (currentPage) {
                this.currentPage = currentPage;
                console.warn(this.currentPage)
            },
            postReason: function () {
                let _this = this;
                _this.httpPost('/api/shortAudio/disApprove/', _this.currentShortAudio, () => {
                    _this.clearForm();
                    _this.reloadAudios();
                });
            },
            clearForm: function () {
                this.currentShortAudio = {
                    id: null,
                    reason: null,
                    approved: null
                };
                this.reasonVisible = false;
                this.reasonEditable = true;
            },
            showReason: function (row) {
                this.reasonVisible = true;
                this.currentShortAudio.reason = row.reason;
                this.reasonEditable = false;
            }
        }
    }
</script>

<style scoped>

</style>

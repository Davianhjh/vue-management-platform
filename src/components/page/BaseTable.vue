<template>
    <div class="table" style="width: 99%">
        <div class="container" style="width: 96%">
            <el-button type="danger" style="width: 7%" icon="delete" class="filter-item" @click="handleBatch">批量失效</el-button>
            <el-input placeholder="Banner标题" v-model="listQuery.title" style="width: 18%;" class="filter-item" @keyup.enter.native="handleFilter"/>
            <el-select v-model="listQuery.platform" placeholder="平台类型" clearable style="width: 9%" class="filter-item">
                <el-option v-for="item in platformOptions" :key="item.key" :label="item.label" :value="item.label"/>
            </el-select>
            <el-select v-model="listQuery.status" placeholder="状态" clearable style="width: 7%" class="filter-item" @change="handleFilter">
                <el-option v-for="item in statusOption" :key="item.key" :label="item.label" :value="item.key"/>
            </el-select>
            <el-select v-model="listQuery.sort" placeholder="排序" clearable style="width: 9%" class="filter-item" @change="handleSort">
                <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key"/>
            </el-select>
            <el-button v-waves class="filter-item" style="width: 6%" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
            <el-button class="filter-item" style="width: 6%;margin-left: 0.1%;" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
            <el-button v-waves :loading="downloadLoading" class="filter-item" style="width: 6%;margin-left: 0.1%;" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
            <el-button class="filter-item" style="width: 7%;margin-left: 14%;" :type="rankType" :disabled="rankStatus" @click="confirmRank" >确定顺序</el-button>
            <el-button class="filter-item" style="width: 7%;margin-left: 0.1%;" type="primary" @click="modifyRank">调整顺序</el-button>

<!--        <el-table
                :data="data"
                border
                class="table"
                ref="multipleTable"
                @selection-change="handleSelectionChange">-->
            <el-table
                :data="tableData"
                border
                style="width: 100%;"
                class="table"
                ref="multipleTable"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="40%" align="center"></el-table-column>
                <el-table-column label="ID" align="center" width="70%">
                    <template slot-scope="scope">
                        <span>{{ scope.row.id }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="标题" align="left" width="140%">
                    <template slot-scope="scope">
                        <span>{{ scope.row.title }}</span>
                        <el-tag>{{ scope.row.app_name | platformFliter }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="banner图片" align="center" prop="imgPath" width="130%">
                    <template slot-scope="scope">
                        <img :src="scope.row.banner_url" style="width: 100%" height="50px">
                    </template>
                </el-table-column>
                <el-table-column label="banner链接" align="center" width="90%">
                    <template slot-scope="scope">
                        <a :href="scope.row.link_url"
                           target="_blank"
                           class="el-button--text">链接地址</a>
                    </template>
                </el-table-column>
                <el-table-column label="类型" align="center" width="75%">
                    <template slot-scope="scope">
                        <span>{{ scope.row.type }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="类型ID" align="center" width="70%">
                    <template slot-scope="scope">
                        <span>{{ scope.row.type_id }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="打开动作" align="center" width="70%">
                    <template slot-scope="scope">
                        <span>{{ scope.row.action }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="弹出样式" align="center" width="50%">
                    <template slot-scope="scope">
                        <span>{{ scope.row.style }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="排序" align="center" width="65%">
                    <template slot-scope="scope">
                        <!--<span>{{ scope.row.rank }}</span>-->
                        <span v-if="!editRankFlag">{{ scope.row.rank }}</span>
                        <span v-if="editRankFlag" class="cell-edit-input">
                            <el-input size="small" v-model="scope.row.rank" placeholder="" @change="handleEditRank(scope.$index, scope.row.rank)"></el-input>
                        </span>

                    </template>
                </el-table-column>
                <el-table-column label="状态" class-name="status-col" width="65%">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
                    </template>
                </el-table-column>

                <el-table-column label="生效时间" align="center" width="140%">
                    <template slot-scope="scope">
                        <span>{{ scope.row.effective_time }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="失效时间" align="center" width="140%">
                    <template slot-scope="scope">
                        <span>{{ scope.row.expired_time }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="215%" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" style="width: 28%" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button v-if="scope.row.status!=='生效'" size="mini" style="width: 28%" type="success" @click="handlePublish(scope.$index, scope.row)">生效</el-button>
                        <el-button v-if="scope.row.status!=='失效'" size="mini" style="width: 28%" @click="handleInvalid(scope.$index, scope.row)">失效</el-button>
                        <el-button v-if="scope.row.status!=='删除'" size="mini" style="width: 28%" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :total="100">
                </el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="40%">
            <el-form ref="form" :model="form" label-width="30%">
                <el-row type="flex" class="row-bg">
                    <el-col>
                        <el-form-item label="标题" style="margin-left: 10%">
                            <el-input v-model="form.title" style="width: 100%"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item label="平台类型">
                            <el-select v-model="form.app_name" class="filter-item" style="width: 80%" placeholder="请选择平台类型">
                                <el-option v-for="item in platformOptions" :key="item.key" :label="item.label" :value="item.key"/>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="banner图片" style="width: 60%">
                    <el-input v-model="form.banner_url" style="width: 185%"></el-input>
                    <el-button type="primary" style="width: 40%;" @click="handlePictureUpload">上传图片<i class="el-icon-upload el-icon--right"></i></el-button>
                </el-form-item>
                <el-form-item label="banner链接" style="width: 60%">
                    <el-input v-model="form.link_url" style="width:185%;"></el-input>
                </el-form-item>
                <el-form-item label="类型" style="width: 60%">
                    <el-select v-model="form.type" class="filter-item" style="width: 80%" placeholder="请选择类型">
                        <el-option v-for="item in typeOption" :key="item" :label="item" :value="item"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="类型ID" style="width: 60%">
                    <el-input v-model="form.type_id" style="width: 80%"></el-input>
                </el-form-item>
                <el-form-item label="打开动作" style="width: 60%">
                    <el-select v-model="form.action" class="filter-item" style="width: 80%" placeholder="请选择打开动作">
                        <el-option v-for="item in actionOption" :key="item" :label="item" :value="item"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="弹出样式" style="width: 60%">
                    <el-select v-model="form.style" class="filter-item" style="width: 80%" placeholder="请选择样式">
                        <el-option v-for="item in styleOption" :key="item.key" :label="item.label" :value="item.label"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="排序" style="width: 60%">
                    <el-input v-model="form.rank" style="width: 80%"></el-input>
                </el-form-item>
                <el-form-item label="状态" style="width: 60%">
                    <el-select v-model="form.status" class="filter-item" style="width: 80%" placeholder="请选择状态">
                        <el-option v-for="item in statusOption" :key="item.key" :label="item.label" :value="item.label"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="生效时间" style="width: 60%">
                    <el-date-picker type="datetime" v-model="form.effective_time" style="width: 80%" placeholder="选择日期" ></el-date-picker>
                </el-form-item>
                <el-form-item label="失效时间" style="width: 60%">
                    <el-date-picker type="datetime" v-model="form.expired_time" style="width: 80%" placeholder="选择日期" ></el-date-picker>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 生效提示框 -->
        <el-dialog title="提示" :visible.sync="publishVisible" width="300px" center>
            <div class="del-dialog-cnt">是否确定使该Banner生效？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="publishVisible = false">取 消</el-button>
                <el-button type="primary" @click="publishRow">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 失效提示框 -->
        <el-dialog title="提示" :visible.sync="invalidVisible" width="300px" center>
            <div class="del-dialog-cnt">是否确定使该Banner失效？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="invalidVisible = false">取 消</el-button>
                <el-button type="primary" @click="invalidRow">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="deleteVisible" width="300px" center>
            <div class="del-dialog-cnt">是否确定删除该Banner？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="deleteVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 批量失效提示框 -->
        <el-dialog title="警告" :visible.sync="batchVisible" width="300px" center>
            <div class="del-dialog-cnt">是否确定批量失效Banner？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="batchVisible = false">取 消</el-button>
                <el-button type="primary" @click="delAll">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        name: 'bannerTable',
        filters: {
            statusFilter(status) {
                const statusMap = {
                    生效: 'success',
                    失效: 'info',
                    删除: 'danger'
                };
                return statusMap[status];
            },
            platformFliter(app_name) {
                const platformMap = {
                    feiyu_IOS: 'IOS',
                    feiyu_Android: 'Android'
                };
                return platformMap[app_name];
            }
        },
        data() {
            return {
                url: './static/vueTable.json',
                tableData: [],
                cur_page: 1,
                multipleSelection: [],
                editVisible: false,
                publishVisible: false,
                invalidVisible: false,
                deleteVisible: false,
                batchVisible: false,
                idx: -1,
                listLoading: true,
                downloadLoading: false,
                editRankFlag: false,
                editRandStatus: false,
                rankType: 'primary',
                rankStatus: true,
                modifyRankData: [],
                listQuery: {
                    page: 1,
                    limit: 20,
                    platform: undefined,
                    status: undefined,
                    title: undefined,
                    type: undefined,
                    sort: undefined
                },
                platformOptions: [{label: 'Android', key:'feiyu_Android'}, {label: 'IOS', key:'feiyu_IOS'}],
                sortOptions: [{ label: 'rank升序', key: '+rank' }, { label: 'rank降序', key: '-rank' }],
                typeOption: ['news', 'program'],
                actionOption: ['open', 'play'],
                styleOption: [{label: '横屏', key: '1'}, {label: '弹出框', key: '2'}, {label: '其他', key: '3'}],
                statusOption: [{label: '生效', key: '0'}, {label: '失效', key: '-1'}, {label: '删除', key: '-2'}],
                form: {
                    id: '',
                    app_name: '',
                    title: '',
                    banner_url: '',
                    link_url: '',
                    type: '',
                    type_id: '',
                    action: '',
                    style: '',
                    rank: '',
                    status: '',
                    effective_time: new Date(),
                    expired_time: new Date(),
                    inputColumn: ''
                },
            }
        },
        created() {
            this.getData();
        },
        methods: {
            getData() {
                this.$axios.get(this.url).then((res) => {
                    this.tableData = res.data.list;
                })
            },
            handleSort() {
/*                this.$axios.get("http://xxx.xx.xx/"+this.listQuery.sort).then(response => {
                    this.tableData = response.data;
                }).catch(error => {
                    console.log(error);
                })*/
                if (this.listQuery.sort === "+rank") {
                    this.tableData = this.tableData.sort((a, b) => {
                        return a.rank-b.rank;
                    });
                } else {
                    this.tableData =  this.tableData.sort((a, b) => {
                        return b.rank-a.rank;
                    });
                }
            },
            handleFilter() {
                this.listQuery.page = 1;
            },
            handleCreate() {
                this.editVisible = true;
                this.form = {
                    id: '',
                    app_name: '',
                    title: '',
                    banner_url: '',
                    link_url: '',
                    type: '',
                    type_id: '',
                    action: '',
                    style: '',
                    rank: '',
                    status: '',
                    effective_time: new Date(),
                    expired_time: new Date(new Date().getFullYear()+1, new Date().getMonth(), new Date().getDay())
                }
            },
            handleEdit(index, row) {
                this.editVisible = true;
                this.idx = index;
                let item = this.tableData[index];
                this.form = {
                    id: index,
                    app_name: item.app_name,
                    title: item.title,
                    banner_url: item.banner_url,
                    link_url: item.link_url,
                    type: item.type,
                    type_id: item.type_id,
                    action: item.action,
                    style: item.style,
                    rank: item.rank,
                    status: item.status,
                    effective_time: item.effective_time,
                    expired_time: item.expired_time
                };
            },
            handleBatch() {
                this.batchVisible = true;
            },
            handlePublish(index, row) {
                this.idx = index;
                this.publishVisible = true;
            },
            handleInvalid(index, row) {
                this.idx = index;
                this.invalidVisible = true;
            },
            handleDelete(index, row) {
                this.idx = index;
                this.deleteVisible = true;
            },
            handleDownload() {
                this.downloadLoading = true;
                import('@/vendor/Export2Excel').then(excel => {
                    const tHeader = ['id', 'app_name', 'title', 'banner_url', 'link_url', 'type', 'type_id', 'action', 'style', 'rank', 'status', 'effective_time', 'expired_time'];
                    const filterVal = ['id', 'app_name', 'title', 'banner_url', 'link_url', 'type', 'type_id', 'action', 'style', 'rank', 'status', 'effective_time', 'expired_time'];
                    const data = this.formatJson(filterVal, this.tableData);
                    excel.export_json_to_excel({
                        header: tHeader,
                        data,
                        filename: 'banner-list'
                    });
                    this.downloadLoading = false
                })
            },
            // 顺序修改
            modifyRank() {
                this.editRankFlag = true;
                this.rankType = 'success';
                this.rankStatus = false;
            },
            handleEditRank(index, val) {
                this.modifyRankData = this.tableData;
                this.modifyRankData[index].rank = val;
                this.editRankStatus = true;
            },
            // 确定修改顺序
            confirmRank() {
                if (this.editRankStatus) {
                    this.tableData = this.modifyRankData;
                }
                this.modifyRankData = [];
                this.rankType = 'primary';
                this.rankStatus = true;
                this.editRankFlag = false;
                this.editRankStatus = false;
            },
            // 批量失效
            delAll() {
                this.multipleSelection.forEach(item1 => {
                   this.tableData.forEach(item2 => {
                       if (item2.id === item1.id) {
                           item2.status = "失效";
                       }
                   });
                });
                this.$message.error('失效了' + this.multipleSelection.length + '个banner');
                this.batchVisible = false;
                this.multipleSelection = [];
            },
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                // TODO
            },
            // 批量操作
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 保存编辑
            saveEdit() {
                this.$set(this.tableData, this.idx, this.form);
                this.$message.success('操作成功');
                this.editVisible = false;
            },
            // 生效操作
            publishRow() {
                this.tableData[this.idx].status = "生效";
                this.$message.success('操作成功');
                this.publishVisible = false;
                this.idx = -1;
            },
            // 失效操作
            invalidRow(){
                this.tableData[this.idx].status = "失效";
                this.$message.success('操作成功');
                this.invalidVisible = false;
                this.idx = -1;
            },
            deleteRow(){
                this.tableData[this.idx].status = "删除";
                this.$message.success('操作成功');
                this.deleteVisible = false;
                this.idx = -1;
            },
            formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => {
                    if (j === 'timestamp') {
                        return parseTime(v[j])
                    } else {
                        return v[j]
                    }
                }));
            },
            handlePictureUpload() {

            }
        }
    }

</script>

<style scoped>
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
    .filter-item {
        display: inline-block;
        vertical-align: middle;
        margin-bottom: 10px;
    }
</style>

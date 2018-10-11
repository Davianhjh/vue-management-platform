<template>
    <div class="table">
        <div class="container">
            <el-button type="danger" icon="delete" class="filter-item" @click="handleBatch">批量删除</el-button>
            <el-input placeholder="模块名称" v-model="listQuery.name" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
            <el-select v-model="listQuery.pic_type" placeholder="模块类别" clearable style="width: 110px" class="filter-item">
                <el-option v-for="item in picTypeOptions" :key="item" :label="item" :value="item"/>
            </el-select>
            <el-select v-model="listQuery.source" placeholder="模块来源" clearable style="width: 110px" class="filter-item">
                <el-option v-for="item in sourceOptions" :key="item" :label="item" :value="item"/>
            </el-select>
            <el-select v-model="listQuery.sort" style="width: 100px" clearable class="filter-item" @change="handleSort">
                <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key"/>
            </el-select>
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
            <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
            <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
            <el-button class="filter-item" style="margin-left: 520px;" :type="rankType" :disabled="rankStatus" @click="confirmRank" >确定顺序</el-button>
            <el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="modifyRank">调整顺序</el-button>

            <el-table
                :data="tableData"
                border
                style="width: 100%;"
                class="table"
                ref="multipleTable"
                @selection-change="handlePicSelectionChange"
                @expand-change="handleExpandChange">

                <el-table-column type="expand">
                    <template slot-scop="scope">
                        <el-button type="danger" size="mini" @click="handleAlbumBatch">批量删除</el-button>
                        <el-button type="success" size="mini" @click="handleAlbumDownload">导出专辑</el-button>
                        <el-button :type="albumRankType" size="mini" :disabled="albumRankStatus" @click="confirmAlbumRank">确定顺序</el-button>
                        <el-button type="primary" size="mini" @click="modifyAlbumRank">调整顺序</el-button>
                        <el-table
                            :data="albumData"
                            border
                            style="width: 100%;margin-top: 10px"
                            class="table"
                            ref="multipleTable"
                            @selection-change="handleAlbumSelectionChange">

                            <el-table-column type="selection" width="55" align="center"></el-table-column>
                            <el-table-column label="ID" align="center" width="80">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.id }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="专辑名称" align="left" width="220">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.album_name }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="背景图片" align="center" prop="imgPath" width="140">
                                <template slot-scope="scope">
                                    <img :src="scope.row.cover" style="width: 120px" height="120px">
                                </template>
                            </el-table-column>
                            <el-table-column label="专辑ID" align="center" width="120">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.album_id }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="主播名" align="center" width="120">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.host_name }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="专辑来源" align="center" width="120">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.source | sourceFilter }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="专辑描述" align="center" width="210">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.album_dscp }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="专辑热度" align="center" width="100">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.album_heat }}</span>
                                </template>
                            </el-table-column>

                            <el-table-column label="操作" width="302" align="center">
                                <template slot-scope="scope">
                                    <el-button type="text" icon="el-icon-edit" class="green" @click="handleAlbumEdit(scope.$index, scope.row)">编辑</el-button>
                                    <el-button type="text" icon="el-icon-delete" class="red" @click="handleAlbumDelete(scope.$index, scope.row)">删除</el-button>
                                    <el-button type="text" icon="el-icon-lx-top" :class="adjustAlbumRankColor" :disabled="adjustAlbumRank" @click="handleAlbumMoveUp(scope.$index, scope.row)">上移</el-button>
                                    <el-button type="text" icon="el-icon-lx-down" :class="adjustAlbumRankColor" :disabled="adjustAlbumRank" @click="handleAlbumMoveDown(scope.$index, scope.row)">下移</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                </el-table-column>

                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column label="ID" align="center" width="80">
                    <template slot-scope="scope">
                        <span>{{ scope.row.id }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="模块名称" align="left" width="250">
                    <template slot-scope="scope">
                        <span>{{ scope.row.name }}</span>
                        <el-tag>{{ scope.row.pic_type | picTypeFilter }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="背景图片" align="center" prop="imgPath" width="140">
                    <template slot-scope="scope">
                        <a :href="scope.row.pic_url"
                           target="_blank"
                           class="el-button--text">查看图片</a>
                    </template>
                </el-table-column>
                <el-table-column label="pic_type" align="center" width="90">
                    <template slot-scope="scope">
                        <span>{{ scope.row.pic_type }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="来源" align="center" width="90">
                    <template slot-scope="scope">
                        <span>{{ scope.row.source }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="rank" align="center" width="90">
                    <template slot-scope="scope">
                        <span v-if="!editRankFlag">{{ scope.row.rank }}</span>
                        <span v-if="editRankFlag" class="cell-edit-input">
                            <el-input size="small" v-model="scope.row.rank" placeholder="" @change="handleEditRank(scope.$index, scope.row.rank)"></el-input>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="子类别序号" align="center" width="90">
                    <template slot-scope="scope">
                        <span>{{ scope.row.sub_class_id }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="子类别名称" align="center" width="130">
                    <template slot-scope="scope">
                        <span>{{ scope.row.sub_class_name }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="模块描述" align="center" width="200">
                    <template slot-scope="scope">
                        <span>{{ scope.row.pic_description }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="307" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-document" size="medium" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" size="medium" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :total="100">
                </el-pagination>
            </div>
        </div>

        <!-- 编辑pic弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="90px">
                <el-form-item label="模块名称">
                    <el-input v-model="form.name" style="width: 215px"></el-input>
                </el-form-item>
                <el-row type="flex" class="row-bg">
                    <el-col>
                        <el-form-item label="模块来源">
                            <el-select v-model="form.source" placeholder="模块来源" clearable style="width: 110px" class="filter-item">
                                <el-option v-for="item in sourceOptions" :key="item" :label="item" :value="item"/>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item label="模块类别">
                            <el-select v-model="form.pic_type" placeholder="模块类别" clearable style="width: 110px" class="filter-item">
                                <el-option v-for="item in picTypeOptions" :key="item" :label="item" :value="item"/>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-form-item label="背景图片">
                    <el-input v-model="form.pic_url" style="width: 338px"></el-input>
                    <el-button type="primary" @click="handlePictureUpload">上传图片<i class="el-icon-upload el-icon--right"></i></el-button>
                </el-form-item>
                <el-form-item label="排序">
                    <el-input v-model="form.rank" style="width: 215px"></el-input>
                </el-form-item>
                <el-form-item label="子模块名称">
                    <el-input v-model="form.sub_class_name" style="width: 215px"></el-input>
                </el-form-item>
                <el-form-item label="模块描述">
                    <el-input v-model="form.pic_descrption" style="width: 215px"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除pic提示框 -->
        <el-dialog title="提示" :visible.sync="deleteVisible" width="300px" center>
            <div class="del-dialog-cnt">是否确定删除该模块？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="deleteVisible = false">取 消</el-button>
                <el-button type="primary" @click="deletePic">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 批量删除pic提示框 -->
        <el-dialog title="提示" :visible.sync="batchVisible" width="300px" center>
            <div class="del-dialog-cnt">是否确定批量删除这些模块？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="batchVisible = false">取 消</el-button>
                <el-button type="primary" @click="picDeleteAll">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑album弹出框 -->
        <el-dialog title="编辑Album" :visible.sync="editAlbumVisible" width="30%">
            <el-form ref="form" :model="albumForm" label-width="90px">
                <el-form-item label="专辑名称">
                    <el-input v-model="albumForm.album_name" style="width: 215px"></el-input>
                </el-form-item>
                <el-row type="flex" class="row-bg">
                    <el-col>
                        <el-form-item label="专辑来源">
                            <el-select v-model="albumForm.source" placeholder="专辑来源" clearable style="width: 110px" class="filter-item">
                                <el-option v-for="item in albumSourceOptions" :key="item.key" :label="item.label" :value="item.key"/>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="专辑ID">
                    <el-input v-model="albumForm.album_id" style="width: 215px"></el-input>
                </el-form-item>
                <el-form-item label="专辑封面">
                    <el-input v-model="albumForm.cover" style="width: 400px"></el-input>
                </el-form-item>
                <el-form-item label="主播名">
                    <el-input v-model="albumForm.host_name" style="width: 215px"></el-input>
                </el-form-item>
                <el-form-item label="专辑描述">
                    <el-input v-model="albumForm.album_dscp" style="width: 215px"></el-input>
                </el-form-item>
                <el-form-item label="专辑热度">
                    <el-input v-model="albumForm.album_heat" style="width: 215px"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAlbumEdit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除album提示框 -->
        <el-dialog title="提示" :visible.sync="deleteAlbumVisible" width="300px" center>
            <div class="del-dialog-cnt">是否确定删除该专辑？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="deleteAlbumVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteAlbum">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 批量删除album提示框 -->
        <el-dialog title="提示" :visible.sync="albumBatchVisible" width="300px" center>
            <div class="del-dialog-cnt">是否确定批量删除这些专辑？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="albumBatchVisible = false">取 消</el-button>
                <el-button type="primary" @click="albumDeleteAll">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'programTable',
        filters: {
            picTypeFilter(pic_type) {
                const picTypeMap = {
                    0: '旧版Banner',
                    1: '旧版推荐',
                    2: '旧版推荐',
                    3: '旧版主题',
                    4: '分类',
                    5: '主题',
                    6: '特别推荐',
                    7: '主题',
                    8: '特别推荐',
                    9: '分类'
                };
                return picTypeMap[pic_type];
            },
            sourceFilter(source) {
                const sourceMap = {
                    xmly: '喜马拉雅',
                    qtfm: '蜻蜓FM',
                    fdds: '樊登读书',
                    tykj: '淘云科技'
                };
                return sourceMap[source];
            }
        },
        data() {
            return {
                picUrl: './static/vueProgram.json',
                albumUrl: './static/vueAlbum.json',
                tableData: [],
                albumData: [],
                cur_page: 1,
                multiplePicSelection: [],
                multipleAlbumSelection: [],
                editVisible: false,
                deleteVisible: false,
                editAlbumVisible: false,
                deleteAlbumVisible: false,
                batchVisible: false,
                albumBatchVisible: false,

                editRankFlag: false,
                editRandStatus: false,
                rankType: 'primary',
                rankStatus: true,
                modifyRankData: [],

                editAlbumRankStatus: false,
                albumRankType: 'primary',
                albumRankStatus: true,
                adjustAlbumRank: true,
                modifyAlbumRankData: [],
                adjustAlbumRankColor: {
                    color: `#8c939d`
                },

                idx: -1,
                idy: -1,
                listLoading: true,
                downloadLoading: false,
                albumDownloadLoading: false,
                listQuery: {
                    page: 1,
                    limit: 20,
                    name: undefined,
                    pic_type: undefined,
                    source: undefined,
                    sort: undefined,
                },
                picTypeOptions: ['特别推荐', '主题', '分类'],
/*                picTypeSelect: [
                    {label: '分类', key: '4'},
                    {label: '主题', key: '5'},
                    {label: '特别推荐', key: '6'},
                    {label: '主题', key: '7'},
                    {label: '特别推荐', key: '8'},
                    {label: '分类', key: '9'}
                ],*/
                sourceOptions: ['喜马拉雅', '蜻蜓FM'],
                sortOptions: [{ label: 'rank升序', key: '+rank' }, { label: 'rank降序', key: '-rank' }],
                albumSourceOptions: [
                    { label: '喜马拉雅', key: 'xmly' },
                    { label: '蜻蜓FM', key: 'qtfm' }
                ],
                form: {
                    id: '',
                    name: '',
                    pic_url: '',
                    pic_type: '',
                    rank: '',
                    sub_class_id: '',
                    sub_class_name: '',
                    pic_descrption: '',
                    source: ''
                },
                albumForm: {
                    id: '',
                    album_name: '',
                    cover: '',
                    album_id: '',
                    host_name: '',
                    source: '',
                    sub_class_id: '',
                    album_dscp: '',
                    album_heat: ''
                }
            }
        },
        created() {
            this.getData();
        },
        methods: {
            getData() {
                this.$axios.get(this.picUrl).then((res) => {
                    this.tableData = res.data.list;
                });
                this.$axios.get(this.albumUrl).then((res) => {
                    this.albumData = res.data.list;
                });
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
                    name: '',
                    pic_url: '',
                    pic_type: '',
                    rank: '',
                    sub_class_id: '',
                    sub_class_name: '',
                    pic_descrption: '',
                    source: ''
                }
            },
            handleBatch() {
                this.batchVisible = true;
            },
            // 编辑pic
            handleEdit(index, row) {
                this.editVisible = true;
                this.idx = index;
                let item = this.tableData[index];
                this.form = {
                    id: item.id,
                    name: item.name,
                    pic_url: item.pic_url,
                    pic_type: item.pic_type,
                    rank: item.rank,
                    sub_class_id: item.sub_class_id,
                    sub_class_name: item.sub_class_name,
                    pic_descrption: item.pic_descrption,
                    source: item.source
                };
            },
            // 保存编辑
            saveEdit() {
                this.$set(this.tableData, this.idx, this.form);
                this.$message.success('操作成功');
                this.editVisible = false;
            },
            handleDelete(index, row) {
                this.idx = index;
                this.deleteVisible = true;
            },
            deletePic() {
                let delId = this.tableData[this.idx].id;
                this.idx = -1;
                // do something with the delId
                this.$message.success('操作成功');
                this.deleteVisible = false;
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
                        filename: 'pic-list'
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
            // 确定顺序修改
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
            // 批量操作
            handlePicSelectionChange(val) {
                this.multiplePicSelection = val;
            },
            picDeleteAll() {
                this.multiplePicSelection.forEach(item1 => {
                    this.tableData.forEach(item2 => {
                        if (item2.id === item1.id) {
                            // do something with delete operation
                        }
                    });
                });
                this.$message.error('删除了' + this.multiplePicSelection.length + '个模块');
                this.batchVisible = false;
                this.multiplePicSelection = [];
            },
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                // TODO
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
            // 控制整个表格只展开一行
            handleExpandChange(row, expandedRows) {
                if (expandedRows.length>1) {
                    expandedRows.shift();
                }
            },
            // 批量操作album
            handleAlbumSelectionChange(val) {
                this.multipleAlbumSelection = val;
            },
            handleAlbumBatch() {
                this.albumBatchVisible = true;
            },
            albumDeleteAll() {
                this.multipleAlbumSelection.forEach(item1 => {
                    this.albumData.forEach(item2 => {
                        if (item2.id === item1.id) {
                            // do something with delete operation
                        }
                    });
                });
                this.$message.error('删除了' + this.multipleAlbumSelection.length + '个专辑');
                this.albumBatchVisible = false;
                this.multipleAlbumSelection = [];
            },
            // album顺序修改
            modifyAlbumRank() {
                this.albumRankStatus = false;
                this.albumRankType = 'success';
                this.adjustAlbumRank = false;
                this.adjustAlbumRankColor = {
                    color: `#20a0ff`
                };
                this.modifyAlbumRankData = this.albumData;
            },
            handleAlbumMoveUp(index, row) {
                this.editAlbumRankStatus = true;
                if (index !== 0) {
                    let item = this.albumData[index];
                    this.albumData[index] = this.albumData[index - 1];
                    this.albumData[index - 1] = item;
                }
            },
            handleAlbumMoveDown(index, row) {
                this.editAlbumRankStatus = true;
                if (index !== this.albumData.length) {
                    let item = this.albumData[index];
                    this.albumData[index] = this.albumData[index + 1];
                    this.albumData[index + 1] = item;
                }
            },
            // 确定顺序修改
            confirmAlbumRank() {
                if (this.editAlbumRankStatus) {
                    // commit the albumData
                    this.albumRankStatus = true;
                    this.albumRankType = 'primary';
                    this.adjustAlbumRank = true;
                    this.adjustAlbumRankColor = {
                        color: `#8c939d`
                    };
                    this.editAlbumRankStatus = false;
                    this.modifyAlbumRankData = [];
                } else {
                    this.albumData = this.modifyAlbumRankData;
                }
            },
            // 修改album
            handleAlbumEdit(index, row) {
                this.editAlbumVisible = true;
                this.idy = index;
                let item = this.albumData[index];
                this.albumForm = {
                    id: item.id,
                    album_name: item.album_name,
                    cover: item.cover,
                    album_id: item.album_id,
                    host_name: item.host_name,
                    source: item.source,
                    sub_class_id: item.sub_class_id,
                    album_dscp: item.album_dscp,
                    album_heat: item.album_heat
                };
            },
            // 保存编辑
            saveAlbumEdit() {
                this.$set(this.albumData, this.idy, this.albumForm);
                this.$message.success('操作成功');
                this.editAlbumVisible = false;
            },
            // 删除album
            handleAlbumDelete(index, row) {
                this.idy = index;
                this.deleteAlbumVisible = true;
            },
            deleteAlbum() {
                let delId = this.albumData[this.idy].id;
                this.idy = -1;
                // do something with the delId
                this.$message.success('操作成功');
                this.deleteAlbumVisible = false;
            },
            // 导出专辑
            handleAlbumDownload() {
                this.albumDownloadLoading = true;
                import('@/vendor/Export2Excel').then(excel => {
                    const tHeader = ['id', 'cover', 'album_id', 'album_name', 'host_name', 'source', 'sub_class_id', 'album_dscp', 'album_heat'];
                    const filterVal = ['id', 'cover', 'album_id', 'album_name', 'host_name', 'source', 'sub_class_id', 'album_dscp', 'album_heat'];
                    const data = this.formatJson(filterVal, this.albumData);
                    excel.export_json_to_excel({
                        header: tHeader,
                        data,
                        filename: 'album-list'
                    });
                    this.albumDownloadLoading = false
                })
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
    .red{
        color: #ff0000;
    }
    .green{
        color: #67c23a;
    }
    .gray{
        color: #8c939d;
    }
    .blue{
        color: #20a0ff;
    }
</style>

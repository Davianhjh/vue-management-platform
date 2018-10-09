<template>
    <div class="table">
        <div class="container">
            <el-button type="primary" icon="delete" class="filter-item" @click="delAll">批量删除</el-button>
            <el-input placeholder="模块名称" v-model="listQuery.name" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
            <el-select v-model="listQuery.pic_type" placeholder="模块类别" clearable style="width: 110px" class="filter-item">
                <el-option v-for="item in picTypeOptions" :key="item" :label="item" :value="item"/>
            </el-select>
            <el-select v-model="listQuery.source" placeholder="模块来源" clearable style="width: 110px" class="filter-item">
                <el-option v-for="item in sourceOptions" :key="item" :label="item" :value="item"/>
            </el-select>
            <el-select v-model="listQuery.sort" style="width: 100px" class="filter-item" @change="handleSort">
                <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key"/>
            </el-select>
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
            <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
            <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
            <el-button class="filter-item" style="margin-left: 500px" type="primary" icon="el-icon-sort" @click="handleModify">调整顺序</el-button>

            <el-table
                :data="tableData"
                border
                style="width: 100%;"
                class="table"
                ref="multipleTable"
                @selection-change="handleSelectionChange">

                <el-table-column type="expand">
                    <template slot-scop="props">
                        <el-table
                            :data="albumData"
                            border
                            style="width: 100%;"
                            class="table"
                            ref="multipleTable"
                            @selection-change="handleSelectionChange">

                            <el-table-column label="模块名称" align="left" width="300">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.name }}</span>
                                    <el-tag>{{ scope.row.pic_type | picTypeFilter }}</el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column label="背景图片" align="center" prop="imgPath" width="140">
                                <template slot-scope="scope">
                                    <img :src="scope.row.pic_url" style="width: 120px" height="120px">
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
                <el-table-column label="模块名称" align="left" width="300">
                    <template slot-scope="scope">
                        <span>{{ scope.row.name }}</span>
                        <el-tag>{{ scope.row.pic_type | picTypeFilter }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="背景图片" align="center" prop="imgPath" width="140">
                    <template slot-scope="scope">
                        <img :src="scope.row.pic_url" style="width: 120px" height="120px">
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
                        <span>{{ scope.row.rank }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="子类别序号" align="center" width="130">
                    <template slot-scope="scope">
                        <span>{{ scope.row.sub_class_id }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="子类别名称" align="center" width="130">
                    <template slot-scope="scope">
                        <span>{{ scope.row.sub_class_name }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="模块描述" align="center" width="130">
                    <template slot-scope="scope">
                        <span>{{ scope.row.pic_description }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="300" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" class="green" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                        <el-button type="text" icon="el-icon-lx-top" :class="modifyButtonColor" :disabled="modifyButton" @click="handleMoveUp(scope.$index, scope.row)">上移</el-button>
                        <el-button type="text" icon="el-icon-lx-down" :class="modifyButtonColor" :disabled="modifyButton" @click="handleMoveDown(scope.$index, scope.row)">下移</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :total="100">
                </el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="90px">
                <el-form-item label="模块名称">
                    <el-input v-model="form.name" style="width: 215px"></el-input>
                </el-form-item>
                <el-row type="flex" class="row-bg">
                    <el-col>
                        <el-form-item label="模块类别">
                            <el-select v-model="listQuery.pic_type" placeholder="模块类别" clearable style="width: 110px" class="filter-item">
                                <el-option v-for="item in picTypeOptions" :key="item" :label="item" :value="item"/>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item label="模块来源">
                            <el-select v-model="listQuery.source" placeholder="模块来源" clearable style="width: 110px" class="filter-item">
                                <el-option v-for="item in sourceOptions" :key="item" :label="item" :value="item"/>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-form-item label="背景图片">
                    <el-input v-model="form.banner_url" style="width: 338px"></el-input>
                    <el-button type="primary" @click="handlePictureUpload">上传图片<i class="el-icon-upload el-icon--right"></i></el-button>
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

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="deleteVisible" width="300px" center>
            <div class="del-dialog-cnt">是否确定删除该模块？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="deleteVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
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
                    1: '旧版推荐',
                    2: '旧版推荐',
                    3: '旧版主题',
                    4: '分类',
                    5: '主题',
                    6: '特别推荐',
                    7: '主题'
                };
                return picTypeMap[pic_type];
            }
        },
        data() {
            return {
                url: './static/vueProgram.json',
                tableData: [],
                albumData: [],
                cur_page: 1,
                multipleSelection: [],
                editVisible: false,
                publishVisible: false,
                invalidVisible: false,
                deleteVisible: false,
                dialogVisible: false,
                modifyButton: true,
                modifyButtonColor: {
                    color: `#8c939d`
                },
                idx: -1,
                listLoading: true,
                downloadLoading: false,
                listQuery: {
                    page: 1,
                    limit: 20,
                    name: undefined,
                    pic_type: undefined,
                    source: undefined,
                    sort: '+id'
                },
                picTypeOptions: ['特别推荐', '主题', '分类'],
                sourceOptions: ['喜马拉雅', '蜻蜓FM'],
                sortOptions: [{ label: 'ID升序', key: '+id' }, { label: 'ID降序', key: '-id' }],
                cropImg: '',
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
                if (this.listQuery.sort === "+id") {
                    this.tableData = this.tableData.sort((a, b) => {
                        return a.id-b.id;
                    });
                } else {
                    this.tableData =  this.tableData.sort((a, b) => {
                        return b.id-a.id;
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
            handleModify() {
                this.modifyButton = false;
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
                        filename: 'table-list'
                    })
                    this.downloadLoading = false
                })
            },
            delAll() {
                this.multipleSelection.forEach(item1 => {
                    this.tableData.forEach(item2 => {
                        if (item2.id === item1.id) {
                            item2.status = "失效";
                        }
                    });
                });
                this.$message.error('失效了' + this.multipleSelection.length + '个banner');
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
            },
            // 失效操作
            invalidRow(){
                this.tableData[this.idx].status = "失效";
                this.$message.success('操作成功');
                this.invalidVisible = false;
            },
            deleteRow(){
                this.tableData[this.idx].status = "删除";
                this.$message.success('操作成功');
                this.deleteVisible = false;
            },
            formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => {
                    if (j === 'timestamp') {
                        return parseTime(v[j])
                    } else {
                        return v[j]
                    }
                }));
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
</style>

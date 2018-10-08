<template>
    <div class="table">

<!--    <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 基础表格</el-breadcrumb-item>
            </el-breadcrumb>
        </div>-->

        <div class="container">
            <el-button type="primary" icon="delete" class="filter-item" @click="delAll">批量失效</el-button>
            <el-input placeholder="Banner标题" v-model="listQuery.title" style="width: 300px;" class="filter-item" @keyup.enter.native="handleFilter"/>
            <el-select v-model="listQuery.platform" placeholder="平台类型" clearable style="width: 110px" class="filter-item">
                <el-option v-for="item in platformOptions" :key="item" :label="item" :value="item"/>
            </el-select>
            <el-select v-model="listQuery.status" placeholder="状态" clearable style="width: 80px" class="filter-item" @change="handleFilter">
                <el-option v-for="item in statusOption" :key="item.key" :label="item.label" :value="item.key"/>
            </el-select>
            <el-select v-model="listQuery.sort" style="width: 100px" class="filter-item" @change="handleFilter">
                <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key"/>
            </el-select>
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
            <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
            <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>

<!--        <div class="handle-box">
                <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
                <el-select v-model="select_cate" placeholder="筛选省份" class="handle-select mr10">
                    <el-option key="1" label="广东省" value="广东省"></el-option>
                    <el-option key="2" label="湖南省" value="湖南省"></el-option>
                </el-select>
                <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
            </div>-->

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
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column label="ID" align="center" width="80">
                    <template slot-scope="scope">
                        <span>{{ scope.row.id }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="标题" align="center" width="200">
                    <template slot-scope="scope">
                        <span>{{ scope.row.title }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="banner图片" align="center" width="100">
                    <template slot-scope="scope">
                        <span>{{ scope.row.banner_url }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="banner链接" align="center" width="300">
                    <template slot-scope="scope">
                        <span>{{ scope.row.link_url }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="类型" align="center" width="50">
                    <template slot-scope="scope">
                        <span>{{ scope.row.type }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="类型ID" align="center" width="90">
                    <template slot-scope="scope">
                        <span>{{ scope.row.type_id }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="打开动作" align="center" width="85">
                    <template slot-scope="scope">
                        <span>{{ scope.row.action }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="弹出样式" align="center" width="50">
                    <template slot-scope="scope">
                        <span>{{ scope.row.style }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="排序" align="center" width="50">
                    <template slot-scope="scope">
                        <span>{{ scope.row.rank }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="状态" align="center" width="50">
                    <template slot-scope="scope">
                        <span>{{ scope.row.status }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="生效时间" align="center" width="130">
                    <template slot-scope="scope">
                        <span>{{ scope.row.effective_time }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="失效时间" align="center" width="130">
                    <template slot-scope="scope">
                        <span>{{ scope.row.expired_time }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="200" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-document" class="green" @click="handleValid(scope.$index, scope.row)">生效</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">失效</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :total="1000">
                </el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="90px">
                <el-form-item label="标题">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item label="banner图片">
                    <el-input v-model="form.banner_url"></el-input>
                </el-form-item>
                <el-form-item label="banner链接">
                    <el-input v-model="form.link_url"></el-input>
                </el-form-item>
                <el-form-item label="类型">
                    <el-select v-model="form.type" class="filter-item" placeholder="请选择类型">
                        <el-option v-for="item in typeOption" :key="item" :label="item" :value="item"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="类型ID">
                    <el-input v-model="form.type_id" style="width: 215px"></el-input>
                </el-form-item>
                <el-form-item label="打开动作">
                    <el-select v-model="form.action" class="filter-item" placeholder="请选择打开动作">
                        <el-option v-for="item in actionOption" :key="item" :label="item" :value="item"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="弹出样式">
                    <el-select v-model="form.style" class="filter-item" placeholder="请选择样式">
                        <el-option v-for="item in styleOption" :key="item.key" :label="item.label" :value="item.key"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="排序">
                    <el-input v-model="form.rank" style="width: 215px"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="form.status" class="filter-item" placeholder="请选择状态">
                        <el-option v-for="item in statusOption" :key="item.key" :label="item.label" :value="item.key"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="生效时间">
                    <el-date-picker type="datetime" v-model="form.effective_time" placeholder="选择日期" ></el-date-picker>
                </el-form-item>
                <el-form-item label="失效时间">
                    <el-date-picker type="datetime" v-model="form.expired_time" placeholder="选择日期" ></el-date-picker>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'basetable',
        data() {
            return {
                url: './static/vuetable.json',
                tableData: [],
                cur_page: 1,
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                del_list: [],
                is_search: false,
                editVisible: false,
                delVisible: false,


                tableKey: 0,
                list: null,
                listLoading: true,
                listQuery: {
                    page: 1,
                    limit: 20,
                    platform: undefined,
                    status: undefined,
                    title: undefined,
                    type: undefined,
                    sort: '+id'
                },
                platformOptions: ['Android', 'IOS'],
                sortOptions: [{ label: 'ID升序', key: '+id' }, { label: 'ID降序', key: '-id' }],
                typeOption: ['news', 'program'],
                actionOption: ['open', 'play'],
                styleOption: [{label: '横屏', key: '1'}, {label: '弹出框', key: '2'}, {label: '其他', key: '3'}],
                statusOption: [{label: '生效', key: '0'}, {label: '失效', key: '-1'}],
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
                    expired_time: new Date()
                },
                idx: -1,
            }
        },
        created() {
            this.getData();
        },
        computed: {
            data() {
                return this.tableData.filter((d) => {
                    let is_del = false;
                    for (let i = 0; i < this.del_list.length; i++) {
                        if (d.name === this.del_list[i].name) {
                            is_del = true;
                            break;
                        }
                    }
                    if (!is_del) {
                        if (d.address.indexOf(this.select_cate) > -1 &&
                            (d.name.indexOf(this.select_word) > -1 ||
                                d.address.indexOf(this.select_word) > -1)
                        ) {
                            return d;
                        }
                    }
                })
            }
        },
        methods: {
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
            // 获取 easy-mock 的模拟数据
            getData() {
                this.$axios.get(this.url).then((res) => {
                    this.tableData = res.data.list;
                })
            },
            search() {
                this.is_search = true;
            },
            formatter(row, column) {
                return row.address;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            handleEdit(index, row) {
                this.idx = index;
                const item = this.tableData[index];
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
                this.editVisible = true;
            },
            handleValid(index, row) {
                this.idx = index;
                const item = this.tableData[index];
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
                this.editVisible = true;
            },
            handleDelete(index, row) {
                this.idx = index;
                this.delVisible = true;
            },
            delAll() {
                const length = this.multipleSelection.length;
                let str = '';
                this.del_list = this.del_list.concat(this.multipleSelection);
                for (let i = 0; i < length; i++) {
                    str += this.multipleSelection[i].name + ' ';
                }
                this.$message.error('删除了' + str);
                this.multipleSelection = [];
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 保存编辑
            saveEdit() {
                this.$set(this.tableData, this.idx, this.form);
                this.$message.success(`修改第 ${this.idx+1} 行成功`);
                this.editVisible = false;
            },
            // 确定删除
            deleteRow(){
                this.tableData.splice(this.idx, 1);
                this.$message.success('删除成功');
                this.delVisible = false;
            },

            handleFilter() {
                this.listQuery.page = 1
                this.getData();
            },
        }
    }

</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
/*    .table{
        width: 100%;
        font-size: 14px;
    }*/
    .red{
        color: #ff0000;
    }
    .green{
        color: #67c23a;
    }


    .filter-item {
        display: inline-block;
        vertical-align: middle;
        margin-bottom: 10px;
    }
    .link-type,
    .link-type:focus {
        color: #337ab7;
        cursor: pointer;
    }
</style>

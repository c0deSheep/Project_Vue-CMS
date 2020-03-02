<!--权限列表的卡片视图-->
<!--集成了Add Edit SetRight 弹出框的组件-->
<template>
  <el-card >
    <!--添加角色按钮-->
    <el-row>
      <el-col>
        <el-button type="primary" @click="showAddRoleDialog">添加角色</el-button>
      </el-col>
    </el-row>

    <!--添加角色区域-->
    <el-table :data="rolesList" border stripe>
      <!--展开列-->
      <el-table-column type="expand">
        <!--列内容-->
        <template slot-scope="scope">
          <el-row v-for="(item1,i1) in scope.row.children" :key="item1.id" :class="['bdbottom', i1===0? 'bdtop':'','vcenter']">
            <!--第一列渲染一级权限 span为一行占据得位置，总数为24，所以，一级占5，二级三级占19(19里二级又占6份，三级占18份)-->
            <el-col :span="5">
              <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
            <!--第二列渲染二级和三级权限-->
            <el-col :span="19">
              <!--第二列第一行渲染二级-->
              <el-row v-for="(item2,i2) in item1.children" :key="item2.id" :class="[ i2===0? '':'bdtop','vcenter']" >
                <!--第二列第一行第一列渲染二级-->
                <el-col :span="6">
                  <el-tag  type="success" closable @close="removeRightById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <!--第二列第一行第二列循环渲染三级级-->
                <el-col  :span="18">
                  <el-tag  type="warning" v-for="(item3,i3) in item2.children" :key="item3.id" :class="[ i3===0? '':'bdtop']" closable @close="removeRightById(scope.row,item3.id)">{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <!--索引列-->
      <el-table-column type="index"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditRoleDialog(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-search" @click="removeRoleById(scope.row.id)">删除</el-button>
          <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页区域-->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
      <!--layout就是这个分页区域的展示排布-->
    </el-pagination>

    <!--添加角色弹框-->
    <add-role-dialog :roleDialogVisible="roleDialogVisible" @getRolesList="getRolesList" @hideDialog="hideDialog" ></add-role-dialog>
    <!--修改角色弹框-->
    <edit-role-dialog :editDialogVisible="editDialogVisible" :editForm="editForm" @hideDialog="hideDialog" @getRolesList="getRolesList" ></edit-role-dialog>
    <!--分配权限弹框-->
    <set-right-dialog :role="role" :defKeys="defKeys" :setRightDialogVisible="setRightDialogVisible" @hideDialog="hideDialog" @clearDefKeys="clearDefKeys" @getRolesList="getRolesList"></set-right-dialog>
  </el-card>
</template>

<script>
  import { get } from '../../../network/get'
  import {remove} from "../../../network/remove";

  import AddRoleDialog from './AddRoleDialog'
  import EditRoleDialog from './EditRoleDialog'
  import SetRightDialog from './SetRightDialog'

  export default {
    name: "RolesCard",
    props:{
      rolesList:{
        type:Array,
        default() {
          return []
        }
      },
      queryInfo : {
        type:Object,
        default () {
          return {}
        }
      },
      total : {
        type:Number,
        default : 0
      }
    },
    components:{
      AddRoleDialog,
      EditRoleDialog,
      SetRightDialog
    },
    data () {
      return {
        // 添加角色弹框传递控制信息
        roleDialogVisible:false,
        // 编辑角色弹框传递控制信息
        editDialogVisible: false,
        // 分配权色弹框传递控制信息
        setRightDialogVisible:false,
        // 编辑角色 单个角色的表单信息对象
        editForm : {},
        //默认选中节点的Id值数组,需要传递到SetRightDialog中
        defKeys :[],
        // 分配权限，单歌角色的表单信息对象，需要传到SetRightDialog
        role:{}
      }
    },
    methods:{
      /**
       *其他事件
       */
      // 监听 pagesize 改变
      handleSizeChange (newSize) {
        this.$emit('handleSizeChange',newSize)
      },

      // 监听 页码值 改变的事件
      handleCurrentChange (newPage) {
        this.$emit('handleCurrentChange',newPage)
      },
      /**
      * 网络请求方法
      * */
      // a.封装删除角色方法
      remove (url) {
        return remove(url).then(res=>{
          // 失败弹框提示
          if (res.meta.status !== 200) {
            return this.$message.error('删除角色失败！')
          }
        })
      },

      // b.封装获取单个角色信息方法
      get (url) {
        return get(url)
      },

      // 1. 请求 角色列表 的方法
      getRolesList(){
        console.log('emitted')
        this.$emit('getRolesList')
      },

      // 2.移除角色 权限 的方法
      // 根据角色Id和权限id，一共又3层权限，所以3种tag都能调用这个方法删除对应的权限
            // 传入的参数则由API决定
      removeRightById (role,rightId) {
        // 2.5.1弹框提示用户是否操作this.$confirm返回的是一个Promise对象
        this.$confirm('此操作移除该权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 3.5.2调用封装好的删除用户方法
          // 根据API的接口传入url
          this.remove(`roles/${role.id}/rights/${rightId}`).then(res=>{
              // 失败弹框提示
              if (res.meta.status !== 200) {
                return this.$message.error('移除权限失败！')
              }
            /**
             *    不需要调用获取权限方法，因为调用这个网络请求会返回一个最新的data，可以直接套到scope.row中
             *    this.getRolesList()
             **/
            // 成功重新将data套入到scope.row中
              role.children = res.data
            })
          // 成功弹框提示
          this.$message({
            type: 'success',
            message: '移除权限成功!'
          });
          // 3.5.3 删除后要重新获取所有用户数据
        }).catch(() => {  // 取消必须添加catch
          this.$message({
            type: 'info',
            message: '已取消移除权限'
          });
        });
      },

      // 3.编辑角色方法，先点击显示弹框，再到EditRoleDialog里输入post
      showEditRoleDialog (id) {
        this.get('roles/' + id).then(res => {
          if (res.meta.status !== 200) {
            // 失败就不允许角色改变，将结果更改会原样
            return this.$message.error('查询用户信息失败')
          }
          // 成功就将单个角色信息信息保存到变量，并传递到弹出框中
          this.editForm = res.data
        })
        this.editDialogVisible = true
      },

      // 4.删除 角色 方法
      removeRoleById(id){
        // 4.1弹框提示用户是否操作this.$confirm返回的是一个Promise对象
        this.$confirm('此操作将永久删除此角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 4.2调用封装好的删除用户方法
          this.remove('roles/' + id)
          // 成功弹框提示
          this.$message({
            type: 'success',
            message: '删除成功!',
            duration:500
          });
          this.getRolesList()
          /**
           * // 4.3 删除后要重新获取所有角色列表数据
           不能使用这个因为不会实时更新，而是使用
           * */
        }).catch(() => {  // 取消必须添加catch
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },

      // // 5.接收弹框发出的发送分配权限结果
      // allotRights () {
      //   const keys = []
      // },

      /**
       * 其他方法事件
       * */

      // 5.分配权限方法
      showSetRightDialog (node) {
          // console.log('before ' + this.defKeys)
        this.setRightDialogVisible = true

        // 递归获取三级节点的id
        this.getLeafKeys(node,this.defKeys)
        // console.log('after '+this.defKeys)

        // 将scope.row即node，保存到role变量中，再传入分配权限弹框
        this.role = node
      },

      // 通过递归的形式，获取角色下所有三级权限的id，并保持到 defKeys数组中
      getLeafKeys(node,arr){
        // 如果当前 node 节点不包含children属性给，则是已经三级节点
        if (!node.children) {
          return  arr.push(node.id)
        }
        node.children.forEach(item => {
          // 递归精华
          this.getLeafKeys(item,arr)
        })
      },

      clearDefKeys (data) {
        // 在关闭分配权限对话框后，要重置存放权限数据的数组
        this.defKeys = data
        console.log(this.defKeys)
      },


      // .添加角色方法,先点击显示弹框，再到AddRoleDialog里输入post，不需要当前的列表信息
      showAddRoleDialog(){
        this.roleDialogVisible = true
      },

      // 隐藏弹框
      hideDialog () {
        this.roleDialogVisible = false
        this.editDialogVisible = false
        this.setRightDialogVisible =false
      }

    },

  }
</script>

<style scoped>
  .el-tag {
    margin: 7px;
  }

  .bdbottom {
    border-bottom: 1px solid #eee;
  }

  .bdtop {
    border-top: 1px solid #eee;
  }

  .vcenter {
    display: flex;
    align-items: center;
  }
</style>
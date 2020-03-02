<!--分配权限弹框-->
<template>
  <el-dialog
    title="分配权限"
    :visible.sync="setRightDialogVisible"
    width="30%"
    :close-on-click-modal="false"
    :before-close="hideDialog"
    @close="setRightDialogClosed"
  >
    <!--树形控件-->
    <!--data为这个控件绑定的来源，props为这个控件数据绑定字段的对象, show-checkbox变成可选 node-key为控制每个可选唯一，值为props中的字段，default-checked-keys可根据传入的数组来默认自动选中节点 -->
    <el-tree :data="rightsList"
             :props="treeProps"
             show-checkbox
             node-key="id"
             default-expand-all
             :default-checked-keys="defKeys"
              ref="treeRef">
    </el-tree>

    <!--底部区域-->
    <span slot="footer" class="dialog-footer">
      <el-button @click="hideDialog">取 消</el-button>
      <el-button type="primary" @click="allotRights" >确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { get } from '../../../network/get'
  import { post } from '../../../network/post'

  export default {
    name: "SetRightDialog",
    props:{
      setRightDialogVisible:{
        type:Boolean,
        default : false
      },
      defKeys :{
        type:Array,
        default() {
          return []
        }
      },
      role : {
        type:Object,
        default () {
          return {}
        }
      }
    },
    data () {
      return {
        // 所有权限的数据
        rightsList : [],
        // 树形控件props需要属性绑定的对象（key）
        treeProps:{
          //这些就是children和label为固定属性，children为树杈，label为树杈名字
          label:'authName',
          children:'children'
        },
        dialogKeys : this.defKeys
      }
    },
    methods:{
      /**
       * 网络请求事件
       * */
      // a.封装get请求
        getRightsStatus () {
          //根据API传入url，获取所有的权限数据
          get('rights/tree').then(res=>{
            // 失败状态
            if (res.meta.status !== 200) {
              return this.$message.error('获取权限数据失败！')
            }
            // 成功状态,将权限赋值到变量中
            this.rightsList = res.data
          })
        },

      // b.封装post请求
      postIdStr (idStr) {
        post(`roles/${this.role.id}/rights`,{rids:idStr}).then(res => {
          // 失败状态
          if (res.meta.status !== 200) {
            return this.$message.error('分配权限失败！')
          }
          this.$message.success('分配权限成功！')

        })
      },

      // 1，确认分配权限，发送请求，
      allotRights () {
        //  若节点可被选择（即 show-checkbox 为 true），则返回目前被选中的节点的 key 所组成的数组(getCheckedKeys,getHalfCheckedKeys)
        // 选中所有被选中的节点（全节点和半节点）
        // ...为展开运算符，即将元素结构出来，例如这里的两个函数都返回一个数组，那么展开运算符就会将其两个数组合并
        const keys = [...this.$refs.treeRef.getCheckedKeys(),...this.$refs.treeRef.getHalfCheckedKeys()]

        // 根据API的要求，发送请求需要将所有选中节点以字符串形式并以逗号拼接发送，所以先进行join操作
        const idStr =keys.join(',')

        this.postIdStr(idStr)

        this.$emit('getRolesList')

        this.hideDialog()

      },
      /**
       * 其他事件
       * */
      // 1.向父组件发射关闭消息框方法
      hideDialog () {
        this.$emit('hideDialog')
      },

      // 2.监听添加分配权限对话框的关闭事件
      setRightDialogClosed () {
        // 重置树形控件
        this.dialogKeys = []
        this.$emit('clearDefKeys',this.dialogKeys)
      },
    },
    created () {
      this.getRightsStatus()

    },
    watch: {
      defKeys: function(){ // 监听父组件的变化
        this.getRightsStatus()
        this.$emit('getRolesList')

      }
    }
  }
</script>

<style scoped>

</style>
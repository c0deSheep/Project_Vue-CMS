<!--弹出添加角色对话框-->
<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :before-close="hideDialog"
    :width="width"
    @close="dialogClosed">

    <slot></slot>

    <!--底部区域-->
    <span slot="footer" class="dialog-footer">
      <el-button @click="hideDialog">取 消</el-button>
      <el-button type="primary" @click="dialogAddForm" >确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>

  export default {
    name: "Dialog",
    props : {
      dialogVisible:{
        type:Boolean,
        default : false
      },
      title:{
        type:String,
        default:''
      },
      width:{
        type:String,
        default:''
      },
      addForm : {
        type:Object,
        default(){
          return {}
        }
      }
    },
    data () {
      return {

      }
    },
    methods:{
      /**
       * 网络请求
       * */
      dialogAddForm() {
        this.$emit('addForm')
      },

      /**
       * 其他事件方法
       * */
      // 向父组件发射关闭消息框方法
      hideDialog () {
        this.$emit('hideDialog')
      },

      // 监听添加用户对话框的关闭事件
      dialogClosed () {
        // 重置表单,给el-form调用resetFields方法
        this.$emit('dialogClosed')
      },

    }
  }
</script>

<style scoped>

</style>
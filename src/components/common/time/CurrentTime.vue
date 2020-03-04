<template>
  <div class="current-time" @mouseenter="showSeconds" @mouseleave="hideSeconds">
    {{nowTime}}
    <span v-show="isShow">
      : {{second}}
    </span>
  </div>
</template>

<script>
  export default {
    name: "CurrentTime",
    data(){
      return {
        nowTime:'',
        second : '',
        isShow : false
      }
    },
    methods:{
      //显示当前时间（年月日时分秒）
      timeFormate(timeStamp) {
        let year = new Date(timeStamp).getFullYear();
        let month =new Date(timeStamp).getMonth() + 1 < 10? "0" + (new Date(timeStamp).getMonth() + 1): new Date(timeStamp).getMonth() + 1;
        let date =new Date(timeStamp).getDate() < 10? "0" + new Date(timeStamp).getDate(): new Date(timeStamp).getDate();
        let hh =new Date(timeStamp).getHours() < 10? "0" + new Date(timeStamp).getHours(): new Date(timeStamp).getHours();
        let mm =new Date(timeStamp).getMinutes() < 10? "0" + new Date(timeStamp).getMinutes(): new Date(timeStamp).getMinutes();
        this.second =new Date(timeStamp).getSeconds() < 10? " 0" + new Date(timeStamp).getSeconds():  new Date(timeStamp).getSeconds();
        // this.nowTime = year + " 年 " + month + " 月 " + date +" 日"+" "+hh+" : "+mm+' : '+ss ;
        this.nowTime = year + " 年 " + month + " 月 " + date +" 日"+" "+hh+" : "+mm + ' ';
      },
      clear(){
        clearInterval(this.nowTimes)
        this.nowTimes = null;
      },
      nowTimes(){
        this.timeFormate(new Date());
        setInterval(this.nowTimes,1000);
        this.clear()
      },

    //  鼠标进入离开时间区
      showSeconds () {
        this.isShow = !this.isShow
      },
      hideSeconds () {
        this.isShow = !this.isShow
      }
    },
    mounted (){
      this.nowTimes()
    }
  }
</script>

<style lang="less" scoped>
  .current-time {
    width: 250px;
    height: 100%;
    color: #fff;
    font-size: 16px;
    padding-left: 10px;
  }

  .current-time span {
    margin: 0 auto;
  }

  .current-time:hover {
    background-color: #ffffff28;
    span {
      color:#ffd202;
      font-weight: bold;
    }
  }
</style>
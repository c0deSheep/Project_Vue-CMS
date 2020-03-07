import BackTop from 'components/content/backTop/BackTop'

export const backTopMixin = {
  data () {
    return {
      isScroll:false,
      }
    },
  components:{
    BackTop
  },
  methods:{
    backClick () {
      // 在父组件中可以通过$refs来访问各子组件中的对应ref
      // 这里的scroll是在父组件使用的scroll组件的ref属性,scrollItem是scroll组件中的data
      //scrollTo是BScroll插件的对象方法,返回顶部,参数为X,Y,需要事件
      // this.$refs.scroll.scrollItem.scrollTo(0,0,500)
      // 但是上面方法在Home中表达过于臃肿,可以封装到Scroll组件methods中
      this.$refs.scroll.scrollTo(0,0)
    },
    listenShowBackTop (postion) {
      this.isScroll = - postion.y > 1000
    },
  }
}
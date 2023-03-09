<template>
  <div
    class="right-side-bar"
    ref="rightSide"
  >
    <div class="collapse-menu">
      <div
        class="change-collapse"
      >
        <img v-if="leftOrRight === true && ifHover === false" src="./edit_icon_shrink_tl_nor.png" alt="左右箭头">
        <img v-if="leftOrRight === true && ifHover === true" src="./edit_icon_shrink_tl_hov.png" alt="左右箭头">
        <img v-if="leftOrRight === false && ifHover === false" src="./edit_icon_shrink_tr_nor.png" alt="左右箭头">
        <img v-if="leftOrRight === false && ifHover === true" src="./edit_icon_shrink_tr_hov.png" alt="左右箭头">
      </div>
      <el-menu
        class="el-menu-parent"
        background-color="#29363b"
        :default-active="activeIndex"
        v-show="menuShow"
      >
      </el-menu>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'RightSideBar',
    data () {
      return {
        isCollapse: true,
        iconStyle: {
          width: '26px',
          height: '26px'
        },
        ifTitle: false,
        activeIndex: '0',
        leftOrRight: true, // true 左  false 右
        ifHover: false, // true 滑动到上面 false 离开  LargeScreenSetting
        componentCurrent: 'LargeScreenSetting',
        menuShow: false, // 控制menu显示或隐藏
        dataSourceList: [], // 数据源列表
        whetherSave: 0,
        baseAttributeIconImg: require('./baseAttribute.png'),
        otherAttributesIconImg: require('./otherAttributes.png'),
        chartInteractionIconImg: require('./chartInteraction.png')
      }
    }
  }
</script>

<style scoped lang="scss">

</style>

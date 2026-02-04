<template>
  <!-- <div class="container">
    <div class="main">中间自适应</div>
    <div class="left">左侧固定</div>
    <div class="right">右侧固定</div>
  </div>
  <div class="container2">
    <div class="main-wrap2">
      <div class="main2">中间自适应2</div>
    </div>
    <div class="left2">左侧固定2</div>
    <div class="right2">右侧固定2</div>
  </div> -->
  <!-- <div class="container3">
    <div class="main3">中间自适应2</div>
    <div class="left3">左侧固定2</div>
    <div class="right3">右侧固定2</div>
  </div> -->
  <div class="container"></div>
</template>

<script setup></script>

<style lang="less" scoped>
// .container {
//   padding: 0 200px;
//   .main {
//     width: 100%;
//     float: left;
//   }
//   .left {
//     width: 200px;
//     float: left;
//     margin-left: -100%;
//     position: relative;
//     left: -200px;
//   }
//   .right {
//     width: 200px;
//     float: left;
//     margin-left: -200px;
//     position: relative;
//     right: -200px;
//   }
// }
// .container2 {
//   .main-wrap2 {
//     width: 100%;
//     float: left;
//     .main2 {
//       margin: 0 200px;
//     }
//   }

//   .left2 {
//     width: 200px;
//     float: left;
//     margin-left: -100%;
//   }
//   .right2 {
//     width: 200px;
//     float: left;
//     margin-left: -200px;
//   }
// }

// .container3 {
//   display: flex;
//   min-height: 300px; /* 容器最小高度 */

//   .main3 {
//     flex: 1; /* 占据剩余所有空间 */
//     order: 2; /* 显示在第二位置 */
//     background: #f0f0f0;
//   }
//   .left3 {
//     width: 200px; /* 固定宽度 */
//     order: 1; /* 显示在第一位置 */
//     background: #ccf;
//   }
//   .right3 {
//     width: 200px; /* 固定宽度 */
//     order: 3; /* 显示在第三位置 */
//     background: #fcc;
//   }
// }
.container {
  display: flex;
  min-height: 300px; /* 容器最小高度 */
}
</style>
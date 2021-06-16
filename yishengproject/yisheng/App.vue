<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
  @import './static/fonts/iconfont.css';
	/*每个页面公共css */
	page{
		height: 100%;
		background: #F7F8FA;
	}
	.van-swipe-cell__left,
	.van-swipe-cell__right {
	  display: flex;
	  width: 65px;
	  justify-content: center;
	  align-items: center;
	  font-size: 15px;
	  color: #fff;
	  text-align: center;
	  background-color: #f44;
	}
</style>

<template>
	<div class='index-container'>
		<div class='logo'>
			
		</div>
		<div class='model-content'>
			<navigator class='model-wraper' url='/pages/order-list/order-list'>
				录单模块
				<image src='../../static/images/order.png'></image>
			</navigator>
			<navigator class='model-wraper' url=''>
				出库模块
				<image src='../../static/images/fahuo.png'></image>
			</navigator>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello'
			}
		},
		onLoad() {

		},
		methods: {

		}
	}
</script>

<style lang='scss'>
.index-container{
	.model-content{
		margin-top:50px;
		display: flex;
		justify-content: space-around;
		padding: 10px 20px;
		.model-wraper{
			position: relative;
			width: 150px;
			height: 100px;
			background: #54bcc6;
			color:white;
			text-align: center;
			line-height: 100px;
			border-radius: 10px;
			overflow: hidden;
			font-size: 16px;
			&:active{
				background: #6ec8d6;
			}
			image{
				width: 60px;
				height: 60px;
				bottom: 0px;
				transform: rotate(30deg);
				position: absolute;
				right: -10px;
				opacity: 0.5;
			}
		}
	}
}
</style>

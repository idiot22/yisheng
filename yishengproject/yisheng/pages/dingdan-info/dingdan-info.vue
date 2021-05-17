<template>
	<div class='dingdan-info-container'>
		<van-cell-group>
		  <cat-field
			v-model='orderInfo.customerName'
			label="客户姓名"
			placeholder="请输入客户姓名"
			error
		  />
		  <cat-field
		    v-model='orderInfo.phone'
			label="联系电话"
			placeholder="请输入联系电话"
			:border="false"
		  />
		  <cat-field
		    v-model='orderInfo.orderId'
			label="订单编号"
			placeholder="订单编号"
			:border="false"
		  />
		</van-cell-group>
		<div class='button-wraper'>
		  <van-button icon="plus" block color='black' @click='saveOrderInfo'>保存</van-button>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				orderInfo:{
					customerName:'',
					phone:'',
					orderId:''
				}
			}
		},
		onLoad(option){
			this.orderInfo = JSON.parse(option.orderInfo)
		},
		methods: {
			saveOrderInfo(){
				// 校验之后
				this.$eventBus.$emit('saveOrderInfo',this.orderInfo)
				setTimeout(()=>{
					uni.navigateBack()
				},1000)
			}
		}
	}
</script>

<style lang='scss' scoped>
.dingdan-info-container{
	padding: 20px;
	.button-wraper{
		margin-top: 20px;
	}
}
</style>

<template>
	<div>
		<van-dropdown-menu active-color="#54bcc6">
		  <van-dropdown-item :value="filters.orderStatus" :options="orderStatusList" />
		  <van-dropdown-item id="item" title="筛选">
		    <van-cell-group>
		      <cat-field
		    	v-model="item.productName"
		    	label="客户姓名"
				placeholder='请输入客户姓名'
		      />
		      <cat-field
		    	v-model="item.productName"
		    	label="录单时间"
				placeholder='请点击'
				readonly='true'
				@click.native='showPop = true'
		      />
		      <cat-field
		    	v-model="item.productName"
		    	label="订单编号"
				placeholder='请输入订单编号'
		      />
		      <cat-field
		    	v-model="item.productName"
		    	label="产品名称"
				placeholder='请输入产品名称'
		      />
		    </van-cell-group>
		    <view style="padding: 5px 16px;">
		      <van-button color='#54bcc6' block round bind:click="onConfirm">
		        确认
		      </van-button>
		    </view>
		  </van-dropdown-item>
		</van-dropdown-menu>
		<div class='list-wraper'>
			<van-swipe-cell
				class='swipe-cell' 
				right-width="65" 
				v-for='(order,orderIndex) in orderList' 
				:key='orderIndex'
				async-close
				@click='toOrderXq(order)'
				@close="deleteOrder($event,order)">
				<div class='list-item-wraper'>
				  <van-row>
					  <van-col :span='9'>客户姓名：<span class='info'>{{order.customerName}}</span></van-col>
					  <van-col :span='9'>联系电话：<span class='info'>{{order.phone}}</span></van-col>
					  <van-col :span='6' class='tag-wraper'>
						  <van-tag color="#ffe1e1" text-color="#f17474" v-if="order.status === '未出库'">未出库</van-tag>
						  <van-tag color="#f3f3f3" text-color="#a7a7a7" v-if="order.status === '已结单'">已出库</van-tag>
						  <van-tag color="#dafffc" text-color="#70b1b7" v-if="order.status === '出库中'">出库中</van-tag>
					  </van-col>
				  </van-row>
				  <van-row>
					  <van-col>订单编号：<span class='info'>{{order.orderId}}</span></van-col>
				  </van-row>
				  <van-row>
					  <van-col>录单时间：<span class='info'>{{order.createTime}}</span></van-col>
				  </van-row>
				  <van-row>
					  <van-col :span='18'>录入产品：
					  <span class='info'>
						<span v-for='(product,productIndex) in order.productList' :key='productIndex'>{{`${product.productName}+${product.amount}，`}}</span>
					  </span>
					  </van-col>
					  <van-col :span='6'></van-col>
				  </van-row>
				  <van-row>
					  <div class='order-list-total-money'>
						  订单总额：<span>¥{{order.allTotalPrice}}</span>
					  </div>
				  </van-row>
				 </div>
				 <view slot="right">
					删除
				 </view>
			</van-swipe-cell>
		</div>
		<div class='add-order-wraper'>
			<navigator url="/pages/order-xq/order-xq?type=add">
				<van-button icon="plus" type="primary" round color='black'/>
			</navigator>
		</div>
		<van-popup
		  :show="showPop"
		  position="bottom"
		  custom-style="height: 50%;"
		  @close="showPop = false">
		  <van-datetime-picker
		    @confirm='dateConfirm'
		  	@cancel='showPop=false'
		    type="date"
		    :value="dateObj.currentDate"
		    @input="inputDate"
		    :min-date="dateObj.minDate"
		    :formatter="formatter"
		  />
		</van-popup>
		<van-dialog id="van-dialog" />
		<van-toast id="van-toast" />
	</div>
</template>

<script>
	import Dialog from '../../wxcomponents/vant-weapp/dialog/dialog';
	import Toast from '../../wxcomponents/vant-weapp/toast/toast.js'
	const db = uniCloud.database()
	const collection = db.collection('order-info');
	export default {
		data() {
			return {
				showPop: false,
				dateObj:{
					currentDate: new Date().getTime(),
					minDate: '2020-01-01'
				},
				orderStatusList: [
				    { text: '全部单子', value: 0 },
				    { text: '未出库', value: 1 },
				    { text: '已出库', value: 2 },
				  ],
				filters:{
					orderStatus:0,
					recordDate:''
				},
				orderList:[]
			}
		},
		async onLoad(){
			this.getOrderList()
		},
		methods: {
			onConfirm() {
			  this.selectComponent('#item').toggle();
			},
      onSwitch1Change(detail) {
        this.setData({ switch1: detail });
      },
      onSwitch2Change(detail) {
        this.setData({ switch2: detail });
      },
      toOrderXq(order){
        uni.navigateTo({
					url: `../order-xq/order-xq?type=edit&order=${JSON.stringify(order)}`
				})
      },
      deleteOrder($event,order){
        const { position, instance } = $event.detail;
        Dialog.confirm({
        message: '确定删除此订单吗？',
        }).then(() => {
        collection.where({_id: order._id}).remove().then(()=>{
          Toast('删除成功')
          this.getOrderList()
        })
        instance.close();
        }).catch(()=>{
          instance.close();
        })
      },
      getOrderList(){
        let loadingToast = Toast.loading({
          message: '加载中...',
          forbidClick: true,
        })
        collection.get().then((res)=>{
          this.orderList = res.result.data
          loadingToast.clear()
        })
      },
      formatter(type, value) {
        if (type === 'year') {
        return `${value}年`;
        } 
        if (type === 'month') {
        return `${value}月`;
        }
        if (type === 'day') {
          return `${value}日`;
        }
        return value;
      },
			inputDate(event){
				this.dateObj.currentDate = event.mp.detail
			},
			dateConfirm(event){
				this.showPop = false
			}
		}
	}
</script>

<style lang='scss'>
.list-wraper{
	margin-top: 30px;
}
.list-item-wraper{
	font-size: 12px;
	background: white;
	padding: 10px 20px;
	color: #323233;
	border-bottom: 1px solid #ebedf0;
	.info{
	 color: #969799;
	}
	.order-list-total-money{
		text-align: right;
		font-size: 13px;
		span{
			color:#f56c6c
		}
	}
}
.tag-wraper{
	text-align: right;
}
.add-order-wraper{
	position: fixed;
	right: 20px;
	bottom: 30px;
}
</style>

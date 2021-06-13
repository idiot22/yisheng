<template>
	<div class='order-xq-container'>
		<div class='order-info'>
			<van-button  v-if='!Object.keys(orderInfo).length' icon="plus" block type="default" plain  @click='addOrderInfo'>添加订单信息</van-button>
			<div class='order-info-show' v-else>
				<van-row>
					<van-col span='4'>
						<van-row class='left'>
							<div class='order-logo'>
								<van-icon name="balance-list" color='white' size='20px'/>
							</div>
						</van-row>
					</van-col>
					<van-col :span='18' class='middle'>
						<van-row>
							<van-col span="6">客户姓名：</van-col>
							<van-col class='info' span="17">
								<p>{{orderInfo.customerName}}</p>
							</van-col>
						</van-row>
						<van-row>
							<van-col span="6">联系方式：</van-col>
							<van-col class='info' span="17">{{orderInfo.phone}}</van-col>
						</van-row>
						<van-row>
							<van-col span="6">客户备注：</van-col>
							<van-col class='info' span="17">{{orderInfo.customerRemark}}</van-col>
						</van-row>
						<van-row>
							<van-col span="6">订单编号：</van-col>
							<van-col class='info' span="17">{{orderInfo.orderId}}</van-col>
						</van-row>
					</van-col>
					<van-col class='right' span='2'>
						<van-icon name="arrow" color='#efefef' size='20px' @click='editOrderInfo'/>
					</van-col>
				</van-row>
			</div>
		</div>
		<div class='inorder-detail-wraper'>
			<!-- <header>录单信息</header> -->
			<div class='inorder-content'>
				<div class='product-info-content' v-for="(item,index) in productList" :key='index'>
					<div class='header'>
						{{'产品'+(index+1)}}
						<van-icon class='cross-icon' name="cross"v-if='index!=0' @click='delProduct(index)'/>
					</div>
					<van-cell-group>
					  <cat-field
						v-model="item.productName"
						label="产品名称"
						placeholder="请输入产品名称"
						:rules="productFormrules.productName"
					  />
					  <cat-field
						v-model="item.color"
						label="产品颜色"
						placeholder="请输入此产品颜色"
						:border="false"
						:rules="productFormrules.color"
					  />
					  <cat-field
						v-model="item.modelType"
						label="规格型号"
						placeholder="请输入规格型号"
						:border="false"
						:rules="productFormrules.modelType"
					  />
					  <cat-field
						v-model="item.amount"
						label="产品数量"
						placeholder="请输入此产品数量"
						:border="false"
						:rules="productFormrules.amount"
					  />
					  <cat-field
						v-model="item.unit"
						label="产品单位"
						placeholder="请输入此产品单位"
						:border="false"
						:rules="productFormrules.unit"
					  />
					  <cat-field
						v-model="item.unitPrice"
						label="产品单价"
						placeholder="请输入此产品单价"
						use-button-slot
						:rules="productFormrules.unitPrice"
						:border="false">
						<div slot="back-info" size="small" type="primary">
						  元
						</div>
					  </cat-field>
					  <cat-field
						:value="item.payMethod"
						label="支付方式"
						placeholder="请输入支付方式"
						use-button-slot
						readonly='true'
						:rules="productFormrules.payMethod"
						@click.native='showPaymentPop(item, index)'
						:border="false">
					  </cat-field>
					  <cat-field
						v-model="item.adjustAmount"
						label="调整金额"
						placeholder="请输入此产品的调整金额"
						use-button-slot
						:rules="productFormrules.adjustAmount"
						:border="false">
						<div slot="back-info" size="small" type="primary">
						  元
						</div>
					  </cat-field>
					  <cat-field
						:value="getTotalAmount(item)"
						label="产品总价"
						readonly
						placeholder="请输入此产品总价"
						use-button-slot
						:rules="productFormrules.totalAmount"
						:border="false">
						<div slot="back-info" size="small" type="primary">
						  元
						</div>
					  </cat-field>
					</van-cell-group>
				</div>
				<van-button  icon="plus" block color='black' @click='addProduct'>添加产品</van-button>
			</div>
			<van-button class='submit-btn' block type="default" block plain @click='submit'>提交</van-button>
		</div>
		<div class='pop-wraper'>
			<van-popup
			  :show="paymentPop"
			  position="bottom"
			  custom-style="height: 50%;"
			  @close="paymentPop = false">
			  <van-picker
			  show-toolbar
			  :columns="payMethodList" 
			  @confirm="getPayMethod"/>
			</van-popup>
		</div>
		<van-toast id="van-toast" />
	</div>
</template>

<script>
	import Toast from '../../wxcomponents/vant-weapp/toast/toast.js'
	const db = uniCloud.database();
	
	export default {
		data() {
			return {
				payMethodList:['艺盛淘宝','创盈淘宝','阿里巴巴','拼多多','微信'],
				id:'',
				orderInfo:{},
				productList:[
					{
						productName:'',
						modelType:'',
						color:'',
						amount:'',
						unit:'',
						unitPrice:'',
						payMethod:'',
						totalAmount:'',
						adjustAmount:0,
					},
				],
				productFormrules:{
					productName: { required: true, message: '请输入产品名称', trigger: 'blur' },
					modelType: { required: true, message: '请输入规格型号', trigger: 'blur' },
					amount:[{ required: true, message: '请输入产品数量', trigger: 'blur' },
						  { type: 'number', message: '请输入正确的产品数量', trigger: 'blur' }],
					unit:{ required: true, message: '请输入产品单位', trigger: 'blur' },
					unitPrice: [{ required: true, message: '请输入产品单价', trigger: 'blur' },
						  { type: 'number', message: '请输入正确的产品单价', trigger: 'blur' }],
					adjustAmount: [{ required: true, message: '请输入调整金额', trigger: 'blur' },
						{ type: 'number', message: '请输入正确的调整金额', trigger: 'blur' }],
					payMethod: { required: true, message: '请输入支付方式', trigger: 'blur' }
				},
				selectProduct:{},
				selectProductIndex:-1,
				paymentPop:false
			}
		},
		mounted(){
			this.$eventBus.$on('saveOrderInfo',(data)=>{
				this.orderInfo = data
			})
		},
		methods: {
			submit(){
				// 校验
				let valide = this.productListAndBasicInfoValidate()
				// 调保存接口
				if(valide){
					// 计算订单总额
					let allTotalPrice = 0
					this.productList.forEach(it => {
						allTotalPrice += Number(it.totalAmount)
					})
					// 给数据库添加数据
					db.collection("order-info").where({orderId: this.orderInfo.orderId}).get().then((res)=>{
						// 避免多次提交数据，以orderId来判断是否重复请求
						if(res.result.data.length === 0){
							db.collection("order-info").add({
								allTotalPrice: allTotalPrice,
								status: '未出库',
								customerName: this.orderInfo.customerName,
								phone:this.orderInfo.phone,
								orderId:this.orderInfo.orderId,
								productList: this.productList}).then(()=>{
									Toast.success('保存成功');
									setTimeout(()=>{
										uni.navigateTo({
											url: '../order-list/order-list'
										})
									},2000)
								}).catch(()=>{
									Toast.fail('保存失败');
								})
						}
					})
				}
			},
			productListAndBasicInfoValidate(){
				if(!Object.keys(this.orderInfo).length){
					Toast('请添加订单信息')
					return false
				}
				if(!this.orderInfo.customerName){
					Toast('客户姓名不能为空')
					return false
				}
				for(let i=0;i<this.productList.length;i++){
					for(let key in this.productList[i]){
						if(this.productFormrules[key] && !this.productList[i][key] && this.productList[i][key]!==0){
							Toast(`${this.productFormrules[key].message || this.productFormrules[key][0].message}`)
							return false
						}
					}
				}
				return true
			},
			showPaymentPop(item, index){
				this.selectProduct = item
				this.selectProductIndex = index
				this.paymentPop = true
			},
			getPayMethod(event){
				this.$set(this.productList[this.selectProductIndex],'payMethod',event.detail.value)
				this.paymentPop = false
			},
			addProduct(){
				this.productList.push({
					productname:'',
					modelType:'',
					amount:'',
					unit:'',
					unitPrice:'',
					totalAmount:'',
					adjustAmount:0
				})
			},
			delProduct(index){
				this.productList.splice(index,1)
			},
			addOrderInfo(){
				uni.navigateTo({
					url: `../dingdan-info/dingdan-info?id=${this.id}&type=add`
				})
			},
			editOrderInfo(){
				uni.navigateTo({
					url: `../dingdan-info/dingdan-info?orderInfo=${JSON.stringify(this.orderInfo)}&id=${this.id}&type=edit`
				})
			},
			// 获取产品总价
			getTotalAmount(item){
				if(item.unitPrice && item.amount){
					let unitPrice = Number(item.unitPrice)
					let amount = Number(item.amount)
					let adjustAmount = Number(item.adjustAmount)
					item.totalAmount = unitPrice * amount + adjustAmount
					return unitPrice * amount + adjustAmount
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
.order-xq-container{
	height: 100%;
	width: 100%;
	padding: 0px 20px 20px 20px;
	box-sizing:border-box;
	.submit-btn{
		/deep/button{
			margin: 20px 0px
		}
	}
	.order-info{
		margin-top: 20px;
		padding: 10px;
		background: white;
		border-radius: 10px;
		.order-info-show{
			font-size: 12px;
			.left{
				display: flex;
				justify-content: center;
				align-items: center;
				height: 50px;
				.order-logo{
					height: 30px;
					width: 30px;
					background: black;
					border-radius: 25px;
					text-align: center;
					line-height: 30px;
					font-size: 16px;
					display: flex;
					justify-content: center;
					align-items: center;
				}
			}
			.middle{
				.van-row{
					line-height: 20px;
				}
				.info{
					color: #646566;
					p{
						width: 100%;
						text-align: left;
						overflow: hidden;
						text-overflow: ellipsis;
					}
				}
			}
			.right{
				height: 50px;
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}
	}
	.inorder-detail-wraper{
		margin-top: 10px;
		header{
			text-align: center;
			font-size: 16px;
			height: 40px;
			line-height: 40px;
		}
		.inorder-content{
			overflow: hidden;
			background: white;
			border-radius: 10px;
			box-shadow: 5px 5px 8px #f7f7f7;
			.product-info-content{
				.header{
					padding: 8px 20px;
					font-size: 14px;
					background: #efefef;
					display: flex;
					justify-content: space-between;
					.cross-icon{
						&:hover{
							color: #f56c6c;
						}
					}
				}
			}
		}
	}
}
</style>

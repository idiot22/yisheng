<template>
	<div class='order-xq-container'>
		<div class='order-info'>
			<van-button  v-if='!orderXq.orderId' icon="plus" block type="default" plain  @click='addOrderInfo'>添加订单信息</van-button>
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
								<p>{{orderXq.customerName}}</p>
							</van-col>
						</van-row>
						<van-row>
							<van-col span="6">联系方式：</van-col>
							<van-col class='info' span="17">{{orderXq.phone}}</van-col>
						</van-row>
						<van-row>
							<van-col span="6">客户备注：</van-col>
							<van-col class='info' span="17">{{orderXq.customerRemark}}</van-col>
						</van-row>
						<van-row>
							<van-col span="6">订单编号：</van-col>
							<van-col class='info' span="17">{{orderXq.orderId}}</van-col>
						</van-row>
					</van-col>
					<van-col class='right' span='2'>
						<van-icon name="arrow" color='#efefef' size='20px' @click='editOrderInfo'/>
					</van-col>
				</van-row>
			</div>
		</div>
		<div class='inorder-detail-wraper'>
			<div class='inorder-content'>
				<div class='product-info-content' v-for="(item,index) in orderXq.productList" :key='index'>
					<div class='product-header'>
						{{'产品'+(index+1)}}
            <div class='edit-save-icon' 
                @click="isEditProduct=!isEditProduct" 
                v-if="index===0 && orderXqType === 'edit' && orderXq.status === '未出库'">
              <i class='iconfont icon-baocun' v-if='isEditProduct'></i>
              <i class='iconfont icon-bianji' v-else></i>
            </div>
						<van-icon class='cross-icon' name="cross"v-if='index!=0' @click='delProduct(index)'/>
					</div>
					<van-cell-group>
					  <cat-field
            v-model="item.productName"
						:initValue="item.productName"
            :readonly='!isEditProduct'
						label="产品名称"
						placeholder="请输入产品名称"
						:rules="productFormrules.productName"
					  />
					  <cat-field
						v-model="item.color"
            :initValue='item.color'
            :readonly='!isEditProduct'
						label="产品颜色"
						placeholder="请输入此产品颜色"
						:border="false"
					  />
					  <cat-field
						v-model="item.modelType"
            :initValue="item.modelType"
            :readonly='!isEditProduct'
						label="规格型号"
						placeholder="请输入规格型号"
						:border="false"
						:rules="productFormrules.modelType"
					  />
					  <cat-field
						v-model="item.amount"
            :initValue="item.amount"
            :readonly='!isEditProduct'
						label="产品数量"
						placeholder="请输入此产品数量"
						:border="false"
						:rules="productFormrules.amount"
					  />
					  <cat-field
						v-model="item.unit"
            :initValue="item.unit"
            :readonly='!isEditProduct'
						label="产品单位"
						placeholder="请输入此产品单位"
						:border="false"
						:rules="productFormrules.unit"
					  />
					  <cat-field
						v-model="item.unitPrice"
            :initValue="item.unitPrice"
            :readonly='!isEditProduct'
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
            :initValue="item.payMethod"
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
            :initValue="item.adjustAmount"
            :readonly='!isEditProduct'
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
            <cat-field
            :v-model="item.remark"
            :initValue='item.remark'
            :readonly='!isEditProduct'
            label="备注"
            placeholder="请输入此备注"
            :border="false">
            </cat-field>
					</van-cell-group>
				</div>
				<van-button  icon="plus" block 
        color='black' 
        @click='addProduct' 
        v-if="orderXqType === 'add' || isEditProduct">添加产品</van-button>
			</div>
		</div>
		<div class='inorder-detail-wraper outorder-detail-wraper' v-if="orderXqType === 'edit' && orderXq.deliveryList.length>0">
      <div class='inorder-content'>
        <div class='product-info-content' v-for="(item,index) in orderXq.deliveryList" :key='index'>
          <div class='product-header'>
            {{'运单'+(index+1)}}
            <div class='edit-save-icon' v-if="orderXq.status !== '已结单'">
              <div v-if='item.isEdit !== undefined && index===0' @click='changeDeliveryEditStatus'>
                <i class='iconfont icon-baocun' v-if='item.isEdit'></i>
                <i class='iconfont icon-bianji' v-else></i>
              </div>
              <div style='width: 10px;' v-if='item.isEdit || item.isEdit === undefined'></div>
              <van-icon class='cross-icon' name="cross" v-if='item.isEdit || item.isEdit === undefined' @click='delDelivery(index)'/>
            </div>
          </div>
          <van-cell-group>
            <cat-field
            v-model="item.expressNumber"
            :initValue="item.expressNumber"
            :readonly='!item.isEdit && item.isEdit !== undefined '
            label="运单号"
            placeholder="请输入运单号"
            :border="false"
            :rules="deliveryFormrules.expressNumber"
            />
            <cat-field
            v-model="item.deliveryAddress"
            :initValue="item.deliveryAddress"
            :readonly='!item.isEdit && item.isEdit !== undefined '
            label="送货地址"
            type="textarea"
            autosize
            placeholder="请输入送货地址"
            :border="false"
            :rules="deliveryFormrules.deliveryAddress"
            />
            <cat-field
            v-model="item.expressAmount"
            :initValue="item.expressAmount"
            :readonly='!item.isEdit && item.isEdit !== undefined '
            label="运费金额"
            placeholder="请输入运费金额"
            :border="false"
            use-button-slot
            :rules="deliveryFormrules.expressAmount">
            <div slot="back-info" size="small" type="primary">
              元
            </div>
            </cat-field>
            <cat-field
            v-model="item.expressPayer"
            :initValue="item.expressPayer"
            :readonly='!item.isEdit && item.isEdit !== undefined '
            label="运费付款人"
            placeholder="请输入运费付款人"
            :border="false"
            :rules="deliveryFormrules.expressPayer"
            />
            <cat-field
            v-model="item.transportMode"
            :initValue="item.transportMode"
            :readonly='!item.isEdit && item.isEdit !== undefined '
            label="运输方式"
            placeholder="请输入运输方式"
            :border="false"
            :rules="deliveryFormrules.transportMode"
            />
            <cat-field
            v-model="item.outorderPerson"
            :initValue="item.outorderPerson"
            :readonly='!item.isEdit && item.isEdit !== undefined '
            label="出库人"
            placeholder="请输入出库人"
            :border="false"
            :rules="deliveryFormrules.outorderPerson"
            />
            <cat-field
            :value="item.outorderTime"
            readonly
            label="出库时间"
            :border="false"
            />
            <cat-field
            v-model="item.outorderRemark"
            :initValue="item.outorderRemark"
            :readonly='!item.isEdit && item.isEdit !== undefined '
            label="备注"
            autosize
            type="textarea"
            placeholder="请输入备注"
            :border="false"
            />
          </van-cell-group>
        </div>
      </div>
    </div>
    <div class='btn-wraper'>
      <van-button class='submit-btn' 
        type="default" 
        block plain 
        @click='submit' 
        v-if="orderXqType === 'add'">
        保存
      </van-button>
      <van-button
        class='submit-btn' 
        block
        icon="plus"
        type="default"
        color='black'
        @click='addDelivery' 
        v-if="orderXqType === 'edit' && orderXq.status !== '已结单' ">
        添加出库信息
      </van-button>
      <van-button 
        class='submit-btn' 
        block plain
        type="default"
        @click='submit' 
        v-if="orderXqType === 'edit' && orderXq.status !== '已结单'">
        保存
      </van-button>
      <van-button
        class='submit-btn' 
        block plain
        type="default"
        @click='endOrder' 
        v-if="orderXq.status === '出库中'">
        结单
      </van-button>
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
    <van-dialog id="van-dialog" />
	</div>
</template>

<script>
  import Dialog from '../../wxcomponents/vant-weapp/dialog/dialog'
	import { dateFormat } from '../../utils/index.js'
	import Toast from '../../wxcomponents/vant-weapp/toast/toast.js'
	const db = uniCloud.database();
	const collection = db.collection("order-info")
	export default {
		data() {
			return {
        orderXqType: 'add',
				payMethodList:['艺盛淘宝','创盈淘宝','阿里巴巴','拼多多','微信'],
				id:'',
        orderXq:{
          customerName:'',
          phone:'',
          customerRemark:'',
          orderId:'',
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
            	adjustAmount: 0,
            }
          ],
          deliveryList:[]
        },
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
        deliveryFormrules:{
          expressNumber: { required: true, message: '请输入运单号', trigger: 'blur' },
          deliveryAddress: { required: true, message: '请输入送货地址', trigger: 'blur' },
          expressAmount:[{ required: true, message: '请输入运费金额', trigger: 'blur' },
          	  { type: 'number', message: '请输入正确的运费金额', trigger: 'blur' }],
          transportMode:{ required: true, message: '请输入运输方式', trigger: 'blur' },
          expressPayer: { required: true, message: '请输入运费付款人', trigger: 'blur' },
          outorderPerson: { required: true, message: '请输入出库人', trigger: 'blur' }
        },
				selectProduct:{},
				selectProductIndex:-1,
				paymentPop:false,
        
        isEditProduct: true,
        isEditDelivery: true
			}
		},
		onLoad(option){
      this.orderXqType = option.type
      if(this.orderXqType === 'edit'){
        this.orderXq = JSON.parse(option.order)
        // 解决不知道什么原因导致的列表数据不渲染
        this.$forceUpdate()
        this.isEditProduct = false
      }
			this.$eventBus.$on('saveOrderInfo',(data)=>{
				this.orderXq.customerName = data.customerName
        this.orderXq.phone = data.phone
        this.orderXq.customerRemark = data.customerRemark
        this.orderXq.orderId = data.orderId
			})
		},
		methods: {
      endOrder(){
        let valide = this.deliveryValidate()
        Dialog.confirm({
        message: '结单后不允许修改单子内容，确定将此单子结单吗？',
        }).then(()=>{
           if(valide){
            let loadingToast = Toast.loading({
              message: '保存中...',
              forbidClick: true,
            })
            //将编辑状态改成false
            if(this.orderXq.deliveryList.length>0){
              this.orderXq.deliveryList.forEach((it)=>{
                it.isEdit = false
              })
            }
            this.orderXq.updateTime = dateFormat('YYYY-mm-dd',new Date())
            let orderXq = JSON.parse(JSON.stringify(this.orderXq))
            orderXq.status = '已结单'
            delete orderXq._id
            collection.where({"_id": this.orderXq._id}).update(orderXq).then(()=>{
              loadingToast.clear()
              Toast.success('保存成功');
              setTimeout(()=>{
                uni.navigateBack()
              },500)
            }).catch(()=>{
              loadingToast.clear()
              Toast.fail('保存失败');
            })
          }
        })

      },
			submit(){
				// 校验
				let valide = this.productListAndBasicInfoValidate() && this.deliveryValidate()
				// 调保存接口
				if(valide){
					// 计算订单总额
					let allTotalPrice = 0
					this.orderXq.productList.forEach(it => {
						allTotalPrice += Number(it.totalAmount)
					})
					let loadingToast = Toast.loading({
					  message: '保存中...',
					  forbidClick: true,
					})
					// 给数据库添加数据
          this.orderXq.allTotalPrice = allTotalPrice
          if(this.orderXqType === 'add'){
            collection.where({orderId: this.orderXq.orderId}).get().then((res)=>{
              // 避免多次提交数据，以orderId来判断是否重复请求
              if(res.result.data.length === 0){
                this.orderXq.createTime = dateFormat('YYYY-mm-dd',new Date())
                this.orderXq.status = '未出库'
                collection.add(this.orderXq).then(()=>{
                    loadingToast.clear()
                    Toast.success('保存成功');
                    setTimeout(()=>{
                      uni.navigateTo({
                        url: '../order-list/order-list'
                      })
                    },1000)
                  }).catch(()=>{
                    loadingToast.clear()
                    Toast.fail('保存失败');
                  })
              }
            })
          } else if(this.orderXqType === 'edit'){
              //将编辑状态改成false
              if(this.orderXq.deliveryList.length>0){
                this.orderXq.deliveryList.forEach((it)=>{
                  it.isEdit = false
                })
              }
              this.orderXq.updateTime = dateFormat('YYYY-mm-dd',new Date())
              let orderXq = JSON.parse(JSON.stringify(this.orderXq))
              delete orderXq._id
              if(orderXq.deliveryList.length>0){
                orderXq.status = '出库中'
              }
              collection.where({"_id": this.orderXq._id}).update(orderXq).then(()=>{
                loadingToast.clear()
                Toast.success('保存成功');
                setTimeout(()=>{
                  uni.navigateBack()
                },500)
              }).catch(()=>{
                loadingToast.clear()
                Toast.fail('保存失败');
              })
           }
				}
			},
			productListAndBasicInfoValidate(){
				if(!Object.keys(this.orderXq).length){
					Toast('请添加订单信息')
					return false
				}
				if(!this.orderXq.customerName){
					Toast('客户姓名不能为空')
					return false
				}
				for(let i=0;i<this.orderXq.productList.length;i++){
					for(let key in this.orderXq.productList[i]){
						if(this.productFormrules[key] && !this.orderXq.productList[i][key] && this.orderXq.productList[i][key]!==0){
							Toast(`${this.productFormrules[key].message || this.productFormrules[key][0].message}`)
							return false
						}
					}
				}
				return true
			},
      deliveryValidate(){
        for(let i=0;i<this.orderXq.deliveryList.length;i++){
        	for(let key in this.orderXq.deliveryList[i]){
        		if(this.deliveryFormrules[key] && !this.orderXq.deliveryList[i][key] && this.orderXq.deliveryList[i][key]!==0){
        			Toast(`${this.deliveryFormrules[key].message || this.deliveryFormrules[key][0].message}`)
        			return false
        		}
        	}
        }
        return true
      },
			showPaymentPop(item, index){
        if(!this.isEditProduct){
          return
        }
				this.selectProduct = item
				this.selectProductIndex = index
				this.paymentPop = true
			},
			getPayMethod(event){
				this.$set(this.orderXq.productList[this.selectProductIndex],'payMethod',event.detail.value)
				this.paymentPop = false
			},
			addProduct(){
				this.orderXq.productList.push({
					productname:'',
					modelType:'',
					amount:'',
					unit:'',
					unitPrice:'',
					totalAmount:'',
					adjustAmount:0
				})
			},
      changeDeliveryEditStatus(){
        this.orderXq.deliveryList.forEach(it=>{
          if(it.isEdit !== undefined){
            it.isEdit = !it.isEdit
          }
        })
      },
      addDelivery(){
        if(!this.orderXq.deliveryList){
          this.$set(this.orderXq,'deliveryList',[])
        }
        this.orderXq.deliveryList.push({
        	expressNumber:'',
        	deliveryAddress:'',
        	expressAmount:'',
        	expressPayer:'',
        	transportMode:'',
        	outorderPerson:'',
        	outorderRemark:'',
          outorderTime: dateFormat('YYYY-mm-dd',new Date())
        })
      },
      delDelivery(index){
        Dialog.confirm({
        message: '确定删除此运单吗？',
        }).then(()=>{
          this.orderXq.deliveryList.splice(index,1)
        })
      },
			delProduct(index){
        Dialog.confirm({
        message: '确定删除此产品吗？',
        }).then(()=>{
			  	this.orderXq.productList.splice(index,1)
        })
			},
			addOrderInfo(){
        console.log(32423)
				uni.navigateTo({
					url: `/pages/dingdan-info/dingdan-info?id=${this.id}&type=add`
				})
			},
			editOrderInfo(){
				uni.navigateTo({
					url: `/pages/dingdan-info/dingdan-info?orderInfo=${JSON.stringify(this.orderXq)}&id=${this.id}&type=edit`
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
	padding: 0px 20px 50px 20px;
	box-sizing:border-box;
  overflow-y: auto;
	.submit-btn{
		/deep/button{
			margin: 20px 0px
		}
	}
	.order-info{
		margin-top: 5px;
		padding: 10px;
		background: white;
		border-radius: 10px;
		.order-info-show{
			font-size: 12px;
			.left{
				display: flex;
				justify-content: center;
				align-items: center;
				height: 70px;
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
				height: 70px;
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}
	}
  .outorder-detail-wraper{
    padding-top: 20px;
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
				.product-header{
					padding: 8px 20px;
					font-size: 14px;
					background: #efefef;
					display: flex;
					justify-content: space-between;
          align-items: center;
          .edit-save-icon{
            display: flex;
          }
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

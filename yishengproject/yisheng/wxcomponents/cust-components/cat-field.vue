<template>
	<div>
		<van-field
			:value="value || initValue"
			:label="label"
			:placeholder="placeholder"
			:border="false"
			@change="change"
			@blur="blur"
			@input='input'
			:error-message='errorMsg'
			:readonly='readonly'
			use-button-slot>
			<div slot='button'>
				<slot name='back-info'></slot>
			</div>
		</van-field>
	</div>

</template>
<script>
export default{
	props:['placeholder','label','value','rules','readonly','initValue'],
	data(){
		return{
			required:false,
			dataType: '',
			validator:null,
			errorMsg:''
		}
	},
	methods:{
		change(e){
			this.$emit('change',e)
			this.validate('change')
		},
		blur(e){
			this.validate('blur')
			this.$emit('blur',e)
		},
		input(e){
			this.$emit('input',e.mp.detail)
			this.validate('input')
		},
		// 有没有更好的方式，现在每次触发都要遍历
		validate(eventType){
			let _that = this
			if(this.rules instanceof Array){
				Promise.all(this.rules.map((item)=>{
					return new Promise((resolve,reject)=>{
						if(item.trigger === eventType){
							let a = _that.callOneValid(item)
							_that.callOneValid(item) ? resolve() : reject()
						}else{
							resolve()
						}
					})
				})).then(()=>{
					this.errorMsg = ''
				}).catch(()=>{})
			}else if(this.rules instanceof Object){
				if(this.rules.trigger === eventType){
					this.callOneValid(this.rules) ? this.errorMsg = '' :""
				}
			}
		},
		// 调用具体的valid函数
		callOneValid(rule){
		  if(rule.required){
			  let b = this.validateRequire(rule)
			 return this.validateRequire(rule)
		  }else if(rule.type){
			 return this.validateType(rule)
		  }
		},
		validateRequire(rule){
			if(!this.value && this.value !== 0){
				this.errorMsg = rule.message
				return false
			}else{
				return true
			}
		},
		validateType(rule){
			// number,array,date,email
			// 先支持基本类型，不考虑typeof的特殊情况
			if(isNaN(Number(this.value)) || (typeof (Number(this.value)) !== rule.type)){
				this.errorMsg = rule.message
				return false
			}else{
				return true
			}
		},
	}
}
</script>
<style>
</style>
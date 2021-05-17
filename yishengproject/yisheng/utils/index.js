export function dateFormat(value) {           
	var date = new Date(value*1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
	var year = date.getFullYear();
	var month = ("0" + (date.getMonth() + 1)).slice(-2);
	var sdate = ("0" + date.getDate()).slice(-2);
	var hour = ("0" + date.getHours()).slice(-2);
	var minute = ("0" + date.getMinutes()).slice(-2);
	var second = ("0" + date.getSeconds()).slice(-2);
	// 拼接
	var result = year + "年" + month + "月" + sdate + "日 " + hour + ":" + minute //+ ":" + second;
	// 返回
	return result;
}
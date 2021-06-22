export function dateFormat(fmt, date) {
    let ret;
    const opt = {
        "Y+": date.getFullYear().toString(),        // 年
        "m+": (date.getMonth() + 1).toString(),     // 月
        "d+": date.getDate().toString(),            // 日
        "H+": date.getHours().toString(),           // 时
        "M+": date.getMinutes().toString(),         // 分
        "S+": date.getSeconds().toString()          // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        };
    };
    return fmt;
}
// 期格式转换2020-06-27T14:20:27.000000Z 时间格式转换成 2020-06-27 14:20:27
export function rTime(date) {
    var json_date = new Date(date).toJSON();
    return new Date(new Date(json_date) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '') 
}
export function geteast9time(date){
  // 目标时区，东9区
  let targetTimezone = -9
  // 当前时区与中时区时差，以min为维度
  let _dif = new Date(date).getTimezoneOffset()
  // 本地时区时间 + 时差  = 中时区时间
  // 目标时区时间 + 时差 = 中时区时间
  // 目标时区时间 = 本地时区时间 + 本地时区时差 - 目标时区时差
  // 东9区时间
  let east9time = new Date(date).getTime() + _dif * 60 * 1000 - (targetTimezone * 60 * 60 * 1000)
  console.log(east9time,88)
  return east9time
}
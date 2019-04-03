/** 
 * api接口的统一出口
 */
// 首页/交易模块接口
import home from '@/api/model/home';
// 个人中心模块接口
import user from '@/api/model/user';
// 导出接口
export default {    
    home,
    user
}
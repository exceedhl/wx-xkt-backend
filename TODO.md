TODO tasks
==============
从student ongoing页面从等待自动进入正在点名页面
用户退出后有进入点名时的处理
删除班级：delete class: delete /classes/1
导出点名记录为excel
客服接口
数据埋点
点名模板消息
优化点名ws，允许多进程ws同时运行


WS test commands
==============
{message: 'Auth', payload: {'authorization': 'Bearer '}
{message:'JoinCall', payload: {'rollcallId': 1}}
{message: 'InputCode', payload: {'rollcallId': 1, 'code': '2345'}})}

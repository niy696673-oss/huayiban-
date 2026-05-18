const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  const { code } = event
  
  // 获取openid（云开发环境自动关联）
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  
  if (!openid) {
    return { success: false, error: '获取openid失败' }
  }
  
  try {
    // 查询用户是否存在
    const userRes = await db.collection('users').where({
      _openid: openid
    }).get()
    
    let userInfo = null
    let formStatus = ''
    
    if (userRes.data.length > 0) {
      // 用户已存在
      userInfo = userRes.data[0]
      formStatus = userInfo.formStatus || ''
    } else {
      // 创建新用户
      await db.collection('users').add({
        data: {
          _openid: openid,
          formStatus: '',
          formData: {},
          assignedDoctor: '',
          role: 'patient',
          createTime: new Date(),
          updateTime: new Date(),
        }
      })
    }
    
    return {
      success: true,
      openid,
      userInfo,
      formStatus,
    }
  } catch (e) {
    return { success: false, error: e.message }
  }
}

const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  const { userInfo, formData } = event

  try {
    // 更新用户表单数据
    await db.collection('users').where({
      _openid: openid
    }).update({
      data: {
        userInfo,
        formData,
        formStatus: 'pending',
        updateTime: new Date(),
      }
    })

    // 创建审核日志
    await db.collection('audit_logs').add({
      data: {
        userId: openid,
        status: 'pending',
        createTime: new Date(),
      }
    })

    return { success: true }
  } catch (e) {
    return { success: false, error: e.message }
  }
}

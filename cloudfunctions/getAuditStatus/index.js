const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  const { openid } = event
  
  try {
    const userRes = await db.collection('users').where({
      _openid: openid
    }).get()
    
    if (userRes.data.length === 0) {
      return { status: '', rejectReason: '' }
    }
    
    const user = userRes.data[0]
    
    // 获取最新的审核日志
    const auditRes = await db.collection('audit_logs')
      .where({ userId: openid })
      .orderBy('createTime', 'desc')
      .limit(1)
      .get()
    
    let rejectReason = ''
    if (auditRes.data.length > 0 && auditRes.data[0].status === 'rejected') {
      rejectReason = auditRes.data[0].rejectReason || ''
    }
    
    return {
      status: user.formStatus || '',
      rejectReason,
    }
  } catch (e) {
    return { status: '', rejectReason: '' }
  }
}

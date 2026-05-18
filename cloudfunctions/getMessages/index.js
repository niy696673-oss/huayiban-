const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  const { openid, doctorId, lastTime, pageSize = 20 } = event
  
  try {
    const messagesRes = await db.collection('messages')
      .where({
        or: [
          { fromId: openid, toId: doctorId },
          { fromId: doctorId, toId: openid },
        ],
        createTime: _.lt(lastTime || Date.now())
      })
      .orderBy('createTime', 'desc')
      .limit(pageSize)
      .get()
    
    return {
      success: true,
      messages: messagesRes.data.reverse(),
      lastTime: messagesRes.data[0]?.createTime || lastTime,
    }
  } catch (e) {
    return { success: false, error: e.message, messages: [] }
  }
}

const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  const { fromId, toId, type, content, mediaUrl } = event
  
  try {
    await db.collection('messages').add({
      data: {
        fromId,
        toId,
        type,
        content: content || '',
        mediaUrl: mediaUrl || '',
        isRead: false,
        createTime: new Date(),
      }
    })
    
    return { success: true }
  } catch (e) {
    return { success: false, error: e.message }
  }
}

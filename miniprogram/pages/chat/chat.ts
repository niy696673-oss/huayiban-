const app = getApp<IAppOption>()

// 用户头像
const defaultAvatar = 'https://ui-avatars.com/api/?name=%E6%88%91&background=95ec69&color=fff&size=200&font-size=0.4&length=1'

// 医生头像
const doctorAvatar = 'https://ui-avatars.com/api/?name=%E9%82%B1%E5%8C%BB%E7%94%9F&background=0071e3&color=fff&size=200&font-size=0.4&length=2'

Page({
  data: {
    doctorName: '邱医生',
    userInfo: null as any,
    defaultAvatar,
    messages: [] as any[],
    inputText: '',
    scrollTop: 0,
    // 预设问答对 - 用户输入以下关键词，邱医生会给出对应回答
    presetQA: {
      '靶向药': '好的，请告诉我您目前服用的是哪种靶向药？以及您目前的症状和身体状况如何？',
      '吉非替尼': '吉非替尼常见的副作用包括恶心、呕吐、皮疹等。您描述的症状可能是药物副作用。建议您：1. 餐后2小时再服药 2. 如症状持续或加重，请及时就医复查。',
      '恶心': '恶心可能是靶向药的常见副作用。建议您：1. 少食多餐，避免空腹服药 2. 避免油腻、辛辣食物 3. 如症状严重，请及时就医。',
      '皮疹': '靶向药相关的皮疹通常出现在面部和躯干。建议您：1. 保持皮肤清洁湿润 2. 避免阳光直射 3. 咨询医生是否需要外用药物治疗。',
      '检查报告': '请上传您的检查报告，我会尽快为您分析。请确保图片清晰可见。',
      '预约': '好的，您可以告诉我您方便的就诊时间，我会为您安排。',
      '谢谢': '不客气！这是我应该做的。祝您早日康复！',
      '副作用': '靶向药常见的副作用包括：1. 恶心呕吐 2. 皮疹 3. 腹泻 4. 乏力等。请告诉我您具体有哪些不适？',
      '诊疗建议': '建议尝试靶向药治疗',
    },
  },

  onLoad(options: any) {
    wx.setNavigationBarTitle({ title: options.doctorName || '邱医生' })
    const userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo')
    this.setData({
      userInfo,
      doctorName: options.doctorName || '邱医生',
    })
    
    // 强制加载初始对话
    this.loadInitialMessages()
  },

  loadInitialMessages() {
    const initialMessages = [
      {
        id: 'msg_1',
        fromId: 'doctor',
        fromName: '邱医生',
        fromAvatar: doctorAvatar,
        type: 'text',
        content: '您好，资料已经审核完毕，您可以在此咨询我诊疗相关问题。',
        createTime: Date.now(),
      },
    ]
    this.setData({ messages: initialMessages })
    this.saveMessages()
  },

  loadMessages() {
    const messages = wx.getStorageSync('messages') || []
    this.setData({ messages })
  },

  saveMessages() {
    wx.setStorageSync('messages', this.data.messages)
  },

  onInputChange(e: any) {
    this.setData({ inputText: e.detail.value })
  },

  onSendText() {
    const { inputText, messages, userInfo } = this.data
    if (!inputText.trim()) return

    const content = inputText.trim()
    this.setData({ inputText: '' })

    // 消息添加到末尾（从下往上，新消息在下面）
    const newMessages = [...messages, {
      id: `user_${Date.now()}`,
      fromId: 'user',
      fromName: '我',
      fromAvatar: defaultAvatar,
      type: 'text',
      content,
      createTime: Date.now(),
    }]

    this.setData({ messages: newMessages, scrollTop: this.data.scrollTop + 1 })
    this.saveMessages()

    setTimeout(() => {
      this.autoReply(content)
    }, 1000)
  },

  autoReply(userMessage: string) {
    const { messages, doctorName, presetQA } = this.data
    const lowerMsg = userMessage.toLowerCase()

    // 精确匹配预设问答
    let matchedReply = ''
    for (const [keyword, reply] of Object.entries(presetQA)) {
      if (lowerMsg.includes(keyword)) {
        matchedReply = reply
        break
      }
    }

    // 只有匹配到预设关键词时才回复，否则不回复
    if (!matchedReply) {
      return
    }

    // 医生回复也添加到末尾
    const newMessages = [...messages, {
      id: `doctor_${Date.now()}`,
      fromId: 'doctor',
      fromName: doctorName,
      fromAvatar: doctorAvatar,
      type: 'text',
      content: matchedReply,
      createTime: Date.now(),
    }]

    this.setData({ messages: newMessages, scrollTop: this.data.scrollTop + 1 })
    this.saveMessages()
  },

  // 输入框聚焦时滚动到底部
  onInputFocus() {
    setTimeout(() => {
      this.setData({ scrollTop: this.data.scrollTop + 1 })
    }, 300)
  },

  onChooseImage() {
    wx.chooseImage({
      count: 1,
      sourceType: ['album', 'camera'],
      success: (res) => {
        const { messages } = this.data
        const tempFilePath = res.tempFilePaths[0]

        // 图片消息也添加到末尾
        const newMessages = [...messages, {
          id: `user_${Date.now()}`,
          fromId: 'user',
          fromName: '我',
          fromAvatar: defaultAvatar,
          type: 'image',
          mediaUrl: tempFilePath,
          createTime: Date.now(),
        }]

        this.setData({ messages: newMessages, scrollTop: this.data.scrollTop + 1 })
        this.saveMessages()

        setTimeout(() => {
          this.autoReply('图片')
        }, 1500)
      }
    })
  },

  onPreviewImage(e: any) {
    wx.previewImage({ urls: [e.currentTarget.dataset.url] })
  },
})

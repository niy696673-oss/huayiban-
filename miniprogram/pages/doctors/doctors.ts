// 医生头像
const doctorAvatar = 'https://ui-avatars.com/api/?name=%E9%82%B1%E5%8C%BB%E7%94%9F&background=0071e3&color=fff&size=200&font-size=0.4&length=2'

// 医助头像
const assistantAvatars = [
  'https://ui-avatars.com/api/?name=%E5%B0%8F%E7%8E%8B&background=5856d6&color=fff&size=200&font-size=0.4&length=2',
  'https://ui-avatars.com/api/?name=%E5%B0%8F%E6%9D%8E&background=ff2d55&color=fff&size=200&font-size=0.4&length=2',
  'https://ui-avatars.com/api/?name=%E5%B0%8F%E5%BC%A0&background=00c7be&color=fff&size=200&font-size=0.4&length=2',
  'https://ui-avatars.com/api/?name=%E5%B0%8F%E9%97%B4&background=ff9500&color=fff&size=200&font-size=0.4&length=2',
  'https://ui-avatars.com/api/?name=%E5%B0%8F%E6%9B%BE&background=34c759&color=fff&size=200&font-size=0.4&length=2',
  'https://ui-avatars.com/api/?name=%E5%B0%8F%E6%98%8E&background=af52de&color=fff&size=200&font-size=0.4&length=2',
  'https://ui-avatars.com/api/?name=%E5%B0%8F%E9%9B%AA&background=5ac8fa&color=fff&size=200&font-size=0.4&length=2',
  'https://ui-avatars.com/api/?name=%E5%B0%8F%E6%99%93&background=ffcc00&color=fff&size=200&font-size=0.4&length=2',
  'https://ui-avatars.com/api/?name=%E5%B0%8F%E6%B5%8B&background=ff3b30&color=fff&size=200&font-size=0.4&length=2',
  'https://ui-avatars.com/api/?name=%E5%B0%8F%E6%9D%B0&background=007aff&color=fff&size=200&font-size=0.4&length=2',
  'https://ui-avatars.com/api/?name=%E5%B0%8F%E6%B7%91&background=32ade6&color=fff&size=200&font-size=0.4&length=2',
  'https://ui-avatars.com/api/?name=%E5%B0%8F%E6%B3%89&background=bf5af2&color=fff&size=200&font-size=0.4&length=2',
]

const assistantNames = ['小王', '小李', '小张', '小赵', '小钱', '小孙', '小周', '小吴', '小郑', '小陈', '小刘', '小徐']

Page({
  data: {
    defaultAvatar: doctorAvatar,
    doctor: {
      _id: 'doctor_qiu',
      name: '邱医生',
      title: '主任医师',
      department: '肿瘤科',
      hospital: '北京协和医院',
      avatarUrl: doctorAvatar,
    },
    assistants: assistantNames.map((name, i) => ({
      _id: `assistant_${i + 1}`,
      name,
      title: '医助',
      avatarUrl: assistantAvatars[i],
    })),
  },

  onLoad() {
    wx.setNavigationBarTitle({ title: '我的医生' })
  },

  onSelectDoctor(e: any) {
    const doctor = this.data.doctor
    wx.navigateTo({
      url: `/pages/chat/chat?doctorId=${doctor._id}&doctorName=${doctor.name}`
    })
  },

  onSelectAssistant(e: any) {
    const assistant = e.currentTarget.dataset.assistant
    wx.navigateTo({
      url: `/pages/chat/chat?doctorId=${assistant._id}&doctorName=${assistant.name}`
    })
  },
})

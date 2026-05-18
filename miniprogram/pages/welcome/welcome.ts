Page({
  data: {
    agreed: false,
  },

  toggleAgree() {
    this.setData({ agreed: !this.data.agreed })
  },

  onStart() {
    if (!this.data.agreed) {
      wx.showToast({ title: '请先同意使用须知', icon: 'none' })
      return
    }
    wx.setStorageSync('welcomed', true)
    wx.redirectTo({ url: '/pages/identity/identity' })
  },
})

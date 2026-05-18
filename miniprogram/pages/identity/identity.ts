Page({
  data: {
    selectedIdentity: '' as '' | 'patient' | 'family',
  },

  onSelect(e: any) {
    const identity = e.currentTarget.dataset.identity as '' | 'patient' | 'family'
    this.setData({ selectedIdentity: identity })
  },

  onConfirm() {
    if (!this.data.selectedIdentity) {
      wx.showToast({ title: '请先选择您的身份', icon: 'none' })
      return
    }
    wx.setStorageSync('userIdentity', this.data.selectedIdentity)
    wx.redirectTo({ url: '/pages/form/form' })
  },
})

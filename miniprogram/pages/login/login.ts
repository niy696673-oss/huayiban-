const app = getApp<IAppOption>()

Component({
  data: {
    loading: false,
  },
  methods: {
    onLogin() {
      this.setData({ loading: true })
      
      wx.login({
        success: async (res) => {
          if (!res.code) {
            this.setData({ loading: false })
            wx.showToast({ title: '登录失败', icon: 'none' })
            return
          }
          
          try {
            const result = await wx.cloud.callFunction({
              name: 'login',
              data: { code: res.code }
            }) as any
            
            app.globalData.openid = result.result?.openid || ''
            app.globalData.formStatus = result.result?.formStatus || ''
            app.globalData.userInfo = result.result?.userInfo || null
            
            this.navigateAfterLogin(result.result?.formStatus || '')
          } catch (e) {
            console.error('login error:', e)
            wx.showToast({ title: '网络错误', icon: 'none' })
          } finally {
            this.setData({ loading: false })
          }
        },
        fail: () => {
          this.setData({ loading: false })
          wx.showToast({ title: '登录失败', icon: 'none' })
        }
      })
    },
    
    navigateAfterLogin(formStatus: string) {
      let url = ''
      
      if (!formStatus || formStatus === 'pending') {
        url = '/pages/form/form'
      } else if (formStatus === 'approved') {
        url = '/pages/doctors/doctors'
      } else if (formStatus === 'rejected') {
        url = '/pages/audit/audit'
      }
      
      if (url) {
        wx.redirectTo({ url })
      }
    }
  },
})

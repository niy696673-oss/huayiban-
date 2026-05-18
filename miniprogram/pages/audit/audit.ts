const app = getApp<IAppOption>()

Component({
  data: {
    status: 'pending' as 'pending' | 'approved' | 'rejected' | '',
    rejectReason: '',
  },

  lifetimes: {
    attached() {
      setTimeout(() => {
        this.setData({ status: 'approved' })
      }, 5000)
    },
  },

  methods: {
    goToDoctors() {
      wx.redirectTo({ url: '/pages/doctors/doctors' })
    },

    goToForm() {
      wx.redirectTo({ url: '/pages/form/form' })
    },
  },
})

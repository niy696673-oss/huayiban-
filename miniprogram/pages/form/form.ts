const app = getApp<IAppOption>()

Component({
  data: {
    currentStep: 1,
    totalSteps: 3,
    isCurrentStepFilled: false,
    formData: {
      hospitalRecords_admission: [] as string[],
      hospitalRecords_discharge: [] as string[],
      hospitalRecords_outpatient: [] as string[],
      imagingReports_ct: [] as string[],
      imagingReports_mri: [] as string[],
      imagingReports_pet: [] as string[],
      therapyRecords: [] as string[],
      pathologyReport: [] as string[],
      geneReport: [] as string[],
      labResults_blood: [] as string[],
      labResults_liver: [] as string[],
      labResults_ecg: [] as string[],
      therapyText: { date: '', drug: '', note: '' },
      basicInfo: { height: '', weight: '', address: '', city: '' },
      walkVideo: '',
      ctStatus: '' as '' | 'yes' | 'no',
    },
    submitting: false,
  },

  lifetimes: {
    attached() {
      this.loadCache()
      this.refreshStep()
    },
  },

  pageLifetimes: {
    show() {
      this.loadCache()
      this.refreshStep()
    },
  },

  methods: {
    refreshStep() {
      const fd = this.data.formData
      let filled = false

      if (this.data.currentStep === 1) {
        const b = fd.basicInfo
        filled = !!(b.height && b.weight && b.address && b.city)
      } else if (this.data.currentStep === 2) {
        const therapyTextFilled = !!(fd.therapyText?.date || fd.therapyText?.drug)
        const hrFilled = fd.hospitalRecords_admission.length > 0 || fd.hospitalRecords_discharge.length > 0 || fd.hospitalRecords_outpatient.length > 0
        const imgFilled = fd.imagingReports_ct.length > 0 || fd.imagingReports_mri.length > 0 || fd.imagingReports_pet.length > 0
        const labFilled = fd.labResults_blood.length > 0 || fd.labResults_liver.length > 0 || fd.labResults_ecg.length > 0
        const ctStatusFilled = !!fd.ctStatus
        filled = ctStatusFilled || hrFilled || imgFilled || fd.therapyRecords.length > 0 ||
          fd.pathologyReport.length > 0 || fd.geneReport.length > 0 || labFilled || therapyTextFilled
      } else if (this.data.currentStep === 3) {
        filled = !!fd.walkVideo
      }

      this.setData({ isCurrentStepFilled: filled })
    },

    goUploadDetail() {
      wx.navigateTo({ url: '/pages/upload-detail/upload-detail' })
    },

    nextStep() {
      if (this.data.currentStep < this.data.totalSteps) {
        this.setData({ currentStep: this.data.currentStep + 1 })
        this.refreshStep()
        this.saveCache()
      }
    },

    prevStep() {
      if (this.data.currentStep > 1) {
        this.setData({ currentStep: this.data.currentStep - 1 })
        this.refreshStep()
      }
    },

    onUploadVideo() {
      wx.chooseVideo({
        sourceType: ['album', 'camera'],
        maxDuration: 60,
        success: (res) => {
          const formData = this.data.formData
          formData.walkVideo = res.tempFilePath
          this.setData({ formData })
          this.refreshStep()
          this.saveCache()
        },
      })
    },

    onInputChange(e: any) {
      const field = e.currentTarget.dataset.field
      const formData = this.data.formData
      ;(formData.basicInfo as any)[field] = e.detail.value
      this.setData({ formData })
      this.refreshStep()
      this.saveCache()
    },

    onCtStatusChange(e: any) {
      const formData = this.data.formData
      formData.ctStatus = e.currentTarget.dataset.value as '' | 'yes' | 'no'
      this.setData({ formData })
      this.refreshStep()
      this.saveCache()
    },

    onSubmit() {
      if (this.data.submitting) return
      this.setData({ submitting: true })
      wx.showLoading({ title: '提交中...' })
      this.saveCache()
      wx.setStorageSync('formStatus', 'pending')
      setTimeout(() => {
        wx.hideLoading()
        wx.redirectTo({ url: '/pages/audit/audit' })
      }, 500)
    },

    saveCache() {
      wx.setStorageSync('formData', this.data.formData)
    },

    loadCache() {
      const formData = wx.getStorageSync('formData')
      if (formData) this.setData({ formData })
    },
  },
})

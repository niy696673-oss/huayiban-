type ImageField =
  | 'hospitalRecords_admission'
  | 'hospitalRecords_discharge'
  | 'hospitalRecords_outpatient'
  | 'imagingReports_ct'
  | 'imagingReports_mri'
  | 'imagingReports_pet'
  | 'therapyRecords'
  | 'pathologyReport'
  | 'geneReport'
  | 'labResults_blood'
  | 'labResults_liver'
  | 'labResults_ecg'

interface TherapyText {
  date: string
  drug: string
  note: string
}

type ImagesMap = Record<ImageField, string[]>

Page({
  data: {
    images: {
      hospitalRecords_admission: [],
      hospitalRecords_discharge: [],
      hospitalRecords_outpatient: [],
      imagingReports_ct: [],
      imagingReports_mri: [],
      imagingReports_pet: [],
      therapyRecords: [],
      pathologyReport: [],
      geneReport: [],
      labResults_blood: [],
      labResults_liver: [],
      labResults_ecg: [],
    } as ImagesMap,
    therapyText: {
      date: '',
      drug: '',
      note: '',
    } as TherapyText,
    expanded: '' as string,
    hasAnyImage: false,
    saving: false,
  },

  onLoad() {
    this.loadFromStorage()
  },

  loadFromStorage() {
    const formData = wx.getStorageSync('formData') || {}

    const allFields: ImageField[] = [
      'hospitalRecords_admission', 'hospitalRecords_discharge', 'hospitalRecords_outpatient',
      'imagingReports_ct', 'imagingReports_mri', 'imagingReports_pet',
      'therapyRecords', 'pathologyReport', 'geneReport',
      'labResults_blood', 'labResults_liver', 'labResults_ecg',
    ]

    const images: ImagesMap = {} as ImagesMap
    allFields.forEach(f => {
      images[f] = (formData as any)[f] || []
    })

    const therapyText: TherapyText = {
      date: formData.therapyText?.date || '',
      drug: formData.therapyText?.drug || '',
      note: formData.therapyText?.note || '',
    }

    const hasAny = allFields.some(f => images[f].length > 0)
    this.setData({ images, therapyText, hasAnyImage: hasAny })
  },

  toggleExpand(e: any) {
    const key = e.currentTarget.dataset.key
    this.setData({ expanded: this.data.expanded === key ? '' : key })
  },

  onTherapyInput(e: any) {
    const type = e.currentTarget.dataset.type as keyof TherapyText
    const therapyText = this.data.therapyText
    therapyText[type] = e.detail.value
    this.setData({ therapyText })
  },

  onAdd(e: any) {
    const field: ImageField = e.currentTarget.dataset.field
    wx.chooseImage({
      count: 9,
      sourceType: ['album', 'camera'],
      success: (res) => {
        const images = this.data.images
        images[field] = [...images[field], ...res.tempFilePaths]
        this.setData({ images })
        this.saveToStorage()
      },
    })
  },

  onRemove(e: any) {
    const field: ImageField = e.currentTarget.dataset.field
    const index = e.currentTarget.dataset.index
    const images = this.data.images
    images[field].splice(index, 1)
    this.setData({ images })
    this.saveToStorage()
  },

  onPreview(e: any) {
    const field: ImageField = e.currentTarget.dataset.field
    const url = e.currentTarget.dataset.url
    wx.previewImage({ current: url, urls: this.data.images[field] })
  },

  onSave() {
    if (this.data.saving) return
    this.setData({ saving: true })
    this.saveToStorage()
    setTimeout(() => {
      this.setData({ saving: false })
      wx.navigateBack()
    }, 400)
  },

  saveToStorage() {
    const formData = wx.getStorageSync('formData') || {}

    const allFields: ImageField[] = [
      'hospitalRecords_admission', 'hospitalRecords_discharge', 'hospitalRecords_outpatient',
      'imagingReports_ct', 'imagingReports_mri', 'imagingReports_pet',
      'therapyRecords', 'pathologyReport', 'geneReport',
      'labResults_blood', 'labResults_liver', 'labResults_ecg',
    ]

    allFields.forEach(f => {
      (formData as any)[f] = this.data.images[f]
    })
    formData.therapyText = this.data.therapyText

    wx.setStorageSync('formData', formData)

    const hasAny = allFields.some(f => this.data.images[f].length > 0)
    this.setData({ hasAnyImage: hasAny })
  },

  goBack() {
    wx.navigateBack()
  },
})

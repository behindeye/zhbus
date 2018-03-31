// pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lines: {},
    // task: ""
  },

  jumpToLine: function (event) {
    var id = event.currentTarget.dataset.id
    var name = event.currentTarget.dataset.name
    var begintime = event.currentTarget.dataset.begintime
    var endtime = event.currentTarget.dataset.endtime
    var price = event.currentTarget.dataset.price
    var fromstation = event.currentTarget.dataset.fromstation
    var tostation = event.currentTarget.dataset.tostation
    // console.log(name+","+begintime+","+endtime+","+price)
    wx.navigateTo({
      url: '../line/line?id=' + id + "&name=" + name + "&begintime=" + begintime + "&endtime=" + endtime + "&price=" + price + "&fromstation=" + fromstation + "&tostation=" + tostation
    })

  },

  searchBus: function (e) {
    var that = this;
    var keyword = e.detail.value
    var timestamp = Date.parse(new Date())
    timestamp = timestamp / 1000;

    // if (typeof (this.data.task) != "undefined") {
    //   console.log("abort")
    //   this.data.task.abort()
    // }

    var requestTask = wx.request({
      url: 'https://api-test.diary.biku8.com/h5/BusQuery',
      method: 'get',
      data: {
        handlerName: 'GetLineListByLineName',
        key: keyword,
        _: timestamp
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          lines: res.data,
        })
      },
      fail: function (res) {
        console.log(res)
        wx.showToast({
          title: res.errMsg,
          icon: 'none',
        })
      }
    })
    // this.setData({
    //   task: requestTask
    // })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },
})
// pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lines: {},
    caches: [],
    flag: 1
  },

  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'search-log',
      success: function (res) {
        console.log(res.data)
        that.setData({
          caches: res.data,
        })
      }
    })
  },

  jumpToLine: function (event) {
    var id = event.currentTarget.dataset.id
    var name = event.currentTarget.dataset.name
    var begintime = event.currentTarget.dataset.begintime
    var endtime = event.currentTarget.dataset.endtime
    var price = event.currentTarget.dataset.price
    var fromstation = event.currentTarget.dataset.fromstation
    var tostation = event.currentTarget.dataset.tostation
    wx.navigateTo({
      url: '../line/line?id=' + id + "&name=" + name + "&begintime=" + begintime + "&endtime=" + endtime + "&price=" + price + "&fromstation=" + fromstation + "&tostation=" + tostation
    })

    var obj = event.currentTarget.dataset.obj;
    var length = this.data.caches.length;
    var tempCache = this.data.caches;
    var flag = true;
    for (var i = 0; i < length; ++i) {
      if (tempCache[i].Id == obj.Id) {
        flag = false;
      }
    }
    if (flag) {
      tempCache[length] = obj;
    }
    console.log(tempCache)
    this.setData({
      caches: tempCache
    })

    wx.setStorage({
      key: 'search-log',
      data: this.data.caches,
    })
  },

  searchBus: function (e) {
    var that = this;
    var keyword = e.detail.value
    var timestamp = Date.parse(new Date())
    timestamp = timestamp / 1000;

    if (keyword == "") {
      this.setData(
        {
          flag: 1
        }
      )
    } else {
      this.setData(
        {
          flag: 0
        }
      )
    }

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
})
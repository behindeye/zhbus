// pages/line/line.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    name: '',
    begintime: '',
    endtime: '',
    price: '',
    tostation: '',
    fromstation: '',
    stations: {},
    bus: '',
    refreshStatus: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id,
      name: options.name,
      begintime: options.begintime,
      endtime: options.endtime,
      price: options.price,
      tostation: options.tostation,
      fromstation: options.fromstation
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    var lineId = this.data.id
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    wx.request({
      url: 'https://api-test.diary.biku8.com/h5/BusQuery',
      method: 'get',
      data: {
        handlerName: 'GetStationList',
        lineId: lineId,
        _: timestamp
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          stations: res.data,
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

    //ask current bus list for stations 
    that.setData({
      refreshStatus : 1
    })
    var lineName = this.data.name;
    var fromStation = this.data.fromstation;
    wx.request({
      url: 'https://api-test.diary.biku8.com/h5/BusQuery',
      method: 'get',
      data: {
        handlerName: 'GetBusListOnRoad',
        lineName: lineName,
        fromStation: fromStation,
        _: timestamp
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          bus: res.data
        })
        wx.setNavigationBarTitle({
          title: that.data.name+"（共"+that.data.bus.data.length+"辆车）",
        })
        var station = that.data.stations;
        var bus = that.data.bus;
        for (var i = 0, len = station.data.length; i < len; ++i) {
          station.data[i].BusNumber = "";
          station.data[i].LastPosition = -1;
          for (var j = 0, len2 = bus.data.length; j < len2; ++j) {
            if (bus.data[j].CurrentStation == station.data[i].Name) {
              station.data[i].BusNumber = station.data[i].BusNumber + "  \n " + bus.data[j].BusNumber;
              station.data[i].LastPosition = bus.data[j].LastPosition;
            }
          }
        }
        that.setData({
          stations: station
        })

        that.setData({
          refreshStatus: 0
        })
      },
      fail: function (res) {
        console.log(res)
        wx.showToast({
          title: res.errMsg,
          icon: 'none',
        })

        that.setData({
          refreshStatus: 0
        })
      }
    })

    setInterval(function () {
      that.setData({
        refreshStatus: 1
      })
      wx.request({
        url: 'https://api-test.diary.biku8.com/h5/BusQuery',
        method: 'get',
        data: {
          handlerName: 'GetBusListOnRoad',
          lineName: lineName,
          fromStation: fromStation,
          _: timestamp
        },
        success: function (res) {
          that.setData({
            bus: res.data
          })
          var station = that.data.stations;
          var bus = that.data.bus;
          for (var i = 0, len = station.data.length; i < len; ++i) {
            station.data[i].BusNumber = "";
            station.data[i].LastPosition = -1;
            for (var j = 0, len2 = bus.data.length; j < len2; ++j) {
              if (bus.data[j].CurrentStation == station.data[i].Name) {
                station.data[i].BusNumber = station.data[i].BusNumber + "  \n" + bus.data[j].BusNumber;
                station.data[i].LastPosition = bus.data[j].LastPosition;
              }
            }
          }
          that.setData({
            stations: station
          })

          that.setData({
            refreshStatus: 0
          })

        },
        fail: function (res) {
          console.log(res)
          wx.showToast({
            title: res.errMsg,
            icon: 'none',
          })
          that.setData({
            refreshStatus: 0
          })
        }
      })
    }, 10000)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var barTitle = this.data.name
    wx.setNavigationBarTitle({
      title: barTitle
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    //ask current bus list for stations 
    var that = this;
    var lineId = this.data.id
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    that.setData({
      refreshStatus: 1
    })
    var lineName = this.data.name;
    var fromStation = this.data.fromstation;
    wx.request({
      url: 'https://api-test.diary.biku8.com/h5/BusQuery',
      method: 'get',
      data: {
        handlerName: 'GetBusListOnRoad',
        lineName: lineName,
        fromStation: fromStation,
        _: timestamp
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          bus: res.data
        })

        var station = that.data.stations;
        var bus = that.data.bus;
        for (var i = 0, len = station.data.length; i < len; ++i) {
          station.data[i].BusNumber = "";
          station.data[i].LastPosition = -1;
          for (var j = 0, len2 = bus.data.length; j < len2; ++j) {
            if (bus.data[j].CurrentStation == station.data[i].Name) {
              station.data[i].BusNumber = station.data[i].BusNumber + "  \n " + bus.data[j].BusNumber;
              station.data[i].LastPosition = bus.data[j].LastPosition;
            }
          }
        }
        that.setData({
          stations: station
        })
        console.log("refresh")
        that.setData({
          refreshStatus: 0
        })
        wx.stopPullDownRefresh()
        wx.showToast({
          title: '刷新成功',
          icon:'none',
          duration:800,
        })
      },
      fail: function (res) {
        console.log(res)
        wx.showToast({
          title: res.errMsg,
          icon: 'none',
        })
        wx.stopPullDownRefresh()
        that.setData({
          refreshStatus: 0
        })
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
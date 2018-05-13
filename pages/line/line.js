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
    this.queryLine();
    var that = this;
    setInterval(function () {
      that.queryBusOnRoad();
    }, 10000)
  },

  queryLine: function () {
    var that = this;
    var lineId = this.data.id
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var cacheStations = wx.getStorageSync(lineId);
    if (typeof (cacheStations) == "undefined" || cacheStations == "") {
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
          wx.setStorage({
            key: lineId,
            data: that.data.stations,
          });
          that.queryBusOnRoad(0);
        },
        fail: function (res) {
          console.log(res)
          wx.showToast({
            title: res.errMsg,
            icon: 'none',
          })
        }
      })
    } else {
      console.log("read cache");
      that.setData({
        stations: cacheStations,
      })
      that.queryBusOnRoad(0);
    }

  },

  queryBusOnRoad: function (n) {
    //ask current bus list for stations 
    var that = this;
    var lineId = this.data.id
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;

    that.setData({
      refreshStatus: 1
    })
    wx.showNavigationBarLoading();
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
        var carNumber = 0;
        try {
          if (typeof (that.data.bus) != "undefined") {
            if (typeof (that.data.bus.data) != "undefined") {
              carNumber = that.data.bus.data.length;
            }
          }
        } catch (err) {
          console.log(err);
        }
        wx.setNavigationBarTitle({
          title: that.data.name + "（共" + carNumber + "辆车）",
        })
        var station = that.data.stations;
        var bus = that.data.bus;
        if (typeof (bus) != "undefined") {
          for (var i = 0, len = station.data.length; i < len; ++i) {
            station.data[i].BusNumber = "";
            station.data[i].LastPosition = -1;
            if (typeof (bus.data) != "undefined") {
              for (var j = 0, len2 = bus.data.length; j < len2; ++j) {
                if (bus.data[j].CurrentStation == station.data[i].Name) {
                  station.data[i].BusNumber = station.data[i].BusNumber + "  \n " + bus.data[j].BusNumber;
                  station.data[i].LastPosition = bus.data[j].LastPosition;
                }
              }
            }
          }
        }
        that.setData({
          stations: station
        })

        that.setData({
          refreshStatus: 0
        })

        if (n == 1) {
          wx.stopPullDownRefresh()
          wx.showToast({
            title: '刷新成功',
            icon: 'none',
            duration: 800,
          })
        }
        wx.hideNavigationBarLoading();
      },
      fail: function (res) {
        console.log(res)
        wx.hideNavigationBarLoading();
        wx.showToast({
          title: res.errMsg,
          icon: 'none',
        })

        that.setData({
          refreshStatus: 0
        })
      }
    })
  },

  changeLine: function (e) {
    var that = this;
    var cacheLineList = wx.getStorageSync(that.data.name);
    if (typeof (cacheLineList) == "undefined" || cacheLineList == "") {
      var timestamp = Date.parse(new Date());
      timestamp = timestamp / 1000;
      wx.request({
        url: 'https://api-test.diary.biku8.com/h5/BusQuery',
        method: 'get',
        data: {
          handlerName: 'GetLineList',
          lineName: that.data.name,
          _: timestamp
        },
        success: function (res) {
          console.log(res.data);
          that.setChangeInfo(res.data);
          if (typeof (res.data) != "undefined") {
            wx.setStorage({
              key: that.data.name,
              data: res.data,
            })
          }
        },
        fail: function (res) {
          wx.showToast({
            title: res.errMsg,
            icon: 'none',
          })
        }
      })
    } else {
      console.log("read line list from cache");
      console.log(cacheLineList);
      this.setChangeInfo(cacheLineList);
    }
  },

  setChangeInfo: function (obj) {
    if (typeof (obj) != "undefined" &&
      typeof (obj.data) != "undefined") {
      var tempId = this.data.id;
      for (var i = 0, len = obj.data.length; i < len; ++i) {
        var item = obj.data[i];
        if (typeof (obj) != "undefined") {
          var id = item.Id;
          if (tempId != id) {
            this.setData({
              id: item.Id,
              name: item.Name,
              begintime: item.BeginTime,
              endtime: item.EndTime,
              price: item.Price,
              tostation: item.ToStation,
              fromstation: item.FromStation
            })
          }
        }
      }
      this.queryLine();
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.queryBusOnRoad(1);
  },
})
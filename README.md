 
# zhbus
抓包珠海公交查询 (微信 h5 ) api，实现的一个微信小程序，代码都是很简陋，主要是尝试接触小程序，思路是有的，只是js、css的语法耗很多时间，如果是 android 来实现，我觉得一个上午就能搞定。

## 1、关键字关联 ##
### url ###
http://www.zhbuswx.com/Handlers/BusQuery.ashx?
### 参数 ###

- handlerName （string类型，如：GetLineListByLineName）
- key= （string类型）
- _ = （long类型，怀疑是时间戳，不填好像也行）

## 2、线路查询 ##
### url ###
http://www.zhbuswx.com/Handlers/BusQuery.ashx?
### 参数 ###

- handlerName （string类型，如：GetStationList）
- lineId= （string类型）
- _ = （long类型，选填）

## 3、线路公交车查询 ##
### url ###
http://www.zhbuswx.com/Handlers/BusQuery.ashx?
### 参数 ###

- handlerName=（string类型，如：GetBusListOnRoad）
- lineName= （string类型）
- fromStation= （string类型）
- _ = （long类型，选填）



# 效果图
- 首页
![首页](https://raw.githubusercontent.com/behindeye/zhbus/master/pic/IMG_4669.PNG)
- 线路图
![线路图](https://raw.githubusercontent.com/behindeye/zhbus/master/pic/IMG_4670.PNG)
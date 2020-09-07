const { request } = require("../../request/index");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders:[],
    tabs: [
      {
        id: 0,
        value: "全部",
        isActive: true
      },
      {
        id: 1,
        value: "待付款",
        isActive: false
      },
      {
        id: 2,
        value: "待收货",
        isActive: false
      },
      {
        id: 3,
        value: "退款/退货",
        isActive: false
      }
    ],
  },


  onShow: function (options) {
    const token=wx.getStorageSync("token");
    if(!token){
      wx.navigateTo({
        url: '/pages/auth/index',
      });
      return
    }

    let pages= getCurrentPages();
    let currentPage=pages[pages.length-1]
    const {type}=currentPage.options
    this.changeTitleByIndex(type-1)
    this.getOrders(type)
  },
  // 获取列表的方法
  getOrders(type){
    request({url:"/my/orders/all",data:{type}})
    .then(res=>{
     this.setData({
        orders:res.orders.map(v=>({...v,create_time_cn:(new Date(v.create_time*1000).toLocaleString())})),   
     })
    })
  },
  // 根据标题索引来激活选中 标题数组
  changeTitleByIndex(index){
    let { tabs } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false)
    this.setData({
      tabs
    })
  },
  handleTabsItemChange(e) {
    const { index } = e.detail;
    this.changeTitleByIndex(index);
    this.getOrders(index+1)
  }

})
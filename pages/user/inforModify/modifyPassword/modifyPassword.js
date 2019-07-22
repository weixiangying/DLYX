// pages/user/inforModify/modifyPassword/modifyPassword.js

var network = require("../../../../utils/network.js");
var md5 = require("../../../../utils/md5.js");
const app = getApp();
var regMobile = /^1(3|4|5|7|8)\d{9}$/;
var regPassw = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,18}$/;


Page({
  data: {
    verifyCodeTime: "获取验证码",
    buttonDisable: false,
    showPassword: false,
    focus: false
  },
  //手机号
  phoneInputEvent: function (e) {
    this.setData({
      mobile: e.detail.value.replace(/^\s*|\s*$/, '')
    })
  },
  //验证码
  identify: function (e) {
    var that = this;
    var mobile = that.data.mobile;
    var c = 60;
    var intervalId = null;

    if (!regMobile.test(mobile)) {
      wx.showToast({
        title: '手机号不合法',
        image: '../../../../images/error.png',
        duration: 1000
      })
    }
    else {
      intervalId = setInterval(function () {
        c--;
        that.setData({
          verifyCodeTime: c + 's后重发',
          buttonDisable: true
        })
        if (c == 0) {
          clearInterval(intervalId);
          that.setData({
            verifyCodeTime: '获取验证码',
            buttonDisable: false
          })
        }
      }, 1000);

      that.sendCode(mobile);

    }
  },
  sendCode: function (mobile) {
    network.POST({
      url: 'v4/login/sendcode',
      params: {
        "mobile": mobile,
        "type": 2
      },
      success: function (res) {
        // console.log(res);
        wx.hideLoading();
        if (res.data.code == 200) {
          wx.showToast({
            title: '发送成功',
            duration: 1000
          })
        } else {
          wx.showToast({
            title: res.data.message,
            image: '../../../../images/error.png',
            duration: 1000
          })
        }
      },
      fail: function () {
        wx.hideLoading();
        wx.showToast({
          title: '服务器异常',
          image: '../../../../images/error.png',
          duration: 1000
        })
      }
    })
  },
  //密码
  modify_passw: function (e) {
    this.setData({
      modify_passw: e.detail.value.replace(/^\s*|\s*$/, '')
    })
  },
  //点击修改
  bindFormSubmit: function (e) {
    var that = this;
    // 手机号
    var phone = e.detail.value.modify_phone.replace(/^\s*|\s*$/, '');
    // 验证码
    var vcode = e.detail.value.modify_verifycode.replace(/^\s*|\s*$/, '');
    // 密码
    var password = e.detail.value.modify_passw.replace(/^\s*|\s*$/, '');

    if (!regMobile.test(phone)) {
      wx.showToast({
        title: '手机号不合法',
        image: '../../../../images/error.png',
        duration: 1000
      })
    }
    else if (password.length == 0) {
      wx.showToast({
        title: '新密码不能为空',
        image: '../../../../images/error.png',
        duration: 1000
      })
    }
    else if (!regPassw.test(password)) {
      wx.showModal({
        title: '提示',
        content: '密码6-18位，包含至少一个字母和一个数字',
        showCancel: false
      })
    }
    else if (vcode.length == 0) {
      wx.showToast({
        title: '请输入验证码',
        image: '../../../../images/error.png',
        duration: 1000
      })
    }
    else {
      
      network.POST({
        url: 'v4/login/update-pwd',
        params: {
          'mobile': phone,
          'password': md5.hexMD5(password),
          'code': vcode
        },
        success: function (res) {
          wx.hideLoading();
          // console.log(res);
          if (res.data.code == 200) {
            wx.showToast({
              title: '修改成功',
              duration: 1000,
              success: function () {
                wx.navigateBack({
                  delta: 1
                });
              }
            })
          } else {
            wx.showToast({
              title: res.data.message,
              image: '../../../../images/error.png',
              duration: 1000
            })
          }
        },
        fail: function () {
          wx.hideLoading();
          wx.showToast({
            title: '服务器异常',
            image: '../../../../images/error.png',
            duration: 1000
          })
        }
      })

    }

  },

  //点击密码图片
  passwordtab: function (e) {
    var that = this;
    var a = that.data.showPassword;
    that.setData({
      showPassword: !a,
      focus: true
    })
  }
})
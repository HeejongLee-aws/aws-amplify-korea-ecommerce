import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // itemPrice: null,
    deliveryPrice: 2500,
    currentCartItem: null,
    itemQty: null,
    sessionTotalPrice: null,
    memberTotalPrice: null,
    cartItemId: null,
    cartId: null,
    sessionCartId: null,
    memberCartItemData: null,
    sessionCartItemData: null,
    user: null,
    userDB: null,
    signedIn: false,
    payedComplete: false,
    cateClickItemData: null,/*클릭한 전시 카테고리 데이터*/
    productData: null,
    windowSize: {
      x: 0,
      y: 0
    }
  },
  getters: {
    // getItemPrice: state => {
    //   return state.itemPrice;
    // },
    getDeliveryPrice: state => {
      return state.deliveryPrice;
    },
    getCurrentCartItem: state => {
      return state.currentCartItem;
    },
    getItemQty: state => {
      return state.itemQty;
    },
    getSessionTotalPrice: state => {
      return state.sessionTotalPrice;
    },
    getMemberTotalPrice: state => {
      return state.memberTotalPrice;
    },
    getCartItemId: state => {
      return state.cartItemId;
    },
    getCartId: state => {
      return state.cartId;
    },
    getSessionCartId: state => {
      return state.sessionCartId;
    },
    getSessionCartItemData: state => {
      return state.sessionCartItemData;
    },
    getMemberCartItemData: state => {
      return state.memberCartItemData;
    },
    getUser: state => {
      return state.user;
    },
    getSignedIn: state => {
      return state.signedIn;
    },
    getUserDB: state => {
      return state.userDB;
    },
    getPayedComplete: state => {
      return state.payedComplete
    },
    getCateClickItemData: state => {
      return state.cateClickItemData;
    },
    getProductData: state => {
      return state.productData
    },
    getwindowSize: state => {
      return state.windowSize
    }
  },
  mutations: {
    // setItemPrice(state, itemPrice){
    //   state.itemPrice = itemPrice
    // },
    setDeliveryPrice(state, deliveryPrice){
      state.deliveryPrice = deliveryPrice
    },
    setCurrentCartItem(state, currentCartItem){
      state.currentCartItem = currentCartItem
    },
    setItemQty(state, itemQty){
      state.itemQty = itemQty
    },
    setSessionTotalPrice(state, sessionTotalPrice){
      state.sessionTotalPrice = sessionTotalPrice
    },
    setMemberTotalPrice(state, memberTotalPrice){
      state.memberTotalPrice = memberTotalPrice
    },
    setCartItemId(state, cartItemId){
      state.cartItemId = cartItemId
    },
    setCartId(state, cartId){
      state.cartId = cartId
    },
    setSessionCartId(state, sessionCartId){
      state.sessionCartId = sessionCartId
    },
    setSessionCartItemData(state, sessionCartItemData) {
      state.sessionCartItemData = sessionCartItemData
    },
    setMemberCartItemData(state, memberCartItemData) {
      state.memberCartItemData = memberCartItemData
    },
    setUser(state, user) {
      if(user != null)
        state.signedIn = true;
      else
        state.signedIn = false;
      state.user = user;
    },
    setUserDB(state, userDB) {
      state.userDB = userDB;
    },
    setPayedComplete(state, bool) {
      state.payedComplete = bool;
    },
    updateUserDestination(state, payload) {
      state.userDB.destination = payload
    },
    updateUserPoint(state, payload) {
      state.userDB.point = payload
    },
    setCateClickItemData(state, cateItm) {
      state.cateClickItemData = cateItm
    },
    setProductData(state, data) {
      state.productData = data
    },
    setWindowSize(state) {
      state.windowSize.x = window.innerWidth
      state.windowSize.y = window.innerHeight
    }
  },
  actions: {
  },
  modules: {
  }
})
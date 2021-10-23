<template>
  <div class="product">
    <!-- <h1>상품상세</h1> -->
    <v-container>
      <v-row>
        <v-col cols="5" align="center"><v-img :src="productData.productImg" max-width="275" min-height="150" aspect-ratio="1" position="center center"></v-img></v-col>
        <v-col cols="7" class="mt-5">
          <v-row no-gutters class="title font-weight-bold">{{productData.productName}}</v-row>
          <v-divider />
          <v-row v-if="getTenderPrice" no-gutters class="title font-weight-bold" style="color: red">{{productData.tenderPrice}}원</v-row>
          <div v-if="!getTenderPrice">
            <v-row no-gutters class="subtitle-2" style="text-decoration: line-through">{{productData.originalPrice}}원</v-row>
            <v-row no-gutters class="title font-weight-bold" style="color: red">{{productData.tenderPrice}}원</v-row>
          </div>
          <v-divider class="d-none d-sm-flex" />
          <!-- Hidden only on xs -->
          <div class="d-none d-sm-flex">
            <v-row no-gutters class="subtitle-2">{{calcDelivery()}}</v-row>
          </div>
          <v-divider class="d-none d-sm-flex"/>
          <div class="d-none d-sm-flex">
          <v-row no-gutters>
            <v-col class="mr-5" cols="8">
              <v-select v-model="item_select" label="옵션을 선택하세요." :items="items" 
              :item-text="item => item.itemName + '(+' + item.itemPrice + ')'" return-object @input="selectProd"></v-select>
              </v-col>
            <v-col cols="3">
              <v-text-field v-model.number="qty" id="prodcut_qty"
              prepend-icon="mdi-minus" append-outer-icon="mdi-plus"
              @click:prepend="minusQty" @click:append-outer="plusQty">
              </v-text-field>
            </v-col>
          </v-row>
          </div>
        </v-col>
      </v-row>
      <div>
        <v-divider class="d-flex d-sm-none" />
        <v-row no-gutters class="d-flex d-sm-none">
          <v-row no-gutters class="subtitle-2">{{calcDelivery()}}</v-row>
        </v-row>
        <v-divider class="d-flex d-sm-none" />
        <v-row no-gutters class="d-flex d-sm-none">
            <v-col class="mr-5" cols="8">
              <v-select v-model="item_select" label="옵션을 선택하세요." :items="items" 
              :item-text="item => item.itemName + '(+' + item.itemPrice + ')'" return-object @input="selectProd"></v-select>
              </v-col>
            <v-col cols="3">
              <v-text-field v-model.number="qty" id="prodcut_qty_"
              prepend-icon="mdi-minus" append-outer-icon="mdi-plus"
              @click:prepend="minusQty" @click:append-outer="plusQty">
              </v-text-field>
            </v-col>
          </v-row>
      </div>
      <v-row>
        <v-col>
          <v-card outlined v-for="(item, index) in select_prod" :key="item.id && item.itemName" class="mb-3">
            <v-card-title class="subtitle-1">
              <v-row no-gutters align="center">
                <v-col cols="4">옵션</v-col>
                <v-col cols="3">수량</v-col>
                <v-col cols="4">총 가격</v-col>
                <v-col cols="1"><v-btn small text @click="deleteProd(index)">X</v-btn></v-col>
              </v-row>
            </v-card-title>
            <v-card-text>
              <v-row no-gutters>
                <v-col cols="4">{{select_prod[index].itemName}}</v-col>
                <v-col cols="3">{{select_prod[index].itemQty}}개</v-col>
                <v-col cols="4"><span id="total_price">{{getTotalPrice(select_prod[index])}}</span>원</v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col><v-btn outlined color="primary" block x-large @click="addCartItem">장바구니 담기</v-btn></v-col>
        <v-snackbar v-model="cart_snackbar" :timeout="cart_snackbar_timeout">
          장바구니에 상품이 담겼습니다.
          <v-btn color="pink" text @click="goToCart">장바구니 보러가기</v-btn>
        </v-snackbar>
        <v-col><v-btn depressed color="primary" block x-large @click="directToOrder">바로 구매</v-btn></v-col>
        <v-snackbar v-model="directOrder_snackbar" :timeout="directOrder_snackbar_timeout">
          바로 구매는 로그인 후 이용해주시기 바랍니다.
          <v-btn color="pink" text @click="gotoLogin">로그인</v-btn>
        </v-snackbar>
      </v-row>
    </v-container>
  </div>
  
</template>


<script>
import { getProduct } from '@/graphql/queries.js'
import { createCart, createCartItem } from '@/graphql/mutations.js'
import { getMemberCartItem, getSessionCartItem } from '@/graphql/queries.js'

export default {
    name: 'Product',
    props: {
    },
    data() {
      return {
        productNo: String,
        productData: '',
        productItemData: [],

        item_select: {},
        items: [],
        qty: 1,
        select_prod: [],
        select_product_cnt: 0,

        cart_snackbar: false,
        cart_snackbar_timeout: 2000,

        directOrder_snackbar: false,
        directOrder_snackbar_timeout: 2000
      }
    },
    created() {
      this.getProductId()
    },
    computed: {
      getTenderPrice() {
        return this.productData.tenderPrice == this.productData.originalPrice ? true : false
      },
      getUser() {
        return this.$store.getters.getUser
      }
    },
    methods: {
      getProductId() {
        this.productNo = this.$route.params.productNo
        this.getProduct(this.productNo)
      },
      async getProduct(id) {
        const res = await this.$Amplify.API.graphql(this.$Amplify.graphqlOperation(getProduct, {id: id}))
        // console.log(res)
        this.productData = res.data.getProduct
        // console.log(this.productData)
        this.productItemData = res.data.getProduct.productItem.items
        this.getItemSelect(this.productItemData)
      },
      getItemSelect(Items) {
        for(let a=0;a<Items.length;a++) {
          this.items.push(Items[a])
        }
      },
      calcDelivery() {
        if(this.productData.tenderPrice < 50000) {
          return "2500원 (50000원 이상 구매 시 무료 배송)"
        } else {
          return "무료 배송 (50000원 이상 구매 시 무료 배송)"
        }
      },
      minusQty() {
        if(this.qty > 1)
          this.qty = this.qty-1
      },
      plusQty() {
        this.qty = this.qty+1
      },
      selectProd() {
        // console.log(this.item_select)
        const input = {
          id: this.item_select.id,
          itemName: this.item_select.itemName,
          itemPrice: this.item_select.itemPrice,
          itemQty: this.qty
        }

        this.select_prod.push(input)
        console.log(this.select_prod)
        this.select_product_cnt = this.select_prod.length
      },
      getTotalPrice(select) {
        return (this.productData.tenderPrice + select.itemPrice) *select.itemQty
      },
      deleteProd(index) {
        this.select_prod.splice(index, 1)
        this.select_product -= 1
        // console.log(index)
      },
      gotoLogin(){
        this.$router.push('/login')
      },
      directToOrder() {
        if(this.$store.getters.getSignedIn) {
          if(this.select_prod.length != 0) {
            let data = []

            for(let a=0;a<this.select_prod.length;a++) {
              let input = {
                productNo: this.productNo,
                productName: this.productData.productName,
                productType: this.productData.productType,
                productModelNo: this.productData.productModelNo,
                productImg: this.productData.productImg,
                itemNo: this.select_prod[a].id,
                itemName: this.select_prod[a].itemName,
                itemQty: this.select_prod[a].itemQty,
                itemPrice: this.getTotalPrice(this.select_prod[a]),
                discountPrice: this.productData.originalPrice - this.productData.tenderPrice
              }
              data[a] = input
              // console.log(data[a])
            }
            this.$store.commit('setProductData', data)
            this.$router.push('/order')
          }
        } else {
          this.directOrder_snackbar = true
        }
      },
      addCartItem() {
        if(this.select_prod.length != 0) { 
          if(this.$store.getters.getSignedIn) {
            //회원
            const memberId = this.$store.getters.getUser.username;
            if(this.$store.getters.getCartId) {
              //카트 존재
              this.createCartItem(this.$store.getters.getCartId, this.select_prod)
            } else { 
              //카트 없음
              this.createCart(memberId, 'MEMBER', 'setCartId')
            }
          } else {
            //비회원
            if(this.$store.getters.getSessionCartId) {
              //카트 존재
              this.createCartItem(this.$store.getters.getSessionCartId, this.select_prod)
            } else {
              //카트 없음
              this.createCart(null, 'SESSION', 'setSessionCartId')
            }
          }
          this.cart_snackbar = true
        }
      },
      createCart(id, type, setCart) {
        let createCartParam;

        if(type == 'MEMBER') {
          createCartParam = {
            cartMemberId: id,
            cartType: type,
            cartName: id + "cart"
          }
        } else {
          createCartParam = {
            cartType: type,
            cartName: id + "cart"
          }
        }

        this.$Amplify.API.graphql(this.$Amplify.graphqlOperation(createCart, {input: createCartParam})).then((res) => {
          const newCartId = res.data.createCart.id;
          this.$store.commit(setCart, newCartId);
          this.createCartItem(newCartId, this.select_prod)
        });
      },
      createCartItem(cartId, selectProduct) {
        for(let a=0;a<selectProduct.length;a++) {
          const createCartItemParam = {
            cartItemCartId: cartId,
            productImg: this.productData.productImg,
            productNo: this.productNo,
            itemNo: selectProduct[a].id,
            productType: this.productData.productType,
            packageNo: this.productData.productModelNo,
            sellerId:"Glyde",
            productName: this.productData.productName,
            itemName: selectProduct[a].itemName,
            itemPrice: this.getTotalPrice(selectProduct[a]),
            itemQty: selectProduct[a].itemQty,
            cartItemInfo: this.setCartItemInfo(this.productData, selectProduct[a]),
            }

          this.$Amplify.API.graphql(this.$Amplify.graphqlOperation(createCartItem, {input: createCartItemParam})).then((res) => {
            console.log(res);
            this.saveToCartData()
          });
        }
      },
      saveToCartData() {
        let currentCartItemTemps;
        let currentItemQty;

        if(this.$store.getters.getSignedIn){
          let id = this.$store.getters.getUser.username;
          this.$Amplify.API.graphql(this.$Amplify.graphqlOperation(getMemberCartItem, {id:id})).then((res) => {
              currentCartItemTemps = res.data.getMember.cart.items[0].cartItems.items
              this.$store.commit('setCurrentCartItem', currentCartItemTemps)
              currentItemQty = currentCartItemTemps.length
              this.$store.commit('setItemQty', currentItemQty)
          });
        } else {
          let sessionCartId = this.$store.getters.getSessionCartId;
          this.$Amplify.API.graphql(this.$Amplify.graphqlOperation(getSessionCartItem, {id:sessionCartId})).then((res) => {
              currentCartItemTemps = res.data.getCart.cartItems.items
              this.$store.commit('setCurrentCartItem', currentCartItemTemps)
              currentItemQty = currentCartItemTemps.length
              this.$store.commit('setItemQty', currentItemQty)
          }); 
        }
      },
      setCartItemInfo(data, select) {
        return "{\"productImg\":\""+ data.imgSrc +"\", \"productNo\":\""+ this.productNo 
          +"\", \"itemNo\":\""+ select.id +"\", \"productType\":\"UNIT\", \"packageNo\":\""+ data.productModelNo 
          +"\", \"sellerId\":\"Glyde\", \"productName\":\""+ data.productName +"\", \"itemName\":\""+ select.itemName
          +"\", \"itemPrice\":"+ this.getTotalPrice(select) +",\"itemDiscount\":"+(data.originalPrice-data.tenderPrice)+"}"
      },
      goToCart() {
        this.cart_snackbar = false
        this.$router.push('/cart')
      }
    }
}
</script>

<style>

#prodcut_qty {
  text-align: center;
}

#prodcut_qty_ {
  text-align: center;
}

#total_price {
  color: crimson;
}

</style>
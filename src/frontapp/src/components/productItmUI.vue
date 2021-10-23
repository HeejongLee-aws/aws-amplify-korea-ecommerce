<template>
  <div>
     <v-card @click.native="goProductDetail()">
        <v-img :src="productinfo.imgSrc" height="220" aspect-ratio="1"></v-img>
        <v-card-title class="justify-center">{{productinfo.productName}}</v-card-title>
        <v-card-subtitle>{{productinfo.tenderPrice}}원</v-card-subtitle>
        <v-col align="right">
          <!-- <v-btn depressed dark @click.stop="addCart_dialog = true" color="#61caef"><v-icon>mdi-cart</v-icon></v-btn> -->
          <v-btn depressed dark @click.stop="addCartItem()" color="#61caef"><v-icon>mdi-cart</v-icon></v-btn>
        </v-col>
        <!-- <v-dialog v-model="addCart_dialog">
          <v-card>
            <v-card-title class="title">상품을 담겠습니까?</v-card-title>
            <v-card-actions>
              <v-spacer />
              <v-btn color="grey darken-1" text @click="addCart_dialog = false">아니오</v-btn>
              <v-btn color="red darken-1" text @click.stop="addCartItem(),addCart_dialog = false, addCart_confirm_dialog = true">예</v-btn>
              <v-dialog v-model="addCart_confirm_dialog">
                <v-card>
                <v-card-title class="title">장바구니에 담겼습니다.</v-card-title>
                  <v-card-actions>
                    <v-spacer />
                    <v-btn color="secondary" text @click="addCart_confirm_dialog = false">확인</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-card-actions>
          </v-card>
        </v-dialog> -->
      </v-card>
  </div>
  
</template>


<script>
import { createCart, createCartItem } from '@/graphql/mutations.js'
import { getMemberCartItem, getSessionCartItem } from '@/graphql/queries.js'

export default {
    name: 'productItmUI',
    props: ['productinfo'],
    components: {
    },
    data: () => {
      return{
        addCart_confirm_dialog: false,
        addCart_dialog: false,
        currentCartItemTemps:[],
        currentItemQty:''
      }
    },
    methods: {
      goProductDetail() {
        // console.log(this.productinfo)
         this.$router.push({name: 'productDetail', params:{ productNo : this.productinfo.productNo }})
      },
      addCartItem(){
        if(this.$store.getters.getSignedIn){
          this.createMemberCart();
        } else {
          this.createSessionCart();
          }
      },
      saveToCartData(){
            if(this.$store.getters.getSignedIn){
            let id = this.$store.getters.getUser.username;
            this.$Amplify.API.graphql(this.$Amplify.graphqlOperation(getMemberCartItem, {id:id})).then((res) => {
                this.$store.commit('setMemberCartItemData', res.data.getMember.cart.items[0].cartItems.items)
                // console.log(this.$store.getters.getMemberCartItemData);
                this.currentCartItemTemps = this.$store.getters.getMemberCartItemData
                this.$store.commit('setCurrentCartItem', this.currentCartItemTemps)
                this.currentItemQty = this.currentCartItemTemps.length
                this.$store.commit('setItemQty', this.currentItemQty)
            });
            } else {
                let sessionCartId = this.$store.getters.getSessionCartId;
                this.$Amplify.API.graphql(this.$Amplify.graphqlOperation(getSessionCartItem, {id:sessionCartId})).then((res) => {
                    this.$store.commit('setSessionCartItemData', res.data.getCart.cartItems.items)
                    // console.log(this.$store.getters.getSessionCartItemData);
                    this.currentCartItemTemps = this.$store.getters.getSessionCartItemData
                    this.$store.commit('setCurrentCartItem', this.currentCartItemTemps)
                    this.currentItemQty = this.currentCartItemTemps.length
                    this.$store.commit('setItemQty', this.currentItemQty)
                }); 
            }
      },
      createMemberCart(){
        const cartId = this.$store.getters.getCartId;
        const memberId = this.$store.getters.getUser.username;
        const createCartParam = {
          cartMemberId:memberId,
          cartType:`MEMBER`,
          cartName:memberId + "cart"
        }
        const createCartItemParam = {
          cartItemCartId:cartId,
          productImg:this.productinfo.imgSrc,
          productNo:this.productinfo.productNo,
          itemNo:this.productinfo.itemNo,
          productType:`UNIT`,
          packageNo:this.productinfo.packageNo,
          sellerId:"Glyde",
          productName:this.productinfo.productName,
          itemName:this.productinfo.itemName,
          itemPrice:this.productinfo.tenderPrice,
          itemQty:1,
          cartItemInfo: this.setCartItemInfo(this.productinfo)
          }
          if(cartId != null){
          this.$Amplify.API.graphql(this.$Amplify.graphqlOperation(createCartItem, {input: createCartItemParam})).then((res) => {
            console.log(res.data);
            this.saveToCartData()
            });
          } else if(cartId == null) {
              this.$Amplify.API.graphql(this.$Amplify.graphqlOperation(createCart, {input: createCartParam})).then((res) => {
              console.log(res.data)
              const newCartId = res.data.createCart.id;
              this.$store.commit('setCartId', newCartId);
              const createCartItemParam = {
                cartItemCartId:newCartId,
                productImg:this.productinfo.imgSrc,
                productNo:this.productinfo.productNo,
                itemNo:this.productinfo.itemNo,
                productType:`UNIT`,
                packageNo:this.productinfo.packageNo,
                sellerId:"Glyde",
                productName:this.productinfo.productName,
                itemName:this.productinfo.itemName,
                itemPrice:this.productinfo.tenderPrice,
                itemQty:1,
                cartItemInfo: this.setCartItemInfo(this.productinfo)
                }
                if(newCartId != null){
                  this.$Amplify.API.graphql(this.$Amplify.graphqlOperation(createCartItem, {input: createCartItemParam})).then((res) => {
                    console.log(res.data);
                    this.saveToCartData()
                  });
                }
              });
          }
      },
      createSessionCart(){
        const sessionCartId = this.$store.getters.getSessionCartId;
        const createSessionCartParam = {
          cartType:`SESSION`,
          cartName:"Session Cart"
        }
        const createSessionCartItemParam = {
          cartItemCartId:sessionCartId,
          productImg:this.productinfo.imgSrc,
          productNo:this.productinfo.productNo,
          itemNo:this.productinfo.itemNo,
          productType:`UNIT`,
          packageNo:this.productinfo.packageNo,
          sellerId:"Glyde",
          productName:this.productinfo.productName,
          itemName:this.productinfo.itemName,
          itemPrice:this.productinfo.tenderPrice,
          itemQty:1,
          cartItemInfo: this.setCartItemInfo(this.productinfo)
          }
          if(sessionCartId != null){
          this.$Amplify.API.graphql(this.$Amplify.graphqlOperation(createCartItem, {input: createSessionCartItemParam})).then((res) => {
            console.log(res.data);
            this.saveToCartData()
            });
          } else if(sessionCartId == null) {
              this.$Amplify.API.graphql(this.$Amplify.graphqlOperation(createCart, {input: createSessionCartParam})).then((res) => {
              console.log(res.data)
              const newSessionCartId = res.data.createCart.id;
              this.$store.commit('setSessionCartId', newSessionCartId);
              const createCartItemParam = {
                cartItemCartId:newSessionCartId,
                productImg:this.productinfo.imgSrc,
                productNo:this.productinfo.productNo,
                itemNo:this.productinfo.itemNo,
                productType:`UNIT`,
                packageNo:this.productinfo.packageNo,
                sellerId:"Glyde",
                productName:this.productinfo.productName,
                itemName:this.productinfo.itemName,
                itemPrice:this.productinfo.tenderPrice,
                itemQty:1,
                cartItemInfo: this.setCartItemInfo(this.productinfo)
                }
                if(newSessionCartId != null){
                  this.$Amplify.API.graphql(this.$Amplify.graphqlOperation(createCartItem, {input: createCartItemParam})).then((res) => {
                    this.saveToCartData()
                    console.log(res.data)
                  });
                }
              });
          }
      },
      goCart() {
        return this.$router.push('/cart')
      },
      setCartItemInfo(data) {
        return "{\"productImg\":\""+ data.imgSrc +"\", \"productNo\":\""+ data.productNo 
          +"\", \"itemNo\":\""+ data.itemNo +"\", \"productType\":\"UNIT\", \"packageNo\":\""+ data.packageNo 
          +"\", \"sellerId\":\"Glyde\", \"productName\":\""+ data.productName +"\", \"itemName\":\""+ data.itemName
          +"\", \"itemPrice\":"+ data.tenderPrice +",\"itemDiscount\":"+(data.originalPrice-data.tenderPrice)+"}"
      }
   },
   created(){
   }
}
</script>
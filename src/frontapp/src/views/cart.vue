<template>
    <div class="cart">
        <v-tabs background-color="#61caef" dark> 
            <v-tab v-if="this.$store.getters.getSignedIn" title>일반배송({{this.$store.getters.getItemQty}})</v-tab>
            <v-tab v-if="!this.$store.getters.getSignedIn" title>일반배송({{this.$store.getters.getItemQty}})</v-tab>
                <v-tab-item>
                    <div v-if="this.$store.getters.getSignedIn">
                        <div v-if="currentCartItemTemps.length > 0">
                            <v-row no-gutters>
                                <v-col align="left">
                                    <v-row>
                                        <v-col>
                                            <v-col>
                                                <h5 class="ml-3" v-if="this.$store.getters.getSignedIn">일반배송상품 ({{this.$store.getters.getItemQty}})개</h5>
                                                <v-divider></v-divider>
                                                <v-container fluid>
                                                <v-card tile outlined dark color="#61caef" class="mr-11" v-if="auto" :width="calcWidth()">
                                                    <v-row no-gutters dense class="mt-2">
                                                        <v-col class="ml-12">
                                                        </v-col>
                                                        <v-col>
                                                            <h5 class="ml-2">상품이름</h5>
                                                        </v-col>
                                                        <v-col>
                                                            <h5 class="ml-4">옵션</h5>
                                                        </v-col>
                                                        <v-col>
                                                            <h5 class="ml-5">수량</h5>
                                                        </v-col>
                                                        <v-col>
                                                            <h5 class="ml-4">가격</h5>
                                                        </v-col>
                                                    </v-row>
                                                </v-card>
                                                <div v-for="(currentCartItemTemp,index) in currentCartItemTemps" :key="currentCartItemTemp.id">
                                                    <v-row>
                                                        <v-col>
                                                            <cartItmUI :content="currentCartItemTemp" :index="index"/>
                                                        </v-col>
                                                        <v-row>
                                                            <div>
                                                                <v-btn tile text depressed x-small class="mt-3" @click="deleteCartItem(currentCartItemTemp)">
                                                                    <v-icon color="blue-grey">mdi-delete</v-icon>
                                                                </v-btn>
                                                            </div>
                                                        </v-row>
                                                    </v-row>
                                                </div>
                                                </v-container>
                                            </v-col>
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-row>
                            <orderSummaryUI />
                        </div>
                        <div v-if="currentCartItemTemps.length <= 0">
                            <v-row>
                                <v-col>
                                    <v-img alt="Emptylogo" src="../assets/emptycart.jpg"></v-img>
                                    <h5>장바구니가 비었어요.</h5>
                                    <v-col></v-col>
                                    <v-btn @click="gotoshop" block color="#61caef" tile depressed><h6 class="mt-2" style="color:white">쇼핑하러가기</h6></v-btn>
                                </v-col>
                            </v-row>
                        </div>
                    </div>
                    <div v-if="!this.$store.getters.getSignedIn">
                        <div v-if="currentCartItemTemps.length > 0">
                            <v-row no-gutters>
                                <v-col align="left">
                                    <v-row>
                                        <v-col>
                                            <v-col>
                                                <h5 class="ml-3" v-if="!this.$store.getters.getSignedIn">일반배송상품 ({{this.$store.getters.getItemQty}})개</h5>
                                                <v-divider></v-divider>
                                                <div v-for="(currentCartItemTemp,index) in currentCartItemTemps" :key="currentCartItemTemp.id">
                                                    <v-row>
                                                        <v-col>
                                                            <cartItmUI :content="currentCartItemTemp" :index="index"/>
                                                        </v-col>
                                                        <v-row>
                                                            <div>
                                                                <v-btn tile text depressed x-small class="mt-3" @click="deleteCartItem(currentCartItemTemp)">
                                                                    <v-icon color="blue-grey">mdi-delete</v-icon>
                                                                </v-btn>
                                                            </div>
                                                        </v-row>
                                                    </v-row>
                                                </div>
                                            </v-col>
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-row>
                            <orderSummaryUI />
                        </div>
                        <div v-if="currentCartItemTemps.length <= 0">
                            <v-row>
                                <v-col>
                                    <v-img alt="Emptylogo" src="../assets/emptycart.jpg"></v-img>
                                    <h5>장바구니가 비었어요.</h5>
                                    <v-col></v-col>
                                    <v-btn @click="gotoshop" block color="#61caef" tile depressed><h6 class="mt-2" style="color:white">쇼핑하러가기</h6></v-btn>
                                </v-col>
                            </v-row>
                        </div>
                    </div>
                </v-tab-item>
            <v-tab>픽업</v-tab>
                <v-tab-item>
                    <v-col>픽업목록입니다.</v-col>
                </v-tab-item>
        </v-tabs>
                            
        <v-footer class="mt-12" color="white" align="left">
            <v-card tile outlined width="1384px">
                <div class="mr-2">
                    <v-row >
                        <v-col class="ml-3" style="color:grey">
                            <h6 class="mt-2">※ 장바구니 이용안내</h6>
                            <v-divider></v-divider>
                            <h6>1. 비회원은 로그인 후에 주문하실 수 있습니다.</h6>
                            <h6>2. 상품수량은 <v-icon>mdi-minus</v-icon>,<v-icon>mdi-plus</v-icon> 를 통해 변경하실 수 있습니다.</h6>
                            <h6>3. 상품별로 옵션을 선택하실 수 있습니다.</h6>
                            <h6>4. 장바구니 목록에서 상품을 삭제하시려면 <v-icon>mdi-delete</v-icon> 버튼을 누르시면 됩니다.</h6>
                        </v-col>
                    </v-row>
                </div>
            </v-card>
        </v-footer>
    </div>
</template>


<script>
import { getMemberCartItem, getSessionCartItem } from '@/graphql/queries.js'
import { deleteCartItem } from '@/graphql/mutations.js'
import { components } from 'aws-amplify-vue'
import orderSummaryUI from '../components/orderSummaryUI'
import cartItmUI from '../components/cartItmUI'


export default {
    name: 'Cart',
    components: {
        orderSummaryUI,
        cartItmUI,
        ...components
        },
        data () {
            return {
                itemLists:[],
                itemTemp:[],
                itemPrice:'',
                sessionItemPrice:'',
                memberItemPrice:'',
                currentCartItemTemps:[]
            }
        },
    methods: {
        calcWidth(){
            if(this.$store.getters.getwindowSize.x > 600){
                var a = "800px"
                    return a
            }
        },
        sort() {
            return this.currentCartItemTemps.slice().sort(function (a, b) {
                return (a.createTime > b.createTime) ? -1 : 1;
            })
        },
        savePriceToCartData(){
            if(this.$store.getters.getSignedIn){
            let id = this.$store.getters.getUser.username;
            this.$Amplify.API.graphql(this.$Amplify.graphqlOperation(getMemberCartItem, {id:id})).then((res) => {
                this.$store.commit('setMemberCartItemData', res.data.getMember.cart.items[0].cartItems.items)
                const getData = this.$store.getters.getMemberCartItemData;
                let a;
                for(a=0; a<getData.length; a++){ 
                    this.memberItemPrice += getData[a].itemPrice
                    var b = parseFloat(this.memberItemPrice);
                    this.memberItemPrice = b;
                    this.$store.commit('setMemberTotalPrice', this.memberItemPrice)
                    // console.log(this.$store.getters.getMemberTotalPrice)
                    if(this.$store.getters.getMemberTotalPrice < 50000){
                        this.$store.commit('setDeliveryPrice', 2500)
                    } else if(this.$store.getters.getMemberTotalPrice >= 50000){
                        this.$store.commit('setDeliveryPrice', 0)
                    }
                }
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
                    const getData = this.$store.getters.getSessionCartItemData;
                    let c;
                    for(c=0; c<getData.length; c++){
                        this.sessionItemPrice += getData[c].itemPrice
                        var d = parseFloat(this.sessionItemPrice);
                        this.sessionItemPrice = d;
                        this.$store.commit('setSessionTotalPrice', this.sessionItemPrice)
                        // console.log(this.$store.getters.getSessionTotalPrice)
                        if(this.$store.getters.getSessionTotalPrice < 50000){
                            this.$store.commit('setDeliveryPrice', 2500)
                        } else if(this.$store.getters.getSessionTotalPrice >= 50000){
                            this.$store.commit('setDeliveryPrice', 0)
                        }
                    }
                    // console.log(this.$store.getters.getSessionCartItemData);
                    this.currentCartItemTemps = this.$store.getters.getSessionCartItemData
                    this.$store.commit('setCurrentCartItem', this.currentCartItemTemps)
                    this.currentItemQty = this.currentCartItemTemps.length
                    this.$store.commit('setItemQty', this.currentItemQty)
                });
            }
        },
        deleteCartItem(data){
            if(this.$store.getters.getSignedIn){
                const deleteCartItemParam = {
                    id:data.id
                    };
                this.$Amplify.API.graphql(this.$Amplify.graphqlOperation(deleteCartItem, {input:deleteCartItemParam})).then((res) => {
                    console.log(res.data);
                    this.memberItemPrice = 0
                    this.savePriceToCartData();
                    });
                    alert('상품이 삭제되었습니다.')
            } else {
                const deleteCartItemParam = {
                    id:data.id
                    };
                this.$Amplify.API.graphql(this.$Amplify.graphqlOperation(deleteCartItem, {input:deleteCartItemParam})).then((res) => {
                    console.log(res.data);
                    this.sessionItemPrice = 0
                    this.savePriceToCartData();
                    });
                    alert('상품이 삭제되었습니다.')
            }
        },
        getCartItem(){
            if(this.$store.getters.getSignedIn){
                let id = this.$store.getters.getUser.username;
                this.$Amplify.API.graphql(this.$Amplify.graphqlOperation(getMemberCartItem, {id:id})).then((res) => {
                    this.$store.commit('setCurrentCartItem', res.data.getMember.cart.items[0].cartItems.items)
                    this.currentCartItemTemps = this.$store.getters.getCurrentCartItem;
                    this.currentCartItemTemps.sort()
                    this.$store.commit('setSessionCartItemData', null)
                    this.$store.commit('setSessionCartId', null)
                    console.log(this.$store.getters.getCurrentCartItem)
                    });
            } else {
                let sessionCartId = this.$store.getters.getSessionCartId;
                this.$Amplify.API.graphql(this.$Amplify.graphqlOperation(getSessionCartItem, {id:sessionCartId})).then((res) => {
                    console.log(res)
                    this.$store.commit('setCurrentCartItem', res.data.getCart.cartItems.items)
                    this.currentCartItemTemps = this.$store.getters.getCurrentCartItem;
                    });
            }
        },
        gotoshop(){
            this.$router.push('/')
        }
    },
    computed: {
        auto(){
            return this.$store.getters.getwindowSize.x < 600 ? false : true
        }
    },
    created() {
        this.getCartItem();
    }
}

</script>

<style lang="css">
  * {
    margin: 0;
    padding: 0;
    font-family: 'Karla', sans-serif;
  }

</style>
<template>
    <div>
        <!-- Hidden only on xs -->
        <v-card tile outlined dark color="#61caef" class="d-none d-sm-flex" :width="calcWidth()">
            <v-row no-gutters dense>
                <v-row align="center">
                    <v-col>
                        <v-img
                        :src="content.productImg"
                        class="ml-12"
                        gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                        height="100px"
                        width="100px"
                        ></v-img>
                    </v-col>
                    <v-col class="mt-3" align="center">
                        <div class="fix_productName">
                            <h6>{{content.productName}}</h6>
                        </div>           
                    </v-col>
                    <v-col class="mt-3">
                        <div class="fix">
                            <v-select
                            v-model="selectedItem"
                            :items="itemLists"
                            :item-text="item => item.itemName + '(+' + item.itemPrice + ')'"
                            label="옵션을 선택하세요."
                            return-object
                            @change="updateItemName"></v-select>
                        </div>
                    </v-col>
                    <v-col class="mt-3">
                        <div class="fix_qtyBtn">
                            <v-row dense>
                                <v-btn tile depressed text x-small color="white" @click="decrement()" :disabled="content.itemQty <=1">
                                    <v-icon>mdi-minus</v-icon>
                                </v-btn>
                                <h6 class="mt-1">{{content.itemQty}}</h6>
                                <v-btn tile depressed text x-small color="white" @click="increment()">
                                    <v-icon>mdi-plus</v-icon>
                                </v-btn>
                            </v-row>
                        </div>
                    </v-col>
                    <v-col class="mt-3">
                        <div>
                            <h6>{{ this.$store.getters.getCurrentCartItem[index].itemPrice }}원</h6>
                        </div>
                    </v-col>
                </v-row>
            </v-row>
        </v-card>
        <!-- Visible only on xs -->
        <v-card tile outlined dark color="#61caef" class="d-flex d-sm-none" :width="calcWidth()">
            <v-row no-gutters dense>
                <v-row dense class="mt-2 mb-2">
                    <v-col>
                        <v-img
                        class="ml-6 mt-2"
                        :src="content.productImg"
                        gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                        height="100px"
                        width="100px"
                        ></v-img>
                        <v-row dense align="center" class="ml-7 mt-3">
                            <v-btn tile depressed text x-small color="white" @click="decrement()" :disabled="content.itemQty <=1">
                                <v-icon>mdi-minus</v-icon>
                            </v-btn>
                            <h6 class="mt-3">{{content.itemQty}}</h6>
                            <v-btn tile depressed text x-small color="white" @click="increment()">
                                <v-icon>mdi-plus</v-icon>
                            </v-btn>
                        </v-row>
                    </v-col>
                    <v-col align="left">
                        <h5 class="mt-3 mb-6">{{content.productName}}</h5>
                        <v-select
                            class="fix_selectItem"
                            v-model="selectedItem"
                            :items="itemLists"
                            :item-text="item => item.itemName + '(+' + item.itemPrice + ')'"
                            label="옵션을 선택하세요."
                            return-object
                            @change="updateItemName">
                        </v-select>
                        <v-card tile outlined class="fix_selectItem mb-2" align="center">
                            <h6 class="mt-2">{{ this.$store.getters.getCurrentCartItem[index].itemPrice }}원</h6>
                        </v-card>
                    </v-col>
                </v-row>
            </v-row>
        </v-card>
    </div>
</template>

<script>
import { updateCartItem } from '@/graphql/mutations.js'
import { getMemberCartItem, getSessionCartItem, getProduct, getProductItem } from '@/graphql/queries.js'

export default {
    name: 'CartItm',
    props:['content', 'index'],
    components:{
    },
    data: () => {
        return{
            tenderPrice:0,
            selectedItem:'',
            currentItemQty:'',
            memberItemPrice:'',
            sessionItemPrice:'',
            itemLists:[],
            itemDiscountTemps:[],
            currentCartItemTemps:[],
        }
    },
    methods: {
        calcWidth(){
            if(this.$store.getters.getwindowSize.x > 600){
                var b = "800px"
                    return b
            } else {
                var c = "285px"
                    return c
            }
        },
        updateItemName(){
            if(this.$store.getters.getSignedIn){
                const updateMemberCartItemParam = {
                    id:this.content.id,
                    itemName:this.selectedItem.itemName,
                    itemNo:this.selectedItem.id,
                    itemPrice:(this.tenderPrice + this.selectedItem.itemPrice) * this.content.itemQty,
                    cartItemInfo: this.setCartItemInfo(this.content)
                    };
                this.$Amplify.API.graphql(this.$Amplify.graphqlOperation(updateCartItem, {input:updateMemberCartItemParam})).then((res) => {
                    console.log(res.data);
                    this.memberItemPrice = 0
                    this.savePriceToMemberCartData();
                });
            } else {
                const updateSessionCartItemParam = {
                    id:this.content.id,
                    itemName:this.selectedItem.itemName,
                    itemNo:this.selectedItem.id,
                    itemPrice:(this.tenderPrice + this.selectedItem.itemPrice) * this.content.itemQty,
                    cartItemInfo: this.setCartItemInfo(this.content)
                    };
                this.$Amplify.API.graphql(this.$Amplify.graphqlOperation(updateCartItem, {input:updateSessionCartItemParam})).then((res) => {
                    console.log(res.data);
                    this.memberItemPrice = 0
                    this.savePriceToMemberCartData();
                });
            }
        },
        increment(){
            if(this.$store.getters.getSignedIn){
            const updateMemberCartItemParam = {
                id:this.content.id,
                itemQty:this.content.itemQty += 1,
                itemPrice:(this.tenderPrice + this.selectedItem.itemPrice) * this.content.itemQty
                };
            this.$Amplify.API.graphql(this.$Amplify.graphqlOperation(updateCartItem, {input:updateMemberCartItemParam})).then((res) => {
                console.log(res.data);
                this.memberItemPrice = 0;
                this.savePriceToMemberCartData();  
                });
            } else {
            const updateSessionCartItemParam = {
                id:this.content.id,
                itemQty:this.content.itemQty += 1,
                itemPrice:(this.tenderPrice + this.selectedItem.itemPrice) * this.content.itemQty
                };
            this.$Amplify.API.graphql(this.$Amplify.graphqlOperation(updateCartItem, {input:updateSessionCartItemParam})).then((res) => {
                console.log(res.data);
                this.sessionItemPrice = 0;
                this.savePriceToMemberCartData(); 
                });
            }
        },
        decrement(){
            if(this.$store.getters.getSignedIn){
                const updateCartItemParam = {
                    id:this.content.id,
                    itemQty:this.content.itemQty -= 1,
                    itemPrice:(this.tenderPrice + this.selectedItem.itemPrice) * this.content.itemQty
                    };
                this.$Amplify.API.graphql(this.$Amplify.graphqlOperation(updateCartItem, {input:updateCartItemParam})).then((res) => {
                    this.memberItemPrice = 0;
                    console.log(res.data);
                    this.savePriceToMemberCartData();  
                    });
            } else {
                const updateCartItemParam = {
                    id:this.content.id,
                    itemQty:this.content.itemQty -= 1,
                    itemPrice:(this.tenderPrice + this.selectedItem.itemPrice) * this.content.itemQty
                    };
                this.$Amplify.API.graphql(this.$Amplify.graphqlOperation(updateCartItem, {input:updateCartItemParam})).then((res) => {
                    this.sessionItemPrice = 0;
                    console.log(res.data);
                    this.savePriceToMemberCartData();
                    });
            }
        },
        savePriceToMemberCartData(){
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
        getProductItemName(){
            this.$Amplify.API.graphql(this.$Amplify.graphqlOperation(getProduct, {id: this.content.productNo})).then((res) => {
                var b = res.data.getProduct.productItem.items
                this.tenderPrice = res.data.getProduct.tenderPrice
                this.itemDiscountTemps = res.data.getProduct
                this.itemLists = b
                this.getDefaulProductItemData();
            });
        },
        getDefaulProductItemData(){
            this.$Amplify.API.graphql(this.$Amplify.graphqlOperation(getProductItem, {id: this.content.itemNo})).then((res) => {
                this.selectedItem = res.data.getProductItem
            });
        },
        setCartItemInfo(data) {
        return "{\"productImg\":\""+ data.imgSrc +"\", \"productNo\":\""+ data.productNo 
          +"\", \"itemNo\":\""+ data.itemNo +"\", \"productType\":\"UNIT\", \"packageNo\":\""+ data.packageNo 
          +"\", \"sellerId\":\"Glyde\", \"productName\":\""+ data.productName +"\", \"itemName\":\""+ this.selectedItem.itemName
          +"\", \"itemPrice\":"+ data.itemPrice +",\"itemDiscount\":"+(this.itemDiscountTemps.originalPrice-this.itemDiscountTemps.tenderPrice) +"}"
        }
    },
    computed: {
        currentCart(){
            return this.$store.getters.getMemberCartItemData;
        }
    },
    created(){
        this.getProductItemName();
    }
}
</script>

<style>
.fix_selectItem {
    width : 110px;
}

.fix {
	width : 110px;
}

.fix_qtyBtn {
    width : 100px;
}

.fix_productName {
	width : 100px;
}

</style>
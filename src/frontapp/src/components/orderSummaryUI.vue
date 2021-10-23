<template>
    <div>
        <v-col>
            <v-divider></v-divider>
            <v-row>
                <v-col class="ml-4" align="left"><h6 style="color:grey">단품합계</h6></v-col>
                <v-col class="mr-4" style="color:grey" align="right" v-if="this.$store.getters.getSignedIn"><h6>{{this.$store.getters.getMemberTotalPrice}}원</h6></v-col> <!--회원-->
                <v-col class="mr-4" style="color:grey" align="right" v-if="!this.$store.getters.getSignedIn"><h6>{{this.$store.getters.getSessionTotalPrice}}원</h6></v-col> <!--비회원-->
            </v-row>
            <v-row>
                <v-col class="ml-4" align="left"><h6 style="color:grey">단품할인합계</h6></v-col>
                <v-col class="mr-4" style="color:grey" align="right">- 0원</v-col>
            </v-row>
            <v-row>
                <v-col class="ml-4" align="left"><h6 style="color:grey">배송비합계</h6></v-col>
                <v-col class="mr-4" align="right" v-if="this.$store.getters.getSignedIn">
                    <h6 style="color:grey">+ {{this.$store.getters.getDeliveryPrice}}원</h6>
                </v-col>
                <v-col class="mr-4" align="right" v-if="!this.$store.getters.getSignedIn">
                    <h6 style="color:grey">+ {{this.$store.getters.getDeliveryPrice}}원</h6>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="ml-4" align="left"><h6 style="color:grey">주문할인합계</h6></v-col>
                <v-col class="mr-4" align="right"><h6 style="color:grey">- {{discounts}}원</h6></v-col>
            </v-row>
            <v-row>
                <v-col class="ml-4" align="left"><h4>총 주문금액</h4></v-col>
                <v-col class="mr-4" align="right" v-if="this.$store.getters.getSignedIn">
                    <h4>{{this.$store.getters.getMemberTotalPrice + this.$store.getters.getDeliveryPrice + discounts}}원</h4>
                </v-col>
                <v-col class="mr-4" align="right" v-if="!this.$store.getters.getSignedIn">
                    <h4>{{this.$store.getters.getSessionTotalPrice + this.$store.getters.getDeliveryPrice + discounts}}원</h4>
                </v-col>
            </v-row>
            <v-divider></v-divider>
            <h6 style="color:grey" align="right" class="mt-2">※ 50,000원 이상 구매 시 배송비 무료입니다.</h6>
        </v-col>
        <v-row v-if="this.$store.getters.getSignedIn">
            <v-col align="right">
                <v-btn depressed x-large class="mr-3" width="300px" color="blue-grey " @click="gotoHome">
                    <v-col align="center">
                        <h5 class="mt-1" style="color:white">계속 쇼핑하기</h5>
                    </v-col>
                </v-btn>
                <v-btn depressed x-large class="mr-3" width="300px" color="#61caef" @click.stop="gotoOrderSheet_dialog = true">
                    <v-col align="center">
                        <h5 class="mt-1" style="color:white">총 {{this.$store.getters.getMemberTotalPrice + this.$store.getters.getDeliveryPrice + discounts}}원 주문하기</h5>
                    </v-col>
                </v-btn>
                <v-dialog v-model="gotoOrderSheet_dialog">
                    <v-card>
                        <v-card-title v-if="this.$store.getters.getSignedIn" class="title">결제창으로 넘어가시겠습니까?</v-card-title>
                        <v-card-actions>
                            <v-spacer />
                            <v-btn text color="grey" @click="gotoOrderSheet_dialog = false">아니오</v-btn>
                            <v-btn text color="#61caef" @click="gotoOrder">예</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-col>
        </v-row>
        <v-row v-if="!this.$store.getters.getSignedIn">
            <v-col align="right">
                <v-btn depressed x-large class="mr-3" width="300px" color="grey" @click="gotoHome">
                    <v-col align="center">
                        <h5 class="mt-1" style="color:white">계속 쇼핑하기</h5>
                    </v-col>
                </v-btn>
                <v-btn depressed x-large class="mr-3" width="300px" color="#61caef" @click.stop="gotoOrderSheet_dialog = true">
                    <v-col align="center">
                        <h5 class="mt-1" style="color:white">총 {{this.$store.getters.getSessionTotalPrice + this.$store.getters.getDeliveryPrice + discounts}}원 주문하기</h5>
                    </v-col>
                </v-btn>
                <v-dialog v-model="gotoOrderSheet_dialog">
                    <v-card>
                        <v-card-title class="title">로그인 후에 이용해 주시기 바랍니다.<br>(비회원은 회원가입 후에 이용가능합니다.)</v-card-title>
                        <v-card-actions>
                            <v-spacer />
                            <v-btn text color="grey" @click="gotoOrderSheet_dialog = false">아니오</v-btn>
                            <v-btn text color="#61caef" @click="gotoLogin">예</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import { getMemberCartItem, getSessionCartItem } from '@/graphql/queries.js'
import { updateOrderSummary } from '@/graphql/mutations.js'

export default {
    components: {
    },
    data () {
        return {
            gotoOrderSheet_dialog: false,
            sessionItemPrice:'',
            memberItemPrice:'',

             //orderSummary 속성
             discounts: 0
        }
    },
    created() {
        this.getMemberCartItem();
    },
    computed: {
        UserInfo() {
            return this.$store.getters.getUser;
        }
    },
    methods: {
        calcCols() {
            if(this.$store.getters.getwindowSize.x < 600){
                return 1
            }
            else{
                return 5
            }
        },
        getTotalPrice(){
            //회원
            if(this.$store.getters.getSignedIn){
                let a;
                const getData = this.$store.getters.getMemberCartItemData;
                for(a=0; a < getData.length; a++){
                    this.memberItemPrice += getData[a].itemPrice
                    var b = parseFloat(this.memberItemPrice);
                    this.memberItemPrice = b;
                    this.$store.commit('setMemberTotalPrice', this.memberItemPrice)
                }
                if(this.$store.getters.getMemberTotalPrice < 50000){
                    this.$store.commit('setDeliveryPrice', 2500)
                } else if(this.$store.getters.getMemberTotalPrice >= 50000){
                    this.$store.commit('setDeliveryPrice', 0)
                }
            } else {  //비회원
                let c;
                const getData = this.$store.getters.getSessionCartItemData;
                for(c=0; c < getData.length; c++){
                    this.sessionItemPrice += getData[c].itemPrice
                    var d = parseFloat(this.sessionItemPrice);
                    this.sessionItemPrice = d;
                    this.$store.commit('setSessionTotalPrice', this.sessionItemPrice)
                }
                if(this.$store.getters.getSessionTotalPrice < 50000){
                    this.$store.commit('setDeliveryPrice', 2500)
                } else if(this.$store.getters.getSessionTotalPrice >= 50000){
                    this.$store.commit('setDeliveryPrice', 0)
                }
            }
        },
        getMemberCartItem(){
            if(this.$store.getters.getSignedIn){
                let id = this.$store.getters.getUser.username;
                this.$Amplify.API.graphql(this.$Amplify.graphqlOperation(getMemberCartItem, {id:id})).then((res) => {
                    this.$store.commit('setMemberCartItemData', res.data.getMember.cart.items[0].cartItems.items)
                    this.getTotalPrice();
                    });
            } else {
                let sessionCartId = this.$store.getters.getSessionCartId;
                this.$Amplify.API.graphql(this.$Amplify.graphqlOperation(getSessionCartItem, {id:sessionCartId})).then((res) => {
                    this.$store.commit('setSessionCartItemData', res.data.getCart.cartItems.items)
                    this.getTotalPrice();
                    });
            }
        },
        gotoOrder() {
            const final_totalPrice = parseFloat(this.memberItemPrice) + parseFloat(this.discounts) + parseFloat(this.$store.getters.getDeliveryPrice)
            const order_Summary = "{\"totalItemPrice\":"+this.$store.getters.getMemberTotalPrice+",\"itemsDiscount\":"+this.discounts+",\"deliveryPrice\":"+this.$store.getters.getDeliveryPrice+",\"finalPrice\":"+final_totalPrice+"}"
            // console.log(order_Summary)
 
            const input = {
                id: this.$store.getters.getCartId,
                orderSummary: order_Summary
            }

            this.$Amplify.API.graphql(this.$Amplify.graphqlOperation(updateOrderSummary, {input: input})).then((res) => {
                console.log(res)
                this.$store.commit('setProductData', null)
                this.$router.push('/order')
                });
        },
        gotoLogin(){
            this.$router.push('/signin')
        },
        gotoHome(){
            this.$router.push('/')
        }
    }
}
</script>

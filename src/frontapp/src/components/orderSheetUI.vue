<template>
    <div id="order_sheet">
        <h3>주문/결제</h3>
            <!-- 장바구니에 담은 상품 나열 -->
        <v-expansion-panels flat class="sheet_header_title">
            <v-expansion-panel>
                <v-expansion-panel-header class="headline">주문상품 총 {{total_qty}}개</v-expansion-panel-header>
                <v-expansion-panel-content style="text-align: start">
                    <v-card v-for="item in getData" :key="item.productNo && item.itemNo" height="130" class="mb-4" outlined>
                        <v-row no-gutters>
                            <v-col cols="3" align="center">
                                <v-img :src="item.productImg" aspect-ratio="1" max-height="129" min-height="129" max-width="200" min-width="120"></v-img>
                            </v-col>
                            <v-col cols="9" :class="getItemDetailMargin()">
                                <v-row no-gutters class="title">
                                    {{ item.productName }}
                                </v-row>
                                <v-row no-gutters>
                                    {{ item.itemName }} 
                                </v-row>
                                <v-row no-gutters>
                                    {{ item.itemPrice }}원 | {{ item.itemQty }}개
                                </v-row>
                            </v-col>
                        </v-row>
                    </v-card>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>
        <v-divider></v-divider>
        <v-container class="order_address" fluid>
            <v-row no-gutters>
                <h5>배송지 정보</h5>
                <v-spacer />
                <v-btn v-if="this.$store.getters.getUserDB.destination == null" text color="primary" @click="changeDestination = true">변경하기</v-btn>
            </v-row>
            <v-dialog v-model="changeDestination">
                <v-col>
                    <v-card>
                        <v-card-text align="center">
                            <v-row no-gutters align="center">
                                <v-col cols="2">우편번호</v-col>
                                <v-col cols="10"><v-text-field :value="zonecode"></v-text-field></v-col>
                            </v-row>
                            <v-row no-gutters align="center">
                                <v-col cols="2">도로명</v-col>
                                <v-col cols="10"><v-text-field multiple :value="new_destinaion"></v-text-field></v-col>
                            </v-row>
                            <v-row no-gutters align="center">
                                <v-col cols="2">지번</v-col>
                                <v-col cols="10"><v-text-field :value="jibunAddress"></v-text-field></v-col>
                            </v-row>
                            <v-row no-gutters align="center">
                                <v-col cols="2">상세주소</v-col>
                                <v-col cols="10"><v-text-field v-model="detailAddress"></v-text-field></v-col>
                            </v-row>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn text color="red darken-1" @click.stop="isDestinationSearch=true">검색하기</v-btn>
                            <v-btn text color="green darken-1" @click="saveNewAddress">저장하기</v-btn>
                        </v-card-actions>
                    </v-card>
                    <v-dialog v-model="isDestinationSearch">
                        <v-card>
                            <vue-daum-postcode @complete="getNewAddress($event), isDestinationSearch=false"/>
                        </v-card>
                    </v-dialog>
                </v-col>
            </v-dialog>
            <v-row no-gutters>
                <!-- 회원 이름, 전화번호, 주소 출력-->
                {{ getMemberInfo.name }}<br>
                {{ getMemberInfo.destination }}<br>
            </v-row>
            <v-row no-gutters>
                <v-select v-model="select" :items="items" label="배송 시 요청사항을 선택해주세요" return-object></v-select>
            </v-row>
            <v-row no-gutters v-if="isDirectInput">
                <v-text-field v-model="delivery_request" label="배송 시 요쳥사항을 입력해주세요."></v-text-field>
            </v-row>
        </v-container>
        <!-- <v-divider></v-divider>
        <v-container class="refund_account" fluid>
            <v-row no-gutters>
                <h5>환불 계좌</h5>
                <v-spacer />
                <v-btn text color="primary">변경하기</v-btn>
            </v-row>
            <v-row>
                환불 계좌 출력
            </v-row>
        </v-container> -->
        <v-divider></v-divider>
        <v-container class="total_price" fluid>
            <v-row no-gutters>
                <h5>결제금액</h5>
            </v-row>
            <v-row no-gutters>
                <h6>쿠폰</h6>
                <v-spacer />
                <v-btn depressed outlined color="grey darken-1">쿠폰 선택</v-btn>
            </v-row>
            <v-divider></v-divider>
            <v-row no-gutters align="center">
                <v-col>
                    <v-row no-gutters>
                        <!-- <v-col class="mr-6" cols="4" style="text-align: center">포인트</v-col> -->
                        <v-text-field class="point_text" dense single-line prefix="포인트" suffix="P" v-model="usePoint" :value="usePoint" :rules="usepoint_rule"></v-text-field>
                    </v-row>
                    <v-row no-gutters class="points">
                        사용 가능 포인트 {{ extraPoint }}p · 예상 지급 포인트 {{ calcPoints() }}p
                        <!-- <v-col cols="3">사용 가능 포인트 {{ usablePoint }}p</v-col>
                        <v-col cols="3">예상 지급 포인트 {{ calcPoints() }}p</v-col> -->
                    </v-row>
                </v-col>
                <v-col align="end">
                    <v-btn depressed outlined color="grey darken-1" @click="useAllPoints">모두 사용</v-btn>
                </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row no-gutters>
                <h5 class="mt-1">총 결제금액</h5>
                <v-spacer />
                <!-- 총 결제금액 출력-->
                <h5 class="mt-1 total_price_text">{{getFinalTotalPrice()}}원</h5>
            </v-row>
            <v-divider />
            <v-row class="total_price_detail" no-gutters>
                총 상품금액 {{ total_item_price }}원<br>
                상품할인 -{{ items_discount }}원<br>
                쿠폰/포인트 할인 -{{ total_benefit_discounts }}원<br>
                배송비 +{{ delivery_price }}원<br>
            </v-row>
        </v-container>
        <v-divider />
        <v-container class="payment_option" fluid>
            <v-row no-gutters>
                <h5>결제 방법</h5>
            </v-row>
            <v-row no-gutters>
                <v-radio-group class="opt_radioGroup" v-model="select_paymentOpt">
                    <v-radio label="카드 결제" value="CARD"></v-radio>
                    <v-radio label="무통장 입금" value="CASH"></v-radio>
                    <v-radio label="휴대폰 결제" value="PHONE"></v-radio>
                </v-radio-group>
            </v-row>
        </v-container>
        <v-container fluid>
            <v-btn depressed color="error" block x-large @click.stop="final_payment_dialog = true">결제하기</v-btn>
            <v-dialog v-model="final_payment_dialog">
                <v-card>
                    <v-card-title class="title">결제를 진행하시겠습니까?</v-card-title>
                    <v-card-actions>
                        <v-spacer />
                        <v-btn color="grey darken-1" text @click="final_payment_dialog = false">아니오</v-btn>
                        <v-btn color="red darken-1" text @click="isDestinationExist">예</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-container>
    </div>
</template>

<script>
import { getCartId, getOrderSummary } from '@/graphql/queries.js'
import { createOrder } from '@/graphql/mutations.js'
import { updateMemberDestination, updateMemberPoint } from '@/graphql/mutations.js'

export default {
    name: 'orderSheetUI',
    props: {

    },
    data() {
        return {
            getData: [],

            //배송시 요청사항
            items: [ '부재시 경비실에 맡겨주세요.', '집앞에 놔주세요.', '택배함에 놔주세요.', '집으로 직접 배송해주세요.', '배송 전에 꼭 연락주세요.', '직접 입력' ],
            select: '',
            delivery_request: '',
            final_req: '',

            //결제 방법
            select_paymentOpt: 'CARD',

            //최종 주문 상품 및 상품 개수, 총 결제 금액
            total_qty: 0,
            order_Summary: [],
            total_item_price: 0,
            items_discount: 0,
            delivery_price: 0,
            final_total_price: 0,
            total_benefit_discounts: 0, //상품 할인가가 아닌 쿠폰/포인트 할인가
            cartItemsInfo: '',

            final_payment_dialog: false,

            changeDestination: false,
            isDestinationSearch: false,
            new_destinaion: '',
            zonecode: '',
            jibunAddress: '',
            roadAddress: '',
            detailAddress: '',

            usePoint: 0,
            usablePoint: 0,
            extraPoint: 0,
            usepoint_rule: [
                value => (value >= 0 && value <= this.usablePoint) || '사용할 수 없습니다'
            ]
        }
    },
    watch: {
        usePoint (val) {
            if(!val)
                val = 0

            if(val >= 0 && val <= this.usablePoint) {
                this.total_benefit_discounts = val
                this.extraPoint = this.getUsablePoint - val
            } else {
                this.total_benefit_discounts = 0
                this.extraPoint = 0
            }
        }
    },
    created() {
        this.getTotalItem()
        this.getOrderSummary()
        this.calcUsablePoint()
    },
    computed: {
        isDirectInput() {
            return this.select == this.items[5] ? true : false;
        },
        getMemberInfo() {
            return this.$store.getters.getUserDB;
        },
        getMemberCartItemData() {
            return this.$store.getters.getCurrentCartItem;
        },
        getUsablePoint() {
            return this.usablePoint;
        },
        getProductData() {
            return this.$store.getters.getProductData
        },
        isDisplayXS() {
            return this.$store.getters.getwindowSize.x < 600 ? true : false
        }
    },
    methods: {
        getItemDetailMargin() {
            if(this.isDisplayXS)
                return "pl-12 mt-6"
            else
                return "pl-5 mt-6"
        },
        getTotalItem() {
            if(this.getProductData)
                this.getData = this.getProductData
            else
                this.getData = this.getMemberCartItemData
            
            for(let a = 0; a < this.getData.length; a++) {
                this.total_qty += this.getData[a].itemQty
            }
        },
        calcUsablePoint() {
            this.usablePoint = this.$store.getters.getUserDB.point
            this.extraPoint = this.usablePoint
        },
        getOrderSummary() {
            if(this.getProductData) {
                for(let a=0;a<this.getProductData.length;a++) {
                    this.total_item_price += this.getProductData[a].itemPrice
                    this.items_discount += (this.getProductData[a].discountPrice * this.getProductData[a].itemQty)
                }
                
                if(this.total_item_price >= 50000)
                    this.delivery_price = 0
                else
                    this.delivery_price = 2500
            } else {
                let id = this.$store.getters.getUser.username;
                this.$Amplify.API.graphql(this.$Amplify.graphqlOperation(getCartId, {id:id})).then((res) => {
                    const user_cartId = res.data.getMember.cart.items[0].id;

                    this.$Amplify.API.graphql(this.$Amplify.graphqlOperation(getOrderSummary, {id: user_cartId})).then(res => {
                    this.order_Summary = JSON.parse(res.data.getCart.orderSummary)

                    this.total_item_price = this.order_Summary.totalItemPrice
                    this.items_discount = this.order_Summary.itemsDiscount
                    this.delivery_price = this.order_Summary.deliveryPrice
                    });
                });   
            }
        },
        getFinalTotalPrice() {
            this.final_total_price = parseFloat(this.total_item_price) + parseFloat(this.delivery_price) - parseFloat(this.total_benefit_discounts)
            return this.final_total_price;
        },
        isDestinationExist() {
            if(this.getMemberInfo.destination == null) {
                alert("배송지를 설정해주세요.")
                this.final_payment_dialog = false
            } else {
                if(this.usepoint_rule[0](this.usePoint) == true) {
                    this.createOrder()
                } else {
                    alert("포인트를 사용할 수 없습니다")
                }
            }
        },
        useAllPoints() {
            this.usePoint = this.getUsablePoint
            this.total_benefit_discounts = this.usePoint
        },
        createOrder() {
            if(this.select == this.items[5])
                this.final_req = this.delivery_request
            else if(this.select == '')
                this.final_req = "없음"
            else
                this.final_req = this.select

            let save_point = this.usablePoint - this.usePoint + this.calcPoints()
            const member_input = {
                id: this.$store.getters.getUser.username,
                point: save_point
            }

            this.$Amplify.API.graphql(this.$Amplify.graphqlOperation(updateMemberPoint, {input: member_input})).then((res) => {
                // console.log(res)
                this.$store.commit('updateUserPoint', res.data.updateMember.point)
            });

            const order_input = {
                orderCartItemInfo: this.getCartItemsInfo(), //장바구니에 담은 아이템의 정보 JSON 생성
                orderCartInfo: this.getCartInfo(), 
                orderDeliveryInfo: this.getDeliveryInfo(),
                totalQty: this.total_qty,
                totalPrice: this.final_total_price,
                discountPrice: parseFloat(this.items_discount)+parseFloat(this.total_benefit_discounts),
                deliveryReq: this.final_req,
                payment: this.select_paymentOpt,
                orderMemberId: this.$store.getters.getUser.username
            }

            this.$Amplify.API.graphql(this.$Amplify.graphqlOperation(createOrder, {input: order_input})).then((res) => {
                console.log(res)
                this.$store.commit('setPayedComplete', true)
                this.$store.commit('setProductData', null)
            });
        },
        getCartItemsInfo() {
            this.cartItemsInfo = "["
            for(let a = 0;a<this.getData.length;a++) {
                //장바구니에 담은 상품의 개수만큼 반복
                if(a == this.getData.length-1) {
                    //마지막 상품일때는 ',' 쉼표 추가하지 않음
                    this.cartItemsInfo += this.getOrderItemInfo(this.getData[a])
                } else {
                    //처음부터 마지막의 전 상품까지 JSON 형식의 String을 더한 후 ',' 쉼표 추가
                    this.cartItemsInfo += this.getOrderItemInfo(this.getData[a]) + ","
                }
            }
            this.cartItemsInfo += "]"

            return this.cartItemsInfo
        },
        getOrderItemInfo(getData) {
            let info;
            info = "{\"productImg\":\""+getData.productImg+"\", \"itemName\":\""+getData.itemName+"\",\"productName\":\""+getData.productName+"\",\"itemPrice\":"+getData.itemPrice+",\"itemQty\":"+getData.itemQty+"}"
            return info;
        },
        getCartInfo() {
            let info;
            let cartId;

            if(this.getProductData)
                cartId = "NoCartDirectOrder"
            else
                cartId = this.$store.getters.getCartId

            info = "{\"cartId\":\""+cartId+"\",\"cartTotalPrice\":"+this.total_item_price
                +",\"cartPayment\":\""+this.select_paymentOpt+"\",\"cartDeliveryPrice\":"+this.delivery_price
                +",\"orderTotalBenefitDiscounts\":"+this.total_benefit_discounts+"}"
            return info;
        },
        getDeliveryInfo() {
            let info;
            info = "{\"ordererName\":\""+this.getMemberInfo.name+"\",\"ordererEmail\":\""+this.getMemberInfo.email
            +"\",\"ordererPhoneNum\":\""+this.getMemberInfo.phoneNum+"\",\"ordererDestination\":\""+this.getMemberInfo.destination+"\",\"ordererDeliveryReq\":\""+this.final_req+"\"}"
            return info;
        },
        getNewAddress(result) {
            this.zonecode = result.zonecode
            this.jibunAddress = result.jibunAddress
            this.roadAddress = result.address
            let extraAddress = ''

            if(result.addressType === 'R') {
                if(result.bname !== '') {
                    extraAddress += result.bname
                }
                if(result.buildingName !== '') {
                    extraAddress += (extraAddress !== '' ? `, ${result.buildingName}` : result.buildingName)
                }
                this.roadAddress += (extraAddress !== '' ? ` (${extraAddress})` : '')
            }

            this.new_destinaion = this.roadAddress
        },
        saveNewAddress() {
            const userId = this.$store.getters.getUser.username

            const input = {
                id: userId,
                destination: this.new_destinaion+" "+this.detailAddress
            }

            this.$Amplify.API.graphql(this.$Amplify.graphqlOperation(updateMemberDestination, {input: input})).then((res) => {
                // console.log(res)
                this.$store.commit('updateUserDestination', res.data.updateMember.destination)
            });

            this.changeDestination = false
            this.zonecode = ''
            this.jibunAddress = ''
            this.roadAddress = ''
            this.detailAddress = ''
        },
        calcPoints() {
            return parseInt(this.total_item_price/100)
        }
    }
}
</script>

<style>
h3 {
    margin-bottom: 25px;
}

.sheet_header_title {
    margin-bottom: 20px;
}

.total_price_text {
    color: red;
}

.total_price_detail {
    margin-top: 10px;
    text-align: start;
}

.order_address {
    text-align: start;
}

#detail {
    margin-left: 10px;
}

.points {
    color: red;
    text-align: start;
}

.point_text input {
    text-align: end;
}

</style>
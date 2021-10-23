<template>
    <div id="orderdetail">
        <v-container fluid class="subtitle-1 font-italic font-weight-medium" style="text-align: start">
            {{ $moment(orderData.createTime).format('YYYY.MM.DD') }}
        </v-container>
        <v-container fluid class="orderItems_info" style="text-align: start">
            <div v-for="item in orderCartItemInfo" :key="item.productNo && item.itemNo">
                <v-row no-gutters class="mb-5">
                    <v-col :cols="getItemFCol()">
                    <v-img
                    :src="item.productImg" aspect-ratio="1" height="120">
                    </v-img>
                    </v-col>
                    <v-col :cols="getItemSCol()" class="mt-5">
                        <v-row no-gutters class="title ml-3">
                            {{ item.productName }} <!-- 상품명 -->
                        </v-row>
                        <v-row no-gutters class="ml-3">
                            {{ item.itemName }} <!-- 옵션명 -->
                        </v-row>
                        <v-row no-gutters class="ml-3">
                            {{ item.itemPrice }}원 | {{ item.itemQty }}개
                        </v-row>
                    </v-col>
                </v-row>
            </div>
        </v-container>
        <v-divider />
        <v-expansion-panels flat class="orderer_info">
            <v-expansion-panel>
                <v-expansion-panel-header class="headline">주문자 정보</v-expansion-panel-header>
                <v-expansion-panel-content style="text-align: start">
                    <v-row no-gutters>
                        <v-col :cols="getFirstCol()">주문자</v-col>
                        <v-col :cols="getSecondCol()">{{ orderDeliveryInfo.ordererName }}</v-col>
                    </v-row>
                    <v-row no-gutters>
                        <v-col :cols="getFirstCol()">연락처</v-col>
                        <v-col :cols="getSecondCol()">{{ orderDeliveryInfo.ordererPhoneNum }}</v-col>
                    </v-row>
                    <v-row no-gutters>
                        <v-col :cols="getFirstCol()">이메일</v-col>
                        <v-col :cols="getSecondCol()">{{ orderDeliveryInfo.ordererEmail }}</v-col>
                    </v-row>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>
        <v-divider />
        <v-expansion-panels flat class="pay_info">
            <v-expansion-panel>
                <v-expansion-panel-header class="headline">결제 정보</v-expansion-panel-header>
                <v-expansion-panel-content style="text-align: start">
                    <v-row no-gutters>
                        <v-col cols="5" style="text-align: start">결제 방법</v-col>
                        <v-col cols="7" style="text-align: end">{{ getPayment() }}</v-col>
                    </v-row>
                    <v-row no-gutters>
                        <v-col cols="5" style="text-align: start">총 결제금액</v-col>
                        <v-col cols="7" style="text-align: end">{{ orderCartInfo.cartTotalPrice }}원</v-col>
                    </v-row>
                    <v-row no-gutters>
                        <v-col cols="5" style="text-align: start">쿠폰/포인트 할인</v-col>
                        <v-col cols="7" style="text-align: end">{{ orderCartInfo.orderTotalBenefitDiscounts }}원</v-col>
                    </v-row>
                    <v-row no-gutters>
                        <v-col cols="5" style="text-align: start">배송비</v-col>
                        <v-col cols="7" style="text-align: end">{{ orderCartInfo.cartDeliveryPrice }}원</v-col>
                    </v-row>
                    <v-divider />
                    <v-row no-gutters class="font-weight-black">
                        <v-col cols="5" style="text-align: start">총 결제금액</v-col>
                        <v-col cols="7" style="text-align: end">{{ orderData.totalPrice }}원</v-col>
                    </v-row>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>
        <v-divider />
        <v-expansion-panels flat class="delivery_info">
            <v-expansion-panel>
                <v-expansion-panel-header class="headline">배송지 정보</v-expansion-panel-header>
                <v-expansion-panel-content style="text-align: start">
                    <v-row no-gutters align="center">
                        <v-col :cols="getFirstCol()">받는분</v-col>
                        <v-col :cols="getSecondCol()">{{ orderDeliveryInfo.ordererName }}</v-col>
                    </v-row>
                    <v-row no-gutters align="center">
                        <v-col :cols="getFirstCol()">주소</v-col>
                        <v-col :cols="getSecondCol()">{{ orderDeliveryInfo.ordererDestination }}</v-col>
                    </v-row>
                    <v-row no-gutters align="center">
                        <v-col :cols="getFirstCol()">연락처</v-col>
                        <v-col :cols="getSecondCol()">{{ orderDeliveryInfo.ordererPhoneNum }}</v-col>
                    </v-row>
                    <v-row no-gutters align="center">
                        <v-col :cols="getFirstCol()">요청사항</v-col>
                        <v-col :cols="getSecondCol()">{{ orderData.deliveryReq }}</v-col>
                    </v-row>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>
        <v-divider />
    </div>
</template>

<script>
import { getOrderDetail } from '@/graphql/queries.js'

export default {
    name: 'myorders',
    props: {
        orderId: String
    },
    data() {
        return {
            orderData: '',
            orderCartInfo: [],
            orderCartItemInfo: [],
            orderDeliveryInfo: []
        }
    },
    created() {
        this.getOrderID()
        this.getOrderDetail()
    },
    computed: {
        isDisplayXS() {
            return this.$store.getters.getwindowSize.x < 600 ? true : false
        }
    },
    methods: {
        getOrderID() {
            this.orderId = this.$route.params.orderId
        },
        getOrderDetail() {
            this.$Amplify.API.graphql(this.$Amplify.graphqlOperation(getOrderDetail, {id: this.orderId})).then((res) => {
                // console.log(res)
                this.orderData = res.data.getOrder
                this.orderCartInfo = JSON.parse(res.data.getOrder.orderCartInfo)
                this.orderCartItemInfo = JSON.parse(res.data.getOrder.orderCartItemInfo)
                this.orderDeliveryInfo = JSON.parse(res.data.getOrder.orderDeliveryInfo)
            });
        },
        getPayment() {
            let payment;

            switch(this.orderCartInfo.cartPayment) {
                case 'CARD':
                    payment = "카드 결제"
                    break;
                case 'CASH':
                    payment = "무통장 입금"
                    break;
                case 'PHONE':
                    payment = "휴대폰 결제"
                    break;
            }

            return payment;
        },
        getItemFCol() {
            if(this.isDisplayXS)
                return 4
            else
                return 3
        },
        getItemSCol() {
            if(this.isDisplayXS)
                return 8
            else
                return 9
        },
        getFirstCol() {
            if(this.isDisplayXS)
                return 4
            else
                return 2
        },
        getSecondCol() {
            if(this.isDisplayXS)
                return 8
            else
                return 10
        }
    }
}
</script>
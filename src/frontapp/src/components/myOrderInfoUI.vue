<template>
    <div id="myorderinfo">
        <v-card class="OrderInfo">
            <v-card-text>
                <p class="display-1 text--primary">주문/배송 조회</p>
                <div v-if="orders_length > 0">
                    <v-card v-for="(item,index) in sortOrders()" :key="item.id" class="orders" outlined @click.native="openMyOrders(item.id)">
                        <v-card-text>
                            <p class="title">{{ $moment(item.createTime).format('YYYY.MM.DD') }}</p>
                            <v-row no-gutters align="center">
                                <v-col :cols="getFirstCol()"><v-img :src="itemImg[index]" aspect-ratio="1" contain height="60"></v-img></v-col>
                                <v-col :cols="getSecondCol()" class="subtitle-1">{{ itemsInfo[index] }}</v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </div>
                <div v-if="orders_length == 0">
                    주문 내역이 없습니다.
                </div>
            </v-card-text>
        </v-card>
    </div>    
</template>

<script>
import { getOrder } from '@/graphql/queries.js'

export default {
    name: 'myorderinfo',
    data() {
        return {
            orders_length: '',
            orders: '',
            orderItems: [],
            itemsInfo: [],
            itemImg: []
        }
    },
    created() {
        this.userOrderInfo()
    },
    computed: {
        UserInfo() {
            return this.$store.getters.getUser;
        },
        isDisplayXS() {
            return this.$store.getters.getwindowSize.x < 600 ? true : false
        }
    },
    methods: {
        userOrderInfo() {
            // console.log(this.UserInfo.username)
            this.$Amplify.API.graphql(this.$Amplify.graphqlOperation(getOrder, {id: this.UserInfo.username})).then((res) => {
                // console.log(res)
                this.orders = res.data.getMember.orders.items
                // console.log(this.orders)
                this.orders_length = this.orders.length
                this.getOrderItems(this.sortOrders())
            });
        },
        getOrderItems(order) {
            let data;
            for(let a=0;a<this.orders_length;a++) {
                data = JSON.parse(order[a].orderCartItemInfo)
                if(data.length == 1) {
                    this.itemsInfo[a] = data[0].productName
                    this.itemImg[a] = data[0].productImg
                } else {
                    this.itemImg[a] = data[0].productImg
                    this.itemsInfo[a] = data[0].productName + " 외 " + (data.length-1) + "개"
                }
            }
        },
        sortOrders() {
            return this.orders.slice().sort(function (a, b) {
                return (a.createTime > b.createTime) ? -1 : 1;
            })
        },
        openMyOrders(item_id) {
            this.$router.push({name: 'myOrders', params:{ orderId : item_id }})
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

<style>
.OrderInfo {
    text-align: start;
    margin-top: 20px;
    margin-bottom: 30px;
    padding: 20px;
}

.orders {
    margin-bottom: 15px;
}
</style>
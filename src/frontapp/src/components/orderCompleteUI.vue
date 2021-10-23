<template>
    <div class="order_complete">
        <v-container class="order_complete_page" fluid>
            <v-card outlined>
                <v-card-text class="card_text">
                    <div class="headline font-weight-bold">
                        <p>주문/결제 완료</p>
                    </div>
                    <div class="page_content">
                        <p>kestore를 이용해주셔서 감사합니다.</p>
                        <p style="color: blue">결제가 완료되었습니다.</p>
                        <p>주문 내역 확인은<br>"My Page > 주문/배송조회"에서 하실 수 있습니다.</p>
                    </div>
                    <div class="btn_arr">
                        <v-btn text color="blue darken-3" @click="goToMyPage">주문내역 확인하러가기</v-btn>
                        <v-btn text color="grey darken-4" @click="goToMain">쇼핑 계속하기</v-btn>
                    </div>
                </v-card-text>
            </v-card>
        </v-container>
    </div>
</template>

<script>
export default {
    name: 'orderCompleteUI',
    data() {
        return {

        }
    },
    methods: {
        async goToMyPage() {
            await this.$router.push('/mypage').then( () => {
                this.$store.commit('setPayedComplete', false)    
            })
        },
        async goToMain() {
            await this.$router.push('/').then( () => {
                this.$store.commit('setPayedComplete', false)
            })
        }
    }
}
</script>

<style>

.card_text {
    padding: 20px;
}

.page_content {
    margin-top: 40px;
}

.btn_arr {
    margin-top: 40px;
}

</style>
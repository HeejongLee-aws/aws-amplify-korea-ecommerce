<template>
    <div id="mypage" v-if="ifsignedIn">
        <v-container fluid>
            <h2>마이 페이지</h2>
            <myInfoUI />
            <myOrderInfoUI />
        </v-container>
    </div>
</template>

<script>
// import { Auth } from 'aws-amplify'
import myInfoUI from '../components/myInfoUI'
import myOrderInfoUI from '../components/myOrderInfoUI'
import { components } from 'aws-amplify-vue'

export default {
    name: 'mypage',
    components: {
        myInfoUI,
        myOrderInfoUI,
        ...components
    },
    computed: {
        ifsignedIn() {
            return this.$store.state.signedIn;
        }
    }
}
</script>
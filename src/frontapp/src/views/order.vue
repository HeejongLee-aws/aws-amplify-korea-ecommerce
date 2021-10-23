<template>
    <div class="order">
        <div v-if="!getPayedComplete">
            <orderSheetUI />
        </div>
        <div v-if="getPayedComplete">
            <orderCompleteUI />
        </div>
    </div>
</template>

<script>
import orderSheetUI from '../components/orderSheetUI'
import orderCompleteUI from '../components/orderCompleteUI'
import { components } from 'aws-amplify-vue'

export default {
    name: 'order',
    components: {
        orderSheetUI,
        orderCompleteUI,
        ...components
    },
    data() {
        return {

        }
    },
    computed: {
        getPayedComplete() {
            return this.$store.getters.getPayedComplete;
        }
    },
    methods: {
        
    }
}
</script>
<template>
  <div class="corner_set">
    <!-- <div>{{title}}</div> -->
    <div v-for="(corner,index) in cornerlist" :key="index" >
       <cornerUI :content="corner" />
    </div>
  </div>
</template>


<script>

import cornerUI from '../components/cornerUI'

export default {
    name: 'cornerSetUI',
    props: {
            'title':{
                type: String
            },
            'cornerlist': {
                type: Array
            }
        },
    components: {
        cornerUI
    },
    data: () => ({

       
       
    }),
   methods: {
     goCart() {
      return this.$router.push('/cart')
    }
   }
}
</script>
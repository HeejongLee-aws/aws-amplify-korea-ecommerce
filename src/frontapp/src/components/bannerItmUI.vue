<template>
  <div>
     <img :src="contentInfo.src" style="max-width: 100%; height: auto;"/>
  </div>
  
</template>


<script>

export default {
    name: 'bannerItmUI',
    props: {
            'contentInfo': {
                type: Object
            }
    },
    components: {
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
<template>
  <div class="coner">
    <!-- <h2>{{content.contentName}}</h2> -->
    <div  v-if="content.contentType === 'BANNER'" >
      <bannerItmUI :contentInfo ="JSON.parse(content.contentInfo)" />
    </div>
    <div  v-if="content.contentType === 'PRODUCT'">
      <v-container fluid>
        <v-row dense>
          <v-col v-for="product in products" :key="product.title" :cols="calcCols()">
            <productItmUI :productinfo ="product"/>
          </v-col>
        </v-row>
      </v-container>
    </div>

  </div>
  
</template>


<script>
import bannerItmUI from '../components/bannerItmUI'
import productItmUI from '../components/productItmUI'

export default {
  name: 'cornerUI',
  props: {
    'content': {
        type: Object
    }
  },
  components: {
    bannerItmUI,
    productItmUI
  },
  data: () => ({
    products: []
  }),
  created() {
    if(this.content.contentType === 'PRODUCT'){
    this.products =  JSON.parse(this.content.contentInfo);
    }
  },
  methods: {
    goCart() {
      return this.$router.push('/cart')
    },
    calcCols() {
      if(this.$store.getters.getwindowSize.x < 600)
        return 6
      else
        return 3
    }
  }
}
</script>
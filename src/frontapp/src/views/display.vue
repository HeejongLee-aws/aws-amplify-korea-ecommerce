<template>
  <div class="coner">
      <v-container fluid>
        <v-row dense>
          <v-col v-for="product in products" :key="product.displayInfo.itemNo" :cols="product.displayInfo.flex">
             <productItmUI :productinfo ="JSON.parse(product.displayInfo)"/>
          </v-col>
        </v-row>
      </v-container>
  </div>
</template>


<script>
import { getDisplayCategory } from '@/graphql/queries.js'
import productItmUI from '../components/productItmUI'

export default {
  name: 'Display',
  props: {id: String},
  watch: {
      id: function (id) {
          this.getGategoryData(id);
      }
    },
  components: {
      productItmUI
    },
  data: () => ({
      products: []
  }),
  methods: {
     getGategoryData(val) {
        this.$Amplify.API.graphql(this.$Amplify.graphqlOperation(getDisplayCategory, {id:val})).then((res) => {
            this.products =  res.data.getDisplayCategory.displayProduct.items;
        });
      }
  }
}

</script>
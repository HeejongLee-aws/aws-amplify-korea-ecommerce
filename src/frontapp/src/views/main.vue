<template>
  <div class="home">
    <div v-for="(dspTemp,index) in dspTemps" :key="index">
      <div>
        <cornerSetUI :title="dspTemp.cornerSetName" :cornerlist="dspTemp.cornerContents.items"  v-if="dspTemp.cornerType === 'SET'" />
      </div>
      <div>
        <cornerUI :content="dspTemp.cornerContents.items[0]" v-if="dspTemp.cornerType === 'UNIT'" />
      </div>
      <div v-if="getUserData">
        <v-dialog v-if="getSessionState != null" v-model="addedCartItem_Recent">
          <v-card outlined color="#61caef">
            <v-col align="center">
              <h4 class="mt-3" style="color:white">최근에 담은 상품이 있습니다.</h4>
              <v-card outlined class="mt-5" width="900px">
                <v-card tile outlined dark class="mt-3" color="#61caef" width="865px">
                  <v-row no-gutters dense class="mt-2">
                    <v-col>
                    </v-col>
                    <v-col>
                      <h5 class="mr-3">상품이름</h5>
                    </v-col>
                    <v-col>
                      <h5>옵션</h5>
                    </v-col>
                    <v-col>
                      <h5 class="ml-2">수량</h5>
                    </v-col>
                    <v-col>
                      <h5 class="ml-4">가격</h5>
                    </v-col>
                  </v-row>
                </v-card>
                <div v-for="(sessionCartItemTemp, index) in sessionCartItemTemps" :key="index">
                  <v-card-text>
                        <v-card outlined color="#61caef">
                          <v-row>
                            <v-col>
                              <v-img
                              :src="sessionCartItemTemp.productImg"
                              width="100px"
                              ></v-img>  
                            </v-col>
                            <v-col class="mt-9">
                              <h5 style="color:white">{{sessionCartItemTemp.productName}}</h5>
                            </v-col>
                            <v-col class="mt-9">
                              <h5 style="color:white">{{sessionCartItemTemp.itemName}}</h5>
                            </v-col>
                            <v-col class="mt-9">
                              <h5 style="color:white">{{sessionCartItemTemp.itemQty}}</h5>
                            </v-col>
                            <v-col class="mt-9">
                              <h5 style="color:white">{{sessionCartItemTemp.itemPrice}}원</h5>
                            </v-col>
                          </v-row>
                        </v-card>
                  </v-card-text>
                </div>
              </v-card>
            </v-col>
            <v-card-actions class="mr-4">
              <v-spacer />
              <v-btn color="white" text @click="addedCartItem_Recent = false"><h6>쇼핑하기</h6></v-btn>
              <v-btn color="white" text @click="gotoCart"><h6>확인하러 가기</h6></v-btn>
            </v-card-actions>
            <v-col align="right">
              <h6 style="color:#78909C" @click="setNull">다음부터 안 볼래요</h6>
            </v-col>
          </v-card>
        </v-dialog>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
//import HelloWorld from '../components/HelloWorld'
import cornerSetUI from '../components/cornerSetUI'
import cornerUI from '../components/cornerUI'
import { components } from 'aws-amplify-vue'
import { getListDisplayCornerTemplates } from '@/graphql/queries.js'

export default {
  name: 'Home',
   data() {
    return {
      dspTemps: [],
      sessionCartItemTemps:[],
      addedCartItem_Recent: true
      
    }
  },
  components: {
    cornerSetUI,
    cornerUI,
    ...components
  },
  created() {
    this.getListDisplayCornerTemplates();
    this.getSessionCartItem();
  },
  computed:{
    getSessionState(){
      return this.$store.getters.getSessionCartItemData 
    },
    getUserData(){
      return this.$store.getters.getSignedIn
    }
  },
  methods: {
    setNull(){
      this.$store.commit('setSessionCartItemData', null)
      this.$store.commit('setSessionCartId', null)
    },
    scrChange(data) {
      return JSON.parse(data).src
    },
    getListDisplayCornerTemplates() {
			this.$Amplify.API.graphql(this.$Amplify.graphqlOperation(getListDisplayCornerTemplates)).then((res) => {
        this.dspTemps = res.data.listDisplayCornerTemplates.items;
			});
    },
    gotoCart(){
      this.$router.push('/cart')
    },
    getSessionCartItem(){
      this.sessionCartItemTemps = this.$store.getters.getSessionCartItemData
    }
   }
}
</script>

<style>
.fix {
	width : 110px;
}

</style>
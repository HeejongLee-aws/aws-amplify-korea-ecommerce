<template>
  <v-app id="inspire" >
    <!-- Header { -->
    <v-navigation-drawer
      v-model="drawer"
      :clipped="$vuetify.breakpoint.lgAndUp"
      app
    >
      <leftMenuUI/>
    </v-navigation-drawer>

    <v-app-bar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      app
      color="blue darken-3"
      dark
    >

      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title class="ml-0 pl-4" @click="linkToMain">kestore</v-toolbar-title>
        <v-spacer />
        <div class="d-none d-sm-flex">
          <!-- Hidden only on xs -->
          <v-toolbar-items v-if="!isSignedIn">
            <v-btn text large @click="linkToSignIn">SIGN IN</v-btn>
          </v-toolbar-items>
          <v-toolbar-items v-if="isSignedIn">
            <v-menu offset-y>
              <template v-slot:activator="{ on }">
              <v-btn text large v-on="on">{{UserInfo.attributes.name}}님. 반갑습니다!</v-btn>
              </template>
                <v-list>
                  <v-list-item v-for="(item, index) in user_services" :key="index" @click="userServices(index)">
                    <v-list-item-title> {{ item.title }} </v-list-item-title>
                  </v-list-item>
                </v-list>
            </v-menu>
          </v-toolbar-items>
          <v-btn text @click="goToCart">
              <v-icon>mdi-cart</v-icon><h6 v-if="this.$store.getters.getItemQty > 0">{{this.$store.getters.getItemQty}}</h6>
          </v-btn>
        </div>
        
        <div class="d-flex d-sm-none">
          <!-- Visible only on xs(Mobile Size) -->
          <v-toolbar-items v-if="!isSignedIn">
            <v-menu close-on-content-click close-on-click offset-y>
              <template v-slot:activator="{ on }">
                <v-btn dark icon v-on="on"><v-icon>mdi-dots-vertical</v-icon></v-btn>
              </template>
              <v-list>
                <v-list-item v-for="(item, index) in xs_nouser_servieces" :key="index" @click="xsNoUserServices(index)">
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-toolbar-items>
          <v-toolbar-items v-if="isSignedIn">
            <v-menu offset-y>
              <template v-slot:activator="{ on }">
                <v-btn dark icon v-on="on"><v-icon>mdi-dots-vertical</v-icon></v-btn>
              </template>
              <v-list>
                <v-list-item class="mt-3 mb-3 font-weight-bold">{{UserInfo.attributes.name}}님.<br>반갑습니다!</v-list-item>
                <v-list-item v-for="(item, index) in xs_user_services" :key="index" @click="xsUserServices(index)">
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-toolbar-items>
        </div>
    </v-app-bar>
    <!-- } Header -->

    <v-content id="app">
      <v-container fluid v-resize="onResize">
        <router-view/>
      </v-container>
    </v-content>
    <v-divider></v-divider>

    <!-- Footer { -->
    <v-footer color="white">
      <v-col align="center">
        <v-col align="left">
          <h4 x-large text @click="linkToMain">KESTORE</h4>
          <h6 style="color:grey">서울특별시 성동구 연무장5가길 7, W1404호</h6>
          <h6 style="color:grey">(성수동2가, 현대테라스타워)</h6>
          <h6 style="color:grey">Tel: 02-733-9200(대표) Fax: 02-733-9201</h6>
        </v-col>
        <v-row>
          <v-col>
            <v-btn text>PLGRIM</v-btn>
          </v-col>
          <v-col>
            <v-btn text>GLYDE</v-btn>
          </v-col>
          <v-col>
            <v-btn text>AWS</v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-footer>
    <!-- } Footer -->
  </v-app>
</template>

<script>
import { Auth } from 'aws-amplify'
import { components } from 'aws-amplify-vue'
import { getCartId,getMember,getMemberCartItem } from '@/graphql/queries.js'
import leftMenuUI from './components/leftMenuUI'

export default {
  name: 'app',
  props: {
      source: String,
  },
  components: {
    ...components,
    leftMenuUI
  },
  data () {
    return {
      currentItemTemps:[],
      currentItemQty:'',
      dialog: false,
      drawer: null,
      items: [
        {
          icon: 'mdi-chevron-up',
          'icon-alt': 'mdi-chevron-down',
          text: 'Menu',
          model: false,
          children: [
            { text: 'Home', url:'/' },
            { text: 'About' , url:'/About'},
            { text: 'cart' , url:'/cart'}
          ],
        },
      ],
      user_services: [
          { title: '마이 페이지' },
          { title: '고객 센터' },
          { title: '로그아웃' }
      ],
      xs_user_services: [
        { title: '마이 페이지' },
        { title: '고객 센터' },
        { title: '장바구니' },
        { title: '로그아웃'}
      ],
      xs_nouser_servieces: [
        { title: '로그인' },
        { title: '장바구니'}
      ]
    }
  },
  created() {
    this.findUser()
  },
  computed: {
    currentCartQty(){
      return this.$store.getters.getMemberCartItemData
    },
    isSignedIn() {
      return this.$store.getters.getSignedIn;
    },
    UserInfo() {
      return this.$store.getters.getUser;
    }
  },
  mounted() {
    this.onResize()
  },
  methods: {
    onResize() {
      this.$store.commit('setWindowSize')
    },
    goToCart(){
      this.$router.push('/cart')
    },
    linkToMain() {
      //error : NavigationDuplicated (같은 주소를 여러번 호출할 때 나는 에러)
      if(this.$store.getters.getPayedComplete)
        this.$store.commit('setPayedComplete', false)
      return this.$router.replace('/').catch(err => console.log(err))
    },
    linkToSignIn() {
      return this.$router.push('/login')
    },
    userServices(index) {
      switch(index) {
        case 0:
          return this.$router.push('/mypage')
        case 1:
          break;
        case 2:
          this.signOut()
          break;
      }
    },
    xsUserServices(index) {
      switch(index) {
        case 0:
          return this.$router.push('/mypage')
        case 1:
          break;
        case 2:
          return this.$router.push('/cart')
        case 3:
          this.signOut()
          break;
      }
    },
    xsNoUserServices(index) {
      switch(index) {
        case 0:
          return this.$router.push('/login')
        case 1:
          return this.$router.push('/cart')
      }
    },
    signOut() {
      Auth.signOut()
        .then(data => {
          console.log(data)
          this.$store.commit('setUser', null)
          this.$store.commit('setUserDB', null)
          this.$store.commit('setCartId', null)
          this.$store.commit('setSessionCartId', null)
          this.$store.commit('setMemberTotalPrice', null)
          this.$store.commit('setSessionTotalPrice', null)
          this.$store.commit('setMemberCartItemData', null)
          this.$store.commit('setSessionCartItemData', null)
          this.$store.commit('setCurrentCartItem', null)
          this.$store.commit('setItemQty', null)
          alert('로그아웃하였습니다.')
          this.$router.push('/')})
        .catch(err => console.log(err));
    },
    async findUser() {
      try {
        // console.log(user)
        const user = await Auth.currentAuthenticatedUser()
        this.$store.commit('setUser', user)
        this.$Amplify.API.graphql(this.$Amplify.graphqlOperation(getMember, { id: user.username }))
        .then(data => {
        this.$store.commit('setUserDB', data.data.getMember)
          this.$Amplify.API.graphql(this.$Amplify.graphqlOperation(getCartId, {id:user.username})).then((res) => {
                  this.$store.commit('setCartId', res.data.getMember.cart.items[0].id);
          });
          this.$Amplify.API.graphql(this.$Amplify.graphqlOperation(getMemberCartItem, {id:user.username})).then((res) => {
            this.$store.commit('setMemberCartItemData', res.data.getMember.cart.items[0].cartItems.items)
            this.currentCartItemTemps = this.$store.getters.getMemberCartItemData;
              this.$store.commit('setCurrentCartItem', this.currentCartItemTemps)
            this.currentItemQty = this.currentCartItemTemps.length
              this.$store.commit('setItemQty', this.currentItemQty)
          });
        }).catch(err => console.log(err))
      } catch (err) {
        this.$store.commit('setUser', null)
      }
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 20px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
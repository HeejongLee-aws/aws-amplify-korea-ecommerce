<template>
  <div id="sign_in">
    <v-container>
      <div>
        <v-card flat>
          <v-card-title class="justify-center">SIGN IN</v-card-title>
          <v-card-text>
            <v-row no-gutters justify="center">
              <v-col cols="6" md="4"><v-text-field v-model="id" placeholder="ID" outlined></v-text-field></v-col>
            </v-row>
            <v-row no-gutters justify="center">
              <v-col cols="6" md="4"><v-text-field v-model="password" type="password" placeholder="PASSWORD" outlined></v-text-field></v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="justify-center">
            <v-btn class="mb-2" depressed color="primary" large @click="signIn">SIGN IN</v-btn>
          </v-card-actions>
        </v-card>
      </div>
    </v-container>
    <v-container fluid>
      Don't have an account? <b-link @click="linkToSignUp">Create account</b-link><br>
      Forgot <b-link href="#">password?</b-link>
    </v-container>
  </div>
</template>

<script>
// @ is an alias to /src
// import { getCart } from '@/graphql/queries.js'
import { Auth } from 'aws-amplify'
import { getMember, getMemberCartItem } from '@/graphql/queries'
import { UpdateCart } from '@/graphql/mutations.js'

export default {
  name: 'LogIn',
  props: {

  },
  data() {
    return {
      currentCartItemTemps:[],
      currentItemQty:'',
      sessionToMemberCartId:'',
      sessionCartTemps:[],
      id: '',
      password: '',
      user: ''
    }
  },
  methods: {
    saveToCartData(){
      let id = this.$store.getters.getUser.username;
      this.$Amplify.API.graphql(this.$Amplify.graphqlOperation(getMemberCartItem, {id:id})).then((res) => {
        this.$store.commit('setCartId', res.data.getMember.cart.items[0].id)

        if(res.data.getMember.cart.items.length != 0){
          this.$store.commit('setMemberCartItemData', res.data.getMember.cart.items[0].cartItems.items)
          this.currentCartItemTemps = this.$store.getters.getMemberCartItemData
          this.$store.commit('setCurrentCartItem', this.currentCartItemTemps)
          this.currentItemQty = this.currentCartItemTemps.length
          this.$store.commit('setItemQty', this.currentItemQty)
        } else
          console.log("카트 아이템 없음")
      });
    },
    linkToSignUp() {
      return this.$router.push('/join')
    },
    signIn() {
      Auth.signIn({
          username: this.id, // Required, the username
          password: this.password, // Optional, the password
      }).then(user => {
        console.log(user)
        this.$store.commit('setUser', user)

        //로그인 시 카트정보 업데이트
        this.saveToCartData();

        //로그인 시 sessionCart의 데이터가 있으면 장바구니 추가
        if(this.$store.getters.getSessionCartId) {
          if(this.$store.getters.getCartId == null){
            let updateCartParam = {
              id: this.$store.getters.getSessionCartId,
              cartType: 'MEMBER',
              cartName: user.username + " cart",
              cartMemberId: user.username
            }

            this.$Amplify.API.graphql(this.$Amplify.graphqlOperation(UpdateCart, {input: updateCartParam})).then((res) => {
              // console.log(res)
              this.$store.commit('setCartId', res.data.updateCart.id)
              let memberCartitemTemps = res.data.updateCart.cartItems.items
              this.$store.commit('setMemberCartItemData', memberCartitemTemps)
              this.$store.commit('setCurrentCartItem', memberCartitemTemps)
              let currentItemQty = memberCartitemTemps.length
              this.$store.commit('setItemQty', currentItemQty)
            })
          } else if(this.$store.getters.getCartId != null){
            console.log("a")
            // var a;
            // var b = this.$store.getters.getSessionCartItemData
            // for()
            // this.$Amplify.API.graphql(this.$Amplify.graphqlOperation(updateCartItem, {input:updateMemberCartItemParam})).then((res) => {
            //     console.log(res); 
            //     });
          }
        }

        this.$Amplify.API.graphql(this.$Amplify.graphqlOperation(getMember, { id: this.id }))
        .then(data => {
          // console.log(data.data)
          this.$store.commit('setUserDB', data.data.getMember)
        }).catch(err => console.log(err))
        // alert('로그인하였습니다.')
        this.$router.push('/')
        })
      .catch(err => {
        console.log(err)
        if(err.code == 'UserNotFoundException')
          alert('아이디를 찾을 수 없습니다.')
        else if(err.code == 'NotAuthorizedException')
          alert('아이디 또는 비밀번호를 확인해주세요.')
        })
    }
  }
}
</script>
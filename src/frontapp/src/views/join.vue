<template>
    <div id="sign_up" app>
        <h3>SIGN UP</h3>
        <v-container class="signin_contents" fluid>
            <v-stepper v-model="step" value="3">
            <v-stepper-header>
                <v-stepper-step key="1-step" step="1" :complete="step > 1">
                    필수정보입력
                </v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step key="2-step" step="2" :complete="step > 2">
                    인증코드입력
                </v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step key="3-step" step="3">
                    가입완료
                </v-stepper-step>
            </v-stepper-header>

            <v-stepper-items>
                <v-stepper-content step="1">
                    <v-text-field v-model="id" label="ID" :rules="id_rules"></v-text-field>
                    <v-text-field v-model="password" label="Password" type="password" :rules="passwd_rules"></v-text-field>
                    <v-text-field v-model="password_check" label="Password Check" type="password" :rules="passwdChk_rules"></v-text-field>
                    <v-text-field v-model="name" label="Name"></v-text-field>
                    <v-text-field v-model="email" label="Email" :rules="email_rules"></v-text-field>
                    <v-radio-group label="Gender" v-model="gender" row dense>
                        <v-radio label="Man" value="M" color="indigo"></v-radio>
                        <v-radio label="Woman" value="W" color="indigo"></v-radio>
                    </v-radio-group>
                    <v-menu ref="menu" v-model="birthdate_menu" :close-on-content-click="false" transition="scale-transition" min-width="250px">
                        <template v-slot:activator="{ on }">
                            <v-text-field v-model="birthdate_formatted" label="Birthday date" readonly v-on="on"></v-text-field>
                        </template>
                        <v-date-picker ref="picker" v-model="birthdate" :max="new Date().toISOString().substr(0, 10)" min="1950-01-01" @change="saveBirthdate"></v-date-picker>
                    </v-menu>
                    <VuePhoneNumberInput v-model="phone_number" size="lg" clearable no-example @update="savePayloadPhonenum"></VuePhoneNumberInput>
                    <v-btn text @click="cancel_dialog=true">Cancel</v-btn>
                    <v-dialog v-model="cancel_dialog">
                        <v-card>
                            <v-card-title class="title">현재 창을 닫을 시 입력한 정보는 저장되지 않습니다. 나가시겠습니까?</v-card-title>
                            <v-card-actions>
                                <v-spacer />
                                <v-btn color="grey darken-1" text @click="cancel_dialog = false">아니오</v-btn>
                                <v-btn color="red darken-1" text @click="signUpCancel">예</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                    <v-btn color="primary" @click="signUpSubmit(1)" :disabled="infoCheck">Next</v-btn>
                </v-stepper-content>

                <v-stepper-content step="2">
                    <v-text-field v-model="code" label="입력하신 이메일로 인증코드를 발송하였습니다. 인증코드를 입력해주세요." hide-details="auto"></v-text-field>
                    <v-row>
                    <v-col>
                        <v-btn text @click="reconfirmPhoneNum">인증코드 다시받기</v-btn>
                    </v-col>
                    <v-col>
                        <v-btn color="primary" @click="confirmPhoneNum(2)" :disabled="codeCheck">Next</v-btn>
                    </v-col>
                    </v-row>
                    <v-snackbar v-model="signUp_err_snackbar" multi-line>인증코드가 유효하지 않습니다.<br>인증코드를 확인해주세요.
                        <v-btn text @click="signUp_err_snackbar = false" color="red">Close</v-btn>
                    </v-snackbar>
                </v-stepper-content>
    
                <v-stepper-content step="3">
                    <div class="signUp_complete">
                        <h4>Kestore 회원가입이 완료되었습니다!</h4>
                        <br>
                        <div>
                            모든 회원가입 절차가 완료되었습니다. <br>
                            신규 가입 기념 2000 포인트가 지급되었습니다.<br>
                            로그인 후 모든 서비스를 이용할 수 있습니다.
                        </div>
                    </div>
                    <v-btn text @click="signUpComplete_goSignIn">로그인</v-btn> 
                    <v-btn depressed color="primary" @click="signUpComplete_goToShop">메인으로 이동</v-btn>
                </v-stepper-content>
            </v-stepper-items>
            </v-stepper>
        </v-container>
    </div>
</template>

<script>
import { Auth } from 'aws-amplify'
import VuePhoneNumberInput from 'vue-phone-number-input'
import 'vue-phone-number-input/dist/vue-phone-number-input.css'

export default {
    name: "SignUp",
    data() {
        return {
            id: '',
            password: '',
            password_check: '',
            name: '',
            email: '',
            phone_number: '',
            formattedPhoneNum: '',
            code: '',
            user: '',

            cancel_dialog: false,
            step: 1,
            steps: 3,

            //사용자 입력값 rules
            id_rules: [
                value => !!value || '아이디를 입력해주세요.',
                value => (value && value.length >= 4) || '4글자 이상 입력해주세요.'
            ],
            passwd_rules: [
                value => !!value || '비밀번호를 입력해주세요.',
                value => (value && value.length >= 8) || '숫자와 소문자 알파벳 조합으로 8글자 이상 입력해주세요.'
            ],
            passwdChk_rules: [
                value => !!value || '비밀번호를 다시 한번 입력해주세요.',
                value => (value && value == this.password) || '비밀번호가 맞지 않습니다.'
            ],
            email_rules: [
                value => {
                    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    return pattern.test(value) || '이메일 형식이 일치하지 않습니다.'
                }
            ],

            signUp_err_snackbar: false,

            gender: 'M',
            birthdate: '',
            birthdate_formatted: '',
            birthdate_menu: false
        }
    },
    components:{
        VuePhoneNumberInput
    },
    watch: {
        step (key) {
            if(this.step > key) {
                this.step = key
            }
        },
        birthdate_menu (val) {
            val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
        },
        birthdate (val) {
            this.birthdate_formatted = this.formatDate(val)
        }
    },
    computed: {
        passwordCheck() {
            return this.password == this.password_check ? true : false
        },
        infoCheck() {
            //모든 회원 정보의 값이 null이 아니라면 disabled = false, 하나라도 null값이 있다면 disabled = true
            if(!!this.id && !!this.password && !!this.password_check && !!this.email && !!this.name && !!this.phone_number && !!this.gender && !!this.birthdate_formatted)
                return false
            else
                return true;
        },
        codeCheck() {
            //입력한 코드값이 여섯 숫자 이상이면 disabled = false
            return this.code.length >= 6 ? false : true
        }
    },
    methods: {
        onInput(key) {
            this.steps = parseInt(key)
        },
        savePayloadPhonenum(payload) {
            this.formattedPhoneNum = payload.formattedNumber
        },
        signUpSubmit(key) {
            Auth.signUp({
                username: this.id,
                password: this.password,
                attributes: {
                    name: this.name,
                    email: this.email,
                    phone_number: this.formattedPhoneNum,
                    birthdate: this.birthdate_formatted,
                    gender: this.gender,
                    'custom:init_point': "2000"
            },
            validationData: []  //optional
            })
            .then(data => {
                // console.log(this.phone_number)
                this.user = data.user
                this.step = key + 1})
            .catch(err => {
                switch(err.code) {
                    case "UsernameExistsException":
                        alert("사용자 아이디가 이미 존재합니다.")
                        break;
                    case "InvalidParameterException":
                        alert("전화번호를 형식에 맞게 입력해주세요.")
                        break;
                }
                console.log(err)});
        },
        confirmPhoneNum(key) {
            Auth.confirmSignUp(this.id, this.code, {
                forceAliasCreation: true    
            }).then(data => {
                console.log(data)
                this.step = key + 1
            }).catch(err => {
                if(err.code == 'CodeMismatchException')
                    this.signUp_err_snackbar = true
                console.log(err)
            });
        },
        reconfirmPhoneNum() {
            Auth.resendSignUp(this.id).then(() => {
                console.log('code resent successfully');
            }).catch(e => {
                console.log(e);
            });
        },
        saveBirthdate(date) {
            this.$refs.menu.save(date)
        },
        formatDate(date) {
            if(!date)
                return null

            const [year, month, day] = date.split('-')
            return `${month}/${day}/${year}`
        }, 
        signUpCancel() {
            this.$router.go(-1)
        },
        signUpComplete_goSignIn() {
            this.$router.push('/login')
        },
        signUpComplete_goToShop() {
            this.$router.push('/')
        },
    }
}
</script>

<style>
h3 {
    margin-top: 20px;
    margin-bottom: 15px;
}

input {
    margin: 10px;
    padding: 15px;
}

#sign_up button {
    margin-top: 50px;
}

.signUp_complete {
    margin-top: 20px;    
}
</style>
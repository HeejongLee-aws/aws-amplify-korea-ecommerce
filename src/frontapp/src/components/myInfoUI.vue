<template>
    <div id="myinfo">
        <v-card class="MyInfoAdmin">
            <v-card-text>
                <p class="display-1 text--primary">나의 정보</p>
                <div>
                    <v-row clss="subtitle-1">
                        <v-col class="font-weight-black" :cols="getFirstCol()">이름 :</v-col>
                        <v-col :cols="getSecondCol()">{{ UserInfo.name }}</v-col>
                    </v-row>
                    <v-row>
                        <v-col class="font-weight-bold" :cols="getFirstCol()">아이디 :</v-col>
                        <v-col :cols="getSecondCol()">{{ UserInfo.id }}</v-col>
                    </v-row>
                    <v-row>
                        <v-col class="font-weight-bold" :cols="getFirstCol()">인증 이메일 :</v-col>
                        <v-col :cols="getSecondCol()">{{ UserInfo.email }}</v-col>
                    </v-row>
                    <v-row>
                        <v-col class="font-weight-bold" :cols="getFirstCol()">전화번호 :</v-col>
                        <v-col :cols="getSecondCol()">{{ UserInfo.phoneNum }}</v-col>
                    </v-row>
                    <v-row>
                        <v-col class="font-weight-bold" :cols="getFirstCol()">생년월일 :</v-col>
                        <v-col :cols="getSecondCol()">{{ getUserBirthdate(UserInfo.birthdate) }}</v-col>
                    </v-row>
                    <v-row>
                        <v-col class="font-weight-bold" :cols="getFirstCol()">성별 :</v-col>
                        <v-col :cols="getSecondCol()">{{ getUserGender() }}</v-col>
                    </v-row>
                    <v-row align="center">
                        <v-col class="font-weight-black" :cols="getFirstCol()">배송지 : </v-col>
                        <v-col :cols="getDestinationSecondCol()" v-if="isDestinationExist">{{ this.$store.getters.getUserDB.destination }}</v-col>
                        <v-col :cols="getDestinationSecondCol()" v-if="!isDestinationExist">배송지를 설정해주세요.</v-col>
                        <!-- Hidden only on xs -->
                        <v-col class="d-none d-sm-flex" cols="2"><v-btn color="primary" text @click="toggleChangeDestination">변경하기</v-btn></v-col>
                        <!-- Visible only on xs -->
                        <v-col class="d-flex d-sm-none" cols="2"><v-btn icon @click="toggleChangeDestination"><v-icon>mdi-fountain-pen-tip</v-icon></v-btn></v-col>
                    </v-row>
                    <v-row v-if="changeDestination">
                        <v-col>
                            <v-card>
                                <v-card-text align="center">
                                    <v-row no-gutters align="center">
                                        <v-col :cols="getCalcChangeDestinationFCol()">우편번호</v-col>
                                        <v-col :cols="getCalcChangeDestinationSCol()"><v-text-field :value="zonecode"></v-text-field></v-col>
                                    </v-row>
                                    <v-row no-gutters align="center">
                                        <v-col :cols="getCalcChangeDestinationFCol()">도로명</v-col>
                                        <v-col :cols="getCalcChangeDestinationSCol()"><v-text-field multiple :value="new_destinaion"></v-text-field></v-col>
                                    </v-row>
                                    <v-row no-gutters align="center">
                                        <v-col :cols="getCalcChangeDestinationFCol()">지번</v-col>
                                        <v-col :cols="getCalcChangeDestinationSCol()"><v-text-field :value="jibunAddress"></v-text-field></v-col>
                                    </v-row>
                                    <v-row no-gutters align="center">
                                        <v-col :cols="getCalcChangeDestinationFCol()">상세주소</v-col>
                                        <v-col :cols="getCalcChangeDestinationSCol()"><v-text-field v-model="detailAddress"></v-text-field></v-col>
                                    </v-row>
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn text color="red darken-1" @click.stop="isDestinationSearch=true">검색하기</v-btn>
                                    <v-btn text color="green darken-1" @click="saveNewAddress">저장하기</v-btn>
                                </v-card-actions>
                            </v-card>
                            <v-dialog v-model="isDestinationSearch">
                                <v-card>
                                    <vue-daum-postcode @complete="getNewAddress($event), isDestinationSearch=false"/>
                                </v-card>
                            </v-dialog>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col class="font-weight-bold" :cols="getFirstCol()">나의 포인트 :</v-col>
                        <v-col :cols="getSecondCol()">{{ point }}p</v-col>
                    </v-row> 
                </div>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
import { updateMemberDestination } from '@/graphql/mutations.js'

export default {
    name: 'myinfo',
    data() {
        return {
            changeDestination: false,
            isDestinationSearch: false,
            
            new_destinaion:'',

            zonecode: '',
            jibunAddress: '',
            roadAddress: '',
            detailAddress: '',

            point: ''
        }
    },
    created() {
        this.getUserPoint()
    },
    computed: {
        UserInfo() {
            return this.$store.getters.getUserDB;
        },
        isDestinationExist() {
            return this.$store.getters.getUserDB.destination
        },
        isDisplayXS() {
            return this.$store.getters.getwindowSize.x < 600 ? true : false
        }
    },
    methods: {
        toggleChangeDestination() {
            this.changeDestination = !this.changeDestination
        },
        getNewAddress(result) {
            this.zonecode = result.zonecode
            this.jibunAddress = result.jibunAddress
            this.roadAddress = result.address
            let extraAddress = ''

            if(result.addressType === 'R') {
                if(result.bname !== '') {
                    extraAddress += result.bname
                }
                if(result.buildingName !== '') {
                    extraAddress += (extraAddress !== '' ? `, ${result.buildingName}` : result.buildingName)
                }
                this.roadAddress += (extraAddress !== '' ? ` (${extraAddress})` : '')
            }

            this.new_destinaion = this.roadAddress
        },
        saveNewAddress() {
            const userId = this.$store.getters.getUser.username

            const input = {
                id: userId,
                destination: this.new_destinaion+" "+this.detailAddress
            }

            this.$Amplify.API.graphql(this.$Amplify.graphqlOperation(updateMemberDestination, {input: input})).then((res) => {
                console.log(res)
                this.$store.commit('updateUserDestination', res.data.updateMember.destination)
            });

            this.changeDestination = false
            this.zonecode = ''
            this.jibunAddress = ''
            this.roadAddress = ''
            this.detailAddress = ''
        },
        getUserPoint() {
            if(this.UserInfo.point) {
                return this.point = this.UserInfo.point
            } else {
                return this.point = 0
            }
        },
        getUserBirthdate(date) {
            if (!date)
                return null

            const [month, day, year] = date.split('/')
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
        },
        getUserGender() {
            if(this.UserInfo.gender == 'M')
                return "남성"
            else
                return "여성"
        },
        getFirstCol() {
            if(this.isDisplayXS)
                return 5
            else
                return 2
        },
        getSecondCol() {
            if(this.isDisplayXS)
                return 7
            else
                return 10
        },
        getDestinationSecondCol() {
            if(this.isDisplayXS)
                return 5
            else
                return 8
        },
        getCalcChangeDestinationFCol() {
            if(this.isDisplayXS)
                return 3
            else
                return 2
        },
        getCalcChangeDestinationSCol() {
            if(this.isDisplayXS)
                return 9
            else
                return 9
        }
    }
}
</script>

<style>
.MyInfoAdmin {
    text-align: start;
    margin-top: 20px;
    margin-bottom: 30px;
    padding: 20px;
}
</style>
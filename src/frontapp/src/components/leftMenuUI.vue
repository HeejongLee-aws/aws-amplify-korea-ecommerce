<template>
  <div>
    <v-treeview :items="items"
    open-on-click
    >
      <template slot="label" slot-scope="{ item }">
      <a @click="clickCategory(item)">{{ item.name }}</a>
    </template>
    </v-treeview>
  </div>  
</template>


<script>
import { getDisplayCategoryList } from '@/graphql/queries.js'

export default {
    name: 'cornerUI',
    props: {
            'content': {
                type: Object
            }
    },
    components: {
    },
    data: () => ({
      items: []
    }),
    created() {

       this.getGategorys();
        
    },

    methods: {
      goCart() {
        return this.$router.push('/cart')
      },
      clickCategory(item) {
        this.$router.push("/cateDetail/"+item.id );
      },
      getGategorys() {
        this.$Amplify.API.graphql(this.$Amplify.graphqlOperation(getDisplayCategoryList)).then((res) => {
        this.items =res.data.getDisplayCategoryList.items;
        this.dataToHierarchy();
        });

      },
      dataToHierarchy() {
        var jsonDatesL1 = [];//1Level 데이터 
        var jsonDatesL2 = [];//2Level 데이터 
        var jsonDatesL3 = [];//3Level 데이터 

        var jsonObjL2List = [];
        var jsonObjL1List = [];
        //Level 별 데이터 분리
        this.items.forEach((element) => {
            var jsonDate = new Object();
            if(element.displayCategoryLevel =='L1'){
                jsonDate.upperCode = "0";
                jsonDate.item = element;
                jsonDatesL1.push(jsonDate);
            }else if(element.displayCategoryLevel =='L2' ){
                jsonDate.upperCode = element.displayGroupCode.substr(0,4)+'00000000';
                jsonDate.item = element;
                jsonDatesL2.push(jsonDate);
            }else if(element.displayCategoryLevel =='L3'){
                jsonDate.upperCode = element.displayGroupCode.substr(0,8)+'0000';
                jsonDate.item = element;
                jsonDatesL3.push(jsonDate);
            }
          
        });
        //3Level 데이터 2Levle children 항목으로 만들기
        //v-treeview 가 id,name 으로 인식하여~ displayGroupCode->id , displayCategoryName->name으로 key 명칭 변경
        jsonDatesL2.forEach((element) => {

            var jsonObjL3 = new Object();
            var l2 = [];

            jsonDatesL3.forEach((element2) => {
                if(element.item.displayGroupCode == element2.upperCode ){

                     var jsonConv = new Object();
                    jsonConv.id=element2.item.id;
                    jsonConv.code=element2.item.displayGroupCode;
                    jsonConv.level=element2.item.displayCategoryLevel;
                    jsonConv.name=element2.item.displayCategoryName;
                    jsonConv.url="/cateDetail";
                    l2.push(jsonConv)
                }
            });
             jsonObjL3.upperCode=element.upperCode;
             jsonObjL3.id=element.item.id;
             jsonObjL3.code=element.item.displayGroupCode;
             jsonObjL3.level=element.item.displayCategoryLevel;
             jsonObjL3.name=element.item.displayCategoryName;
             jsonObjL3.url="/cateDetail";
             jsonObjL3.children=l2;
             jsonObjL2List.push(jsonObjL3);

        });
         //2Level 데이터 1Levle children 항목으로 만들기
        //v-treeview 가 id,name 으로 인식하여~ displayGroupCode->id , displayCategoryName->name으로 key 명칭 변경
        jsonDatesL1.forEach((element) => {

            var jsonObjL2 = new Object();
            var l1 = [];

            jsonObjL2List.forEach((element2) => {
                if(element.item.displayGroupCode == element2.upperCode ){
                    l1.push(element2)
                }
            });

             jsonObjL2.upperCode=element.upperCode;
             jsonObjL2.id=element.item.id;
             jsonObjL2.code=element.item.displayGroupCode;
             jsonObjL2.level=element.item.displayCategoryLevel;
             jsonObjL2.name=element.item.displayCategoryName;
             jsonObjL2.url="/cateDetail";
             jsonObjL2.children=l1;
             jsonObjL1List.push(jsonObjL2);

        });
     
           this.items = jsonObjL1List;

      }
    }
}
</script>
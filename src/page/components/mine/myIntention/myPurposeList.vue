<template>
    <div>
        <div class="miList-wrapper">
            <div class="miList-container">
                <div class="title items">
                    <div class="list-a item">
                        发布时间
                        <div class="up-down" style="margin-left: 10px" @click="timeUpDownClick">
                            <span class="icon-item icon-up" :class="{active: timeUpDown == true}">&#xe605;</span>
                            <span class="icon-item icon-down" :class="{active: timeUpDown == false}">&#xe605;</span>
                        </div>
                    </div>
                    <div class="list-b item" @click="typeShowFn">
                        {{typeWriting}}
                        <div class="triangle-little" style="margin-left: 10px"></div>
                        <ul class="type-list" v-show="typeShow">
                            <li v-for="item in type" @click="typeClickFn(item)">{{item}}</li>
                        </ul>
                    </div>
                    <div class="list-c item">
                        发布标题
                    </div>
                    <div class="list-d item" @click="stateShowFn">
                        <span>{{stateWriting}}</span>
                        <div class="triangle-little" style="margin-left: 10px"></div>
                        <stateList :state="state" v-show="stateShow" @stateClick="stateClickFn"></stateList>
                    </div>
                    <div class="list-e item"></div>
                    <div class="list-f item"></div>
                </div>
                <div class="lists-containt">
                    <!--点击列表，展示意向详情-->
                    <div class="list items" v-for="(item,index) in myData" :class="{'list-active': listItemIndex === index}" @click="listClickFn(item,index)">
                        <div class="list-a item">
                            {{item.releasetime}}
                        </div>
                        <div class="list-b item">
                            {{item.demandtype}}
                        </div>
                        <div class="list-c item color">
                            <span>{{item.title}}</span>
                        </div>
                        <div class="list-d item">
                            {{item.responseProgress}}
                        </div>
                        <div class="list-e item">
                            <span class="icon-item talk-icon" @click.stop="chat(item)" style="cursor:pointer;">&#xe602;
                                <span v-show="talkNumShow">1</span>
                            </span>
                        </div>
                        <div class="list-f item color">
                            查看详情<span class="icon-item">&#xe686;</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <transition-group name="slidex-fade">
            <myPurpose v-if="myPurposeShow" :sendDataToMyPurpose="sendDataToMyPurpose" @close-this="closeThisFn" :key="5"></myPurpose>
            <myPurpose1 v-show="myPurpose1Show" @close-this="closeThisFn" @responseShow="responShow" :key="6"></myPurpose1>
            <myPurpose2 v-show="myPurpose2Show" @close-this="closeThisFn" @transShow="transShow" :key="7"></myPurpose2>
        </transition-group>
    </div>
</template>
<script>
    import * as vx from 'vuex'
    import tabulationBoxTrigger from '$src/public/js/tabulationBoxTrigger.js';
    import stateList from '../stateList.vue'
    import myPurpose from './myPurpose.vue'
    import myPurpose1 from './myPurpose1.vue'
    import myPurpose2 from './myPurpose2.vue'

    export default {
        data() {
            return {
                typeShow: false,    //需求类型显示
                stateShow: false,   //状态显示
                typeWriting: '需求类型',
                stateWriting: '状态',
                //不同需求类型展现的状态不同
                type: [],
                type0: ['运力投放'],
                type1: ['航线需求'],
                type2: ['运力投放','航线需求'],
                state: [],
                state1: ['意向征集','订单确认','交易完成','已撤回','需求关闭','落选'], // 航线需求
                state2: ['意向征集','订单确认','订单完成','佣金支付','交易完成','已撤回','需求关闭','落选'],//运力需求
                myPurposeShow: false, // myPublish是否显示
                myPurpose1Show: false,// myPurpose1是否显示
                myPurpose2Show: false,
                talkNumShow: false,         //是否有对话
                myData: [],                 // 将获取的数据，渲染到页面上
                myData0: [],                 // 航司能看到的数据，渲染到页面上
                myData1: [],                 // 机场能看到的数据，渲染到页面上
                myData2: [],                 // 太美能看到的数据，渲染到页面上
                listItemIndex: '',          // 被点击列的index，用来使其变成active
                timeUpDown: true,           // 通过时间进行排序
                sendData:{                   // 请求的参数
                    page:1,                  // 页码，必传
                    demandType: '',         // 查询需求类型 0:航线需求、1:运力需求、2:运营托管、3:航线委托、4:运力委托
                    responseProgress: '',   // 状态 [0:意向征集、1:订单确认、2:已撤回、3:需求关闭、4:落选状态 5:交易完成,6:订单完成,7:佣金支付]
                    orderType: 0            // 发布时间排序类型，0:倒序，1:正序
                },
                sendDataToMyPurpose: {},   // 向myPurpose传数据
            }
        },
        watch:{
            'sendData.orderType': function () {
                this.getListData();
            },
           /* 'sendData.demandType': function () {
                this.getListData();
            },*/
            'sendData.responseProgress': function () {
                this.getListData();
            },
            myData0: function () {
                this.myData0.forEach((val) => {
                    this.myData2.push(val)
                })
            },
            myData1: function () {
                this.myData1.forEach((val) => {
                    this.myData2.push(val)
                })
            }
        },
        mounted() {
            this.judgeRole();
            this.getListData();
            tabulationBoxTrigger.hierarchy = false; // navigation层级，true：不显示，false：显示
        },
        methods: {
            // 角色判断(0:航司,1:机场(政府),2:太美)，我的意向: 航司：航线需求,机场：运力需求
            judgeRole: function () {
                if(this.role.role == 1) {  // 机场
                    this.type = this.type0;
                    this.myData = this.myData0;
                    this.typeWriting = '运力投放';
                    this.state = this.state2;
                    this.sendData.demandType = 1;
                }if(this.role.role == 0) {  // 航司
                    this.type = this.type1;
                    this.myData = this.myData1;
                    this.typeWriting = '航线需求';
                    this.state = this.state1;
                    this.sendData.demandType = 0;
                }if(this.role.role == 2) {  // 太美
                    this.type = this.type2;
                    this.myData = this.myData2;
                }
            },
            // ajax获取列表数据
            getListData: function () {
                this.$ajax({
                    url:"/getResponseListOfMine",
                    method: 'post',
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded'
                    },
                    params: this.sendData
                }) .then((response) => {
                    this.myData0 = [];
                    this.myData1 = [];
                    if(response.data.opResult === '0') {
                        response.data.list.list.forEach((val) => {
                            if (val.demandtype == '运力需求' || val.demandtype == '运力投放') {
                                this.myData0.push(val);
                            }
                            if (val.demandtype == '航线需求') {
                                this.myData1.push(val);
                            }
                        });
                        this.judgeRole();
                    }else if(response.data.opResult === '1') {
//                        console.info('ajax1')
//                        this.myData0 = [];
//                        this.myData1 = [];
                        this.judgeRole();
                    }else {
                        alert('无法请求到数据，错误代码：' + response.data.opResult)
                    }
                }).catch((error) => {
                    console.log(error);
                });
            },
            // 刷新页面
            refreshFn: function () {
//                console.info('refreshFn');
                this.getListData();
            },
            // 聊天功能(传：demandEmployeeId（需求用户id）,employeeId（用户id）,id（此条意向id）)
            chat:function (item) {
                let chatObj = {};
                chatObj.demandEmployeeId = item.demandEmployeeId;
                chatObj.employeeId = item.employeeId;
                chatObj.id = item.demandId;
//                console.info(chatObj)
                tabulationBoxTrigger.$emit('addChat',chatObj);
            },
            // 不是我的，张帅的页面是否显示
            responShow: function () {
                this.myPurpose1Show = true;
                this.myPurpose2Show = false;
            },
            transShow: function () {
                this.myPurpose1Show = false;
                this.myPurpose2Show = true;
            },
            //*******************
            typeShowFn: function () {
                this.typeShow = !this.typeShow;
            },
            stateShowFn: function () {
                this.stateShow = !this.stateShow;
            },
            // 通过“发布时间”选择展示内容
            timeUpDownClick: function () {
                this.myData0 = [];
                this.myData1 = [];
                this.timeUpDown = !this.timeUpDown;
                this.sendData.orderType = this.timeUpDown ? 0 : 1;
            },
            // 通过“需求类型”选择展示内容 0:航线需求、1:运力需求、2:运营托管、3:航线委托、4:运力委托
            typeClickFn: function (item) {
                this.myData0 = [];
                this.myData1 = [];
                this.typeWriting = item;
                this.sendData.responseProgress = '';
                this.stateWriting = '状态';
                if(item == '运力投放' || item == '运力需求') {
                    this.state = this.state2;
                    this.sendData.demandType = 1;
                }if(item == '航线需求') {
                    this.state = this.state1;
                    this.sendData.demandType = 0;
                }
            },
            // 通过“状态”选择展示内容  [0:意向征集、1:订单确认、2:已撤回、3:需求关闭、4:落选状态 5:交易完成,6:订单完成,7:佣金支付]
            stateClickFn: function (item) {
                this.myData0 = [];
                this.myData1 = [];
                this.stateWriting = item;
                if(item == '意向征集') {
                    this.sendData.responseProgress = 0;
                }if(item == '订单确认') {
                    this.sendData.responseProgress = 1;
                }if(item == '已撤回') {
                    this.sendData.responseProgress = 2;
                }if(item == '需求关闭') {
                    this.sendData.responseProgress = 3;
                }if(item == '落选状态' || item == '落选') {
                    this.sendData.responseProgress = 4;
                }if(item == '交易完成') {
                    this.sendData.responseProgress = 5;
                }if(item == '订单完成') {
                    this.sendData.responseProgress = 6;
                }if(item == '佣金支付') {
                    this.sendData.responseProgress = 7;
                }
            },
            // 点击列表(list)，展示详情
            listClickFn: function (item,index) {
//                console.info('purposeItem:')
//                console.info(item)
                this.$ajax({
                    url:"/getResponseDetails",
                    method: 'post',
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded'
                    },
                    params: {
                        responseId: item.id //发布时间排序类型 0-倒序 1-正序
                    }
                }) .then((response) => {
//                    console.info('我的意向详情:')
//                    console.info(response.data.obj)
                    if(response.data.opResult == 0){
                        this.listItemIndex = index; //变成active状态
                        if(this.role.role == 0) { //0：航司 1：机场 2：太美
                            this.myPurposeShow = true;
                        }else if(this.role.role == 1) { //1：机场
//                            this.myPurpose1Show = true;
                            tabulationBoxTrigger.$emit('sendDataToMyPurpose12', response.data.obj);
                        }else if(this.role.role == 2) { //2：太美
                            if(response.data.obj.demandtype === '0') { //demandtype：（0:航线需求、1:运力需求、2:运营托管、3:航线委托、4:运力委托）
                                this.myPurposeShow = true;
                            }else if(response.data.obj.demandtype === '1') { //demandtype：（0:航线需求、1:运力需求、2:运营托管、3:航线委托、4:运力委托）
                                tabulationBoxTrigger.$emit('sendDataToMyPurpose12', response.data.obj);
                            }
                        }
                        this.sendDataToMyPurpose = response.data.obj;  //将item的参数传递给myPurpose.vue
                        tabulationBoxTrigger.hierarchy = true;  //将nav栏层级下调，不显示
                    }else {
                        alert('错误代码response.data.opResult：' + response.data.opResult)
                    }

                }).catch((error) => {
                    console.log(error);
                });
            },
            // 点击关闭详情
            closeThisFn: function () {
                this.listItemIndex = '';
                this.myPurposeShow = false;
                this.myPurpose1Show = false;
                this.myPurpose2Show = false;
                tabulationBoxTrigger.hierarchy = false;
                this.refreshFn();
            }
        },
        computed: {
            ...vx.mapGetters([
                'role'
            ]),
        },
        components: {
            stateList,
            myPurpose,
            myPurpose1,
            myPurpose2,
        }
    }
</script>
<style lang="scss" scoped>
    $icon-color: #3c78ff;
    $font-color: #605e7c;
    $border-color: rgba(96,94,124,0.37);
    ul {
        position: absolute;
        margin: 0;
        padding: 0;
        list-style: none;
        border-radius: 4px;
        box-shadow: 0 2px 11px $border-color;
        background: white;
        z-index: 2;
        li {
            padding-left: 17px;
            height: 35px;
            font-size: 1.2rem;
            color: $font-color;
            cursor: pointer;
            &:hover {
                background: #F5F5F5;
            }
        }
    }

    .icon-item {
        font-size: 1.6rem;
        font-family: iconfont;
    }
    .triangle-little {
        width: 0;
        height: 0;
        border-left: 4.5px solid transparent;
        border-right: 4.5px solid transparent;
        border-top: 5px solid $icon-color;
    }
    .color {
        color: #3c78ff;
    }
    .miList-wrapper {
       /* position: absolute;
        bottom: 0;
        left: 0;*/
        width: 100%;
        height: 500px;
        /*height: 434px;*/
        font-size: 1.2rem;
        background: #F8F8F8;
    }
    .miList-container {
        margin: 0 auto;
        padding-top: 40px;
        width: 1000px;
        height: 340px;
        .lists-containt {
            height: 280px;
            overflow-y: scroll;
        }
        .lists-containt::-webkit-scrollbar {
            width: 7px;
        }
        .lists-containt::-webkit-scrollbar-thumb {
            height: 56px;
            background: #D8D8D8;
            border-radius: 4px;
        }
        /*&::after {
            display: block;
            height: 60px;
            content: '';
        }*/
    }
    .items {
        display: flex;
        margin-bottom: 10px;
        padding: 0 40px;
        .item {
            display: flex;
            align-items: center;
            flex-shrink: 0;
        }
        .list-a {
            width: 100px;
            .up-down {
                position: relative;
                width: 20px;
                .active {
                    color: $icon-color;
                }
                .icon-up {
                    position: absolute;
                    bottom: -4px;
                    transform: rotate(180deg);
                }
                .icon-down {
                    position: absolute;
                    top: -4px;
                }
            }
        }
        .list-b {
            position: relative;
            margin-right: 40px;
            width: 100px;
            .type-list {
                top: 40px;
                left: 0;
                li {
                    display: flex;
                    align-items: center;
                    width: 103px;
                }
            }
        }
        .list-c {
            margin-right: 40px;
            width: 320px;
            >span {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
        .list-d {
            position: relative;
            width: 80px;
            >span {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
        .list-e {
            margin-right: 160px;
            width: 20px;
            .talk-icon {
                position: relative;
                font-size: 2.5rem;
                >span {
                    position: absolute;
                    top: -1px;
                    right: -1px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-width: 12px;
                    height: 12px;
                    font-size: 1.0rem;
                    color: white;
                    background: red;
                    border-radius: 20px;
                }
            }
        }
        .list-f {
            width: 60px;
            white-space: nowrap;
        }
    }
    .title {
        height: 40px;
    }
    .list {
        height: 58px;
        border: 1px solid transparent;
        border-radius: 4px;
        background: white;
        &:hover {
            background: #ebebeb;
        }
        &:active {
            border: 1px solid #d0d0d0;
            background: #ebebeb;
        }
        .list-f {
            cursor: pointer;
        }
    }
    .list-active {
        border: 1px solid #d0d0d0;
        background: #ebebeb;
    }
</style>
<template>
    <div class="wrapper" @click.self="closeThisFn">

        <div class="ald-container">
            <div class="first item-container">
                <span>{{myData.demandtypeStr}}详情</span>
                <span class="close-icon" @click="closeThisFn" style="cursor: pointer;">&times;</span>
            </div>
            <div class="second item-container">
                <div class="anew-publish" v-show="linkServiceShow" @click="linkServiceClickFn">
                    联系客服 <span class="icon-item">&#xe720;</span>
                </div>
                <div class="anew-publish" v-show="anewPublishShow" @click="anewPublishClickFn">
                    重新发布
                </div>
                <div class="edit-publish btn-w" v-show="editPublishShow" @click="editPublishClickFn">
                    <span class="icon-item">&#xe653;</span>编辑
                </div>
                <div class="top">
                    <span style="height: 25px;">{{myData.title}}</span>
                </div>
                <div class="bottom">
                    <span class="font-gray" style="margin-right: 46px; width: 160px;">创建于{{releasetime}}</span>
                    <span class="font-gray">状态:　
                        <span  v-if="demandStateText == true" style="color: red; font-weight: bold;">审核未通过</span>
                        <span v-else>{{myData.demandprogressStr}}</span>
                    </span>
                </div>
            </div>
            <!--后来添加的航线详情-->
            <div class="third item-container">
                <div class="start item">
                    <div class="item-a font-gray">始发<span v-show="myData.dptState == 0">机场</span>
                        <span v-show="myData.dptState == 1">区域</span></div>
                    <div class="item-b"><span v-if="myData.dptState == 1">{{myData.dpt}}</span><span v-else>{{myData.dptNm}}</span></div>
                    <div class="item-c font-gray">{{myData.dptAcceptnearairportStr}}临近机场</div>
                    <div class="item-d font-gray">出港资源</div>
                    <div class="item-e">{{myData.dptTime}}</div>
                </div>
                <div class="item-icon">
                    <span class="icon-item">&#xe672;</span>
                </div>
                <div class="pass item">
                    <div class="item-a font-gray">经停<span v-show="myData.pstState == 0">机场</span>
                        <span v-show="myData.pstState == 1">区域</span></div>
                    <div class="item-b"><span v-if="myData.pstState == 1">{{myData.pst}}</span><span v-else>{{myData.pstNm}}</span></div>
                    <div class="item-c font-gray">&nbsp;<!--此处有空格--></div>
                    <div class="item-d font-gray">出港资源</div>
                    <div class="item-e">{{myData.pstTimeresourcesStr}}</div>
                </div>
                <div class="item-icon">
                    <span class="icon-item">&#xe672;</span>
                </div>
                <div class="arrive item">
                    <div class="item-a font-gray">到达<span v-show="myData.arrvState == 0">机场</span>
                        <span v-show="myData.arrvState == 1">区域</span></div>
                    <div class="item-b"><span v-show="myData.arrvState == 0">{{myData.arrvNm}}</span>
                        <span v-show="myData.arrvState == 1">{{myData.arrv}}</span></div>
                    <!--下方有空格-->
                    <div class="item-c font-gray">&nbsp;<!--此处有空格--></div>
                    <div class="item-d font-gray">&nbsp;<!--此处有空格--></div>
                    <div class="item-e">&nbsp;<!--此处有空格--></div>
                </div>
            </div>
            <div class="fourth item-container">
                <div class="items">
                    <div class="left item">
                        <div class="font-gray">拟开时间</div>
                        <div class="font-gray">拟飞机型</div>
                        <div class="font-gray">客量期望</div>
                        <div class="font-gray">补贴政策</div>
                    </div>
                    <div class="right item">
                        <div class="item-height">{{myData.sailingtime}}</div>
                        <div class="item-height">{{myData.aircrfttyp}}</div>
                        <div class="item-height">{{myData.aircrfttyp}}</div>
                        <div class="item-height">{{myData.subsidypolicyStr}}</div>
                    </div>
                </div>
                <div class="items">
                    <div class="left item">
                        <div class="font-gray">拟开班期</div>
                        <div class="font-gray">座位数</div>
                        <div class="font-gray">客座率期望</div>
                        <div class="font-gray">有效期</div>
                    </div>
                    <div class="right item">
                        <div class="item-height">{{myData.days}}</div>
                        <div class="item-height">{{myData.seating}}</div>
                        <div class="item-height">{{myData.loadfactorsexpect}}%</div>
                        <div class="item-height">{{myData.periodValidity}}</div>
                    </div>
                </div>
            </div>

            <div class="fifth item-container">
                <div class="left font-gray">其他说明</div>
                <div class="right">{{myData.remark}}</div>
            </div>
            <div class="seventh item-container">
                <span v-show="wrongTextShow" class="danger">*XXXX事情有误，请重新输入</span>
            </div>
            <span class="line"></span>
            <div class="eighth">
                <div class="buttons" v-if="buttonShow == true">
                    <button class="btn btn-w" @click="recallFn(),closeThisFn()">结束需求</button>
                </div>
                <div class="buttons" v-else>
                    <button class="btn btn-w" style="width: 100px; margin-right: 12px; background: #cccccc; color: white;" @click="anewPublishClickFn2(),closeThisFn()">重新发布</button>
                    <button class="btn btn-w" style="width: 100px;" @click="recallFn(),closeThisFn()">结束需求</button>
                </div>
            </div>
            <editTransportForm v-if="editTransportFormShow" @close-this="closeEditTransportForm" @change-showCode="changeShowCodeFn"></editTransportForm>
            <editAirlineReq v-if="editAirlineReqShow" @close-this="closeEditAirlineReq" @change-showCode="changeShowCodeFn"></editAirlineReq>
        </div>
    </div>
</template>
<script>
    import tabulationBoxTrigger from '$src/public/js/tabulationBoxTrigger.js'
    import editTransportForm from './editTransportForm.vue'
    import editAirlineReq from './editAirlineReq.vue'

    export default {
        data() {
            return {
                myData: {},             // 获取的数据渲染到页面上
                anewPublishShow: false, //“重新发布”是否显示
                linkServiceShow: false, // "联系客服"是否显示
                editPublishShow: false, // “编辑”是否显示
                demandStateText: false, //"审核未通过"是否显示
                wrongTextShow: false,  // 错误提示是否显示
                buttonShow: true,      // 按钮显示一个或两个
                releasetime: '',        //创建时间
                editTransportFormShow: false, //编辑需求表单
                editAirlineReqShow: false,
                recallData: {},         //点击“撤回该托管”传的数据
                id: '',                 // 点击列表获取这条需求id
            }
        },
        mounted() {
            // 从myPublishList获取参数，并渲染到页面上
            tabulationBoxTrigger.$on('sendDataToMyPublish',val => {
//                console.info('从myPublishList获取的数据:');
//                console.info(val);
                this.myData = val;
                this.id = this.myData.id;
                // 状态有误时显示的内容
//                this.wrongShow();
                if(this.myData.demandstate == 2){
                    this.wrongShow();
                }else{
                    this.show();
//                    this.wrongShow();
                }
                //将创建时间顺序改变
                let time1 = this.myData.releasetime.split('.');
                let time2 = [];
                for(let i = time1.length - 1; i >= 0; i--){
                    time2.push(time1[i]);
                }
                this.releasetime = time2.join('.');
            });

            //判断审核是否通过,“重新发布”是否显示
        },
        computed: {
        },
        components: {
            editTransportForm,
            editAirlineReq
        },
        methods: {
            // 格式无误时显示的内容
            show: function () {
                this.buttonShow = true; //下方按钮显示1个
                this.linkServiceShow = true; // 上方“联系客服”按钮
                this.editPublishShow = false;  // 上方“编辑”按钮
                this.anewPublishShow = false; //上方“重新发布”按钮
                this.demandStateText = false; //"审核未通过"是否显示
                this.wrongTextShow = false;  //警告信息
            },
            // “格式有误时显示的内容
            wrongShow: function () {
                this.buttonShow = true; //下方按钮显示1个
                this.linkServiceShow = false; // 上方“联系客服”按钮
                this.editPublishShow = false;  // 上方“编辑”按钮
                this.anewPublishShow = true; //上方“重新发布”按钮
                this.demandStateText = true; //"审核未通过"是否显示
                this.wrongTextShow = true;   //警告信息
            },
            // 点击“联系客服”
            linkServiceClickFn: function () {
                alert('联系客服');
            },
            closeThisFn: function () {
                this.$emit('close-this');
            },
            //点击上方的“重新发布”
            anewPublishClickFn: function () {
//                alert('重新发布')
                this.buttonShow = false; //下方按钮显示1个
                this.linkServiceShow = false; // 上方“联系客服”按钮
                this.editPublishShow = true;  // 上方“编辑”按钮
                this.anewPublishShow = false; //上方“重新发布”按钮
            },
            // 点击“编辑”
            editPublishClickFn: function () {
                if(this.myData.demandtype == 0) {
                    this.editAirlineReqShow = true;
//                    console.info('editAirlineReqShow')
                }if(this.myData.demandtype == 1) {
                    this.editTransportFormShow = true;
//                    console.info('editTransportFormShow')
                }
            },
            // 点击表单的“确认”后
            changeShowCodeFn: function () {
                this.editPublishShow = false;
                this.anewPublishShow = false;
                this.wrongTextShow = false;
                tabulationBoxTrigger.$on('sendToMyPublish',(val) => {
//                    console.info('sendToMyPublish:')
//                    console.info(val)
                    this.myData = val;
                    this.myData.id = this.id
//                    console.info(this.id)
                    //将创建时间顺序改变
                    /*let time1 = this.myData.releasetime.split('.');
                    let time2 = [];
                    for(let i = time1.length - 1; i >= 0; i--){
                        time2.push(time1[i]);
                    }
                    this.releasetime = time2.join('.');*/
                });
            },
            //关闭“编辑需求”表单
            closeEditTransportForm: function () {
                this.editTransportFormShow = false;
            },
            closeEditAirlineReq: function () {
                this.editAirlineReqShow = false;
            },
            //点击下方“重新发布”
            anewPublishClickFn2: function () {
//                console.info(this.myData);
                this.$ajax({
                    url:"/demandAdd",
                    method: 'post',
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded'
                    },
                    params: this.myData
                }) .then((response) => {
//                    console.info(response.data)
//                    this.$store.dispatch('hybridData', response.data.list.list).then(() => {});
                }) .catch((error) => {
                    console.log(error);
                });
            },
            // "撤回该托管",调用修改接口，传id和demandprogress = 3（关闭）
            recallFn: function () {
                this.recallData.id = this.myData.id;
                this.recallData.demandprogress = 3;
//                console.info(this.recallData);
                this.$ajax({
//                    url:"/demandUpdate",
                    url: "closeDemandById",
                    method: 'post',
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded'
                    },
//                    params: this.recallData
                    params: {
                        id: this.myData.id
                    }
                }) .then((response) => {
//                    console.info(response.data)
//                    this.$store.dispatch('hybridData', response.data.list.list).then(() => {});
                }) .catch((error) => {
                    console.log(error);
                });
            },
        }
    }
</script>
<style lang="scss" scoped>
    /*多行省略号，兼容多个浏览器*/
    @mixin line-clamp($lines, $line-height: 20px) {
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: $lines; // number of lines to show
        overflow: hidden;
        line-height: $line-height;
        max-height: $line-height * $lines;
    }
    /**************************/
    .font-gray {
        color: rgba(96, 94, 124, 0.7);
    }
    .danger {
        color: #FF9393;
    }
    .icon-item {
        font-size: 1.6rem;
        font-family: iconfont;
    }
    .btn-b {
        outline: none;
        border: 0;
    }
    .btn-w {
        outline: none;
    }
    .wrapper {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, .4);
        z-index: 30;
    }
    .ald-container{
        position: absolute;
        top: 0px;
        right: 0px;
        /*padding-bottom: 100px;*/
        width: 600px;
        height: 100%;
        min-height: 700px;
        font-size: 1.2rem;
        background: white;
        z-index: 12;
    }
    .item-container {
        display: flex;
        padding: 0 40px;
    }
    .first {
        position: relative;
        justify-content: space-between;
        align-items: center;
        height: 41px;
        font-size: 12px;
        .close-icon {
            position: absolute;
            right: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 22px;
            height: 22px;
            border: 1px solid gray;
            border-radius: 100%;
        }
    }
    .second {
        position: relative;
        flex-direction: column;
        margin-bottom: 20px;
        height: 100px;
        background: rgba(216,216,216, .17);
        .anew-publish {
            position: absolute;
            top: 25px;
            right: 25px;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100px;
            height: 20px;
            color: white;
            border-radius: 20px;
            background: #3C78FF;
            cursor: pointer;
        }
        .edit-publish {
            position: absolute;
            top: 25px;
            right: 25px;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 72px;
            height: 27px;
            border-radius: 20px;
            cursor: pointer;
        }
        .top {
            display: flex;
            margin: 30px 0 15px 0;
            font-size: 20px;
        }
        .bottom {
            display: flex;
            margin-left: 3px;
        }
    }
    .third {
        position: relative;
        justify-content: space-between;
        margin-bottom: 20px;
        .item {
            width: 140px;
            height: 160px;
            .item-a {
                margin: 25px 0 10px 0;
            }
            .item-b {
                height: 25px;
                font-size: 20px;
            }
            .item-c {
                margin-bottom: 23px;
            }
            .item-d {
                margin-bottom: 5px;
            }
            .item-e {}
        }
        .item-icon {
            position: relative;
            >span {
                position: absolute;
                top: 55px;
                left: 50%;
                margin-left: -8px;
            }
        }
    }
    .fourth {
        justify-content: space-between;
        align-items: flex-start;
        .items {
            display: flex;
            width: 240px;
            .item {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                line-height: 40px;
                .item-height {
                    height: 40px;
                }
            }
            .left {
                width: 80px;
            }
            .right {
                width: 160px;
            }
        }
    }
    .fifth {
        margin-top: 20px;
        height: 100px;
        .left {
            flex-shrink: 0;
            width: 80px;
            line-height: 20px;
        }
        .right {
            @include line-clamp(3);
        }
    }
    .seventh {
        position: absolute;
        bottom: 125px;
    }
    .line {
        position: absolute;
        left: 20px;
        bottom: 110px;
        width: 560px;
        height: 2px;
        background: #f3f3f3;
    }
    .eighth {
        position: absolute;
        left: 20px;
        bottom: 0;
        display: flex;
        justify-content: center;
        /*align-items: center;*/
        width: 560px;
        height: 100px;
        background: white;
        .buttons {
            display: flex;
            margin-top: 18px;
            height: 40px;
            >.btn-b {
                margin-right: 14px;
                width: 300px;
                border-radius: 20px;
            }
            >.btn-w {
                width: 200px;
                border-radius: 20px;
            }
        }
    }
</style>
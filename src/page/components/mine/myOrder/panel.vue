<template>
    <div class="wrap" @click.self="closeDetail">
        <div class="box shadow">
            <div class="panel-header">
                <p class="mgr-l">订单详情<span  class="iconfont closer" @click="closeDetail">&#xe62c;</span></p>
            </div>
            <div class="aplan-wrapper">
                <listModule :ndetailData="metaData.data"
                            :type="typeList[detailData.demandType]"
                            v-if="metaData">
                </listModule>
                <itenListModule
                            :ndetailData="metaData.responseList[0]"
                            :type="typeList[detailData.demandType==1?0:1]"
                            v-if="metaData && metaData.responseList.length>0">
                </itenListModule>
                <template v-if="false">
                    <header>
                        <div class="head-til">收到的意向</div>
                    </header>
                    <div class="table-form-extend">
                        <div class="table-header">
                            <span class="item-a">收到时间</span><span class="item-b">意向方</span>
                        </div>
                        <ul class="table-body">
                            <li v-for="(item, index) in extend.data">
                                <div class="list">
                                    <span class="item-a">2017.12.19</span>
                                    <span class="item-b">CTU</span>
                                    <span v-show="extend.active!=index" @click="extend.active=index" class="item-c">查看详情</span>
                                    <span v-show="extend.active===index" @click="extend.active=-1" class="item-c">收起详情</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
    import listModule from './detailListModule.vue';
    import itenListModule from './Iten-ListModule.vue';
    import tabulationBoxTrigger from '$src/public/js/tabulationBoxTrigger.js'

    export default{
        data(){
            return {
                show:{
                    swrapper: false,
                },
                reason:{
                    text: '',
                    textLength:0
                },
                metaData: null,
                fatherScroll:true,
                typeList: ['航线需求','运力投放 '],
                extend:{
                    data:[
                        {
                            name: '1',
                            age:'2'
                        },
                        {
                            name: '3',
                            age:'4'
                        },
                        {
                            name: '5',
                            age:'6'
                        },
                    ],
                    active: -1
                }
            }
        },
        components: {listModule,itenListModule},
        props: ["detailData"],
        watch:{
            reason:{
                handler: function (val,oval) {
                    if(val.length>100){
                        this.reason.text.splice(0,100);
                    }
                    this.reason.textLength = this.reason.text.length;
                },
                deep: true
            }
        },
        methods: {
            closeDetail:function () {//关闭所有
                this.$emit("closeAll");
            },
            changeState: function (state,reason) {
                let rsk = reason||'';
                return new Promise((resolve,reject)=>{
                    this.$ajax({
                        method: 'POST',
                        url: '/checkDemand',
                        params: {
                            demandId : this.detailData.id,
                            demandState: state,
                            rek: rsk
                        }
                    }).then(res=>{
                        if(res.data.opResult===0){
                            resolve(res.data.opResult);
                        }else{
                            reject("未处理成功");
                        }
                    }).catch(err=>{
                        reject(err);
                    })
                })
            },
            postPass:function () {//审核通过
                let that = this;
                that.changeState(0).then((val)=>{
                    that.detailData.demandstate = "审核通过";
                    alert("success:审核通过");
                },(err)=>{
                    that.detailData.demandstate = "审核通过";
                    alert("faild:审核通过");
                });
            },
            //拒绝
            postReason:function () {//提交
                let that = this;
                that.show.swrapper = false;
                that.changeState(1,that.reason.text).then((val)=>{
                    that.detailData.demandstate = "审核未通过";
                    that.metaData.rek = that.reason.text;
                    alert("success:审核未通过");
                },(err)=>{
                    that.detailData.demandstate = "审核未通过";
                    alert("faild:审核未通过");
                });
            },
            closeReason: function () {//取消
                this.reason.text = '';
                this.show.swrapper = false;
            },
            getScrollWidth: function () {
                let noScroll, scroll, oDiv = document.createElement("DIV");
                oDiv.style.cssText = "position:absolute; top:-1000px; width:100px; height:100px; overflow:hidden;";
                noScroll = document.body.appendChild(oDiv).clientWidth;
                oDiv.style.overflowY = "scroll";
                scroll = oDiv.clientWidth;
                document.body.removeChild(oDiv);
                return noScroll-scroll;
            }
        },
        created: function () {
            let fdom = document.querySelector('.my-center');
            if(!(fdom.offsetHeight===fdom.scrollHeight===fdom.clientHeight)){
                this.fatherScroll = false;
                fdom.style.overflow = 'hidden';
                fdom.style.right = this.getScrollWidth()+'px';
            }
            //取出拒绝原因
            let that = this;
            let id = this.detailData.id,
                responseId = this.detailData.responseId;

            this.$ajax({
                method: 'GET',
                url: '/seeMyOrderDetail',
                params: {
                    id,
                    responseId
                }
            }).then(res=>{
                that.metaData = res.data;
            }).catch(err=>{
            })
        },
        mounted:function () {
            tabulationBoxTrigger.hierarchy = true;
        },
        destroyed: function () {
            tabulationBoxTrigger.hierarchy = false;
            if(this.fatherScroll){
                let fdom = document.querySelector('.my-center');
                fdom.style.overflow = 'auto';
                fdom.style.right = '0';
            }
        }
    }
</script>

<style lang="scss" scoped>
　　.input textarea{border:none; text-indent:5px;line-height:20px;background:url(http://www.w3dev.cn/eg/linebg.gif) repeat;overflow:auto}
    $bt-c: #605e7c;
    $txt-c: #3c78ff;
    $bor-c: #efefef;
    $spt-c: #979797;
    /*通用設定*/
    *{
        box-sizing: border-box;
    }
    h1,h2,h3,h4,h5,h6{
        color: $bt-c;
    }
    .panel-header{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 50px;
        line-height: 50px;
        text-indent: 50px;
        color: rgba(96,94,124,.7);
        box-shadow: 0px 5px 10px rgba(216, 216, 216, 0.9);
        z-index: 1;
    }
    .mgr-l{
    }
    .flex-center{
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .tips-top{
        color: red;
        position: absolute;
        top: -35%;
        left: 10px;
    }
    .tips-pas{
        color: green;
        position: absolute;
        top: -35%;
        left: 10px;
    }
    .closer{
        display: inline-block;
        position: absolute;
        right: 3%;
        top: 5px;
        margin-top:9px;
        width:22px;
        height:22px;
        line-height:22px;
        text-align:center;
        text-indent: 0;
        color:#3C78FF;
        border:1px solid #ededed;
        border-radius: 11px;
        cursor:pointer;
    }
    /*主體内容*/
    .aplan-wrapper{
        position:absolute;
        top: 50px;
        right:0;
        width:100%;
        box-sizing:border-box;
        color:#605E7C;
        overflow: hidden;
        background-color:#fff;
        max-height: 90%;
        overflow-y: auto;
        box-shadow: -5px 5px 15px rgba(216,216,216,.9) inset;
    }
    .wrap{
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0.2);
        z-index: 11;
    }
    .shadow{
        box-shadow: 0px 0px 15px #888;
    }
    .box{
        position: absolute;
        width: 600px;
        height: 100%;
        top: 0;
        right: 0;
        background-color: #fff;
        padding: 20px 20px;
    }
    .footer{
        position: absolute;
        width: 95%;
        height: 120px;
        bottom: 0;
        border-top: 1px solid $spt-c;
    }
    .btn{
        display: inline-block;
        margin: 0 4px;
        text-align: center;
        border-radius: 20px;
        width: 120px;
        height: 40px;
        line-height: 40px;
        color: #fff;
        cursor: pointer;
    }
    .btn-prime{
        width: 220px;
        background-color: #3c78ff;
        box-shadow: 1px 1px 6px rgba(60,120,255,.6);
    }
    .btn-gray{
        color: #000;
        width: 100px;
        border: 1px solid #ccc;
    }
    .swrapper{
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background-color: rgba(0,0,0,.2);
    }
    .rsn-box{
        width: 620px;
        height: 370px;
        background-color: #fff;
        position: relative;
        padding: 20px 20px;
    }
    .rsn-body{
        position: relative;
        height: 172px;
        border-radius: 5px;
        background-color: $bor-c;
        padding: 10px 10px;
        .txtarea{
            display: inline-block;
            position: absolute;
            width: 420px;
            height: 150px;
            margin: 0 10px;
        }
        .letter-counter{
            position: absolute;
            bottom: 5px;
            right: 10px;
        }
    }
    .footer-s{
        position: absolute;
        width: 90%;
        height: 120px;
        bottom: 0;
    }


    header{
        box-sizing: border-box;
        width:100%;
        background-color:rgba(216,216,216,.2);
        padding: 5px 40px 0 50px;
        .head-til{
            font-size:20px;
            font-weight:bold;
            height: 80px;
            line-height: 80px;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
        }
        .tips{
            height:12px;
            line-height:12px;
            color:rgba(96, 94, 124, 0.7);
            padding:20px 0;
            span{
                margin-right:30px;
            }
        }
    }
    .table-form-extend{
        width: 100%;
        box-sizing: border-box;
        padding: 40px 0;
        .table-header{
            padding: 0 50px;
            display: flex;
            .item-a{
                flex:2;
            }
            .item-b{
                flex:5;
            }
        }
        .table-body{
            list-style: none;
            padding: 0 30px;
            li{
                background-color: #eee;
                margin: 5px 0;
                .list{
                    height: 60px;
                    line-height: 60px;
                    padding: 0 20px;
                    display: flex;
                    .item-a{
                        flex:2;
                    }
                    .item-b{
                        flex:4;
                    }
                    .item-c{
                        flex:1;
                        color: #3c78ff;
                        cursor: pointer;
                    }
                }
                .main-info{
                    box-sizing: border-box;
                    width: 100%;
                    padding: 0 20px;
                    border-top: 2px solid #000;
                }
            }
        }
    }
</style>
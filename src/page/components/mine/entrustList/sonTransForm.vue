<template>
    <div class="t-form scroll popup">
        <div class="t-must">
            <div class="form-box">
                <div class="t-title">联系人</div><input type="text" placeholder="请填写有效联系人" v-model="contact">
            </div>
            <div class="form-box">
                <div class="t-title">联系方式</div><input type="text" placeholder="请填写有效联系方式" @blur="verifyPhon" v-model="phoneNum">
                <div class="error" v-show="isError">*电话格式有误，请重新输入</div>
            </div>
            <div style="height:20px;width:100%;" v-if="isError"></div>
        </div>
        <div class="t-optional">
            <div class="form-box">
                <div class="t-title">出港时刻</div>
                <div class="radio-box">
                    <div class="t-radio">
                        <input type="radio" class="magic-radio" id="timeYes" v-model="getTime" value="true" ><label for="timeYes">有&nbsp;</label>
                    </div>
                    <div class="selected" v-if="this.getTime == 'true'">
                        <div @click="boxShow1=!boxShow1" :class="{selec:pickStart}">{{timeStart}}</div>
                        <span>-</span>
                        <div @click="boxShow2=!boxShow2" :class="{selec:pickEnd}">{{timeEnd}}</div>
                      <div class="time-table popup time-start" v-show="boxShow1">
                          <div class="time-item" v-for="(num,index) in timeData" @click="pickTime1(index)">{{num}}</div>
                      </div>
                      <div class="time-table popup time-end" v-show="boxShow2">
                          <div class="time-item" v-for="(num,index) in timeData" @click="pickTime2(index)">{{num}}</div>
                      </div>
                    </div>
                    <div class="t-radio">
                        <input type="radio" class="magic-radio" id="timeNo" v-model="getTime" value="false"><label for="timeNo">无</label>
                    </div>
                </div>
            </div>
            <div class="form-box">
                <div class="t-title">是否有班期</div>
                <div class="radio-box">
                    <div class="t-radio">
                        <input type="radio" class="magic-radio" id="flightYes" v-model="getFlight" value="true"><label for="flightYes">有&nbsp;</label>
                    </div>
                    <div class="selected border" @click="showBox=!showBox" v-show="this.getFlight == 'true'">
                        <span class="fl-til" v-text="msg" :class="{selec:isSel}"></span>
                        <span class="icon-item icon-item1">&#xe605;</span>
                        <div class="dropDown popup" v-show="showBox">
                            <div @click="getNeed(index)" v-for="(value,index) in stateType">{{value}}</div>
                        </div>
                    </div>
                    <div class="t-radio">
                        <input type="radio" class="magic-radio" id="flightNo" v-model="getFlight" value="flase"><label for="flightNo">无</label>
                    </div>
                </div>
            </div>
            <div class="form-box air-route">
                <div class="t-title">意向航线</div>
                <input type="text" placeholder="起飞机场" v-model="intendedDpt" v-on:keyup="openSearch3"><span class="icon-item ">&#xe672;</span>
                <airportS1 class="aisx" v-on:resData="dptData" :searchText="intendedDpt" v-show="dptSearch" style="left:-17px;top:48px;"></airportS1>
                <input type="text" placeholder="经停机场（可选填）" v-model="intendedPst" v-on:keyup="openSearch4"><span class="icon-item ">&#xe672;</span>
                <airportS1 class="aisx" v-on:resData="pstData" :searchText="intendedPst" v-show="pstSearch" style="left:160px;top:48px;"></airportS1>
                <input type="text" placeholder="目标机场（可选填）" v-model="intendedArrv" v-on:keyup="openSearch5">
                <airportS1 class="aisx" v-on:resData="arrvData" :searchText="intendedArrv" v-show="arrvSearch" style="left:300px;top:48px;"></airportS1>
            </div>
            <div class="form-box">
                <div class="t-title">机型</div><input type="text" placeholder="输入选择机型" v-model="airplaneTyp" v-on:keyup="getAirplaneTyp">
                <div class="airpl-typ popup scroll" v-show="airplTypShow">
                    <div v-for="(item,index) in airTypData" @click="getAirType(index)">{{item}}</div>
                </div>
            </div>
            <div class="form-box se-place" >
                <div class="t-title">运力基地</div><input type="text" placeholder="输入选择机场" v-model="searchText" v-on:keyup="openSearch">
              <airportS class="aisx" v-on:resData="resData" :searchText="searchText" v-show="isSearch"></airportS>
            </div>
            <div class="form-box reset">
                <div class="t-title">运力归属</div><input type="text" placeholder="输入选择航司" v-model="airCompany" @click="getAirCompany">
                <div class="airpl-typ popup scroll" v-show="airCompanyShow" style="top:49px;">
                    <div v-for="(item,index) in airCompanyData" @click="getCompanyList(index)">
                    <span>{{item[0]}}</span>
                    <span>{{item[1]}}</span>
                    </div>
                </div>
            </div>
            <div class="form-box reset">
                <div class="t-title">座位布局</div><input type="text" placeholder="填写举例：F8Y160" v-model="seat">
            </div>
            <div class="form-box pad1 taken">
                <div class="t-title">小时成本</div><input type="text" placeholder="请填写小时成本" v-model="hourcost">
                <span>w/h</span>
            </div>
            <div class="form-box  pad1 dispatch">
                <div class="t-checkbox">
                    <input type="checkbox" name=" " id="dispatch" class="magic-radio" v-model="dispatch"><label for="dispatch">接受调度</label>
                </div>
                <input type="text" v-show="dispatch" v-model="dispatchText" v-on:keyup="openSearch1" placeholder=" ">
                <airportS class="aisx"  :searchText="dispatchText" v-on:resData="disData" v-show="dispatchSearch" style="top:50px;"></airportS>
                <div class="history" v-show="dispatch">
                    <div class="his-item" v-for="(name,index) in searchData">{{name}} <span @click="delItem(index)">x</span></div>
                </div>
            </div>
            <div class="form-box tips pad1">
                <div class="t-title">其他说明</div><input type="text" placeholder="可选填" v-model="tip" maxlength="35">
                <span class="num"><span >{{num}}</span>/35</span>
            </div>
            <div class="form-box get-time" ref="timeForm">
                <div class="t-title" ref="timeTitle">发布有效期</div>
               <div class="calendar time-btn" ref="timeDate">
                 <div class="myslec"  @click="calendarShow=!calendarShow"><span class="icon-item ">&#xe607;</span>{{myDate}}</div>
                 <div v-show="calendarShow" class="calendar-box popup">
                   <div class="selec-data">
                     <input type="text" placeholder="开始时间" v-model="calendarInitDay1"><span>-</span>
                     <input type="text" placeholder="结束时间" v-model="calendarInitDay2">
                     <div class="confirm-btn btn" @click="getMyDate">确定</div>
                     <div class="cancel-btn btn" @click="calendarShow=!calendarShow">取消</div>
                   </div>
                   <calendar v-on:changeDate="getDate1" :initDay="calendarInitDay1"></calendar>
                   <calendar v-on:changeDate="getDate2" :initDay="calendarInitDay2"></calendar>
                 </div>
               </div>
            </div>
        </div>
        <div class="post-type">
            <div class="t-radio">
                <input type="radio" name="type" id="type1" class="magic-radio" v-model="post" value="0"><label for="type1">对所有人公开</label>
            </div>
            <div class="t-radio">
                <input type="radio" name="type" id="type2" class="magic-radio" v-model="post" value="1"><label for="type2">对认证用户公开</label>
            </div>
            <div class="t-radio">
                <input type="radio" name="type" id="type3" class="magic-radio" v-model="post" value="3"><label for="type3">定向发布</label>
            </div>
            <div class="direction t-radio" style="position:relative;">
                <input type="text" v-show="this.post == '3' " style="width:200px;" v-model="directText" v-on:keyup="openSearch2">
                <div class="history" v-show="this.post == '3'" style="top:-5px;left:2px;line-height:26px;">
                    <div class="his-item" v-for="(name,index) in searchData1">{{name}} <span @click="delItem1(index)">x</span></div>
                </div>
                <airportS class="aisx"  :searchText="directText" v-on:resData="directData" v-show="directSearch" style="top:25px;"></airportS>
            </div>
        </div>
        <div class="t-btn">
            <div class="confirm-btn " @click="confirm">确认发布</div>
            <div class="cancel-btn " @click="cancel">取消</div>
        </div>
    </div>
</template>
<script>
 import calendar from './../../calendar'
 import airportS from './../../../reuseComponents/airportSearch.vue'//可匹配机场和地区搜索
 import airportS1 from './../../../reuseComponents/airportSearch1.vue'//仅可匹配机场搜索
 import tabulationBoxTrigger from '$src/public/js/tabulationBoxTrigger.js'
    export default {
        data () {
            return{
                showBox: false,
                boxShow1: false,
                boxShow2: false,
                isSel: false,
                isError: false,
                phoneNum: '',
                getFlight: 'true',
                getTime: 'true',
                dispatch:false,
                pickStart:false,
                pickEnd:false,
                airplTypShow:false,
                airCompanyShow:false,
                contact: '',
                intendedDpt:'',
                intendedPst:'',
                intendedArrv:'',
                airplaneTyp:'',
                airCompany:'',
                airCompanyId: 0,
                dptState:[0,1],//运力基地：机场为0，地区为1
                seat:'',
                hourcost:'',
                post:'0',
                timeStart:'00:00',
                timeEnd:'00:00',
                tip: '',
                searchData:["双流机场","武当山机场"],
                searchData1:["双流机场","武当山机场"],
                msg:'选择班期类型',
                stateType:['待定','满排','半排'],
                myDate:'选择起始时间',
                calendarInitDay1: '',
                calendarInitDay2: '',
                calendarShow: false,
                timeData:['01:00','02:00','03:00','04:00','05:00','06:00','07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00',
                '19:00','20:00','21:00','22:00','23:00','00:00'],
                timeShow: true,
                isSearch: false,
                searchText: '',
                dispatchSearch:false,
                dispatchText:'',
                directSearch:false,
                directText:'',
                dptSearch:false,
                pstSearch:false,
                arrvSearch:false,
                qyCode: '',
                qyCode1:'',
                qyCode2:'',
                qyCode3:'',
                qyCode4:'',
                qyCode5:'',
                airTypData: ["A320","A330","B737NG","E190/195","CRJ900","MA60","B787","B777","B767","E145","B757","B747","ARJ21"],
                airCompanyData:[],
                demandData:{}
            }
        },
        components:{
            calendar,
            airportS,
            airportS1
        },
        methods:{
             getNeed: function(i) {
                this.msg = this.stateType[i];
                this.isSel = true;
            },
             getDate1: function(d){//获取组件返回的日期
            this.calendarInitDay1 = d;
            },
             getDate2: function(d){//获取组件返回的日期
                this.calendarInitDay2 = d;
            },
            getMyDate: function(){//获取起始的日期
                if(this.calendarInitDay1 && this.calendarInitDay2){
                    this.myDate = this.calendarInitDay1 + "-" + this.calendarInitDay2;
                    this.calendarShow = false;
                    this.$refs.timeDate.style.width = "213px";
                    this.$refs.timeForm.style.width = "579px";
                     this.$refs.timeTitle.style.width = "60px";
                }else{

                }
            },
            openSearch: function(){
                this.isSearch =true;
            },
            /*closeSearch: function(){
                    this.isSearch = false;
            },*/
            openSearch1: function(){
                this.dispatchSearch =true;
            },
            /*closeSearch1: function(){
                    this.isSearch = false;
            },*/
             openSearch2: function(){
                this.directSearch =true;
            },
             openSearch3: function(){
                this.dptSearch =true;
            },
             openSearch4: function(){
                this.pstSearch =true;
            },
             openSearch5: function(){
                this.arrvSearch =true;
            },
          /*  verifyPhon:function(){
                let pattern = /^0{0,1}(1[0-9][0-9]|15[7-9]|153|156|18[7-9])[0-9]{8}$/;
                if((!pattern.test(this.phoneNum)){
                    this.isError = true;
                }
                this.isError = true;
            },*/
            verifyPhon: function () {
                if(!(/^1[3|4|5|8][0-9]\d{8}$/.test(this.phoneNum))){
                    this.isError = true;
                }else{
                    this.isError = false;
                }
            },
            pickTime1: function(i) {
                this.timeStart = this.timeData[i];
                this.boxShow1 = false;
                this.pickStart = true;
            },
             pickTime2: function(i) {
                this.timeEnd = this.timeData[i];
                this.boxShow2 = false;
                this.pickEnd = true;
            },
            delItem:function(i){
                this.searchData.splice(i,1);
            },
             delItem1:function(i){
                this.searchData1.splice(i,1);
            },
            cancel:function(){
                this.$emit("closeForm");
            },
            resData: function (data) {
                this.isSearch = false;
                this.searchText = data.name;
                this.qyCode = data.code;
            },
            disData: function(data){
                this.dispatchSearch = false;
                this.dispatchText = data.name;
                this.qyCode1 = data.code;
            },
            directData: function(data){
                this.directSearch = false;
                this.directText = data.name;
                this.qyCode2 = data.code;
            },
            dptData: function (data) {
                this.dptSearch = false;
                this.intendedDpt = data.name;
                this.qyCode3 = data.code;
            },
            pstData: function (data) {
                this.pstSearch = false;
                this.intendedPst = data.name;
                this.qyCode4 = data.code;
            },
            arrvData: function (data) {
                this.arrvSearch = false;
                this.intendedArrv = data.name;
                this.qyCode5 = data.code;
            },
            getAirType: function(i){
                this.airplaneTyp = this.airTypData[i];
                this.airplTypShow = false;
            },
            getCompanyList: function(i){
                this.airCompany = this.airCompanyData[i][0];
                this.airCompanyShow = false;
                this.airCompanyId = this.airCompanyData[i][2];
            },
            getAirplaneTyp:function(){
                this.airplTypShow = true;
            },
            getAirCompany: function(){
                this.$ajax({
                url:"/airCompenyList",
                method: 'post',
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded'
                },
                params: {
                    page:2
                }
            }) .then((response) => {
                response.data.list.forEach(item =>{
                    let myCompany = [];
                    myCompany.push(item.airlnCd);
                    myCompany.push(item.icao);
                    myCompany.push(item.capacitycompany);
                    this.airCompanyData.push(myCompany);
                })
            }).catch((error) => {
                    console.log(error);
                });
                //console.log(this.airCompanyData)
                this.airCompanyShow = true;
            },
            confirm:function(){

                    this.demandData.demandtype = "1";
                    this.demandData.contact = this.contact;
                    this.demandData.iHome = this.phoneNum;
                    this.demandData.dptTime = this.getTime == 'true'? (this.timeStart + ' - '+ this.timeEnd):'无';
                    this.demandData.days   = this.getFlight =='true'? this.msg: '无';
                    this.demandData.intendedDpt = this.qyCode3;
                    this.demandData.intendedPst = this.qyCode4;
                    this.demandData.intendedArrv = this.qyCode5;
                    this.demandData.aircrfttyp = this.airplaneTyp;
                    this.demandData.dpt = this.qyCode;
                    this.demandData.dptState = this.dptState[0];
                    this.demandData.capacitycompany = this.airCompanyId;
                    this.demandData.seating = this.seat;
                    this.demandData.hourscost = this.hourcost;
                    this.demandData.schedulingStr = this.dispatch == false? '不接受':'接受';
                    this.demandData.scheduling = this.dispatch == false? '1':'0';
                    if(this.dispatch){
                        this.demandData.schedulinePort  = this.qyCode1;
                    }
                    this.demandData.remark = this.tip;
                    this.demandData.periodValidity = this.myDate;
                    this.demandData.publicway = this.post;
                    //demandData.directionalgoal = this.directText;
                    //demandData.demandprogress = '0';
                 this.$ajax({
                url:"/sonDemandAdd",
                method: 'post',
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded'
                },
                params: this.demandData
            }) .then((response) => {
                    if(response.opResult == "0"){
                         this.$emit("closeForm");
                    }
            }) .catch((error) => {
                    console.log(error);
                });

            }
        },
        computed:{
            num: function(){
                return this.tip.length <= 35? this.tip.length: 35;
            }
        },
        watch:{


        },
         mounted:function () {
              tabulationBoxTrigger.$on('getSonId', val => {
                    this.demandData.demandId = val;
                });
        }

    }
</script>

<style scoped lang="scss">
    input {
        outline:none;
        border: 0;
        color: #605E7C;
        font-size:1.2rem;
        box-sizing:border-box;
        padding-left:5px;
        border-bottom:1px solid rgba(151,151,151,.3);
    }
    .t-form{
        position:absolute;
        top:65px;
        left:0;
        z-index:99;
        box-sizing:border-box;
        overflow-y: scroll;
        font-size:1.2rem;
        padding:20px;
        width:620px;
        height:630px;
        color: #605E7C;
        border-radius:4px;
        background-color:#fff;
        .t-must,.t-optional{
            width:100%;
            box-sizing:border-box;
            display:flex;
            flex-wrap: wrap;
            justify-content: space-between;
            padding:0 20px;
            border-radius:5px;
            background-color:#FBFBFB;
        }
        .t-optional{
            margin-top:10px;
        }

    }
    .form-box{
        width:240px;
        height:26px;
        line-height:26px;
        padding:27px 0;
        display:flex;
        position: relative;
        .t-title{
            width:60px;
            overflow:hidden;
        }
        .radio-box{
            width:180px;
            display:flex;
        }
        >input{
            width:180px;
            height:26px;
            background-color: #FBFBFB;
        }
    }
    .t-form .reset{
        height:26px;
        padding:17px 0;
    }
    .air-route{
        width:580px;
        padding:20px 0 34px 0;
        >input{
            width:138px;
            height:26px;
        }
        >span{
            dispaly:inline-block;
            width:30px;
            text-align:center;
        }
    }
    .se-place{
        position:relative;
    }
    .tips{
        position:relative;
        width:580px;
        >input{
            width:470px;
        }
        .num{
            position:absolute;
            right:2px;
            top:20px;
        }
    }
    .get-time .time-btn{
        box-sizing:border-box;
        position:relative;
        height:26px;
        width:146px;
        margin-left:14px;
        border:1px solid rgba(151,151,151,.3);
        border-radius:5px;
        padding:0 22px 0 44px;
        cursor:pointer;
    }
    .myslec span{
        position:absolute;
        left:0;
        top:0;
        width:20px;
        text-align:center;
        border-right:1px solid rgba(151,151,151,.3);
    }
    .post-type{
        display: flex;
        margin: 40px 0 70px 0;
        .t-radio{
            margin-right:20px;
            height:26px;
            line-height:26px;
        }
    }
    .t-btn{
        font-size: 1.5rem;
        display: flex;
        flex-flow: row nowrap;
        justify-content: flex-end;
        align-items: center;
        margin-bottom:22px;
        >div{
          height:40px;
          line-height:40px;
          border-radius:100px;
          text-align:center;
          color:#ffffff;
          background-color:#3c78ff;
          cursor:pointer;

        }
        .confirm-btn{
          width:190px;
          margin:0 10px;
          box-shadow: 1px 1px 6px rgba(60, 120, 255, .6);
        }
        .cancel-btn{
          width:80px;
          color:rgba(96,94,124,.6);
          box-sizing:border-box;
          opacity:40%;
          background-color:#fff;
          border: 1px solid rgba(96,94,124,.6);
        }
    }
    .confirm-btn:hover{
           background-color: rgba(80, 139, 255,1);
          color: white !important;
          cursor: pointer;
          box-shadow: 1px 2px 18px rgba(60, 120, 255,0.5);
    }
    .cancel-btn:hover {
      background-color: rgba(256, 256, 256, .7);
      cursor: pointer;
      box-shadow: 1px 2px 18px rgba(60, 120, 255,0.5);
    }
    .pad1{
        padding:20px 0 34px 0;
    }
    .selected{
        position:relative;
        width:100px;
        height:26px;
        line-height:26px;
        margin-left:5px;
        display:flex;
        cursor:pointer;
        >div{
            width:40px;
            text-align:center;
            color:rgba(96,94,124,.4);
            border:1px solid rgba(151,151,151,.3);
            border-radius:5px;
        }
        >span{
            padding:0 3px;
        }
    }
    .icon-item {
        font-size: 1.6rem;
        font-family: iconfont;
    }
    .icon-item1{
        padding-left:14px;
        color: #446cea;
        line-height: 26px;
    }
    .border{
        border:1px solid rgba(151,151,151,.3);
        border-radius:5px;
        padding-left:5px;
    }
  .selected .dropDown {
        position:absolute;
        top:28px;
        left:0;
        width:107px;
        border:0 !important;
        border-radius: 4px;
        z-index:99;
        >div {
            width: 107px;
            height:35px;
            box-sizing: border-box;
            line-height:35px;
            background-color: #fff;
            padding-left: 14px;
            text-align:left;
            color: #605E7C;
            font-size: 1.2rem;
            cursor:pointer;
            &:hover{
                background-color:#f5f5f5;
            }
        }
    }
    .fl-til{
        display:inline-block;
        width:80px;
        color:rgba(96,94,124,.4);
    }
    .selec{
        color:#605E7C !important;
    }
    .taken{
        position:relative;
        >span{
            position:absolute;
            right:0;
            top:20px;
        }
    }

    .magic-radio {
        position: absolute;
        display: none;
    }
    .magic-radio + label {
        display: flex;
        align-items: center;
        cursor: pointer;
        vertical-align: middle;
        &:before {
            padding-right: 5px;
            font-family: iconfont;
            font-size: 1.7rem;
            color: gray;
            content: '\e61c';
            border-radius: 50%;
        }
    }
    .magic-radio:checked + label {
        &:before {
            content: '\e622';
            color: #3c78ff;
        }
    }
    .error{
        position:absolute;
        top:58px;
        right:36px;
        color:red;
    }
    .aisx {
        position: absolute;
        top: 58px;
        left: 0px;
        width: 260px;
        max-height: 210px;
        overflow-y: scroll;
        z-index: 10;
    }

    .radio-box .selected .time-table{
        position: absolute;
        height:210px;
        width: 53px;
        border:0;
        overflow: hidden;
        overflow-y: scroll;
        z-index: 1;
        >.time-item {
            width: 100%;
            height:35px;
            line-height:35px;
            background-color: #fff;
            text-align:center;
            color: #605E7C;
            cursor:pointer;
            &:hover{
                background-color: rgba(235, 235, 235, 0.5);
            }
        }
    }
    .time-start{
        top:26px;
        left:-5px;
    }
    .time-end{
        top:26px;
        left:50px;
    }
    .time-table::-webkit-scrollbar {
        width: 4px;
    }
    .time-table::-webkit-scrollbar-thumb {
        height: 56px;
        background: #D8D8D8;
        border-radius: 4px;
    }

    .dispatch{
        >input{
            width:162px;
            padding-left:8px;
        }
    }
    .history{
        position:absolute;
        top:18px;
        right:-15px;
        width:180px;
        display:flex;
        .his-item{
            float:left;
            background-color:#f3f3f7;
            border-radius:100px;
            color:#3c78ff;
            font-weight:800;
            height:26px;
            padding:0 6px;
            margin-right:3px;
            span{
                display:inline-block;
                width:12px;
                height:12px;
                line-height:10px;
                text-align:center;
                cursor:pointer;
                background-color:#fff;
                border-radius:100%;
                margin:0 1px;
            }
        }
    }
    .airpl-typ{
        position:absolute;
        left:58px;
        top:58px;
        width:180px;
        max-height:210px;
        cursor:pointer;
        z-index:10;
        overflow:hidden;
        overflow-y:scroll;
        div{
            justify-content: space-between;
            display: flex;
            padding: 0 14px;
            height:35px;
            line-height:35px;
            text-align:left;
            &:hover{
                background-color:rgba(235,235,235,.5);
            }
        }

    }
    .popup-x1{
        border:0 !important;
    }
</style>

<style scoped>
  .calendar-box{
    width: 540px;
    height:270px;
    position: relative;
    top: 0px;
    left:-134px;
    z-index: 10;
    padding:20px 10px 10px 10px;
  }
  .calendar-box .selec-data{
    height:30px;
    font-size: 12px;
    margin-bottom:20px;
    position: relative;
  }
  .calendar-box .selec-data input{
    height: 100%;
    width: 75px;
    font-size: 12px;
    border:0;
    outline: none;
    border-bottom: 1px solid rgba(151, 151, 151, 0.3);
  }
  .calendar-box .selec-data span{
    display: inline-block;
    width:30px;
    text-align: center;
  }
  .selec-data .btn{
    position:absolute;
    top:0;
    height: 30px;
    line-height: 30px;
    border-radius: 100px;
    text-align: center;
    cursor: pointer;
  }
  .selec-data .confirm-btn{
    right:0;
    width:60px;
    color:#ffffff;
    background-color:#3c78ff;
  }
  .selec-data .cancel-btn{
    width:50px;
    color:rgba(96,94,124,.6);
    box-sizing: border-box;
    border:1px solid rgba(96,94,124,.6);
    right:64px;
  }
</style>

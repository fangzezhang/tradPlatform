export default {
    c_updated:(state)=>{
        return state.c_updated;
    }
    ,close:(state)=>{
        return state.close;
    }
    ,airList:(state)=>{
        return state.airList;
    }
    ,cityList:(state)=>{
        return state.cityList;
    }
    ,companyList:(state)=>{
        return state.companyList;
    }
    ,monoData:(state)=>{
        return state.demandList.monoData;
    }
    ,demandList:(state)=>{
        return state.demandList;
    },
    role:(state)=>{
        return state.role;
    },
    conditionsOpen:(state)=>{
        return state.conditionsOpen;
    },
    routeNetwork:(state)=>{
        return state.routeNetwork;
    },
    searchInfo:(state)=>{
        return state.searchInfo;
    },
}

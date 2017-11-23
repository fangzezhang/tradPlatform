import {
    TEST,
    CLOSE,
    INITIALIZE,
    HYBRIDDATA,
    MONODATA,
    ROLE,
} from './types'
import getters from './getters'
import {state} from './state.js'
const mutations = {
    [TEST](state) {
        state.c_updated = state.c_updated ++;
    },
    [CLOSE](state) {
        state.close = !state.close;
    },
    [INITIALIZE](state,vl) {
        state.airList = vl;
    },
    [MONODATA](state,vl) {
        switch (vl.t){
            case 0:
                state.demandList.monoData = vl.v;
                break;
            case 1:
                state.demandList.monoData = vl.v;
                break;
            case 2:
                state.demandList.monoData.list = state.demandList.monoData.list.concat(vl.v);
                break;
        }
    },
    [HYBRIDDATA](state,vl) {
        switch (vl.t){
            case 0:
                state.demandList.hybridData = vl.v;
                break;
            case 1:
                state.demandList.hybridPage = vl.v;
                break;
            case 2:
                state.demandList.hybridData.list = state.demandList.hybridData.list.concat(vl.v);
                break;
        }
    },
    [ROLE](state,vl) {
        state.role = vl;
    }
};
export default {
	state,
	mutations,
	getters
}
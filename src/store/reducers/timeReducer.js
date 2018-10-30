/**************************
 * @file: 所有页面的Reducer
 * @author: leinov
 * @date: 2018-10-29
 **************************/
import { handleActions } from "redux-actions";
import {
	TIME_CONFIG_DATA, // 时间
} from "../types/index";

export default handleActions({
	[TIME_CONFIG_DATA](state, action) {
		return {
			...state,
			timeConfigData: action.newData
		};
	}
}, {
	timeConfigData:[],
});

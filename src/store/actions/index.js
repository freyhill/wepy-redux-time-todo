/**************************
 * @file: 所有页面的Action
 * @desc: 该文件包含action 和业务方法
 * @author: leinov
 * @date: 2018-10-29
 **************************/

import xcxutil from "xcxutil";
import { getStore } from "wepy-redux";

import {
	TIME_CONFIG_DATA //课程详情
} from "../types/index";

let store=getStore();

// 时间段设置action
export function timeConfigAction(newData) {
	return { type: TIME_CONFIG_DATA, newData };
}


/**
 * 添加时间段
 *
 * @param {Object} newData
 * @returns {Object}
 */
export function addTimeConfig(newData) {
	let storedata = store.getState().timeReducer.timeConfigData;
	storedata.push(newData);
	store.dispatch(timeConfigAction(storedata));
}


/**
 * 修改时间段
 *
 * @param  {type} value 选择的时间的值
 * @param  {type} pos   修改的位置
 * @return {type}       description
 */
export function changeTimeConfig(value,pos) {
	let timeConfigData = store.getState().timeReducer.timeConfigData;
	let copy  = xcxutil.deepCopy(timeConfigData);
	copy.map((item,index)=>{
		if(pos.index === index){
			if(pos.type === "start"){
				if(item.endValue < value || item.endValue == value){
					xcxutil.modal("开始时间必须小于结束时间");
					return;
				}
				item.startVaule = value;
			}else{
				if(item.startVaule > value || item.startVaule == value){
					xcxutil.modal("结束时间必须大于开始时间");
					return;
				}
				item.endValue = value;
			}
		}
	});
	store.dispatch(timeConfigAction(copy));
}

/**
 * 删除时间段
 *
 * @param  {Number} index 下标
 */
export function deleteTimeConfig(index){
	let timeConfigData = store.getState().timeReducer.timeConfigData;
	let copy  = xcxutil.deepCopy(timeConfigData);
	copy.splice(index,1);
	store.dispatch(timeConfigAction(copy));
}

# wepy-redux-time-todo
![image](https://github.com/leinov/leinov.github.io/raw/master/img/timeredux.gif)

## Use
```
git clone git@github.com:leinov/wepy-redux-time-todo.git

npm install

npm run dev
```

## WIKI
### 创建项目
首先需要安装wepy命令，通过命令创建wepy项目，在执行下面第二句命令过程中会有一些问题，在到是否使用redux的问题时选y，在创建时就会加入redux依赖以及store文件夹
```
npm install wepy-cli -g //安装全局wepy命令

wepy init standard wepy-redux-time-todo // 创建wepy-redux-time-todo项目
```

### 项目结构
执行创建命令后会出现类似以下结构的项目结构(下面是我自己创建文件后的)
```
 |-- dist // 编译后执行文件夹
 |-- node_modules
 |-- src // 开发文件夹
 |   |-- components //组件
        |-- sec-title.wpy
     |-- pages //业务页面
        |-- index.wpy
     |-- store // redux
        |-- actions
            |-- index.js
        |-- reducers
            |-- timeReducer.js
            |-- index.js //合并reducer
        |-- types
            |-- index.js
     |-- style //样式
        |-- weui.scss
     |-- app.wpy //入口
 |-- package.json
```

### Redux概念以及使用


Redux主要的作用是管理复杂的数据，多用于操作单页应用中的复杂状态，将整个应用的状态集中放在一个容器里统一管理。作为一个状态容器，他就像一个盒子(store)，这个唯一的盒子(整个应用只有一个store)里有很多状态(state), 都以一个对象树的形式储存在store 中。 **唯一能改变 state 的办法是触发 action**，action是一个简单的对象，用来描述你想要干什么。reducer是一个纯函数来根据action返回的type操作状态变化返回新状态，reducer作为createStore参数返回最新的store，下面我们通过redux官网的代码具体描述redux的执行过程，


#### Action

action可以理解为动作，用户希望干什么，比如点击一个按钮让页面的数字加1，切换日期，插入数组等，总之是一个希望页面状态发生改变的行为标识。action用一个对象表示,包含一个必须属性```type```
```
{type:"INCREMENT"} //表示添加动作
{type:"DECREMENT"} //表示减法动作
{type:"GET_DATA",payload:{}} // 表示获取数据动作并挂载一个数据在payload属性上供reducer使用，多用于异步获取数据，也可以用自己的添加其他属性
```
#### Reducer

reducer是一个形式为 (state, action) => state 的纯函数（纯函数概念：不依赖外部环境变量，只依赖内部参数、不会产生副作用、相同的输入确保相同的输出）。描述了 action 如何把 state 转变成下一个 state。state 的形式取决于你自己，可以是基本类型、数组、对象、甚至是 Immutable.js 生成的数据结构。唯一的要点是当 state  变化时需要返回全新的对象，而不是修改传入的参数。
下面例子使用 `switch` 语句和字符串来做判断，也可以用自己的方式。

```
function reducer(state = 0, action) {
  switch (action.type) {
  case 'INCREMENT':
    return state + 1;
  case 'DECREMENT':
    return state - 1;
  default:
    return state;
  }
}
```

#### store

redux的createStore方法用于创建应用唯一的store，createStore方法的**参数**即reducer，用于更新store内state树，通过以下创建就可以把一个初始的{state:0}的这样一个状态存入到store中
```
import { createStore } from 'redux';

const store = createStore(reducer);
```
store有几个重要的方法
* ```store.dispatch(action)```  //派发事件 表示要干什么
* ```store.getState()``` // 获取存储在store里的所有状态(数据)
* ```store.subscribe(listener)``` //手动监听状态变化

#### dispatch改变状态

store.dispatch是改变状态的唯一方式，dispatch接受一个action参数（做什么），通知reducer需要做出什么样的改变，再更新整个store
```
store.dispatch({INCREMENT:"INCREMENT"})
```
这个操作会告诉reducer 当前需要给state做加1操作，
#### 获取state
```
store.getState() // {state:1}
```

### subscribe监听
```
store.subscribe(() =>
  console.log(store.getState())
);
```
在dispatch触发状态更新后需要通过subscribe监听才能获得最新的状态，如果在react中使用则需要把视图渲染函数放在监听函数内。
```
import store from "./redux.js"
store.subscribe(()=>{
  ReactDOM.render(<App />, document.getElementById('root'))
});
```
> 以上是纯redux的使用，使用起来比较鸡肋，redux大量被使用在react项目中，封装库react-redux提供的Provider和connect可以将react和redux完美结合，使用非常方便。


### Redux在wepy中的使用
通过上面的描述应该对redux有了一定的了解，接下来我们看下redux在小程序框架wepy中如何使用，wepy中需要安装wepy-redux依赖，类似react-redux，store文件夹下放redux的操作代码，redux的使用方法都相同，这里我们讲下与react使用不一样的地方

#### 初始化store
首先需要在app.wpy中初始化store
```
import { setStore } from 'wepy-redux'
import configStore from './store'

const store = configStore()
setStore(store)
```
wepy中app.wpy编译后为原生小程序中的app.js，app.js在小程序整个执行生命周期里处于最前端，在小程序初始化时来创建store，这样在所有页面都可以使用，等同于react里的Provider

#### redux-actions
这里使用```redux-actions```库来优化reducer里的```switch```写法。
```
import { handleActions } from "redux-actions";
import {
	TIME_CONFIG_DATA, // 学员
} from "../types/index";

export default handleActions({
	[TIME_CONFIG_DATA](state, action) {
		return {
			...state,
			timeConfigData: action.newData
		};
	}
}, {
	timeConfigData:[], //state初始值
});
```

#### connect连接到wepy组件上
connect(states, actions) connect有两个参数，states是整个应用的状态，页面需要使用哪个状态对应获取该状态即可,actions业务操作，是wepy-redux对action的封装，这里我们不用这种方式，自己在action中手动dispatch，如果想要了解详细使用可参考[wepy-redux](https://www.npmjs.com/package/wepy-redux)
```
import { connect } from 'wepy-redux'
 @connect({
    timeConfigData(state) {
      return state.timeReducer.num
    }
  })
  export default class Index extends wepy.page {
  	// ...
    methods = {
      // ...
    }
    // ...
    onLoad() {
    }
  }
```
使用数据
```
<template lang="wxml">
    <repeat for="{{timeConfigData}}" index="index" item="item" key="key">
    </repeat>
</template>
```

> 其他方法都与在react中使用相同， 通过上面的配置就就可以在wepy中使用redux了，详细代码参考[code](https://github.com/leinov/wepy-redux-time-todo)

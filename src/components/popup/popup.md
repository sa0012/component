### Popup - 弹出层

---
#### 按需引入

```js
import { Popup } from '@insaic/neon'
Vue.use(Popup)
```

#### 例子 [demo源码](https://github.com/insaic/neon/blob/dev/examples/routers/popup.vue)
```html
<sq-popup v-model="isShowCenter">中间弹出</sq-popup>

<sq-popup v-model="isShowLeft" :close-on-click-overlay="false" position="left">
  <sq-button type="primary" size="small" @click="isShowLeft = !isShowLeft">关闭</sq-button>
</sq-popup>

<sq-popup v-model="isShowRight" position="right">右侧弹出</sq-popup>

<sq-popup v-model="isShowTop" :hide-mask="true" position="top">
  <sq-notice-bar text="为了确保您的资金安全，请设置支付密码"/>
</sq-popup>

<sq-popup v-model="isShowBottom" position="bottom">底部弹出</sq-popup>
```

#### Props
 名称                    | 类型        | 说明            | 默认值    | 可选值
:------                  |:---------  |:--------        |:-------  |:------
 value                   | `Boolean`  | 是否显示         |   --     | --
 position                | `String`   | 显示的位置       | center   | top, right, bottom, left
 close-on-click-overlay  | `Boolean`  | 点击蒙层是否关闭 | true     | false
 hide-mask                | `Boolean`  | 是否显示蒙层     | false    | true
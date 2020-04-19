### Picker - 选择器
---
#### 按需引入

```js
import { Picker } from '@insaic/neon'
Vue.use(Picker)
```

#### 例子 [demo源码](https://github.com/insaic/neon/blob/dev/examples/routers/picker.vue)
```html
<sq-picker
  :columns="columns"
  @confirm="confirm"
  @cancel="cancel"
  @on-change="onChange"
/>
```
---
#### Props
| 名称                 | 类型       | 说明                                            | 默认值      | 可选值         |
|:-----------          |:--------- |:-------------------                             |:-------    |:-------------- |
| title                | `String`  | picker的标题                                    |   ''        |       --      |
| show-toolbar         | `Boolean` | 是否显示头部栏                                   |   `false`   |     `true`    |
| columns              | `Array`   | 选项list                                        |    `[]`     |       --      |
| loading              | `Boolean` | 是否显示loading状态                              |    `false`  |     `true`    |
| value-key            | `String`  | 当columns每项为Object时，设置对应的key用于列表显示 |    --       |     --        |
| row-height           | `Number`  | 列表行高                                         |    48       |     --        |
| row-count            | `Number`  | 每列显示数量                                     |    5        |     --        |
| confirm-buttonT-text | `String`  | 确认按钮的文本                                    |    确认     |     --        |
| cancel-buttonT-text  | `String`  | 取消按钮的文本                                    |    取消     |     --        |
| format-value-fun     | `Function`| 用于格式化显示值的函数                             |    --      |     --        |
| format               | `Array`   | 添加于每项显示值之后，用于显示，如['年', '月', '日'] |    --      |     --        |

---

#### Event
| 名称       | 参数  | 描述
|:---------- |:---- |:-------------------------------- 
| confirm    | values | 点击确认按钮执行的事件,values为每列选中的值组成的数组
| cancel     | --   | 点击取消按钮执行的事件
| on-change  | values，<br>picker，<br>{<br>  valueInColumnIndex，<br>  columnInColumnsIndex<br> } | **参数一：** values：同confirm参数values<br>**参数二：** picker：当前picker自身<br>**参数三：** 为对象形式，其中：<br>valueInColumnIndex：改变的值在该列中的下标。<br>columnInColumnsIndex：改变的值的列在所有列中的下标。

#### 内部方法
通过 ref 可以获取到 picker 实例并调用实例方法，或在on-change 事件中通过 第二个参数取得picker实例调用方法。

方法名           | 参数            | 返回值 | 说明
:------         |:----            |:-------|:---
getValues       | --              | values | 获取所有列选中的值，values为每列选中的值组成的数组
setValues       | values          | --     | 设置所有列选中的值，values为每列选中的值组成的数组
setColumnValues | index, dataList | --     | 	设置对应列中数据列表，index为第几列，dataList为数据源组成的数组
setColumns      | val             | --     | 设置所有列的数据，val为每列数据源组成的数组

:::warning 注意
当在调用了`setColumnValues`或`setColumns`或直接改变`columns`数据源后，继续调用`setValues`时，<br>
请在`$nextTick`中调用，确保设置选中值的方法是在更换列表数据源完成后执行。<br>
否则设置新的选中项可能会不生效。
```js
this.$refs.pickerRef.setColumns(newColumns)
this.$nextTick(() => {
  this.$refs.pickerRef.setValues(values)
})
```
:::
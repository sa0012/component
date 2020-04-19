<template>
  <div class="sq-picker-item" :style="isShowPickerItem">
    <ul class="sq-picker-item-wrapper" :style="itemStyles">
      <li
        class="sq-picker-item-row"
        v-for="(item, index) in list"
        :key="index"
        :style="rowStyles"
        @click="setIndex(index, true)"
      >
        {{ valueKey ?
          (formatValueFun ? formatValueFun(item[valueKey]) : item[valueKey]) :
          (formatValueFun ? formatValueFun(item) : item) }}{{ format }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'sq-picker-item',

  props: {
    dataList: {
      type: Array,
      default: () => []
    },
    valueKey: {
      type: String
    },
    format: {
      type: String
    },
    formatValueFun: {
      type: Function
    },
    defaultIndex: {
      type: Number,
      default: 0
    },
    hideEmptyColumn: {
      type: Boolean,
      default: false
    },
    // 每行列的高度
    rowHeight: Number,
    // 每列显示数量
    rowCount: Number
  },

  computed: {
    itemStyles () {
      return {
        transform: `translate3d(0px, ${this.translateY}px, 0px)`,
        transition: `transform ${this.transitionTime}s`
      }
    },
    rowStyles () {
      return {
        height: `${this.rowHeight}px`,
        lineHeight: `${this.rowHeight}px`
      }
    },
    isShowPickerItem () {
      return {
        display: this.hideEmptyColumn && !this.list.length ? 'none' : ''
      }
    },
    // 列表初始偏移量
    offset () {
      return parseInt(this.rowCount / 2)
    }
  },

  data () {
    return {
      list: this.dataList,
      temp: null, // 容器
      translateY: parseInt(this.rowCount / 2) * this.rowHeight,
      transitionTime: 0,
      startY: 0, // 起始值
      moveY: 0, // 移动的距离
      saveY: parseInt(this.rowCount / 2) * this.rowHeight, // 缓存偏移量
      currentIndex: this.defaultIndex, // 选中的下标
      startTime: undefined,
      points: []
    }
  },

  methods: {
    init () {
      this.temp.addEventListener('touchstart', this.onTouchStart, false)
      this.temp.addEventListener('touchmove', this.onTouchMove, false)
      this.temp.addEventListener('touchend', this.onTouchEnd, false)
      this.temp.addEventListener('touchcancel', this.onTouchEnd, false)
    },

    onTouchStart (event) {
      if (this.loading) return

      this.startY = event.changedTouches[0].pageY
      this.moveY = 0
      this.startTime = +new Date()

      event.preventDefault()
    },

    onTouchMove (event) {
      if (this.loading) return

      if (this.transitionTime) {
        this.transitionTime = 0
      }

      this.moveY = event.changedTouches[0].pageY - this.startY
      this.translateY = this.saveY + this.moveY

      this.startTime = +new Date()
      this.points.push({ time: this.startTime, y: event.changedTouches[0].pageY })
      if (this.points.length > 40) {
        this.points.shift()
      }

      event.preventDefault()
    },

    onTouchEnd (event) {
      if (!this.startY || this.loading) return

      const endY = event.changedTouches[0].pageY
      const endTime = +new Date()
      // 如果最后次move时间与end时间超过100ms，不添加惯性滑动
      if (endTime - this.startTime > 100) {
        this.onStop()
      } else {
        if (Math.abs(endY - this.startY) > 10) {
          const endPos = this.points.length - 1
          let startPos = endPos
          for (let i = endPos; i > 0 && this.startTime - this.points[i].time < 100; i--) {
            startPos = i
          }

          if (startPos !== endPos) {
            const ep = this.points[endPos]
            const sp = this.points[startPos]
            const t = ep.time - sp.time
            const s = ep.y - sp.y
            const v = s / t // 出手时的速度
            const diff = v * 150 // 滑行 150ms,这里直接影响“灵敏度”
            this.onStop(diff)
          } else {
            this.onStop()
          }
        } else {
          this.onStop()
        }
      }

      event.preventDefault()
    },

    onStop (diff = 0) {
      // 缓存上次translateY的值
      this.saveY = this.translateY
      const {offset, rowHeight, list, currentIndex} = this
      const _saveY = this.saveY
      const count = list.length
      // 获得list 下标
      let _index = parseInt((offset * rowHeight - _saveY - diff) / rowHeight)
      if (_index < 0) {
        _index = 0
      } else if (_index >= count) {
        _index = count - 1
      }

      // 当前位置与 标准情况下 下标距离值 进行对比， 不相同情况下，进行手动设置位置
      if (_saveY !== ((offset - currentIndex) * rowHeight)) {
        this.transitionTime = 0.3
        // 向下拉 超过显示情况下
        if (_saveY > 0 && _saveY > offset * rowHeight) {
          this.setIndex(0, true)
          // 向上拉 超过显示情况下
        } else if (_saveY < 0 && _saveY < (offset - count + 1) * rowHeight) {
          this.setIndex(count - 1, true)
        } else {
          this.setIndex(_index, true)
        }
      }
    },

    setIndex (index, userAction) {
      this.saveY = this.translateY = (this.offset - index) * this.rowHeight

      if (index !== this.currentIndex) {
        this.currentIndex = index
        userAction && this.$emit('on-change', index, this.$parent.children.indexOf(this))
      }
    },

    getValue () {
      return this.list[this.currentIndex]
    },

    setValue (value) {
      const { list } = this

      let selectIndex = 0
      if (Object.prototype.toString.call(value) === '[object Object]' && this.valueKey) {
        list.forEach((item, i) => {
          if (item[this.valueKey] === value[this.valueKey]) {
            selectIndex = i
          }
        })
      } else {
        selectIndex = list.indexOf(value) > -1 ? list.indexOf(value) : 0
      }
      this.setIndex(selectIndex)
    }
  },

  created () {
    this.$parent.children && this.$parent.children.push(this)
  },

  mounted () {
    this.$nextTick(() => {
      this.temp = this.$el
      this.init()
    })
  },

  beforeDestroy () {
    this.temp.removeEventListener('touchstart', this.onTouchStart)
    this.temp.removeEventListener('touchmove', this.onTouchMove)
    this.temp.removeEventListener('touchend', this.onTouchEnd)
    this.temp.removeEventListener('touchcancel', this.onTouchEnd)
  },

  destroyed () {
    this.$parent.children && this.$parent.children.splice(this.$parent.children.indexOf(this), 1)
  }
}
</script>

<style lang="scss">
$prefixCls: sq-picker-item;

.#{$prefixCls} {
  flex: 1;
  flex-basis: 1e-9px;
  width: 1%;
  position: relative;
  overflow: hidden;
  &-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    font-size: 16px;
    margin: 0;
    padding: 0;
  }
  &-row {
    margin: 0;
    padding: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>

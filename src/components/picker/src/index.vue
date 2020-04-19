<template>
  <div class="sq-picker">
    <div class="sq-picker-header sq-picker-bottom-line" v-show="showToolbar">
      <div @click="$_cancel">{{ cancelButtonText }}</div>
      <div>{{ title }}</div>
      <div @click="$_confirm">{{ confirmButtonText }}</div>
    </div>
    <div class="sq-picker-body" @touchmove.prevent>
      <div class="sq-picker-body-mask top" :style="bodyMaskStyles"></div>
      <div class="sq-picker-body-mask bottom" :style="bodyMaskStyles"></div>
      <div class="sq-picker-body-wrapper" :style="bodyStyles">
        <picker-item
          v-for="(item, index) in formatColumns(columns)"
          :key="index"
          :data-list="item"
          :format="format && format.length ? format[index] : ''"
          :format-value-fun="formatValueFun"
          :value-key="valueKey"
          :row-height="rowHeight"
          :row-count="rowCount"
          :hide-empty-column="hideEmptyColumn"
          @on-change="$_onChange"
        />
      </div>
    </div>
    <div class="sq-picker-loading-mask" v-show="loading">
      <div class="sq-picker-loading-icon"></div>
    </div>
  </div>
</template>

<script>
import PickerItem from './pickerItem'

export default {
  name: 'sq-picker',

  components: {
    PickerItem
  },

  props: {
    formatValueFun: Function,
    format: Array,
    cancelButtonText: {
      type: String,
      default: '取消'
    },
    confirmButtonText: {
      type: String,
      default: '确认'
    },
    loading: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    showToolbar: {
      type: Boolean,
      default: false
    },
    columns: {
      type: Array,
      default: () => []
    },
    valueKey: String,
    hideEmptyColumn: {
      type: Boolean,
      default: false
    },
    rowHeight: {
      type: Number,
      default: 48
    },
    rowCount: {
      type: Number,
      default: 5
    }
  },

  computed: {
    bodyStyles () {
      return { height: `${this.rowHeight * this.rowCount}px` }
    },
    bodyMaskStyles () {
      return { height: `${this.rowHeight * parseInt(this.rowCount / 2)}px` }
    }
  },

  data () {
    return {
      children: []
    }
  },

  watch: {
    columns (val) {
      this.setColumns(val)
    }
  },

  methods: {
    formatColumns (columns) {
      if (columns.length && Array.isArray(columns[0])) {
        return columns
      } else if (Object.prototype.toString.call(columns[0]) === '[object Object]' && columns[0].values) {
        return columns.map(column => { return column.values })
      } else {
        return [columns]
      }
    },

    $_cancel () {
      this.$emit('cancel')
    },

    $_confirm () {
      this.$emit('confirm', this.getValues())
    },

    $_onChange (valueInColumnIndex, columnInColumnsIndex) {
      this.$emit('on-change', this.getValues(), this, {
        valueInColumnIndex,
        columnInColumnsIndex
      })
    },

    getValues () {
      return this.children.map(child => child.getValue())
    },

    setValues (values) {
      values.forEach((value, index) => {
        this.children[index] && this.children[index].setValue(value)
      })
    },

    setColumnValues (index, dataList) {
      const column = this.children[index]
      if (column && JSON.stringify(column.list) !== JSON.stringify(dataList)) {
        column.list = dataList
        column.setIndex(0)
      }
    },

    setColumns (val) {
      const columns = this.formatColumns(val || this.columns)
      columns.forEach((dataList, index) => {
        this.setColumnValues(index, dataList)
      })
    }
  }
}
</script>

<style lang="scss">
$prefixCls: sq-picker;

.#{$prefixCls} {
  text-align: center;
  background-color: #fff;
  position: relative;
  &-header {
    display: flex;
    min-height: 48px;
    line-height: 48px;
    @include mix-1px($bottom: 1);
    :nth-child(1) {
      width: 80px;
      flex: 0 0 80px;
      color: $theme-color;
      font-size: 16px;
    }
    :nth-child(2) {
      flex: 1;
    }
    :nth-child(3) {
      width: 80px;
      flex: 0 0 80px;
      color: $theme-color;
      font-size: 16px;
    }
  }
  &-body {
    position: relative;
    &-mask {
      position: absolute !important;
      z-index: 10;
      width: 100%;
      pointer-events: none;
      transform: translateZ(0);
      &.top {
        top: 0;
        background: -webkit-gradient(linear,left bottom,left top,from(hsla(0,0%,100%,.6)),to(hsla(0,0%,100%,.95)));
        position: relative;
        &::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: 0;
          right: 0;
          height: 1px;
          border-bottom: 1px solid #E5E5E5;
          color: #E5E5E5;
          transform-origin: 0 100%;
          transform: scaleY(0.5);
        }
      }
      &.bottom {
        bottom: 0;
        background: -webkit-gradient(linear,left top,left bottom,from(hsla(0,0%,100%,.6)),to(hsla(0,0%,100%,.95)));
        position: relative;
        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          right: 0;
          height: 1px;
          border-bottom: 1px solid #E5E5E5;
          color: #E5E5E5;
          transform-origin: 0 100%;
          transform: scaleY(0.5);
        }
      }
    }
    &-wrapper {
      display: flex;
    }
  }
  &-loading-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 11;
  }
  &-loading-icon {
    box-sizing: border-box;
    width: 1em;
    height: 1em;
    font-size: 36px;
    border: 3px solid transparent;
    border-top-color: $theme-color;
    border-left-color: $theme-color;
    border-bottom-color: $theme-color;
    border-radius: 50%;
    animation: quan .8s infinite linear;
  }
}
</style>

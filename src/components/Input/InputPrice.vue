<script>
import { formatNumber } from "../../composables/convert/convertVN";
export default {
  name: "InputPrices",
  setup() {
    return {
      formatNumber
    }
  },
  props: {
    data: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      dataPrice: formatNumber(this.data.dataPrice.toString())
    }
  },
  watch: {
    dataPrice(val, preVal) {
      this.handleChangePrice(val.toString().replaceAll(",", ""), preVal.toString().replaceAll(",", ""), this.data.title);
    }
  },
  emits: ["isChangePrice"],
  methods: {
    handleChangePrice(val, preVal, type) {
      const reg = /^-?\d*(\.\d*)?$/;
      switch(type) {
        case 'price':
          if (
            (!isNaN(+val.toString().replaceAll(",", "")) &&
              reg.test(val.toString().replaceAll(",", ""))) ||
            val.toString().replaceAll(",", "") === "" ||
            val.toString() === "-"
          ) {
            this.dataPrice = formatNumber(val.toString());
          } else {
            this.dataPrice = formatNumber(preVal.toString());
          }
        break;
      case 'original_price':
        if (
          (!isNaN(+val.toString().replaceAll(",", "")) &&
            reg.test(val.toString().replaceAll(",", ""))) ||
          val.toString().replaceAll(",", "") === "" ||
          val.toString() === "-"
        ) {
          this.dataPrice = formatNumber(val.toString());
        } else {
          this.dataPrice = formatNumber(preVal.toString());
        }
        break;
      default:
        break;
      }
      this.$emit('isChangePrice', {
        dataPrice: this.dataPrice,
        type: type
      })
    }
  }
}
</script>

<template>
  <div class="relative">
    <input 
      v-model="this.dataPrice" 
      :max-length="25"
      class="label-group-input d-block w-full"
      style="padding-left: 30px;"
      type="text"
    />
    <div class="absolute top-0 bottom-0 left-0 h-100 d-flex align-items-center pl-2">
      (đ)
    </div>
  </div>
</template>

<style scoped lang="css">
.label-group input {
  outline: none;
  padding: 8px 10px;
  border-radius: 4px;
  border: 1px solid #ddd;
}
</style>
<script>
import * as XLSX from "xlsx";
// import * as cptable from "xlsx/dist/cpexcel.full.mjs";
import { DownloadOutlined, PictureOutlined, ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { createVNode } from "vue";
import { Modal } from "ant-design-vue";

const requireFields = ["Loại", "Mã sản phẩm", "Tên", "Mô tả ngắn", "Giá bán", "Giá gốc", "Danh mục", "Hình ảnh"]
const optionFields = ["Tên thuộc tính 1", "Giá trị thuộc tính 1", "Tên thuộc tính 2", "Giá trị thuộc tính 2", "Tên thuộc tính 3", "Giá trị thuộc tính 3"]
export default {
  name: 'ModalExportProduct',
  components: {
    DownloadOutlined,
    PictureOutlined,
    ExclamationCircleOutlined,
    Modal
  },
  props: {
    dataTable: {
      type: Array,
      default: {}
    }
  },
  methods: {
    handleExportProduct() {
      const _this = this;
      Modal.confirm({
        class: "modal-exprot-product",
        title: "Xuất excel",
        icon: createVNode(ExclamationCircleOutlined),
        content: "",
        okText: "Xuất excel",
        okType: 'danger',
        cancelText: "Huỷ",
        onOk() {
          let dataExcel = [];
          let workbook = XLSX.utils.book_new();
          dataExcel = dataExcel.concat([requireFields.concat(optionFields).map(el => [el])])
          
          _this.dataTable.forEach(product => {
            let dataConvert = _this.convertProductToData(product)
            console.log('dataConvert', dataConvert)
            dataConvert.forEach(el => {
              dataExcel = dataExcel.concat(el)
            })
          })

          let worksheet = XLSX.utils.aoa_to_sheet(dataExcel);
          XLSX.utils.book_append_sheet(workbook, worksheet, 'product');
          XLSX.writeFile(workbook, 'products.xlsx');
        },
      })
    },

    convertProductToData(product) {
      let variations = product.variations || []
      variations = variations.map(el => {
        if (el.images && el.images.length > 0) {
          el.images
        } else {
          el.images = ["https://statics.pancake.vn/web-media/1d/58/cb/7e/a43b3f11a05df59ef40150693cc2de037716558eb5dd65a758052eb0.png"]
        }
        let variationProperties = (el.properties || []).reduce((acc, el) => acc.concat([[el.name], [el.value]]), [])

        return [["Mẫu mã"], [el.sku], [""], [""], [el.price], [el.original_price], [""], [(el.images || []).join(", ")]].concat(variationProperties)
      })

      let productAttrs = product.attributes.reduce((acc, el) => {
        return acc.concat([[el.name], [(el.value || []).join(", ")]])
      }, [])

      if (product.images && product.images.length > 0) {
        product.images
      } else {
        product.images = ["https://statics.pancake.vn/web-media/1d/58/cb/7e/a43b3f11a05df59ef40150693cc2de037716558eb5dd65a758052eb0.png"]
      }

      let categories = (product.categories || []).map(el => el).join(", ")
      let prod = [["Product"], [product.sku], [product.name], [product.description], [product.price], [product.original_price], [categories], [(product.images || []).join(", ")]].concat(productAttrs)
      return [[prod]].concat([variations])
    }
  }
}
</script>

<template>
  <div>
    <button style="height: 34px; border: 1px solid #ddd; background-color: #fff;" class="rounded-md" @click="handleExportProduct">
      <download-outlined class="text-14"/>
      Xuất excel
    </button>  
  </div>
</template>

<style lang="css">
  .modal-exprot-product .ant-modal-confirm-btns {
    float: none !important;
    text-align: center !important;
  }
</style>
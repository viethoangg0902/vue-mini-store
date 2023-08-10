<script>
import * as XLSX from "xlsx";
// import * as cptable from "xlsx/dist/cpexcel.full.mjs";
import { UploadOutlined, PictureOutlined } from "@ant-design/icons-vue";
import { toastNotification } from "../Notification";
import { useStore } from "../../pinia/store";
import { convertVN } from "../../composables/convert/convertVN";

import { collection, setDoc, doc, getDocs } from "firebase/firestore"; 
const requireFields = ["Loại", "Mã sản phẩm", "Tên", "Mô tả ngắn", "Giá bán", "Giá gốc", "Danh mục", "Hình ảnh"]
const optionFields = ["Tên thuộc tính 1", "Giá trị thuộc tính 1", "Tên thuộc tính 2", "Giá trị thuộc tính 2", "Tên thuộc tính 3", "Giá trị thuộc tính 3"]
export default {
  name: 'ModalExportProduct',
  components: {
    UploadOutlined,
    PictureOutlined
  },
  props: {
    uidData: {
      type: String,
      default: null
    }
  },
  setup() {
    return {
      convertVN
    }
  },
  data() {
    const store = useStore();
    
    return {
      store,
      db: store.db,
      visible: false,
      dataFile: null,
      dataProducts: null,
      listDataCate: null,
      dataProduct: null,

      arrayCateImport: [],
      arrayCate: [],
      arrayProduct: []
    }
  },
  emits: ["isHandleImportProduct"],
  methods: {
    async getData() {
      this.listDataCate = await getDocs(collection(this.db, this.uidData + 'Categories'));
      this.listDataProduct = await getDocs(collection(this.db, this.uidData + 'Products'));
    },
    getHeadersExcel(sheet){
      var headers = [];
      var range = XLSX.utils.decode_range(sheet['!ref']);
      var C,
        R = range.s.r; /* start in the first row */
      /* walk every column in the range */
      for (C = range.s.c; C <= range.e.c; ++C) {
        var cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })]; /* find the cell in the first row */

        var hdr = 'UNKNOWN ' + C; // <-- replace with your desired default
        if (cell && cell.t) hdr = XLSX.utils.format_cell(cell);

        headers.push(hdr);
      }
      return headers;
    },
    checkFields(listFields) {
      return requireFields.reduce((errorFields, field) => {
        if (listFields.findIndex(x => { return x == field }) == -1) {
          errorFields.push(field);
        }
      return errorFields;
      }, [])
    },
    async handleImportProduct() {
      if(this.dataProducts != null) {
        this.dataProducts.map(el => {
          this.arrayCateImport.push(...el.categories)
          this.arrayCateImport = Array.from(new 
            Set(this.arrayCateImport.map(item => 
                item.toLowerCase().trim()
              )
            )
          )
        })
        this.listDataCate.docs.map(el => {
          this.arrayCate.push(el.data().name.toLowerCase().trim())
        })

        console.log('arrayCate', this.arrayCate)
        console.log('arrayCateImport', this.arrayCateImport)

        this.listDataProduct.docs.map(el => {
          this.arrayProduct.push(el.data().slug)
        })

        const arrayProductImport = this.dataProducts.filter(element => !this.arrayProduct.includes(element.slug));
        const filteredElements = [...new Set(this.arrayCateImport.filter((element) => !this.arrayCate.includes(element)))];
        console.log('filteredElements', filteredElements)

        filteredElements.forEach(el => {
          let idCategory = this.store.randomID()
          setDoc(doc(this.db, this.uidData + 'Categories', `${idCategory}`), {
            name: el.charAt(0).toUpperCase() + el.slice(1), 
            id: idCategory,
            is_hidden: true,
            description: "",
            images: [],
            slug: convertVN(el).replace(/ /g, "-")
                              .replace(/_$/g, ""),
            total_products: 0
          })
        })

        this.$emit('isHandleImportProduct', arrayProductImport)
        this.visible = false;
        this.dataFile = null;
      } else {
        this.visible = false;
        this.dataFile = null;
      }
    },
    onHandleFileExcel(event) {
      this.getData();
      const file = event.target.files[0];
      this.dataFile = file;
      const reader = new FileReader();
      reader.readAsBinaryString(file);
      reader.onload = e => {
        const xlsxData = e.target.result;
        const workbook = XLSX.read(xlsxData, { type: 'binary' })
        const firstSheetNames = workbook.SheetNames[0];
        const roa = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheetNames], { raw: true })
        if (roa.length != 0) {
          const listFields = this.getHeadersExcel(workbook.Sheets[firstSheetNames]);
          const filedsLack = this.checkFields(listFields);
          if (filedsLack.length != 0) {
            toastNotification('error', 'Thông báo', `Tệp của bạn bị thiếu một trường ${filedsLack.join(",")}`)
          } else {
            let dataAfterCheck = roa.map(el => {
              return requireFields.concat(optionFields).reduce((acc, e) => ({ ...acc, ...{ [e]: el[e] } }), {})
            })

            dataAfterCheck = dataAfterCheck.reduce((acc, el) => {
              if (el["Loại"] == "Product") {
                return acc.concat([el])
              } else {
                const lastIndex = acc.length - 1;
                const variations = acc[lastIndex].variations || [];
                variations.push(el);
                acc[lastIndex].variations = variations;
                return acc;
              }
            }, [])
            
            let data = this.createData(dataAfterCheck)
            if (dataAfterCheck.filter(d => d.error).length == 0) {
              this.dataProducts = data;
            }
          }
        } else {

        }
      }
    },
    createData(params) {
      let data = params.map(el => {
        let product_id = this.store.randomID();
        let attr1 = el["Tên thuộc tính 1"]
        let value1 = el["Giá trị thuộc tính 1"]
        let attr2 = el["Tên thuộc tính 2"]
        let value2 = el["Giá trị thuộc tính 2"]
        let attr3 = el["Tên thuộc tính 3"]
        let value3 = el["Giá trị thuộc tính 3"]

        let images = el["Hình ảnh"]
        if (images) {
          images = images.split(", ")
        } else {
          []
        }

        let attributes = []
        if (attr1 && value1) {
          value1 = value1.split(", ")
          attributes = attributes.concat([{ name: attr1, value: value1 }])
        }

        if (attr2 && value2) {
          value2 = value2.split(", ")
          attributes = attributes.concat([{ name: attr2, value: value2 }])
        }

        if (attr3 && value3) {
          value3 = value3.split(", ")
          attributes = attributes.concat([{ name: attr3, value: value3 }])
        }
        let variations = (el.variations || []).map(e => {
          let a1 = e["Tên thuộc tính 1"]
          let a2 = e["Tên thuộc tính 2"]
          let a3 = e["Tên thuộc tính 3"]
          let v1 = e["Giá trị thuộc tính 1"]
          let v2 = e["Giá trị thuộc tính 2"]
          let v3 = e["Giá trị thuộc tính 3"]
          let properties = []
          let title = ""

          if (a1 && v1) {
            properties = properties.concat([{ name: a1, value: v1 }])
            title = v1;
          }

          if (a2 && v2) {
            properties = properties.concat([{ name: a2, value: v2 }])
            title = title + ' / ' + v2;
          }

          if (a3 && v3) {
            properties = properties.concat([{ name: a3, value: v3 }])
            title = title + ' / ' + v3;
          }

          let variationImages = e["Hình ảnh"]
          if (variationImages) {
            variationImages = variationImages.split(", ")
          } else {
            []
          }
          return {
            id: this.store.randomID(),
            product_id: product_id,
            title: title,
            is_hidden: true,
            product_name: el["Tên"],
            name: el["Tên"] + ' - ' + title,
            price: e["Giá bán"],
            original_price: e["Giá gốc"] || 0,
            images: variationImages,
            sku: `${e["Mã sản phẩm"]}`,
            properties: properties,
            remain_quantity: 0
          }
        }).reduce((acc, el) => {
            if (find(acc, e => isEqual(e.properties, el.properties))) {
              return acc
            } else {
              return acc.concat(el)
            }
          }, [])
        let categories = (el["Danh mục"] || "").split(", ").filter(el => el).map(el => el)

        return {
          id: product_id,
          categories: categories,
          original_price: el["Giá gốc"] || 0,
          price: el["Giá bán"] || 0,
          images: images || [],
          sku: `${el["Mã sản phẩm"]}`,
          description: (el["Mô tả ngắn"] || "").replaceAll(/(?:\r\n|\r|\n)/g, ''),
          name: el["Tên"],
          slug: convertVN(el["Tên"])
                  .replace(/ /g, "-")
                  .replace(/_$/g, ""),
          attributes: attributes,
          variations: variations,
          is_hidden: false,
          quantity: 0
        }
      })

      return data
    }
  }
}
</script>

<template>
  <div>
    <button style="height: 34px; border: 1px solid #ddd; background-color: #fff;" class="rounded-md" @click="this.visible = !this.visible">
      <upload-outlined class="text-14"/>
      Nhập excel
    </button>
    <a-modal 
      class="modal-collection collection-media-table p-0 modal-export-product"
      title="Nhập sản phẩm từ tệp excel" 
      okText="Lưu"
      cancelText="Huỷ"
      v-model:visible="this.visible"
      @ok="this.handleImportProduct"
    >
      <div class="media-table-body">
        <a-alert
          :message="$t('Warning')"
          :description="$t('To successfully import products, excel files need to be written in the correct sample file format')"
          type="warning"
          show-icon
        />
        <label for="handleFileExcel" class="cursor-pointer" v-if="this.dataFile == null">
          <div class="ant-upload-img rounded-md" >
            <upload-outlined class="text-16 mr-1"/>
            Upload
          </div>
          <input type="file" @change="onHandleFileExcel" id="handleFileExcel" accept=".xlsx, .xls, .csv" class="h-0 w-0 overflow-hidden d-none"/>
        </label>
        <label for="handleFileExcel" class="cursor-pointer" v-else>
          <div class="ant-upload-img rounded-md">
            {{ this.dataFile.name }}
          </div>
          <input type="file" @change="onHandleFileExcel" id="handleFileExcel" accept=".xlsx, .xls, .csv" class="h-0 w-0 overflow-hidden d-none"/>
        </label>
      </div>
    </a-modal>
  </div>
</template>

<style scoped lang="css">
  .ant-upload-img {
    border: 1px solid #ddd;
    padding: 5px;
    width: 120px;
    margin: 20px auto 0;
    text-align: center;

    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }

  .modal-export-product .ant-modal-body {
    padding: 22px 22px 0 22px !important;
  }
</style>
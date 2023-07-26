<script>
import { PlusOutlined, DownOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons-vue";
import { convertVN, formatMoney } from "../../composables/convert/convertVN";
import { useStore } from "../../pinia/store";
export default {
  name: "AddVariations",
  components: {
    PlusOutlined,
    DownOutlined,
    EditOutlined,
    DeleteOutlined
  },
  props: {
    dataVariations: {
      type: Object,
      default: {}
    }
  },
  setup() {
    return {
      convertVN, 
      formatMoney
    }
  },
  data() {
    const store = useStore();
    return {
      store,
      valueAttribute: [],
      options: [],
      listAttributes: [],
      listVariations: [],
      remain_quantity: 0,
      quantity: 0,
      price: 0,
      original_price: 0,
    }
  },
  created() {
    this.listAttributes = [
      {
        id: this.store.randomID(),
        name: 'Kích thước',
        value: []
      }
    ]
  },
  emits: ['transmissionVariations'],
  methods: {
    handleQuantity(value) {
      this.remain_quantity = Number(value.target.value);
    },
    onAddAttributes() {
      this.listAttributes = [
        ...this.listAttributes, 
        {
          id: this.store.randomID(),
          name: "",
          value: []
        }
      ]
    },
    handleChangeTitleAttr(id) {
      this.quantity = 0
      let value = event.target.value;
      this.listAttributes.map((el) => {
        if(el.id == id) {
          el.name = value;
        }
      })
      this.listAttributes = [...this.listAttributes]
      this.handleChange()
    },
    handleChange(attr) {
      this.handleAddVariaions(this.listAttributes)
      this.quantity = 0
      this.$emit('transmissionVariations', 
        {
          variations: this.listVariations, 
          attributes: this.listAttributes,
          quantity: this.quantity
        }
      );
    },
    handleAddVariaions(listAttr) {
      this.listVariations = listAttr
        .filter((item) => item.name)
        .reduce((acc, item, index) => {
          const { name, value } = item;
          if (!value || !value.length) return acc;
          let results = [];
          const current = [...acc];
          if (index == 0) {
            for (let i = 0; i < value.length; i++)
              results.push([
                { name: name, value: value[i] }
              ])
          } else {
            for (let i = 0; i < current.length; i++)
              for (let j = 0; j < value.length; j++) {
                const now = current[i].slice();
                const temp = now.concat({
                  name: name,
                  value: value[j],
                })
                results.push(temp)
              };
          };

          return results;
        }, [])
        .map((properties, index) => {
          return ({
            id: this.store.randomID(),
            product_name: this.dataVariations.name,
            name: this.dataVariations.name + ' - ' + properties.map((i) => i.value).join(" / "),
            sku: this.dataVariations.sku + '_' + convertVN(properties.map((i) => i.value).join(" / ")).toUpperCase()
                                                  .replaceAll(" / ", "_") 
                                                  .replace(" ", "_"),
            price: this.dataVariations.price,
            product_id: this.dataVariations.id,
            original_price: this.dataVariations.original_price,
            title: properties.map((i) => i.value).join(" / "),
            properties: properties,
            remain_quantity: this.remain_quantity, 
            images: [],
            is_hidden: true,
          })
        });

      console.log("listVariations", this.listVariations);
    },
    onRemainQuantity(remain_quantity) {
      this.quantity += Number(remain_quantity)
      this.$emit('transmissionVariations', 
        {
          variations: this.listVariations, 
          attributes: this.listAttributes,
          quantity: this.quantity
        }
      );
    },
    handleDeleteAttr(id) {
      console.log('id delete', id)
    }
  }
}
</script>

<template>
  <div class="ant-card-variations">
    <div class="ant-collapse-header p-4">
      <button class="border-0 background-transparent p-0 fw-600">
        <down-outlined class="mr-2"/>
        <span>Thông tin mẫu mã</span>
      </button>
    </div>
    <div class="ant-collapse-content w-100">
      <a-row class="align-items-center">
        <a-col :span="18">
          <div class="">
            <p class="fw-500 mb-1">Tạo mẫu mã</p>
            <span class="fw-300 text-14">Thêm mẫu mã sản phẩm được sử dụng quản lý sản phẩm có những hình thái khác nhau như: kích thước, màu sắc,...</span>
          </div>
        </a-col>
        <a-col :span="6">
          <div class="text-end">
            <button class="border-0 background-transparent color-1db954" @click="onAddAttributes">
              <plus-outlined class="text-14" />
              Thêm thuộc tính
            </button>
          </div>
        </a-col>
      </a-row>
      <div class="l-product-variant mt-4">
        <div class="variant-header">
          <a-row class="mb-2 variant-list">
            <a-col :span="6" class="pr-3">
              <span class="variant-item--name">
                Tên thuộc tính
              </span>
            </a-col>
            <a-col :span="18" class="pl-3">
              <span class="variant-item--property">
                Giá trị thuộc tính
              </span>
            </a-col>
          </a-row>
        </div>
        <div class="ui-product-variant mb-4">
          <a-row class="mb-2 variant-list" v-for="(attribute, index) in listAttributes" :key="attribute.id">
            <a-col :span="6" class="pr-3">
              <span class="variant-item--name label-group">
                <input 
                  placeholder="Tên thuộc tính" 
                  class="w-full" 
                  :value="attribute.name" 
                  @keyup="handleChangeTitleAttr(attribute.id)"
                />
              </span>
            </a-col>
            <a-col :span="17" class="pl-3">
              <span class="variant-item--property">
                <a-select 
                  v-model:value="attribute.value"
                  mode="tags"
                  style="width: 100%; height: 100%;"
                  placeholder="Giá trị thuộc tính"
                  @change="handleChange"
                >
                </a-select>
              </span>
            </a-col>
            <a-col :span="1" class="pl-3">
              <span class="variant-item--delete h-100 d-flex align-items-center justify-content-center cursor-pointer" v-if="index != 0" @click="handleDeleteAttr(attribute.id)">
                <delete-outlined class="text-17"/>
              </span>
            </a-col>
          </a-row>
        </div>
        <div class="ui-product-variant">
          <div class="">
            <b>Sửa đổi các mẫu mã đã tạo</b>
            <p class="mb-2">Chỉnh sửa lại thông tin về giá, SKU, Số lượng,... cho các mẫu mã đã tạo</p>
          </div>
          <a-table
            class="table-page-active"
            :data-source="this.listVariations"
            :pagination="false"
            bordered
          >
            <a-table-column title="Mẫu mã" class="w-35">
              <template #default="{ record }">
                <div class="d-flex align-items-center gap-3">
                  <span>{{ record.title.replaceAll("/", "|")  }}</span>
                </div>
              </template>
            </a-table-column>
            <a-table-column title="SKU" class="w-25">
              <template #default="{ record }">
                <span class="fw-300">
                  {{ this.dataVariations.sku + '_' + 
                    convertVN(record.title).toUpperCase()
                      .replaceAll(" / ", "_") 
                      .replace(" ", "_")
                  }}
                </span>
              </template>
            </a-table-column>
            <a-table-column title="Giá bán (đ)" class="w-10">
              <template #default="{ record }">
                <span>
                  <input type="text" v-model="record.price" @keyup="this.price = $event.target.value" class="py-1 px-3"/> 
                </span>
              </template>
            </a-table-column>
            <a-table-column title="Giá gốc (đ)" class="w-10">
              <template #default="{ record }">
                <span>
                  <input type="text" v-model="record.original_price" @keyup="this.original_price = $event.target.value" class="py-1 px-3"/> 
                </span>
              </template>
            </a-table-column>
            <a-table-column title="Số lượng" class="w-10">
              <template #default="{ record }">
                <span>
                  <!-- <input v-model="record.remain_quantity" @keyup="this.remain_quantity = Number($event.target.value)" type="number" class="py-1 px-3 input_remain_quantity"/> -->
                  <input v-model="record.remain_quantity" @change="this.onRemainQuantity(record.remain_quantity)" type="number" class="py-1 px-3 input_remain_quantity"/>
                </span>
              </template>
            </a-table-column>
          </a-table>
        </div>
      </div>
    </div>
  </div>  
</template>

<style>
  .label-group input {
    outline: none;
    /* height: 40px; */
    padding: 8px 10px;
    border-radius: 4px;
    border: 1px solid #ddd;
  }

  .ant-input-affix-wrapper {
    padding: 0px 8px !important;
    border-radius: 4px;
  }

  .ant-select-selection-item {
    background-color: #e8f8ee !important;
    border-radius: 4px !important;
  }
</style>
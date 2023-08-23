<script>
import {
  PlusOutlined,
  DownOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons-vue";
import { convertVN, formatMoney, formatMoneyChange } from "../../composables/convert/convertVN";
import { useStore } from "../../pinia/store";
export default {
  name: "EditVariation",
  components: {
    PlusOutlined,
    DownOutlined,
    EditOutlined,
    DeleteOutlined,
  },
  props: {
    dataVariations: {
      type: Object,
      default: {},
    },
  },
  setup() {
    return {
      convertVN,
      formatMoney,
      formatMoneyChange
    };
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
    };
  },
  created() {
    this.listAttributes = [...this.dataVariations?.attributes];
    this.listVariations = [...this.dataVariations.variations];
  },
  emits: ["transmissionVariations"],
  methods: {
    onAddAttributes() {
      this.listAttributes = [
        ...this.dataVariations.attributes,
        {
          id: this.store.randomID(),
          name: "",
          value: []
        }
      ];
    },
    handleChangeTitleAttr(id) {
      let value = event.target.value;
      this.listAttributes.map((el) => {
        if (el.id == id) {
          el.name = value;
        }
      });
      this.listAttributes = [...this.listAttributes];
      this.handleChange();
    },
    handleChange(attr) {
      this.handleAddVariaions(this.listAttributes);
      this.$emit('transmissionVariations', 
        {
          variations: this.listVariations, 
          attributes: this.listAttributes,
          quantity: this.quantity
        }
      )
    },
    handleAddVariaions(listAttr) {
      const oldVariations = this.listVariations;
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
          const oldVariation = oldVariations.find(
            (variation) => variation.title == properties
          );
          return oldVariation
            ? oldVariation
            : {
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
            }
        });

      console.log("listVariations", this.listVariations);
      this.quantity = 0;
      this.listVariations.forEach(el => {
        this.quantity += Number(el.remain_quantity);
      })
    },
    handleClickEdit(id) {
      this.$router.push({
        path: "/dashboard/products/edit/" + this.dataVariations.id + "/variat/" + id
      });
    },
    handleDeleteAttr(id) {
      this.listAttributes = this.listAttributes.filter((item) => item.id !== id)
      this.handleAddVariaions(this.listAttributes);
      this.$emit('transmissionVariations', 
        {
          variations: this.listVariations, 
          attributes: this.listAttributes,
          quantity: this.quantity
        }
      )
    },
  },
};
</script>

<template>
  <div class="ant-card-variations"> 
    <div class="ant-collapse-header p-4">
      <button class="border-0 background-transparent p-0 fw-600">
        <down-outlined class="mr-2" />
        <span>{{ $t('Variant information') }}</span>
      </button>
    </div>
    <div class="ant-collapse-content w-100">
      <a-row class="align-items-center">
        <a-col :span="18">
          <div class="">
            <p class="fw-500 mb-1">{{ $t('Create variant') }}</p>
            <span class="fw-300 text-14">{{ $t('Add product models used to manage products with different forms such as size, color,...') }}</span>
          </div>
        </a-col>
        <a-col :span="6">
          <div class="text-end">
            <button
              class="border-0 background-transparent color-1db954"
              @click="onAddAttributes"
            >
              <plus-outlined class="text-14" />
              {{ $t('Add attribute') }}
            </button>
          </div>
        </a-col>
      </a-row>
      <div class="l-product-variant mt-4">
        <div class="variant-header">
          <a-row class="mb-2 variant-list">
            <a-col :span="6" class="pr-3">
              <span class="variant-item--name">{{ $t('Name of attribute') }}</span>
            </a-col>
            <a-col :span="18" class="pl-3">
              <span class="variant-item--property">{{ $t('Value of attribute') }}</span>
            </a-col>
          </a-row>
        </div>
        <div class="ui-product-variant mb-4">
          <a-row
            class="mb-2 variant-list"
            v-for="(attribute, index) in listAttributes"
            :key="attribute.id"
          >
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
                  style="width: 100%; height: 100%"
                  placeholder="Giá trị thuộc tính"
                  @change="handleChange"
                >
                </a-select>
              </span>
            </a-col>
            <a-col :span="1" class="pl-3">
              <span
                class="variant-item--delete h-100 d-flex align-items-center justify-content-center cursor-pointer"
                v-if="index != 0"
                @click="handleDeleteAttr(attribute.id)"
              >
                <delete-outlined class="text-17" />
              </span>
            </a-col>
          </a-row>
        </div>
        <div class="ui-product-variant">
          <div class="">
            <b>{{ $t('Modify the variations created') }}</b>
            <p class="mb-2">{{ $t('Edit information about price, SKU, Quantity,... for created models') }}</p>
          </div>
          <a-table
            class="table-page-active"
            :data-source="this.listVariations"
            :pagination="false"
            bordered
          >
            <a-table-column :title="$t('Variant')">
              <template #default="{ record }">
                <div class="d-flex align-items-center gap-3">
                  <span>{{ record.title.replaceAll("/", "|") }}</span>
                </div>
              </template>
            </a-table-column>
            <a-table-column :title="$t('SKU')" class="w-15">
              <template #default="{ record }">
                <span class="fw-300">
                  {{
                    record.sku
                  }}
                </span>
              </template>
            </a-table-column>
            <a-table-column :title="$t('Price') + '(đ)'" class="w-15">
              <template #default="{ record }">
                <span>
                  {{ formatMoney((record.price)) }}
                </span>
              </template>
            </a-table-column>
            <a-table-column :title="$t('Original price') + '(đ)'" class="w-15">
              <template #default="{ record }">
                <span>
                  {{ formatMoney(record.original_price) }}
                </span>
              </template>
            </a-table-column>
            <a-table-column :title="$t('Quantity')" class="w-15">
              <template #default="{ record }">
                <span>
                  {{ record.remain_quantity }}
                </span>
              </template>
            </a-table-column>
            <a-table-column :title="$t('Action')" class="w-15">
              <template #default="{ record }">
                <div class="btn-act">
                  <a-tooltip placement="top">
                    <template #title>
                      <span>{{ $t('Delete product') }}</span>
                    </template>
                    <button
                      class="border-0 mx-1 background-transparent cursor-pointer"
                    >
                      <delete-outlined class="text-18" />
                    </button>
                  </a-tooltip>
                  <a-tooltip placement="top">
                    <template #title>
                      <span>{{ $t('Edit Variation') }}</span>
                    </template>
                    <button
                      class="border-0 mx-1 background-transparent cursor-pointer"
                      @click="handleClickEdit(record.id)"
                    >
                      <edit-outlined class="text-18" />
                    </button>
                  </a-tooltip>
                </div>
              </template>
            </a-table-column>
          </a-table>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="css">
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

<script>
import { DeleteOutlined } from "@ant-design/icons-vue";
import { doc, deleteDoc } from "firebase/firestore";
import { useStore } from "../../pinia/store";
import { toastNotification } from "../../components/Notification";

import { Modal } from "ant-design-vue";
import { createVNode } from "vue";
export default {
  name: 'ModalDeleteAll',
  components: {
    DeleteOutlined
  },
  props: {
    data: {
      type: Object,
      default: {}
    }
  },
  data() {
    const store = useStore();
    return {
      db: store.db,
      Modal,
      dataSort: []
    }
  }, 
  emits: ["isHandleDeleteAll"],
  methods: {
    handleDeleteAll() {
      console.log('okokokk', this.data)
      const _this = this;
      Modal.confirm({
        title: `Xoá ${_this.data.selectedRowKeys.length } ${_this.data.title}`,
        icon: createVNode(DeleteOutlined),
        content: `Bạn có chắc chắn muốn xóa ${_this.data.title} này không? Hành động này không thể được hoàn tác`,
        okText: "Đồng ý",
        okType: 'danger',
        cancelText: "Huỷ",
        onOk() {
          _this.data.selectedRowKeys.map(async (el, index) => {
            await deleteDoc(doc(_this.db, _this.data.uidData + `${_this.data.nameOption}`, `${el}`));
          })
          _this.dataSort = _this.data.dataSort.filter((element) => !_this.data.selectedRowKeys.includes(element.id))
          _this.$emit('isHandleDeleteAll', _this.dataSort)
          toastNotification('success', `Xoá ${_this.data.title} thành công`, '')
        },
      });
    }
  }
}
</script>

<template>
  <button class="px-2 rounded-md d-flex align-items-center" @click="handleDeleteAll" style="border: 1px solid #ddd; background-color: #fff;">
    <delete-outlined class="text-16"/>
  </button>
</template>
<script>
import { ref } from "vue";
import draggable from "vuedraggable";
import { useStore } from "../../pinia/store";

export default {
  name: 'ModalSortImage',
  components: {
    draggable
  },
  setup() {
    const meals = ref([
      '1',
      '2',
      '3',
      '4',
      '5'
    ])
    return {
      meals 
    }
  },
  data() {
    const store = useStore()
    return {
      store,
      drag: false,
      arrayImage: [
        "https://firebasestorage.googleapis.com/v0/b/vue-project-67d3d.appspot.com/o/ImageUser%2FvPhh5NLimJXK8jFBL1AAE3SdqZC3%2F1.png?alt=media&token=58cb04bb-0400-4e50-8833-dbc1655bbcb6",
        "https://firebasestorage.googleapis.com/v0/b/vue-project-67d3d.appspot.com/o/ImageUser%2FvPhh5NLimJXK8jFBL1AAE3SdqZC3%2Fz4505350028943_a0942535403fea7c1ea38fe573ac149b.jpg?alt=media&token=9f321227-3d8a-4c5d-9204-4f32d0521fbb",
        "https://firebasestorage.googleapis.com/v0/b/vue-project-67d3d.appspot.com/o/ImageUser%2FvPhh5NLimJXK8jFBL1AAE3SdqZC3%2Fz4505387463158_34d0ca78eab850fb950657f144fb0de9.jpg?alt=media&token=af42df84-453b-428a-b20a-cdb198a29edd",
        "https://firebasestorage.googleapis.com/v0/b/vue-project-67d3d.appspot.com/o/ImageUser%2FvPhh5NLimJXK8jFBL1AAE3SdqZC3%2Fz4505387463158_34d0ca78eab850fb950657f144fb0de9-removebg-preview.png?alt=media&token=09b62c0f-285e-44fe-b7cc-7cf3ae22caa7"
      ]
    }
  },
  created() {
    // console.log('meals', this.meals)
    // console.log('arrayImage', this.arrayImage)
  },
  // computed: {
  //   dragOptions() {
  //     return {
  //       animation: 200,
  //       group: "description",
  //       disabled: false,
  //       ghostClass: "ghost"
  //     };
  //   }
  // }
}
</script>

<template>
  <div>
    <a-modal
      class="modal-sort-img"
      v-model:visible="this.store.visibleSortImage"
      title="Sắp xếp ảnh"
      okText="Lưu"
      cancelText="Huỷ"
    >
      <div class="media-table-body">
        <draggable class="min-height" v-model="meals" tag="ul">
          <template #item="{ element: meal }">
            <li>{{ meal }}</li>
          </template>
        </draggable>
      </div>  
    </a-modal>
  </div>
</template>
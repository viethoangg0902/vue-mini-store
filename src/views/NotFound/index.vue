<script>
import "../../sass/main.sass"; 
import {
  LeftOutlined,
} from "@ant-design/icons-vue";

export default {
  components: {
    LeftOutlined
  }
}
</script>

<template>
  <div class="w-full h-100 d-flex align-items-center justify-content-center">
    <div class="main-error" style="width: 1200px;">
      <a-row class="wscn-http404">
        <a-col :span="14">
          <div class="pic-404">
            <img class="pic-404__parent w-full" src="https://panjiachen.github.io/vue-element-admin/static/img/404.a57b6f31.png"/>
            <img class="pic-404__child left absolute" src="https://panjiachen.github.io/vue-element-admin/static/img/404_cloud.0f4bc32b.png"/>
            <img class="pic-404__child mid absolute" src="https://panjiachen.github.io/vue-element-admin/static/img/404_cloud.0f4bc32b.png"/>
            <img class="pic-404__child right absolute" src="https://panjiachen.github.io/vue-element-admin/static/img/404_cloud.0f4bc32b.png"/>
          </div>
        </a-col>
        <a-col :span="10">
          <h1 class="fw-900">OOPS!</h1>
          <h2 class="">Quản trị viên web nói rằng bạn không thể vào trang này...</h2>
          <p>Vui lòng kiểm tra xem URL bạn đã nhập có chính xác không hoặc nhấp vào nút bên dưới để quay lại trang chủ.</p> 
          <div class="text-center">
            <router-link 
              :to="{ name: 'Dashboard', params: {} }"
              class="border-0 d-flex align-items-center justify-content-center gap-1"
            >
              <left-outlined class="text-14"/>
              <span class="text-16">Go to HomePage</span>
            </router-link>
          </div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<style scoped lang="css">
  .pic-404 {
    position: relative;
    overflow: hidden;
  }

  .wscn-http404 .pic-404__child.left {
    width: 80px;
    top: 17px;
    left: 220px;
    opacity: 0;
    -webkit-animation-name: cloudLeft-data-v-26fcd89f;
    animation-name: cloudLeft-data-v-26fcd89f;
    -webkit-animation-duration: 2s;
    animation-duration: 2s;
    -webkit-animation-timing-function: linear;
    animation-timing-function: linear;
    -webkit-animation-fill-mode: forwards;
    animation-fill-mode: forwards;
    -webkit-animation-delay: 1s;
    animation-delay: 1s;
  }

  .wscn-http404 .pic-404__child.mid {
    width: 46px;
    top: 10px;
    left: 420px;
    opacity: 0;
    -webkit-animation-name: cloudMid-data-v-26fcd89f;
    animation-name: cloudMid-data-v-26fcd89f;
    -webkit-animation-duration: 2s;
    animation-duration: 2s;
    -webkit-animation-timing-function: linear;
    animation-timing-function: linear;
    -webkit-animation-fill-mode: forwards;
    animation-fill-mode: forwards;
    -webkit-animation-delay: 1.2s;
    animation-delay: 1.2s;
  }

  .wscn-http404 .pic-404__child.right {
    width: 62px;
    top: 100px;
    left: 500px;
    opacity: 0;
    -webkit-animation-name: cloudRight-data-v-26fcd89f;
    animation-name: cloudRight-data-v-26fcd89f;
    -webkit-animation-duration: 2s;
    animation-duration: 2s;
    -webkit-animation-timing-function: linear;
    animation-timing-function: linear;
    -webkit-animation-fill-mode: forwards;
    animation-fill-mode: forwards;
    -webkit-animation-delay: 1s;
    animation-delay: 1s;
  }

  @keyframes cloudLeft-data-v-26fcd89f {
    0% {
        top: 17px;
        left: 220px;
        opacity: 0
    }

    20% {
        top: 33px;
        left: 188px;
        opacity: 1
    }

    80% {
        top: 81px;
        left: 92px;
        opacity: 1
    }

    to {
        top: 97px;
        left: 60px;
        opacity: 0
    }
  }

  @-webkit-keyframes cloudMid-data-v-26fcd89f {
    0% {
        top: 10px;
        left: 420px;
        opacity: 0
    }

    20% {
        top: 40px;
        left: 360px;
        opacity: 1
    }

    70% {
        top: 130px;
        left: 180px;
        opacity: 1
    }

    to {
        top: 160px;
        left: 120px;
        opacity: 0
    }
  }

  @keyframes cloudMid-data-v-26fcd89f {
    0% {
        top: 10px;
        left: 420px;
        opacity: 0
    }

    20% {
        top: 40px;
        left: 360px;
        opacity: 1
    }

    70% {
        top: 130px;
        left: 180px;
        opacity: 1
    }

    to {
        top: 160px;
        left: 120px;
        opacity: 0
    }
}

@-webkit-keyframes cloudRight-data-v-26fcd89f {
    0% {
        top: 100px;
        left: 500px;
        opacity: 0
    }

    20% {
        top: 120px;
        left: 460px;
        opacity: 1
    }

    80% {
        top: 180px;
        left: 340px;
        opacity: 1
    }

    to {
        top: 200px;
        left: 300px;
        opacity: 0
    }
  }

  @keyframes cloudRight-data-v-26fcd89f {
    0% {
        top: 100px;
        left: 500px;
        opacity: 0
    }

    20% {
        top: 120px;
        left: 460px;
        opacity: 1
    }

    80% {
        top: 180px;
        left: 340px;
        opacity: 1
    }

    to {
        top: 200px;
        left: 300px;
        opacity: 0
    }
  }



  h1 {
    font-size: 40px;  
    margin: 0;
    color: #498cf2;
    /* text-shadow: 5px 5px 5px #2d5b9d;
    height: 220px; */
  }

  h2 {
    font-size: 24px;
    text-shadow: 5px 5px 8px;
  }

  .main-error a {
    border: 1px solid #498cf2;
    border-radius: 6px;
    padding: 5px 20px;
    width: 200px;
    margin: auto;
  }

  .main-error a:hover {
    background: #498cf2;
    color: #fff;
  }
</style>
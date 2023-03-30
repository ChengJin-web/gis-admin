<template>
  <div class="bottom-coord">
    <div class="copyright" :class="{ black: basemap === 'hybrid' }">
      <span
        >Copyright © 2023
        <a class="link" target="blank" href="https://github.com/xLong1029/xlong-map-admin"
          ><span>{{ companyName }}</span></a
        >
        All Rights Reserved.</span
      >
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue'

const props = defineProps({
  companyName: {
    type: String,
    default: ''
  }
})

// 地图底图
const basemap = inject('getBasemap')
</script>

<style lang="scss" scoped>
.bottom-coord {
  height: 20px;
  width: 100%;
  position: absolute;
  bottom: 0;
  font-size: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .copyright {
    padding: 2px;
    background: rgba(255, 255, 255, 0.35);
    border-radius: 0 4px 0 0;
    .link {
      color: var(--primaryColor, #168bf2);

      &:hover {
        span {
          text-decoration: underline;
        }
      }
    }

    .iconfont {
      font-size: 12px;
    }

    > span {
      margin: 0 10px;
    }

    &.black {
      background: rgba(0, 0, 0, 0.35);
      color: #999999;
    }
  }
}

.qrcode {
  &-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__img {
    width: 100px;
    height: 100px;
  }

  &__title {
    margin-top: 10px;
    font-size: 12px;
  }
}
</style>

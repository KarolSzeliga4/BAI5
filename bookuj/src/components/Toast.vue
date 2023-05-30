<template>
  <div class="myToast" v-if="userState.toast.show">
    <div class="myToast-header">
      <div class="row">
        <div class="col"><strong>Bookuj</strong></div>
        <div class="col text-right" @click="hide">
          <small>X</small>
        </div>
      </div>
    </div>
    <div class="myToast-body">{{ userState.toast.text }}</div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import userState from "../state/userState";
import { onUpdated } from "vue";

onUpdated(() => {
  if (!!userState.toast.text) {
    setTimeout(() => {
      userState.toast.show = false;
      userState.toast.text = "";
    }, 2000);
  }
});
</script>

<style>
.myToast {
  position: absolute;
  z-index: 10;
  background-color: rgb(46, 127, 199);
  padding: 1rem;
  border-radius: 5px;
  color: white;
}

.text-right {
  text-align: right;
}

.text-right:hover {
  cursor: pointer;
}
</style>

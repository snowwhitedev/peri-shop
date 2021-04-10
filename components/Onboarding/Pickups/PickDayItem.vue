<template>
  <div class="flex justify-between items-center">
    <div class="flex items-center">
      <div
        class="bg-white border-2 rounded border-gray-800 w-6 h-6 flex flex-shrink-0 justify-center items-center mr-2 focus-within:border-blue-500"
      >
        <input
          v-model="value.checked"
          type="checkbox"
          :value="value.checked"
          class="opacity-0 absolute cursor-pointer"
        >
        <svg
          class="fill-current hidden w-4 h-4 text-red-700 pointer-events-none"
          viewBox="0 0 20 20"
        >
          <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
        </svg>
      </div>
      <div class="select-none cursor-pointer weekdays">
        {{ value.day }}
      </div>
    </div>
    <div class="flex justify-between">
      <div class="flex items-center">
        <label class="mr-2">From:</label>
        <b-timepicker v-model="value.start_time" hour-format="24" inline />
      </div>
      <div class="flex items-center ml-6">
        <label class="mr-2">To:</label>
        <b-timepicker v-model="value.end_time" hour-format="24" inline />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      default: () => {}
    }
  }
};
</script>

<style lang="scss" scoped>
.weekdays {
  text-transform: capitalize;
}
</style>

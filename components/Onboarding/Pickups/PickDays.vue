<template>
  <div class="modal-card">
    <div class="w-full block p-3 shadow-md modal-card-body bg-gray-200">
      <div class="flex flex-row w-full mb-2">
        <div class="w-full flex flex-col items-center">
          <span class="text-xl text-gray-600 font-semibold">
            Select day of weeks
          </span>
        </div>
        <span
          class="rounded px-2 py-1 bg-red-700 text-white float-right cursor-pointer"
          @click="$emit('close')"
        >
          Done
        </span>
      </div>
      <div class="flex flex-row justify-between">
        <label class="flex flex-row justify-start items-start">
          <div class="select-none cursor-pointer mr-1 uppercase text-sm font-semibold">
            {{ selectAllText }}
          </div>
          <div
            class="bg-white border-2 rounded border-gray-800 w-6 h-6 flex flex-shrink-0 justify-center items-center mr-2 focus-within:border-blue-500"
          >
            <input
              id="selectAll"
              v-model="allSelected"
              type="checkbox"
              class="opacity-0 absolute cursor-pointer"
              @click="selectAll"
            >
            <svg
              class="fill-current hidden w-4 h-4 text-red-700 pointer-events-none"
              viewBox="0 0 20 20"
            >
              <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
            </svg>
          </div>
        </label>
      </div>
      <ul id="customScroll" data-simplebar-auto-hide="false">
        <li
          v-for="(pickUpTime, index) in pickUpTimes"
          :key="index"
          class="border border-t-0 border-r-0 border-l-0 border-b mb-2"
        >
          <pick-day-item v-model="pickUpTimes[index]" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import PickDayItem from './PickDayItem.vue';
import { WEEK_DAYS, PICKUP_DEFAULT_START_TIME, PICKUP_DEFAULT_END_TIME } from '@/store/contants';
export default {
  components: {
    PickDayItem
  },
  props: {
    value: {
      type: Array,
      default: () => []
    },
    initDays: {
      type: Array,
      default: () => []
    }
  },
  data: () => {
    const fakeDate = '2020-11-22';
    const pickUpTimes = WEEK_DAYS.map(day => ({
      pickup_time_id: null,
      day,
      start_time: new Date(`${fakeDate} ${PICKUP_DEFAULT_START_TIME}`),
      end_time: new Date(`${fakeDate} ${PICKUP_DEFAULT_END_TIME}`),
      checked: false
    }));
    return {
      weekDays: WEEK_DAYS,
      selectAllText: 'Select All',
      allSelected: false,
      pickUpTimes
    };
  },
  watch: {
    pickUpTimes: {
      handler () {
        this.$emit('input', this.pickUpTimes);
      },
      deep: true
    },
    initDays: {
      handler () {
        const fakeDate = '2020-11-22';
        const newPicKTimes = WEEK_DAYS.map(day => ({
          pickup_time_id: null,
          day,
          start_time: new Date(`${fakeDate} ${PICKUP_DEFAULT_START_TIME}`),
          end_time: new Date(`${fakeDate} ${PICKUP_DEFAULT_END_TIME}`),
          checked: false
        }));
        for (const idx in newPicKTimes) {
          const found = this.value.findIndex(el => (el.day === newPicKTimes[idx].day));
          if (found > -1) {
            newPicKTimes[idx] = {
              pickup_time_id: this.value[found].pickup_time_id,
              day: newPicKTimes[idx].day,
              start_time: new Date(`${fakeDate} ${this.value[found].start_time}`),
              end_time: new Date(`${fakeDate} ${this.value[found].end_time}`),
              checked: true
            };
          }
        }
        this.pickUpTimes = [...newPicKTimes];
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    selectAll () {
      this.allSelected = !this.allSelected;
      this.selectAllText = this.allSelected ? 'Clear All' : 'Select All';
      for (const pick of this.pickUpTimes) {
        pick.checked = this.allSelected;
      }
    }
  }
};
</script>

<style scoped>
.weekdays {
  text-transform: capitalize;
}
</style>

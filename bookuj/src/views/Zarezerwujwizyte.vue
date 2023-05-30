<template>
  <h1>Zarezerwuj wizytę</h1>
  <h6 v-if="!userState.accessToken.length">Oh nie, nie jesteś zalogowany 😢</h6>
  <div v-else>
    <h6>Zalogowany jako: {{ userState.user.login }}</h6>

    <div class="container">
      <Calendar
        ref="calendar"
        v-model="data.selectedDate"
        :attributes="attrs"
        v-on:dayclick="dayClick">
      </Calendar>
      <div>
        <div class="hours-container">
          <div
            class="hour-element"
            v-for="hour in data.hours"
            :class="{ active: data.selectedHour === hour }"
            v-on:click="() => hourClick(hour)">
            {{ hour }}:00
          </div>
        </div>
        <button
          id="makeBooking"
          class="btn btn-primary btn-block mb-3 shadow"
          v-on:click="book"
          :disabled="data.blocked">
          Zarezerwuj wizytę
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { Calendar, DatePicker } from "v-calendar";
import "v-calendar/style.css";
import { onMounted, onUpdated } from "vue";
import { makePostRequest } from "../api/api";
import userState from "../state/userState";
const attrs = ref([
  {
    content: "blue",
  },
  {
    highlight: {
      color: "blue",
      fillMode: "light",
    },
    dates: new Date(),
  },
]);
const calendar = ref(null);

const data = reactive({
  selectedDate: new Date(2023, 4, 8),
  selectedHour: 0,
  hours: [],
  blocked: true,
});

onMounted(() => {
  getHours(data.selectedDate.toString());
});

let lastGetDay = null;
onUpdated(() => {
  if (lastGetDay?.getTime?.() !== data.selectedDate?.getTime?.()) {
    getHours(data.selectedDate.toString());
    lastGetDay = data.selectedDate;
  }
});

const getHours = async (date) => {
  const response = await makePostRequest("booking/availableHours", {
    date,
  });

  data.blocked = !response.hours.length;
  data.hours = response.hours;
  data.selectedHour = response.hours[0];
};

const dayClick = (day, event) => {
  data.selectedDate = new Date(day.id);
};

const hourClick = (hour) => {
  data.selectedHour = hour;
};

const book = async () => {
  const response = await makePostRequest(`booking/make`, {
    date: data.selectedDate.toString(),
    hour: data.selectedHour,
    userId: userState.user.id,
  });

  let booking = {
    time: data.selectedDate.toString() + data.selectedHour,
    name: "doctor",
    purpose: "purpose",
    addInfo: "description",
  };

  console.log(userState.user.bookings.data.push(booking));

  getHours(data.selectedDate.toString());
};
</script>

<style>
.container {
  display: flex;
  flex-direction: row;
  max-width: unset;
}

.hours-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  min-height: 50px;
  padding: 20px;
}

.hour-element {
  width: 100px;
  height: 25px;
  padding: 5px 10px;
  border: 1px solid black;
  border-radius: 5px;
  padding: 15px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  color: black;
}

.hour-element:hover {
  background-color: #3c91b3;
  cursor: pointer;
}

.hour-element.active {
  background-color: #3cb371;
  font-weight: bolder;
}
</style>

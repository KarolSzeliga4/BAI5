<template>
  <h1>Zarezerwuj wizytę</h1>
  <h6 v-if="!userState.accessToken.length">Oh nie, nie jesteś zalogowany 😢</h6>
  <div v-else>
    <div id="purposeChoice">
      <h3>Wybierz lekarza i usługę:</h3>
      <div class="doctors-container">
        <div 
          class="doctor-element"
          :class="{ active: data.doctorId === doctorsId['Dr Zbigniew Burski'] }"
          v-on:click="() => doctorClick(doctorsId['Dr Zbigniew Burski'])">Dr Zbigniew Burski</div>
        <div 
          class="doctor-element"
          :class="{ active: data.doctorId === doctorsId['Dr Zosia Burska'] }"
          v-on:click="() => doctorClick(doctorsId['Dr Zosia Burska'])">Dr Zosia Burska</div>
        <div 
          class="doctor-element"
          :class="{ active: data.doctorId === doctorsId['Dr Mirosław Halux'] }"
          v-on:click="() => doctorClick(doctorsId['Dr Mirosław Halux'])">Dr Mirosław Halux</div>
      </div>
      <div id="1" class="purpose-container">
        <div
          class="purpose-element"
          v-for="purpose in visitPurposes['1']"
          :class="{ active: data.purpose === purpose }"
          v-on:click="() => purposeClick(purpose, 1)">
          {{ purpose }}
        </div>
      </div>
      <div id="2" class="purpose-container">
        <div
          class="purpose-element"
          v-for="purpose in visitPurposes['2']"
          :class="{ active: data.purpose === purpose }"
          v-on:click="() => purposeClick(purpose, 2)">
          {{ purpose }}
        </div>
      </div>
      <div id="3" class="purpose-container">
        <div
          class="purpose-element"
          v-for="purpose in visitPurposes['3']"
          :class="{ active: data.purpose === purpose }"
          v-on:click="() => purposeClick(purpose, 3)">
          {{ purpose }}
        </div>
      </div>
      <button
        id="makeBooking"
        class="btn btn-primary btn-block mb-3 shadow"
        v-on:click="confirmPurposeClick"
        :disabled="data.blocked">
        Przejdź do wyboru daty
      </button>
    </div>
    <div id="dateChoice" class="second-part">
      <h3>Wybierz termin</h3>
      <div class="doctor-perpose-result-container">
        <h4>Wybrany lekarz i cel wizyty:</h4>
        <div 
          class="doctor-element" style="background-color: #14dfce;">
          {{ doctorsNames[data.doctorId]}}
        </div>
        <div 
          class="purpose-element" style="background-color: #14dfce;">
          {{ data.purpose }}
        </div>
      </div>
      <div class="container">
        <Calendar
          ref="calendar"
          v-model="data.selectedDate"
          :attributes="attrs"
          v-on:dayclick="dayClick">
        </Calendar>
        <div>
          <div class="day-container">
            <h5>Dnia [{{data.selectedDate.toString().substring(0, 15)}}] dostępne są następujące terminy:</h5>
          </div>
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
  purpose: "purpose",
  doctorId: 0,
  hours: [],
  blocked: true,
});

const visitPurposes = {
    "1": ["Bóle w klatce piersiowej", "Nadciśnienie Niewydolność", "Opieka po zawale", "Ocena ryzyka przed operacjami", "Diagnostyka"],
    "2": ["Poradnia chorób wewnętrznych", "Diagnostyka stanu zdrowia", "Ocena stanu zdrowia", "Skierowanie do lekarza specjalisty"],
    "3": ["Bóle chrząstno Stawowe", "Kwalifikacje do zabiegów", "Blokada/punkcja/nakłucie", "Diagnostyka"]
};
const doctorsNames = {
    1: "Dr Zbigniew Burski",
    2: "Dr Zosia Burska",
    3: "Dr Mirosław Halux"
};

const doctorsId = {
    "Dr Zbigniew Burski": 1,
    "Dr Zosia Burska": 2,
    "Dr Mirosław Halux": 3
};

onMounted(() => {
  getHours(data.selectedDate.toString(), data.doctorId);
});

let lastGetDay = null;
onUpdated(() => {
  if (lastGetDay?.getTime?.() !== data.selectedDate?.getTime?.()) {
    getHours(data.selectedDate.toString(), data.doctorId);
    lastGetDay = data.selectedDate;
  }
});

const getHours = async (date, doctorId) => {
  const response = await makePostRequest("booking/availableHours", {
    date,
    doctorId
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

const purposeClick = (purpose, doctorId) => {
  data.purpose = purpose;
  data.doctorId = doctorId;
};

const confirmPurposeClick = () => {
  document.getElementById('dateChoice').style.display = "inline";
  document.getElementById('purposeChoice').style.display = "none";
};

const doctorClick = (id) => {
  if(data.doctorId != 0){
  document.getElementById(data.doctorId).style.display = "none";
  }
  data.doctorId = id;
  document.getElementById(data.doctorId).style.display = "flex";
  data.purpose = "purpose";
};

const book = async () => {
  const response = await makePostRequest(`booking/make`, {
    date: data.selectedDate.toString(),
    hour: data.selectedHour,
    userId: userState.user.id,
    purpose: data.purpose,
    doctorId: data.doctorId,
  });

  let booking = {
    time: data.selectedDate.toString() + data.selectedHour,
    name: doctorsNames[doctorId], 
    purpose: data.purpose,
    addInfo: "no description",
  };

  console.log(userState.user.bookings.data.push(booking));

  getHours(data.selectedDate.toString(), doctorId);
};
</script>

<style>

.container {
  display: flex;
  flex-direction: row;
  max-width: unset;
}

.doctors-container{
  display: flex;
  flex-wrap: wrap;
  gap: 50px;
  min-height: 50px;
  padding: 20px;
}

.purpose-container{
  display: none;
  flex-wrap: wrap;
  justify-content: left;
  gap: 20px;
  min-height: 50px;
  padding: 20px;
}

.day-container{
  display: flex;
  justify-content: left;
  padding: 10px 30px;
}

.second-part {
  display: none;
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
  background-color: #14dfce;
  font-weight: bolder;
}

.purpose-element {
  background-color: #c8e6f1;
  border: 1px solid black;
  border-radius: 15px;
  padding: 5px 10px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  color: black;
}

.purpose-element:hover {
  background-color: #e2f2f8;
  cursor: pointer;
}

.purpose-element.active {
  background-color: #14dfce;
  font-weight: bolder;
}


.doctor-element {
  font-size: 20px;
  background-color: #b2bec2;
  border: 1px solid black;
  border-radius: 5px;
  padding: 5px 10px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  color: black;
}

.doctor-element:hover {
  background-color: #d2e1e6;
  cursor: pointer;
}

.doctor-element.active {
  background-color: #14dfce;
  font-weight: bolder;
}

.doctor-perpose-result-container{
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
  min-height: 50px;
  padding: 30px;
}

</style>

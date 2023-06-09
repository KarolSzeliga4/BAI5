<template>
      <div>
        <h1>Twój profil</h1>
        <p>
          Jesteś zalogowany jako: <b>{{ userState.user.name }}</b>
        </p>
        <p>
          Twój numer telefonu: <b>{{ userState.user.phoneNumber }}</b>
        </p>
        <p>Bookingi:</p>
        <table class="table">
          <thead>
            <tr>
              <th scope="col">Czas</th>
              <th scope="col">Doktor</th>
              <th scope="col">Cel</th>
              <th scope="col">Dodatkowa informacja</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in userState.user.bookings.data">
              <th scope="row">{{ item.time }}</th>
              <td>{{ item.name }}</td>
              <td>{{ item.purpose }}</td>
              <td>{{ item.addInfo }}</td>
            </tr>
          </tbody>
        </table>
      </div>
  </template>
  
  <script setup>
  import userState from "../state/userState";
  </script>
  
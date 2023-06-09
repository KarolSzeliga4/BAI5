<template>
  <div>
    <div v-if="!userState.accessToken.length">
      <h1>Zaloguj się / Zarejestruj się</h1>
      <section class="row">
        <div class="col-md-8">
          <ul class="nav nav-pills nav-justified mb-3" id="ex1" role="tablist">
            <li class="nav-item" role="presentation">
              <a
                class="nav-link active"
                id="tab-login"
                data-mdb-toggle="pill"
                href="#login"
                role="tab"
                aria-controls="login"
                aria-selected="true"
                >Logowanie</a
              >
            </li>
            <li class="nav-item" role="presentation">
              <a
                class="nav-link"
                id="tab-register"
                data-mdb-toggle="pill"
                href="#register"
                role="tab"
                aria-controls="register"
                aria-selected="false"
                >Rejestarcja</a
              >
            </li>
          </ul>

          <div class="tab-content">
            <div
              class="tab-pane fade show active"
              id="login"
              role="tabpanel"
              aria-labelledby="tab-login">
              <!-- <form> -->
              <div class="form-outline mb-4">
                <input
                  type="email"
                  id="loginName"
                  class="form-control"
                  v-model="data.email" />
                <label class="form-label" for="loginName">Email</label>
              </div>

              <div class="form-outline mb-4">
                <input
                  type="password"
                  id="loginPassword"
                  class="form-control"
                  v-model="data.password" />
                <label class="form-label" for="loginPassword">Hasło</label>
              </div>

              <button
                id="test"
                class="btn btn-primary btn-block mb-3"
                v-on:click="login"
                :disabled="!!userState.accessToken">
                Zaloguj się
              </button>
              <!-- </form> -->
            </div>
            <div
              class="tab-pane fade"
              id="register"
              role="tabpanel"
              aria-labelledby="tab-register">
              <form>
                <div class="form-outline mb-4">
                  <input
                    type="text"
                    id="registerName"
                    class="form-control"
                    v-model="data.nameSurname" />
                  <label class="form-label" for="registerName"
                    >Imię i nazwisko</label
                  >
                </div>

                <div class="form-outline mb-4">
                  <input
                    type="email"
                    id="registerEmail"
                    class="form-control"
                    v-model="data.email" />
                  <label class="form-label" for="registerEmail">Email</label>
                </div>

                <div class="form-outline mb-4">
                  <input
                    type="tel"
                    id="registerPhone"
                    class="form-control"
                    v-model="data.phoneNumber" />
                  <label class="form-label" for="registerPhone"
                    >Numer telefonu</label
                  >
                </div>

                <div class="form-outline mb-4">
                  <input
                    type="password"
                    id="registerPassword"
                    class="form-control"
                    v-model="data.password" />
                  <label class="form-label" for="registerPassword">Hasło</label>
                </div>
              </form>

              <button
                id="test"
                class="btn btn-primary btn-block mb-3"
                v-on:click="register">
                Zarejestruj się
              </button>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <i>
            Administratorem danych osobowych przetwarzanych na Internetowym
            Koncie Pacjenta jest Minister Zdrowia. Dane kontaktowe
            Administratora Danych: Ministerstwo Zdrowia, ul. Miodowa 15, 00-952
            Warszawa, e-mail: kancelaria@mz.gov.pl. Dane na Internetowym Koncie
            Pacjenta są przetwarzane po to, by udostępnić pacjentom informacje o
            zdarzeniach medycznych, które ich dotyczą. Każdej osobie, której
            dane są przetwarzane, przysługuje prawo do: dostępu do danych
            osobowych, ich sprostowania lub uzupełnienia, ograniczenia
            przetwarzania, wniesienia skargi do organu nadzorczego. Pełna
            informacja o przetwarzaniu danych osobowych
          </i>
        </div>
      </section>
    </div>
    <div v-else>
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
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { makePostRequest } from "../api/api";
import userState from "../state/userState";
import { onUpdated } from "vue";
import router from "../Router";

onUpdated(() => {
  if (!!userState.accessToken) {
    router.push({ path: "/" });
  }
});

const data = reactive({
  nameSurname: "",
  email: "",
  password: "",
  phoneNumber: "",
});

async function register() {
  try {
    const response = await makePostRequest(`auth/register`, {
      nameSurname: data.nameSurname,
      email: data.email,
      password: data.password,
      phoneNumber: data.phoneNumber,
    });

    userState.toast.show = true;
    userState.toast.text = response.message;
  } catch (error) {
    userState.toast.show = true;
    userState.toast.text = error.toString();
  }
}

async function login() {
  try {
    const dataLog = await makePostRequest(`auth/login`, {
      email: data.email,
      password: data.password,
    });

    console.log(dataLog);
    userState.accessToken = dataLog.token;
    userState.user = dataLog.user;

    userState.toast.show = true;
    userState.toast.text = dataLog.message;
    list();
  } catch (error) {
    userState.toast.show = true;
    userState.toast.text = error.toString();
  }
}

const list = async () => {
  if (!!userState.accessToken) {
    userState.user.bookings = [];
    const response = await makePostRequest(`bookingList`, {
      id: userState.user.id,
    });

    response.data.forEach((element) => {
      let dateGMT = new Date(Date.parse(element.time));
      element.time =
        dateGMT.toLocaleDateString() +
        " godz.: " +
        dateGMT.toLocaleTimeString();
    });

    userState.user.bookings = response;
  }
};

console.log(userState.user.bookings);
</script>

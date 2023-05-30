<template>
  <nav>
    <div class="row">
      <div class="col-3"></div>
      <div class="col-9">
        <div class="row justify-content-end">
          <div class="col-auto">
            <router-link to="/Zakresuslug">
              <button>Zakres usług</button>
            </router-link>
          </div>
          <div class="col-auto">
            <router-link to="/Nasilekarze">
              <button>Nasi lekarze</button>
            </router-link>
          </div>
          <div class="col-auto">
            <router-link to="/Cennik">
              <button>Cennik</button>
            </router-link>
          </div>
          <div class="col-auto">
            <router-link to="/Kontakt">
              <button>Kontakt</button>
            </router-link>
          </div>
          <div class="col-auto">
            <router-link to="/Zalogujsie">
              <button>Zaloguj się</button>
            </router-link>
          </div>
          <div class="col-auto">
            <router-link to="/Zarezerwujwizyte">
              <button>Zarezerwuj wizytę</button>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

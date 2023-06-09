<template>
  <footer>
    <div class="row">
      <div class="col">
        <div class="plus">
          <img src="../../assets/doctor.png" alt="plus" />
          <p>Profil pacjenta</p>
        </div>
      </div>
      <div class="col">
        <div class="plus">
          <img src="../../assets/mapa.png" alt="plus" />
          <p>Centrum Krakowa</p>
        </div>
      </div>
      <div class="col">
        <div class="plus">
          <img src="../../assets/book.png" alt="plus" />
          <p>Łatwa rejestracja online</p>
        </div>
      </div>
      <div class="col">
        <div class="plus">
          <img src="../../assets/dr_zosia.png" alt="plus" />
          <p>Najlepsi lekarze</p>
        </div>
      </div>
    </div>
    <slot>
      Numer telefonu: <b>600-200-200</b> Adres e-mail:
      <b>kontakt@cmkrakow.pl</b> Adres: <b>32-342 Kraków ul. Bratysławska 32</b>
    </slot>
  </footer>
</template>

<style>
.plus img {
  border: 1px solid #7c86c2;
  border-radius: 100%;
  width: 80px;
  height: 80px;
}
</style>

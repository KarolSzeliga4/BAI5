import { reactive } from "vue";

export default reactive({
  accessToken: "",
  user: {
    name: "",
    id: 0,
    email: "",
    phoneNumber: "",
    bookings: [],
  },
  toast: {
    text: "",
    show: false,
  },
});

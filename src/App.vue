<template>
  <div id="root">
    <Convert />
    <ConfirmPasswordModal
      :showModalConfirm="showModalPassword"
      @toggleConfirmPasswordModal="toggleConfirmPasswordModal($event)"
      :onPasswordConfirm="onPasswordConfirm"
    />
  </div>
</template>

<script>
import "./global.css";
import getConfig from "./config";
import Convert from "./Convert.vue";
import ConfirmPasswordModal from "./components/ConfirmPasswordModal.vue";
import { decryptPrivateKeyWithPasswordConfirm } from "./message";

const nearConfig = getConfig(process.env.NODE_ENV || "development");
console.log(
  `networkId:${nearConfig.networkId} CONTRACT_NAME:${nearConfig.contractName}`
);
window.networkId = nearConfig.networkId;

export default {
  created() {
    document.title = "NEAR Messaging Service";
  },
  name: "App",
  components: {
    Convert,
    ConfirmPasswordModal,
  },

  data() {
    return {
      showModalPassword: false,
      onPasswordConfirm: () => {},
    };
  },

  computed: {
    isSignedIn() {
      return window.walletConnection.isSignedIn();
    },
    darkMode() {
      return this.$store.state.darkMode;
    },
    showAlertModal() {
      return this.$store.state.alertModal.isShow;
    },
    showKeyModal() {
      return this.$store.state.keyModal;
    },
    showConfirmPasswordModal() {
      return this.$store.state.confirmPasswordModal;
    },
    localPrivateKey() {
      return this.$store.state.localPrivateKey;
    },
  },

  methods: {
    toggleConfirmPasswordModal(e) {
      this.showModalPassword = e;
    },
    handleOverflow(checkState) {
      if (checkState) {
        document.querySelector("body").style.overflow = "hidden";
      } else {
        document.querySelector("body").style.overflow = "visible";
      }
    },
    handleCheckTime() {
      const date = new Date();
      this.$store.commit("SAVE_REAL_TIME", date);
    },
    checkTime() {
      window.setInterval(() => {
        this.handleCheckTime();
      }, 1000);
    },
  },

  watch: {
    darkMode: {
      immediate: true,
      handler: function () {
        if (this.darkMode) {
          document.querySelector("html").setAttribute("data-theme", "light");
        } else {
          document.querySelector("html").setAttribute("data-theme", "dark");
        }
      },
    },
    showAlertModal: {
      immediate: true,
      handler: function () {
        this.handleOverflow(this.showAlertModal);
      },
    },
    showKeyModal: {
      immediate: true,
      handler: function () {
        this.handleOverflow(this.showKeyModal);
      },
    },
    showConfirmPasswordModal: {
      immediate: true,
      handler: function () {
        this.handleOverflow(this.showConfirmPasswordModal);
      },
    },
    isSignedIn: {
      immediate: true,
      handler: function () {
        this.$store.commit("SET_AUTH", this.isSignedIn);
      },
    },
  },

  mounted() {
    if (this.localPrivateKey !== null && this.$store.state.auth.auth.isLogin) {
      this.$toast.warning("Please confirm password to read private message", {
        timeout: 3000,
      });
      this.showModalPassword = true;
      this.onPasswordConfirm = (password) => {
        const privateKeyDecrypt = decryptPrivateKeyWithPasswordConfirm(
          password,
          this.localPrivateKey
        );
        if (privateKeyDecrypt.includes("TEST")) {
          this.$toast.success("Password is correct");
          this.$store.commit("PASSWORD_CONFIRM", password);
          this.$store.commit("IS_PRIVATE_KEY_NOT_DECRYPT", false);
        } else {
          this.$toast.error("Your Confirmation Password is incorrect");
          this.$store.commit("IS_PRIVATE_KEY_NOT_DECRYPT", true);
        }
      };
    }
    if (this.localPrivateKey === null && this.$store.state.auth.auth.isLogin) {
      this.$toast.warning("Please generate or import key to use this app", {
        timeout: 3000,
      });
    }
    this.checkTime();
  },
};
</script>

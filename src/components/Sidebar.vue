<template>
  <div :class="[{ active: activeMobileMenu }, 'mail-left']">
    <div class="logo d-flex align-center justify-between">
      <div class="d-flex align-center">
        <img src="../../public/assets/images/logo.svg" class="flex-shrink-0" />
        <span
          class="
            text-logo
            title-16
            f-700 f-obi
            ml-10
            letter-spacing-5
            text-justify
          "
        >
          Near Messaging Service
        </span>
      </div>
      <div class="flex-shrink-0 is-hidden block-sm">
        <img src="../../public/assets/images/lnc.svg" class="logo-dark" />
        <img
          src="../../public/assets/images/lnc-light.svg"
          class="logo-light"
        />
      </div>
    </div>

    <div class="mail-left__compose">
      <button
        class="btn-mail btn-mail__sent btn-compose cursor-pointer"
        @click="handleSendMessageModal"
      >
        <span class="btn-mail__wrap d-flex align-center justify-center">
          <img
            src="../../public/assets/images/compose.svg"
            class="logo-dark flex-shrink-0"
          />
          <img
            src="../../public/assets/images/compose-light.svg"
            class="logo-light flex-shrink-0"
          />
          <span
            class="title-16 f-700 letter-spacing-5 color-white ml-20 ml-sm-10"
          >
            COMPOSE
          </span>
        </span>
      </button>
    </div>

    <div class="mail-left__menu hidden-sm">
      <div @click="handleResetSelectedMailId()">
        <router-link
          to="/inbox"
          class="mail-left__menu-item mb-10 d-flex align-center justify-between"
          v-bind:class="{
            active: $route.path === '/inbox' || $route.path === '/',
          }"
        >
          <span class="d-flex align-center">
            <img
              src="../../public/assets/images/inbox.svg"
              class="flex-shrink-0"
            />
            <span class="ml-20 title">Inbox</span>
          </span>
          <span class="letter-spacing-5">{{ inboxMsgNum }}</span>
        </router-link>
      </div>
      <div @click="handleResetSelectedMailId()">
        <router-link
          to="/sent"
          class="mail-left__menu-item d-flex align-center justify-between"
          v-bind:class="{ active: $route.path === '/sent' }"
        >
          <span class="d-flex align-center">
            <img
              src="../../public/assets/images/sent.svg"
              class="flex-shrink-0"
            />
            <span class="ml-20 title">Sent</span>
          </span>
          <span class="letter-spacing-5">{{ sentMsgNum }}</span>
        </router-link>
      </div>
    </div>

    <div class="mail-left__static d-flex justify-center flex-column pl-10">
      <div class="mb-16 d-flex align-start">
        <div class="theme-change">
          <label class="switch-theme">
            <input
              type="checkbox"
              :checked="darkMode"
              class="input__switch-theme"
              @click="handleToggleDarkMode"
            />
            <span class="slider"></span>
          </label>
        </div>
        <div
          @click="showKeyModal"
          class="lock d-flex align-center justify-center ml-20 cursor-pointer"
          :class="[{ 'is-hidden': !isLoggedIn }]"
        >
          <img
            src="../../public/assets/images/lock.svg"
            class="flex-shrink-0"
          />
        </div>
      </div>
      <div class="f-12 f-500 mb-30 mb-sm-0">
        <div><b>Statistics:</b></div>
        <div style="padding-left: 10px">
          <div>{{ statics.activeAccount }} active accounts,</div>
          <div>{{ statics.totalsAccount }} total accounts,</div>
          <div>{{ statics.messages }} messages.</div>
        </div>
      </div>

      <div class="hidden-sm">
        <img src="../../public/assets/images/lnc.svg" class="logo-dark" />
        <img
          src="../../public/assets/images/lnc-light.svg"
          class="logo-light"
        />
        <!-- <div class="f-12 f-500 mb-10">
          <br /><a href="https://learnnear.club" target="_blank">
            <img
              src="../../public/assets/images/lnc-logo-dark.svg"
              class="logo-dark"
            />
            <img
              src="../../public/assets/images/lnc-logo-light.svg"
              class="logo-light"
            />
          </a>
        </div> -->
      </div>
    </div>

    <div class="mail-left__connect">
      <!-- Button Connect -->
      <button
        :class="[
          { 'is-hidden': isLoggedIn },
          'btn-mail cursor-pointer btn-connect',
        ]"
        @click="handleAuth"
      >
        <span class="btn-mail__wrap d-flex align-center justify-center">
          <img
            src="../../public/assets/images/connect.svg"
            class="logo-dark flex-shrink-0"
          />
          <img
            src="../../public/assets/images/connect-light.svg"
            class="logo-light flex-shrink-0"
          />
          <span class="title-16 f-700 letter-spacing-5 color-white ml-20">
            CONNECT
          </span>
        </span>
      </button>
      <!-- Info Connect -->
      <div :class="[{ 'is-hidden': !isLoggedIn }, 'mail-left__info']">
        <div class="is-hidden block-sm f-12">Wallet connected:</div>
        <div class="d-flex pl-10 pl-sm-0">
          <div class="flex-shrink-0">
            <span class="status background-active"></span>
          </div>
          <div class="pl-8 pr-20 flex-grow-1">
            <div class="name title-16 f-700 mb-4">{{ username }}</div>
            <div class="f-500">Balance: {{ balance }} NEAR</div>
          </div>
          <span
            class="p-relative cursor-pointer"
            @click="handleLogOut"
            style="top: 3px"
          >
            <svg
              class="flex-shrink-0"
              width="16"
              height="15"
              viewBox="0 0 16 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.8 6.3999L4.8 7.9999L12 7.9999L12 10.3999L16 7.1999L12 3.9999L12 6.3999L4.8 6.3999Z"
                fill="#888A90"
              />
              <path
                d="M1.5999 14.3999L8.7999 14.3999C9.6823 14.3999 10.3999 13.6823 10.3999 12.7999L10.3999 9.5999L8.7999 9.5999L8.7999 12.7999L1.5999 12.7999L1.5999 1.5999L8.7999 1.5999L8.7999 4.7999L10.3999 4.7999L10.3999 1.5999C10.3999 0.717502 9.6823 -9.82912e-05 8.7999 -9.83683e-05L1.5999 -9.89978e-05C0.717504 -9.90749e-05 -9.60786e-05 0.717501 -9.61558e-05 1.5999L-9.71349e-05 12.7999C-9.7212e-05 13.6823 0.717503 14.3999 1.5999 14.3999Z"
                fill="#888A90"
              />
            </svg>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { login, logout, NEAR_UNIT } from "../utils";
import { utils } from "near-api-js";

export default {
  data() {
    return {
      statics: {
        activeAccount: 0,
        totalsAccount: 0,
        messages: 0,
      },
      balance: 0,
    };
  },

  computed: {
    isLoggedIn() {
      return this.$store.state.auth.auth.isLogin;
    },
    activeMobileMenu() {
      return this.$store.state.activeMobileMenu;
    },
    username() {
      return window.walletConnection.getAccountId();
    },
    sentMsgNum() {
      return this.$store.state.sentMsgNum;
    },
    inboxMsgNum() {
      return this.$store.state.inboxMsgNum;
    },
    darkMode() {
      return this.$store.state.darkMode;
    },
    isPrivateKeyNotDecrypt() {
      return this.$store.state.isPrivateKeyNotDecrypt;
    },
  },

  mounted() {
    this.getSentMessageNum();
    this.getInboxMessageNum();
    this.getStatics();
    this.getBalance();
    this.checkInboxMsgNum();
    this.checkBalance();
  },

  watch: {
    isLoggedIn: {
      immediate: true,
      handler: function () {
        const privateKey = localStorage.getItem(
          `${process.env.VUE_APP_CONTRACT_NAME}_${this.username}_privatekey`
        );
        if (privateKey) {
          this.$store.commit("TOGGLE_PRIVATEKEY_LOCAL", {
            key: privateKey,
            userName: this.username,
          });
        }
      },
    },
  },

  methods: {
    handleAuth() {
      login();
    },

    handleLogOut() {
      logout();
    },

    handleToggleDarkMode() {
      this.$store.commit("TOGGLE_DARK_MODE");
    },

    handleSendMessageModal() {
      if (this.$store.state.sendMessageModal.isShow) return;
      this.$store.commit("TOGGLE_SEND_MESSAGE_MODAL");
    },

    handleResetSelectedMailId() {
      this.$store.commit("RESET_MESSAGE_CONVERSATION", null);
    },

    getSentMessageNum() {
      window.contract
        .getSentMsgNum({ accountId: this.username })
        .then((data) => {
          this.$store.commit("SET_SENT_MSG_NUM", data);
        });
    },

    getInboxMessageNum() {
      window.contract
        .getInboxMsgNum({ accountId: this.username })
        .then((data) => {
          this.$store.commit("SET_INBOX_MSG_NUM", data);
        });
    },

    getStatics() {
      window.contract.getStatics().then((data) => {
        this.statics.activeAccount = data.sentAccountNum;
        this.statics.totalsAccount = data.accountNum;
        this.statics.messages = data.messageNum;
      });
    },

    async getBalance() {
      if (this.isLoggedIn) {
        const account = await window.walletConnection.account(
          "example-account.testnet"
        );
        const balance = await account.getAccountBalance();
        let available = (balance?.available || 0) / 10 ** 24;
        this.balance = utils.format.formatNearAmount(
          balance?.available || 0,
          2
        );
      }

      return 0;
    },

    checkInboxMsgNum() {
      const TIME_CHECK = process.env.VUE_APP_TIME_CHECK;
      window.setInterval(() => {
        this.getInboxMessageNum();
      }, parseInt(TIME_CHECK));
    },

    checkBalance() {
      window.setInterval(() => {
        this.getBalance();
      }, 30000);
    },

    showKeyModal() {
      if (!this.isPrivateKeyNotDecrypt) {
        this.$store.commit("SHOW_CONFIRM_PASSWORD_MODAL", false);
        this.$store.commit("TOGGLE_KEY_MODAL");
      } else {
        this.$store.commit("SHOW_CONFIRM_PASSWORD_MODAL", true);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.name {
  width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

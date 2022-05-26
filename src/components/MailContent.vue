<template>
  <div class="mail-content-container flex-grow-1">
    <div
      class="mail-content__col mail-content__component"
      :class="{ 'd-none': windowWidth <= 1024 && msgInboxId }"
    >
      <header class="mail-content__header">
        <div class="mail-content__header-col">
          <div
            class="mail-content__header-title f-700 mb-4 d-flex align-center"
          >
            <img
              src="../../public/assets/images/logo.svg"
              style="max-width: 29px"
            />
            {{ routePathSent ? "Sent" : "Inbox" }}
          </div>
          <div class="f-500 mb-30 mb-md-16 mb-sm-0">
            <span>
              {{ routePathSent ? sentMsgNum : inboxMsgNum }}
            </span>
            Messages
          </div>
        </div>
        <div
          class="
            d-flex
            align-center
            justify-between
            mail-content__header-col mail-content__header-col-right
          "
        >
          <div class="d-flex align-center no-wrap text-right top">
            <div>Page {{ page }}/ {{ maxPage }}</div>
            <div
              class="mail-content__button hidden-sm ml-20 mr-20 ml-sm-6 mr-sm-0"
            >
              <div>
                <span
                  v-show="page > 1"
                  class="mail-content__button-prev cursor-pointer mr-4 mr-sm-16"
                  @click="prevPage()"
                ></span>
                <span
                  v-show="!reachMaxPage && !preventPagination"
                  class="mail-content__button-next cursor-pointer"
                  @click="nextPage()"
                ></span>
              </div>
            </div>
          </div>
          <!-- <div class="mail-content__component-search flex-grow-1">
            <button class="btn-search">
              <img src="../../public/assets/images/icon-search.svg" />
            </button>
            <input placeholder="Search" />
          </div> -->
        </div>
      </header>

      <div
        :class="[
          { 'is-hidden': userLogin },
          'title-16 f-700 mail-content__list-none',
        ]"
      >
        Connect your NEAR wallet to start using NEAR Messaging Service!
      </div>
      <router-view v-if="userLogin" />
    </div>
    <AllMessages />
  </div>
</template>

<script>
import AllMessages from "./AllMessages.vue";
import { ITEM_PER_PAGE } from "../constant";

export default {
  components: {
    AllMessages,
  },
  data() {
    return {
      windowWidth: window.innerWidth,
    };
  },
  created() {
    window.addEventListener("resize", this.myEventHandler);
  },
  destroyed() {
    window.removeEventListener("resize", this.myEventHandler);
  },
  computed: {
    userLogin() {
      return this.$store.state.auth.auth.isLogin;
    },
    msgInboxId() {
      return this.$store.state.messageConversation.msgInboxId;
    },
    routePathInbox() {
      return this.$route.path === "/inbox" || this.$route.path === "/";
    },
    routePathSent() {
      return this.$route.path === "/sent";
    },
    sentMsgNum() {
      return this.$store.state.sentMsgNum;
    },
    inboxMsgNum() {
      return this.$store.state.inboxMsgNum;
    },
    totalMsg() {
      return this.routePathInbox ? this.inboxMsgNum : this.sentMsgNum;
    },
    page() {
      return this.$store.state.page;
    },
    reachMaxPage() {
      return this.page * ITEM_PER_PAGE > this.totalMsg;
    },
    maxPage() {
      return Math.ceil(this.totalMsg / ITEM_PER_PAGE);
    },
    preventPagination() {
      return this.$store.state.preventPagination;
    },
  },
  watch: {
    $route: function (to, from) {
      if (to.name !== from.name) {
        // Reset page when route change
        this.$store.commit("SET_PAGE", 1);
      }
    },
  },
  methods: {
    myEventHandler() {
      this.windowWidth = window.innerWidth;
    },
    nextPage() {
      this.$store.commit("SET_PAGE", this.page + 1);
    },
    prevPage() {
      this.$store.commit("SET_PAGE", this.page - 1);
    },
  },
};
</script>

<style lang="scss" scoped></style>

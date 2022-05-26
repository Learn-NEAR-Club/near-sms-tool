<template>
  <article
    class="mail-content__item d-flex"
    :class="!checkUnread(message.id) ? 'unread' : ''"
    @click="handleSelectedMail(message.id)"
  >
    <Avatar :accountId="message.from" size="40" />
    <div class="content pl-20 pl-md-10 flex-grow-1">
      <header class="d-flex justify-between mail-content__item-header">
        <div class="flex-grow-1 mail-content__item-header__top pr-20">
          <div class="name title-16 f-700">{{ message.from }}</div>
          <div :class="{ isPrivate: message.isPrivate }">
            <img
              v-if="message.isPrivate"
              src="../../public/assets/images/privateMsg.svg"
              class="private-message"
            />
            <div class="title f-500">Title: {{ message.title }}</div>
          </div>
        </div>
        <div class="text-right f-500">
          <div class="status-read">
            <span v-if="!checkUnread(message.id)">Unread</span>
          </div>
          <div class="date-time no-wrap">
            {{ message.timestamp.toLocaleString() }}
          </div>
        </div>
      </header>
    </div>
    <div class="is-hidden">{{ selectedId }}</div>
  </article>
</template>

<script>
import Avatar from "./Avatar";

export default {
  props: ["message"],

  components: {
    Avatar,
  },

  data() {
    return {
      readMailId: [],
      selectedId: null,
      accountId: null,
    };
  },

  mounted() {
    this.getAccountId();
  },

  methods: {
    getAccountId() {
      this.accountId = window.walletConnection.getAccountId();
    },

    handleSelectedMail(id) {
      this.$store.commit("MESSAGE_CONVERSATION", id);
      this.selectedId = id;

      const accountIdInboxLocalStorage = JSON.parse(
        localStorage.getItem(this.accountId + " " + "inbox")
      );

      if (accountIdInboxLocalStorage) {
        const selectedMailReadID = [...accountIdInboxLocalStorage];
        selectedMailReadID.push(id);
        const removeDuplicateItem = Array.from(new Set(selectedMailReadID));
        this.readMailId = removeDuplicateItem;
      }

      const selectedMailReadID = [...this.readMailId];
      selectedMailReadID.push(id);
      const removeDuplicateItem = Array.from(new Set(selectedMailReadID));
      this.readMailId = removeDuplicateItem;

      if (accountIdInboxLocalStorage && accountIdInboxLocalStorage.includes(id))
        return;

      localStorage.setItem(
        this.accountId + " " + "inbox",
        JSON.stringify(this.readMailId)
      );
    },

    checkUnread(id) {
      const localStorageId = JSON.parse(
        localStorage.getItem(this.accountId + " " + "inbox")
      );
      if (localStorageId) {
        return localStorageId.includes(id);
      }
      return false;
    },
  },
};
</script>

<style lang="scss" scoped>
.isPrivate {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.private-message {
  width: 16px;
}
</style>
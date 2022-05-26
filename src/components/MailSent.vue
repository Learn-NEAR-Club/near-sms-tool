<template>
  <div>
    <article
      class="mail-content__item d-flex"
      @click="handleSelectedMail(message.id)"
    >
      <Avatar :accountId="message.to" size="40" />

      <div class="content pl-20 pl-md-10 flex-grow-1">
        <header class="d-flex justify-between mail-content__item-header">
          <div class="flex-grow-1 mail-content__item-header__top pr-20">
            <div class="name title-16 f-700">To: {{ message.to }}</div>
            <div :class="{ isPrivate: message.isPrivate }">
              <img
                v-if="message.isPrivate"
                src="../../public/assets/images/privateMsg.svg"
                class="private-message"
              />
              <div class="title f-500">Title: {{ message.title }}</div>
            </div>
          </div>
          <div
            class="text-right f-500"
            style="display: flex; flex-direction: column; align-items: flex-end"
          >
            <div class="date-time no-wrap">
              {{ message.timestamp.toLocaleString() }}
            </div>
            <div
              style="position: relative; width: min-content"
              v-show="this.handleShowCoinIcon && !isReceive"
              @click="handleConfirmClaim"
              @mouseover="showTooltip = true"
              @mouseleave="showTooltip = false"
            >
              <img
                src="../../public/assets/images/coin.svg"
                style="
                  width: 20px;
                  height: 20px;
                  max-width: min-content;
                  color: #333;
                "
              />
              <Tooltip :isShow="showTooltip">
                You can get back {{ this.handleCalculateReceiveCoin() }} NEAR
                due to the receiver has not replied in 48 hours!</Tooltip
              >
            </div>
          </div>
        </header>
      </div>
    </article>
    <ConfirmModal
      :showModal="showModalConfirmReceive"
      @closeConfirmModal="closeConfirmModal($event)"
      :handleConfirmFn="handleConfirm"
      :isShowKeyModal="false"
    >
      <div :style="{ fontSize: '15px' }">Are you sure to claim back?</div>
    </ConfirmModal>
  </div>
</template>

<script>
import { convertUnit } from "../utils";
import Avatar from "./Avatar";
import dayjs from "dayjs";
import Tooltip from "./Tooltip.vue";
import ConfirmModal from "../components/ConfirmModal.vue";

export default {
  props: ["message"],

  components: {
    Avatar,
    Tooltip,
    ConfirmModal,
  },

  data() {
    return {
      accountId: null,
      showTooltip: false,
      checkTime: false,
      coinReceive: 0,
      isReceive: false,
      handleConfirm: () => {},
      showModalConfirmReceive: false,
    };
  },

  computed: {
    realTime() {
      return this.$store.state.realTime;
    },
    handleShowCoinIcon() {
      const convertSendBackAmount = convertUnit(
        this.message.moneyInfo.sendBackAmount
      );
      const convertReceivedAmount = convertUnit(
        this.message.moneyInfo.receivedAmount
      );
      const convertCanReceivedAmount = convertUnit(
        this.message.moneyInfo.canReceivedAmount
      );
      const backAmount = convertCanReceivedAmount - convertReceivedAmount;

      if (
        this.checkTime &&
        Number(convertSendBackAmount) === 0 &&
        backAmount > 0
      ) {
        return true;
      } else {
        return false;
      }
    },
  },

  watch: {
    realTime: {
      immediate: true,
      handler: function () {
        this.handleCheckTime(this.message.timestamp);
      },
    },
  },

  methods: {
    handleSelectedMail(id) {
      this.$store.commit("MESSAGE_CONVERSATION", id);
    },

    closeConfirmModal(e) {
      this.showModalConfirmReceive = e;
    },

    handleCheckTime(hourSentMsg) {
      if (hourSentMsg && this.realTime) {
        const timeConvert = dayjs(this.realTime).diff(
          dayjs(hourSentMsg),
          "hour"
        );
        // > 48 hour
        if (timeConvert > 48) {
          this.checkTime = true;
        } else {
          this.checkTime = false;
        }
      }
    },

    handleCalculateReceiveCoin() {
      const convertReceivedAmount = convertUnit(
        this.message.moneyInfo.receivedAmount
      );
      const convertCanReceivedAmount = convertUnit(
        this.message.moneyInfo.canReceivedAmount
      );
      const backAmount =
        Number(convertCanReceivedAmount) - Number(convertReceivedAmount);
      return backAmount;
    },

    handleConfirmClaim() {
      this.showModalConfirmReceive = true;
      this.handleConfirm = this.handleClaim;
    },

    handleClaim() {
      window.contract.sendBack({ msgId: this.message.id }).then((data) => {
        if (data) {
          this.$toast.success("Success receive NEAR!", {
            timeout: 2000,
          });
          this.isReceive = data;
        } else {
          this.$toast.error("Fail receive NEAR!", {
            timeout: 2000,
          });
          this.isReceive = data;
        }
      });
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

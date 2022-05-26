<template>
  <article class="mail-right__item">
    <header class="mail-right__item-header d-flex">
      <Avatar :accountId="from" size="60" />
      <div
        class="
          info
          pl-30 pl-xl-16 pl-md-16 pl-sm-10
          flex-grow-1
          d-flex
          justify-between
        "
      >
        <div>
          <div class="name title-20 mb-10 f-700">
            {{ dataMsg.from }}
          </div>
          <div class="to f-500">To: {{ dataMsg.to }}</div>
        </div>
        <div class="text-right">
          <div class="action mb-10 mb-sm-4 d-flex" style="position: relative">
            <div style="position: relative">
              <div
                class="
                  action-sent
                  reply
                  cursor-pointer
                  d-flex
                  align-center
                  mr-40 mr-xl-20
                  md-md-20 md-sm-20
                "
                @click="handleShowReply"
              >
                <svg
                  class="mr-10"
                  width="28"
                  height="20"
                  viewBox="0 0 28 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M28 20C28 20 25.3167 5.55556 11.6667 5.55556V0L0 10L11.6667 19.3333V12.9236C19.075 12.9236 24.1354 13.5417 28 20Z"
                    fill="#3B4551"
                  />
                </svg>
                Reply
                <span
                  class="coin-info"
                  v-show="this.handleCheck()"
                  @mouseover="showTooltip = true"
                  @mouseleave="showTooltip = false"
                >
                  {{ this.handleCalculateReceivedAmount() }}N</span
                >
              </div>
            </div>
            <div
              class="action-sent forward cursor-pointer d-flex align-center"
              @click="handleShowForward"
            >
              Forward
              <svg
                class="ml-10"
                width="28"
                height="20"
                viewBox="0 0 28 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 20C0 20 2.68333 5.55556 16.3333 5.55556V0L28 10L16.3333 19.3333V12.9236C8.925 12.9236 3.86458 13.5417 0 20Z"
                  fill="#3B4551"
                />
              </svg>
            </div>
            <Tooltip :isShow="this.showTooltip">
              Reply this message to get
              {{ this.handleCalculateReceivedAmount() }}
              NEAR now!
            </Tooltip>
          </div>
          <div class="f-500 date">{{ dataMsg.timestamp.toLocaleString() }}</div>
        </div>
      </div>
    </header>

    <section class="mail-right__item-body">
      <div :class="{ isPrivate: dataMsg.isPrivate }">
        <img
          v-if="dataMsg.isPrivate"
          src="../../public/assets/images/privateMsg.svg"
          class="private-message"
        />
        <div class="title cursor-pointer" @click="showDetail = !showDetail">
          Title: {{ dataMsg.title }}
        </div>
      </div>
      <div class="description f-500">
        <div class="content">
          <TipTap :modelValue="dataMsg.content" :isDetail="true" />
        </div>
      </div>
      <div ref="feedback">
        <ReplyMessage
          :class="{ 'is-hidden': !showReply }"
          :id="dataMsg.id"
          :title="dataMsg.title"
          :to="dataMsg.from"
          :from="dataMsg.to"
          :showReply="showReply"
          :isPrivate="dataMsg.isPrivate"
          @cancelReplay="cancelReplay"
        />
        <ForwardMessage
          :class="{ 'is-hidden': !showForward }"
          :id="dataMsg.id"
          :title="dataMsg.title"
          :to="dataMsg.to"
          :from="dataMsg.from"
          :content="dataMsg.content"
          :showForward="showForward"
          @cancelForward="cancelForward"
        />
      </div>
    </section>
  </article>
</template>

<script>
import ReplyMessage from "./ReplyMessage.vue";
import ForwardMessage from "./ForwardMessage.vue";
import Avatar from "./Avatar";
import TipTap from "../components/TipTap.vue";
import Tooltip from "../components/Tooltip.vue";
import dayjs from "dayjs";
import { convertUnit } from "../utils";

export default {
  props: ["dataMsg", "from"],

  components: {
    ReplyMessage,
    ForwardMessage,
    Avatar,
    TipTap,
    Tooltip,
  },

  data() {
    return {
      showDetail:
        this.dataMsg.id === this.$store.state.messageConversation.msgInboxId,
      showReply: false,
      showForward: false,
      showTooltip: false,
      percent: 10 / 100,
    };
  },

  computed: {
    realTime() {
      return this.$store.state.realTime;
    },
  },

  watch: {
    realTime: {
      immediate: true,
      handler: function () {
        this.handleSetPercent(this.dataMsg.timestamp);
      },
    },
    showReply: {
      immediate: true,
      handler: function () {
        if (this.showReply) {
          const el = this.$refs.feedback;

          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
          }
        }
      },
    },
    showForward: {
      immediate: true,
      handler: function () {
        if (this.showForward) {
          const el = this.$refs.feedback;

          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
          }
        }
      },
    },
  },

  methods: {
    handleShowReply() {
      if (this.showForward) return;
      this.showReply = !this.showReply;
    },
    handleShowForward() {
      if (this.showReply) return;
      this.showForward = !this.showForward;
    },
    cancelReplay(e) {
      this.showReply = e;
    },
    cancelForward(e) {
      this.showForward = e;
    },

    handleSetPercent(hourSentMsg) {
      if (hourSentMsg && this.realTime) {
        const timeConvert = dayjs(this.realTime).diff(
          dayjs(hourSentMsg),
          "hour"
        );
        // within 24 hour
        if (timeConvert > 1 && timeConvert < 24) {
          this.percent = 50 / 100;
        }
        // within 1 hour
        if (timeConvert < 1 && timeConvert < 24) {
          this.percent = 100 / 100;
        }
      }
    },

    handleCalculateReceivedAmount() {
      const convertReceivedAmount = convertUnit(
        this.dataMsg.moneyInfo.canReceivedAmount
      );
      return (Number(convertReceivedAmount) * this.percent).toFixed(4);
    },

    handleCheck() {
      const convertReceivedAmount = convertUnit(
        this.dataMsg.moneyInfo.receivedAmount
      );
      const convertSendBackAmount = convertUnit(
        this.dataMsg.moneyInfo.sendBackAmount
      );
      if (convertReceivedAmount == 0 && convertSendBackAmount == 0) {
        return true;
      } else {
        return false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.isPrivate {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}
.private-message {
  width: 20px;
}
</style>

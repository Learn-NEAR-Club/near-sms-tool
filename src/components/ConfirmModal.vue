<template>
  <transition name="slide" appear>
    <div class="modal" v-if="showModal">
      <div class="header d-flex align-center justify-between mb-20">
        <div class="title title-20 f-700 d-flex align-center">Confirmation</div>
        <div class="action">
          <span class="btn-close cursor-pointer" @click="handleCloseModal">
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.14209 16.1426L16.2842 2.00044"
                stroke="#888A90"
                stroke-width="3"
                stroke-linecap="round"
              />
              <path
                d="M2.14209 2L16.2842 16.1421"
                stroke="#888A90"
                stroke-width="3"
                stroke-linecap="round"
              />
            </svg>
          </span>
        </div>
      </div>
      <div class="container">
        <slot></slot>
        <div class="container-btn">
          <button
            class="
              btn-sent btn-sent-key
              cursor-pointer
              d-flex
              align-center
              justify-center
              flex-shrink-0
            "
            @click="handleConfirm"
          >
            <img src="../../public/assets/images/sent.svg" />
            <span>Confirm</span>
          </button>
          <button
            class="
              btn-sent btn-sent-key
              cursor-pointer
              d-flex
              align-center
              justify-center
              flex-shrink-0
            "
            @click="handleCloseModal"
          >
            <img src="../../public/assets/images/sent.svg" />
            <span>Cancel</span>
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    showModal: {
      type: Boolean,
    },
    handleConfirmFn: {
      type: Function,
    },
    isShowKeyModal: {
      type: Boolean,
    },
  },

  methods: {
    handleCloseModal() {
      this.$emit("closeConfirmModal", false);
    },

    handleConfirm() {
      this.$emit("closeConfirmModal", false);
      if (this.isShowKeyModal) {
        this.$store.commit("TOGGLE_KEY_MODAL");
      }
      this.handleConfirmFn();
    },
  },
};
</script>

<style lang="scss" scoped>
.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 99999;

  width: 100%;
  max-width: 450px;
  background: var(--background-modal);
  border-radius: 16px;

  padding: 25px;
  color: var(--color-menu);

  display: flex;
  flex-direction: column;
  align-items: center;

  background: var(--background-modal);
  border: 1px solid var(--border-modal);
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  -webkit-box-shadow: var(--body-box-shadow);
  -moz-box-shadow: var(--body-box-shadow);
  box-shadow: var(--body-box-shadow);
  -webkit-border-radius: 8px;
  -moz-border-radius: 8px;
  border-radius: 8px;

  @media (max-width: 767px) {
    width: 350px;
  }
  .header {
    width: 100%;
    .title {
      color: var(--color-title-mail-detail);
    }
  }
  .container {
    width: 100%;
    .container-btn {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
      @media (max-width: 767px) {
        flex-direction: column;
      }
      .btn-sent-key {
        width: auto;
        span {
          width: auto;
          text-align: left;
        }
        @media (max-width: 767px) {
          span {
            width: 30%;
            font-size: 16px;
          }
        }
      }
    }
  }
}
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.5s ease, opacity 0.2s ease-in-out;
}
.slide-enter {
  transform: translateX(-50%) translateY(-25px);
  opacity: 1;
}
.slide-leave-to {
  transform: translateX(-50%) translateY(0px);
  opacity: 0;
}
</style>

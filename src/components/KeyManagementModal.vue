<template>
  <div>
    <transition name="slide" appear>
      <div class="modal" v-if="showModal">
        <div class="header d-flex align-center justify-between mb-20">
          <div class="title title-20 f-700 d-flex align-center">
            Key Management
          </div>
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
          <div class="form-input d-flex pb-10 mb-20">
            <span>Public Key: </span>
            <input
              placeholder="NO PUBLIC KEY"
              v-model="hiddenPubKey"
              disabled
            />
            <div class="line"></div>
          </div>
          <div class="form-input d-flex pb-10 mb-20">
            <span>Private Key: </span>
            <input
              placeholder="NO PRIVATE KEY"
              v-model="hiddenPriKey"
              disabled
            />
            <div class="line"></div>
          </div>
          <div
            v-if="!localPrivateKey || hiddenExport"
            class="form-input d-flex pb-10 mb-20 font-italic"
          >
            <div v-if="hiddenPubKey">
              We found your public key on the system. Please click the
              <span class="highlight-text"> "Import"</span>
              button to import your corresponding key. In case you don't
              remember the key, please click
              <span class="highlight-text">"Generate"</span> button to generate
              new key. If you generate a new key, you won't be able to view the
              content of old private messages.
            </div>
            <div v-else>
              Please click "Generate" button to generate new key or click
              "Import" button to import old key!
            </div>
            <div class="line"></div>
          </div>
          <div class="d-flex flex-col-sm" style="gap: 1rem">
            <button
              v-if="
                (!isPrivateKeyNotDecrypt && !localPrivateKey) || hiddenExport
              "
              class="
                btn-sent btn-sent-key
                cursor-pointer
                d-flex
                align-center
                justify-center
                flex-shrink-0
              "
              @click="genKeyClick"
            >
              <img src="../../public/assets/images/sent.svg" />
              <span>Generate</span>
            </button>
            <label
              v-if="
                (!isPrivateKeyNotDecrypt && !localPrivateKey) || hiddenExport
              "
              class="
                btn-sent btn-sent-key
                cursor-pointer
                d-flex
                align-center
                justify-center
                flex-shrink-0
              "
            >
              <img src="../../public/assets/images/sent.svg" />
              <span>Import</span>
              <input type="file" ref="doc" @change="importKeyClick()" />
            </label>
            <button
              v-if="!hiddenExport && localPrivateKey"
              class="
                btn-sent btn-sent-key
                cursor-pointer
                d-flex
                align-center
                justify-center
                flex-shrink-0
              "
              @click="exportKeys"
            >
              <img src="../../public/assets/images/sent.svg" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>
    </transition>

    <ConfirmModal
      :showModal="showModalConfirmReGenImport"
      @closeConfirmModal="closeConfirmModal($event)"
      :handleConfirmFn="handleConfirm"
      :isShowKeyModal="true"
    >
      <div :style="{ fontSize: '15px' }">
        Are you sure to override the old key? <br />
        Override new key will make existed privated messages unable to decrypt
      </div>
    </ConfirmModal>

    <ConfirmPasswordModal
      :showModalConfirm="showModalPassword"
      @toggleConfirmPasswordModal="toggleConfirmPasswordModal($event)"
      :onPasswordConfirm="handlePasswordConfirm"
      @handleReShowKeyManagementModal="handleReShowKeyManagementModal()"
    />
  </div>
</template>

<script>
import {
  generateRSAKey,
  privateKeyToPublicKey,
  decryptPrivateKeyWithPasswordConfirm,
  encryptPrivateKeyWithPasswordConfirm,
} from "../message";
import ConfirmModal from "../components/ConfirmModal.vue";
import ConfirmPasswordModal from "../components/ConfirmPasswordModal.vue";

export default {
  components: {
    ConfirmModal,
    ConfirmPasswordModal,
  },

  data() {
    return {
      publicKey: null,
      privateKey: null,
      file: null,
      showModalConfirmReGenImport: false,
      showModalPassword: false,
      handleConfirm: () => {},
      handlePasswordConfirm: () => {},
      hiddenExport: false,
    };
  },

  computed: {
    showModal() {
      return this.$store.state.keyModal;
    },
    username() {
      return window.walletConnection.getAccountId();
    },

    hiddenPubKey() {
      if (this.publicKey && !this.hiddenExport) {
        return (
          this.publicKey.slice(0, 10) +
          "********************" +
          this.publicKey.substr(-10)
        );
      }
      return "";
    },

    hiddenPriKey() {
      if (this.privateKey && !this.hiddenExport) {
        return (
          this.privateKey.slice(0, 10) +
          "********************" +
          this.privateKey.substr(-10)
        );
      }
      return "";
    },
    localPrivateKey() {
      return this.$store.state.localPrivateKey;
    },
    showConfirmModal() {
      return this.$store.state.showConfirmModal;
    },
    isPrivateKeyNotDecrypt() {
      return this.$store.state.isPrivateKeyNotDecrypt;
    },
  },

  mounted() {
    this.getUserPublicKey();
    if (
      localStorage.getItem(
        `${process.env.VUE_APP_CONTRACT_NAME}_${this.username}_privatekey`
      )
    ) {
      this.privateKey = localStorage.getItem(
        `${process.env.VUE_APP_CONTRACT_NAME}_${this.username}_privatekey`
      );
    }

    if (
      localStorage.getItem(
        `${process.env.VUE_APP_CONTRACT_NAME}_${this.username}_publickey`
      )
    ) {
      this.publicKey = localStorage.getItem(
        `${process.env.VUE_APP_CONTRACT_NAME}_${this.username}_publickey`
      );
    }
  },

  watch: {
    showConfirmModal: {
      immediate: true,
      handler: function () {
        if (this.showConfirmModal) {
          this.showModalPassword = true;
        } else {
          this.showModalPassword = false;
        }
      },
    },
  },

  methods: {
    handleCloseModal() {
      this.$store.commit("TOGGLE_KEY_MODAL");
    },

    // handle Re-show Key Management Modal
    handleReShowKeyManagementModal() {
      this.hiddenExport = true;
    },

    // handle Modal Confirm ReGen or ReImport
    closeConfirmModal(e) {
      this.showModalConfirmReGenImport = e;
    },

    getUserPublicKey() {
      window.contract
        .getPublicKey({ accountId: this.username })
        .then((data) => {
          if (data) {
            this.publicKey = data;
          }
        });
    },

    //handle save Public Key to server
    updateKeysApi(key) {
      window.contract.updatePublicKey({ publicKey: key }).then((data) => {
        if (data) {
          this.$toast.success("Success update key!", {
            timeout: 2000,
          });
        } else {
          this.$toast.error("Error update key!", {
            timeout: 2000,
          });
        }
      });
    },

    //handle Modal Confirm Password
    toggleConfirmPasswordModal(e) {
      this.showModalPassword = e;
    },

    // Check confirm
    confirmOverride(onDone) {
      const publicKeyCache = localStorage.getItem(
        `${process.env.VUE_APP_CONTRACT_NAME}_${this.username}_publickey`
      );
      const privateKeyCache = localStorage.getItem(
        `${process.env.VUE_APP_CONTRACT_NAME}_${this.username}_privatekey`
      );

      if (publicKeyCache && privateKeyCache) {
        this.showModalConfirmReGenImport = true;
        this.handleConfirm = onDone;
      } else {
        onDone();
      }
    },

    genKeyClick() {
      this.confirmOverride(this.genKeys);
    },

    //handle Gen Key
    genKeys() {
      const generateKeys = generateRSAKey();

      this.showModalPassword = true;
      this.handlePasswordConfirm = (password) => {
        this.handlePublicKeyGen(generateKeys.publicKey);
        this.handlePrivateKey(
          encryptPrivateKeyWithPasswordConfirm(
            password,
            generateKeys.privateKey
          )
        );
        this.$store.commit("PASSWORD_CONFIRM", password);
        this.hiddenExport = false;
      };
    },

    importKeyClick() {
      this.confirmOverride(this.importKeys);
    },

    // handle Import Key
    importKeys() {
      this.file = this.$refs.doc.files[0];
      const reader = new FileReader();
      if (this.file.name.includes(".pem")) {
        reader.onload = (res) => {
          const privateKeyImport = res.target.result;

          this.showModalPassword = true;
          this.handlePasswordConfirm = (password) => {
            this.handlePublicKeyImport(privateKeyImport);
            this.handlePrivateKey(
              encryptPrivateKeyWithPasswordConfirm(password, privateKeyImport)
            );
            this.$store.commit("PASSWORD_CONFIRM", password);
            this.hiddenExport = false;
          };
        };
        reader.onerror = (err) => console.log(err);
        reader.readAsText(this.file);
      } else {
        this.$toast.error("Invalid Private Key!", {
          timeout: 2000,
        });
        reader.onerror = (err) => console.log(err);
        reader.readAsText(this.file);
      }
    },

    //handle Export Original Private Key
    exportKeys() {
      if (
        localStorage.getItem(
          `${process.env.VUE_APP_CONTRACT_NAME}_${this.username}_privatekey`
        )
      ) {
        this.showModalPassword = true;
        this.handlePasswordConfirm = (password) => {
          const privateKeyDecrypt = decryptPrivateKeyWithPasswordConfirm(
            password,
            localStorage.getItem(
              `${process.env.VUE_APP_CONTRACT_NAME}_${this.username}_privatekey`
            )
          );
          if (privateKeyDecrypt.includes("TEST")) {
            this.handleExportKeys(privateKeyDecrypt);
          } else {
            this.$toast.error("Your Confirmation Password is incorrect");
          }
        };
      }
    },

    handleExportKeys(privateKey) {
      if (privateKey) {
        const file = new Blob([privateKey.slice(5)], {
          type: "text/plain",
        });
        if (window.navigator.msSaveOrOpenBlob)
          // IE10+
          window.navigator.msSaveOrOpenBlob(
            file,
            `nms-${this.username}-key.pem`
          );
        else {
          // Others
          var a = document.createElement("a"),
            url = URL.createObjectURL(file);
          a.href = url;
          a.download = `nms-${this.username}-key.pem`;
          document.body.appendChild(a);
          a.click();
          setTimeout(function () {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
          }, 0);
        }
        this.$toast.success("Success Export Private Key!", {
          timeout: 2000,
        });
      } else {
        this.$toast.warning("Please Generate or Import Key!", {
          timeout: 2000,
        });
      }
    },

    handlePublicKeyImport(privateKeyImport) {
      const publicKeyImport = privateKeyToPublicKey(privateKeyImport);
      this.handlePublicKeyGen(publicKeyImport);
    },

    handlePublicKeyGen(publicKeyGen) {
      localStorage.setItem(
        `${process.env.VUE_APP_CONTRACT_NAME}_${this.username}_publickey`,
        publicKeyGen
      );
      this.publicKey = publicKeyGen;
      this.updateKeysApi(publicKeyGen);
    },

    handlePrivateKey(key) {
      localStorage.setItem(
        `${process.env.VUE_APP_CONTRACT_NAME}_${this.username}_privatekey`,
        key
      );
      this.$store.commit("TOGGLE_PRIVATEKEY_LOCAL", {
        key,
        userName: this.username,
      });
      this.privateKey = key;
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
  z-index: 9999;

  width: 100%;
  max-width: 550px;
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
    .btn-sent-key {
      width: auto;
      span {
        width: auto;
        text-align: left;
      }
      input[type="file"] {
        display: none;
      }
      @media (max-width: 767px) {
        span {
          width: 30%;
          font-size: 16px;
        }
      }
    }
    .form-input {
      font-size: 16px;
      line-height: 22px;
      position: relative;
      display: flex;
    }
    .form-input .line {
      content: " ";
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      width: 100%;
      height: 1px;
      background: var(--main-color);
      -webkit-transform: scaleY(0.5);
      -moz-transform: scaleY(0.5);
      -ms-transform: scaleY(0.5);
      -o-transform: scaleY(0.5);
      transform: scaleY(0.5);
    }
    .form-input span {
      color: var(--color-mail-item);
      flex: 0.25;
      @media (max-width: 767px) {
        flex: 0.5;
      }
    }
    .form-input input {
      flex: 1;
      background: transparent;
      width: 100%;
      border: 0;
      color: var(--color-menu);
      padding-left: 0px;
      font-size: 16px;
      line-height: 22px;
      font-weight: 700;
    }
    .form-input input::-webkit-input-placeholder {
      font-weight: 500;
    }
    .form-input input:-moz-placeholder {
      font-weight: 500;
    }
    .form-input input::-moz-placeholder {
      font-weight: 500;
    }
    .form-input input:-ms-input-placeholder {
      font-weight: 500;
    }
    .form-input input::-ms-input-placeholder {
      font-weight: 500;
    }
    .form-input input::placeholder {
      font-weight: 500;
    }
    .form-input input:focus {
      outline: none;
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

<!-- 主组件 -->
 <template>
  <div class="container">
    <!-- 未连接钱包 -->
    <div v-if="!account" class="connect-action">
      <a-empty
        ><span>暂无钱包</span
        ><a-button type="primary">创建钱包</a-button></a-empty
      >
    </div>
    <!-- 已有钱包，未连接 -->
    <div v-else-if="!connectAccount" class="connect-action">
      <span>连接钱包（支持MetaMask等注入式钱包）</span>
      <a-button
        @click="connectWallet"
        :disabled="isConnecting"
        class="connect-btn"
        >{{ isConnecting ? "连接中......" : "连接钱包" }}</a-button
      >
      <p v-if="error" class="error">{{ error }}</p>
    </div>
    <!-- 已连接钱包 -->
    <div v-else class="connect-action">
      <div class="wallet-header">
        <div class="account-info">
          <a-tooltip title="复制"
            ><span class="address" @click="copyAddress">{{
              shortAddress
            }}</span></a-tooltip
          >
          <span>{{ networkName }}</span>
        </div>
        <a-button @click="disconnect">断开钱包连接</a-button>
        <!-- 余额显示 -->
        <div class="balance-section">
          <span>钱包余额</span>
          <div class="balance-amount">{{ formateEth(balance) }}ETH</div>
        </div>
      </div>

      <!-- 核心操作 -->
      <div class="actions">
        <a-card
          ><span>ETH交易</span>
          <div class="input-group">
            <input
              v-model="sendTo"
              placeholder="请输入接收地址......"
              class="address-input"
            />
            <input
              v-model="sendAccount"
              type="number"
              placeholder="请输入发送金额"
              step="0.001"
              class="amount-input"
            />
            <a-button @click="sendETH" :disabled="!canSend" class="send-btn"
              >发送</a-button
            >
          </div></a-card
        >
        <div class="action-card">
          <span>签名信息</span
          ><input
            v-model="message"
            placeholder="请输入签名的信息"
            class="message-input"
          /><a-button @click="signMsg" class="sign-btn">签名</a-button>
        </div>
      </div>
      <div v-if="statusMessage" :class="['status', statusType]">
        {{ statusMessage }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { message } from "ant-design-vue";
import Web3 from "web3";
import { ref, computed } from "vue";
const isConnecting = ref(false);
const error = ref("");
const account = ref(null);
const connectAccount = ref(null);
const balance = ref("0");
const sendTo = ref("");
const sendAccount = ref("");
const message = ref("");
const statusMessage = ref("");
const statusType = ref("info");
const chainId = ref("0x1");

//格式化地址
const shortAddress = computed(() => {
  if (!account.value) return "";
  else if (!connectAccount.value) return "";
  return `${account.value.slice(0, 6)}...${account.value.slice(-4)}`;
});
//网络名称
const networkName = computed(() => {
  const networks = {
    "0x1": "以太坊",
    "0x5": "Goerli测试网",
    "0xaa36a7": "Sepolia测试网",
  };
  return networks[chainId.value] || `网络 ${chainId.value}`;
});

const canSend = computed(() => {
  return sendTo.value && sendAccount.value > 0;
});

const checkConnection = async () => {
  if (!isConnecting) return;

  try {
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    if (accounts.length > 0) {
      account.value = accounts[0];
    }
  } catch {}
};

const disconnect = async () => {};
</script>

<style lang="less" scoped>
.container {
  height: calc(100vh-60px);
  display: flex;
  position: relative;

  .connect-action {
    .connect-btn {
    }
    .error {
    }
    .wallet-header {
      .account-info {
        .address {
        }
      }
      .balance-section {
      }
      .balance-amount {
      }
    }
    .actions {
      .input-group {
        .address-input {
        }
        .amount-input {
        }
        .send-btn {
        }
      }
      .action-card {
        .message-input {
        }
        .sign-btn {
        }
      }
    }
  }
}
</style>
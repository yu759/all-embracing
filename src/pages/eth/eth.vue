<!-- 连接钱包（支持MetaMask等注入式钱包）

显示当前账户和余额（原生代币）

切换网络

发送交易（这里我们先实现发送原生代币）

签名消息 -->
<template>
  <div>
    <h1>Account Balance</h1>

    <div>
      <p>Personnel:{{ person }}</p>
      <p>Balance: {{ balance }} ETH</p>
    </div>
  </div>

  <div><Button onClick="estimateGas">付费</Button></div>
</template>

<script setup>
import Web3 from "web3";
import { onMounted, ref } from "vue";
const web3 = ref(null);
const account = ref(null);
const balance = ref("12");
const person = ref("");

const webContract = async () => {
  const personList = ["1", "2", "3", "4"];
  person.value = personList[0];
  if (window.ethereum) {
    web3.value = new Web3(window.ethereum);
    await window.ethereum.enable();
    const accounts = await web3.value.eth.getAccounts();
    account.value = accounts[0];

    const balanceInWei = await web3.value.eth.getBalance(account.value);
    balance.value = web3.value.utils.fromWei(balanceInWei, "ether");
  } else {
    console.error("1");
  }
};

const estimateGas = async (wishedId, amountETH) => {
  const amountWei = web3.utils.toWei(amountETH, "ether");
};

onMounted(() => {
  webContract();
});
</script>
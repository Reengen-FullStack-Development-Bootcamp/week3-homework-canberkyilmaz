<template>
  <div>a</div>
</template>

<script>
export default {
  data() {
    return {};
  },
  created() {
    // Company symbol value at URL params.
    const ticker = this.$route.params.symbol;
    this.ticker = ticker;
    // this.getCompanyDailyDetails({
    //   symbol: symbol,
    //   function: this.getApiFunctions().daily.function,
    // });
  },
};
</script>

<style scoped></style>

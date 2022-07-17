<script setup lang="ts">
import DecisionTree from './DecisionTree.vue'
import DocumentationIcon from './icons/IconDocumentation.vue'
import ToolingIcon from './icons/IconTooling.vue'
// import EcosystemIcon from './icons/IconEcosystem.vue'
// import CommunityIcon from './icons/IconCommunity.vue'
// import SupportIcon from './icons/IconSupport.vue'
</script>

<template>
  <DecisionTree json-url='src/services/treetablenodes.json'>
  </DecisionTree>

  <!-- <DecisionTree msg="sdf">asdf
    <template #icon>
      <ToolingIcon />
    </template>
    <template #heading>Tooling</template>
  </DecisionTree> -->
</template>

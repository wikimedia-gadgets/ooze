<template>
  <!-- Mod Menu is shown in bottom left - "Ooze Tools" - when tapped or clicked this opens a big menu  -->
  <div class="oozeMenu">
    <CdxToggleButton v-model="buttonValue" class="oozeMenuButton">
      <CdxIcon :icon="cdxIconViewCompact" />
    </CdxToggleButton>

    <CdxCard v-if="buttonValue">
      App stuff in here
    </CdxCard>
  </div>
</template>


<script setup lang="ts">
import { ref } from 'vue';
import { CdxToggleButton, CdxIcon, CdxCard } from '@wikimedia/codex';
import { cdxIconViewCompact } from '@wikimedia/codex-icons';

const buttonValue = ref(false);


</script>


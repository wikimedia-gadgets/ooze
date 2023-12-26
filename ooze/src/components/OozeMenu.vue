<template>
  <!-- Mod Menu is shown in bottom left - "Ooze Tools" - when tapped or clicked this opens a big menu  -->
  <div class="oozeMenuContainer">
    <CdxToggleButton v-model="menuOpen" class="oozeMenuButton">
      <CdxIcon :icon="cdxIconViewCompact" />
    </CdxToggleButton>

    <div v-if="menuOpen" class="cdx-card oozeMenu">
      <!-- Footer (at bottom) -->
      <div class="oozeMenuFooter">
        <span class="oozeMenuTitle">ooze v1.1.1</span>

        <!-- Settings button -->
        <div class="oozeButtons">
          <CdxButton class="oozeMenuButton" size="large">
            <CdxIcon :icon="cdxIconSettings" />
          </CdxButton>
        </div>
      </div>

    </div>
  </div>
</template>


<script setup lang="ts">
import { ref } from 'vue';
import { CdxToggleButton, CdxButton, CdxIcon } from '@wikimedia/codex';
import { cdxIconViewCompact, cdxIconSettings } from '@wikimedia/codex-icons';

const menuOpen = ref(false);


</script>


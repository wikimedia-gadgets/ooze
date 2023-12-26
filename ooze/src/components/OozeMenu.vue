<template>
  <!-- Mod Menu is shown in bottom left - "Ooze Tools" - when tapped or clicked this opens a big menu  -->
  <div class="oozeMenuContainer">
    <CdxToggleButton v-model="menuOpen" class="oozeMenuButton" aria-label="OOZE Tool Menu">
      <CdxIcon :icon="cdxIconViewCompact" />
    </CdxToggleButton>

    <div v-if="menuOpen" class="cdx-card oozeMenu">

      <!-- Header/footer (at bottom, or on top on mobile) -->
      <div class="oozeMenuFooter">
        <p class="oozeMenuTitle">ooze v1.1.1</p>
        <div class="oozeButtons">
          <!-- Settings button -->
          <CdxButton size="large" weight="quiet" aria-label="OOZE Settings">
            <CdxIcon :icon="cdxIconSettings" />
          </CdxButton>
          <!-- Close button -->
          <CdxButton size="large" weight="quiet" @click="menuOpen = false" aria-label="Close menu">
            <CdxIcon :icon="cdxIconClose" />
          </CdxButton>
        </div>
      </div>

      <!-- Content -->
      

    </div>
  </div>

</template>


<script setup lang="ts">
import { ref } from 'vue';
import { CdxToggleButton, CdxButton, CdxIcon, CdxMenuItem } from '@wikimedia/codex';
import { cdxIconViewCompact, cdxIconSettings, cdxIconClose, cdxIconLock } from '@wikimedia/codex-icons';

const menuOpen = ref(false);

const menuItem = {
	value: 5921,
	label: 'Color',
	description: 'visual perception of light wavelengths',
	icon: cdxIconTag,
	id: 'menu-item-with-icon'
};


</script>


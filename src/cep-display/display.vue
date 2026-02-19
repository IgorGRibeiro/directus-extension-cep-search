<template>
	<span class="cep-display">{{ formatted }}</span>
</template>

<script setup>
import { computed } from 'vue';
import { formatCEP } from '../utils/cep-utils.js';

const props = defineProps({
	value: {
		type: String,
		default: null,
	},
});

const formatted = computed(() => (props.value ? formatCEP(props.value) : '—'));
</script>

<style scoped>
.cep-display {
	font-family: var(--theme--fonts--monospace--font-family);
}
</style>

<template>
	<!-- CEP input with mask -->
	<template v-if="fieldType === 'cep'">
		<v-input
			:model-value="displayValue"
			@update:model-value="handleCepInput"
			:placeholder="placeholder || '00000-000'"
			maxlength="9"
			:disabled="disabled"
			font-family="monospace"
		>
			<template #append v-if="fetchStatus !== null">
				<v-icon
					v-if="fetchStatus === 'success'"
					name="check_circle"
					small
					style="color: var(--theme--success);"
					v-tooltip="'CEP encontrado'"
				/>
				<v-icon
					v-else-if="fetchStatus === 'error'"
					name="error"
					small
					style="color: var(--theme--danger);"
					v-tooltip="'CEP não encontrado'"
				/>
			</template>
		</v-input>
	</template>

	<!-- UF select -->
	<template v-else-if="fieldType === 'uf'">
		<v-select
			:model-value="value"
			@update:model-value="$emit('input', $event)"
			:placeholder="placeholder || 'Selecione o estado'"
			:items="ufChoices"
			:disabled="disabled"
			show-deselect
		/>
	</template>

	<!-- Plain text input for rua, bairro, cidade -->
	<template v-else>
		<v-input
			:model-value="value"
			@update:model-value="$emit('input', $event)"
			:placeholder="placeholder || ''"
			:disabled="disabled"
		/>
	</template>
</template>

<script setup>
import { computed } from 'vue';
import { cleanCEP, formatCEP } from '../utils/cep-utils.js';

const ESTADOS_BRASIL = [
	{ uf: 'AC', nome: 'Acre' },
	{ uf: 'AL', nome: 'Alagoas' },
	{ uf: 'AP', nome: 'Amapá' },
	{ uf: 'AM', nome: 'Amazonas' },
	{ uf: 'BA', nome: 'Bahia' },
	{ uf: 'CE', nome: 'Ceará' },
	{ uf: 'DF', nome: 'Distrito Federal' },
	{ uf: 'ES', nome: 'Espírito Santo' },
	{ uf: 'GO', nome: 'Goiás' },
	{ uf: 'MA', nome: 'Maranhão' },
	{ uf: 'MT', nome: 'Mato Grosso' },
	{ uf: 'MS', nome: 'Mato Grosso do Sul' },
	{ uf: 'MG', nome: 'Minas Gerais' },
	{ uf: 'PA', nome: 'Pará' },
	{ uf: 'PB', nome: 'Paraíba' },
	{ uf: 'PR', nome: 'Paraná' },
	{ uf: 'PE', nome: 'Pernambuco' },
	{ uf: 'PI', nome: 'Piauí' },
	{ uf: 'RJ', nome: 'Rio de Janeiro' },
	{ uf: 'RN', nome: 'Rio Grande do Norte' },
	{ uf: 'RS', nome: 'Rio Grande do Sul' },
	{ uf: 'RO', nome: 'Rondônia' },
	{ uf: 'RR', nome: 'Roraima' },
	{ uf: 'SC', nome: 'Santa Catarina' },
	{ uf: 'SP', nome: 'São Paulo' },
	{ uf: 'SE', nome: 'Sergipe' },
	{ uf: 'TO', nome: 'Tocantins' },
];

const props = defineProps({
	value: {
		type: String,
		default: '',
	},
	disabled: {
		type: Boolean,
		default: false,
	},
	placeholder: {
		type: String,
		default: '',
	},
	fieldType: {
		type: String,
		default: 'cep',
	},
	fetchStatus: {
		type: String,
		default: null,
	},
	ufDisplayMode: {
		type: String,
		default: 'short',
	},
});

const emit = defineEmits(['input']);

// CEP-specific
const displayValue = computed(() => formatCEP(props.value));

function handleCepInput(newValue) {
	emit('input', cleanCEP(newValue));
}

// UF choices: value is always the short code; label depends on ufDisplayMode
const ufChoices = computed(() =>
	ESTADOS_BRASIL.map((estado) => ({
		text: props.ufDisplayMode === 'full' ? estado.nome : estado.uf,
		value: estado.uf,
	}))
);
</script>

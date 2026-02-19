<template>
	<div class="cep-search-group">
		<v-notice v-if="!cepField" type="warning">
			Nenhum campo filho com a interface <strong>Campo de Endereço</strong> e tipo <strong>CEP</strong> foi encontrado.
			Adicione um campo filho, defina sua interface como "Campo de Endereço" e selecione o tipo "CEP".
		</v-notice>

		<v-notice v-if="fetchError" type="danger" class="fetch-error">
			{{ fetchError }}
		</v-notice>

		<v-form
			:group="field.field"
			:fields="fieldsWithStatus"
			:model-value="values"
			:primary-key="primaryKey"
			:disabled="disabled || isFetching"
			:loading="loading || isFetching"
			:validation-errors="validationErrors"
			:batch-mode="batchMode"
			:batch-active-fields="batchActiveFields"
			@update:model-value="$emit('apply', $event)"
		/>
	</div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { cleanCEP, fetchAddressByCEP } from '../utils/cep-utils.js';

const props = defineProps({
	field: {
		type: Object,
		required: true,
	},
	fields: {
		type: Array,
		default: () => [],
	},
	values: {
		type: Object,
		default: () => ({}),
	},
	primaryKey: {
		type: [String, Number],
		default: null,
	},
	disabled: {
		type: Boolean,
		default: false,
	},
	batchMode: {
		type: Boolean,
		default: false,
	},
	batchActiveFields: {
		type: Array,
		default: () => [],
	},
	loading: {
		type: Boolean,
		default: false,
	},
	validationErrors: {
		type: Array,
		default: () => [],
	},
	overwriteExisting: {
		type: Boolean,
		default: false,
	},
});

const emit = defineEmits(['apply']);

const isFetching = ref(false);
const fetchError = ref(null);
const fetchStatus = ref(null); // 'success' | 'error' | null

// All child fields using the cep-input interface
const cepInputFields = computed(() =>
	props.fields.filter((f) => f.meta?.interface === 'cep-input')
);

// Auto-detect field roles by fieldType option
// A field with no fieldType or fieldType === 'cep' is the CEP field
const cepField = computed(() =>
	cepInputFields.value.find((f) => {
		const ft = f.meta?.options?.fieldType;
		return !ft || ft === 'cep';
	})
);

const streetField = computed(() =>
	cepInputFields.value.find((f) => f.meta?.options?.fieldType === 'rua')
);

const neighborhoodField = computed(() =>
	cepInputFields.value.find((f) => f.meta?.options?.fieldType === 'bairro')
);

const cityField = computed(() =>
	cepInputFields.value.find((f) => f.meta?.options?.fieldType === 'cidade')
);

const ufField = computed(() =>
	cepInputFields.value.find((f) => f.meta?.options?.fieldType === 'uf')
);

// Read autofill settings from the CEP field's own options
const autofillEnabled = computed(() =>
	cepField.value?.meta?.options?.enableAutofill !== false
);

// Pass fetchStatus down to the cep-input CEP field via its injected options
const fieldsWithStatus = computed(() => {
	if (!cepField.value) return props.fields;

	return props.fields.map((f) => {
		if (f.field !== cepField.value.field) return f;
		return {
			...f,
			meta: {
				...f.meta,
				options: {
					...(f.meta?.options ?? {}),
					fetchStatus: fetchStatus.value,
				},
			},
		};
	});
});

// Watch CEP field value; debounce the autofill trigger
watch(
	() => cepField.value && props.values[cepField.value.field],
	(newValue) => {
		if (!cepField.value) return;

		const clean = cleanCEP(newValue);

		if (clean.length < 8) {
			fetchStatus.value = null;
			fetchError.value = null;
			clearTimeout(debounceTimer);
			return;
		}

		if (!autofillEnabled.value) return;

		if (!isFetching.value) {
			performAutofill(clean);
		}
	}
);

async function performAutofill(cleanedCEP) {
	if (isFetching.value) return;

	isFetching.value = true;
	fetchError.value = null;
	fetchStatus.value = null;

	try {
		const addressData = await fetchAddressByCEP(cleanedCEP);

		if (!addressData) {
			fetchStatus.value = 'error';
			fetchError.value = 'CEP não encontrado. Verifique o número digitado.';
			return;
		}

		fetchStatus.value = 'success';

		const fieldMappings = [
			{ field: streetField.value?.field,      value: addressData.logradouro },
			{ field: neighborhoodField.value?.field, value: addressData.bairro },
			{ field: cityField.value?.field,         value: addressData.localidade },
			{ field: ufField.value?.field,           value: addressData.uf },
		];

		const updates = {};

		for (const mapping of fieldMappings) {
			if (!mapping.field || !mapping.value) continue;
			if (!props.overwriteExisting && props.values[mapping.field]) continue;
			updates[mapping.field] = mapping.value;
		}

		if (Object.keys(updates).length > 0) {
			emit('apply', { ...props.values, ...updates });
		}
	} catch (error) {
		fetchStatus.value = 'error';
		fetchError.value = error.message || 'Erro ao buscar CEP. Verifique sua conexão.';
	} finally {
		isFetching.value = false;
	}
}
</script>

<style scoped>
.cep-search-group {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.fetch-error {
	margin-bottom: 4px;
}
</style>

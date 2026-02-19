import InterfaceComponent from "./interface.vue";

export default {
  id: "cep-input",
  name: "Campo de Endereço",
  icon: "pin_drop",
  description: "Campo de endereço configurável: CEP (com máscara e autopreenchimento), logradouro, bairro, cidade ou UF",
  component: InterfaceComponent,
  options: [
    // ── Always visible ──────────────────────────────────────────────────────
    {
      field: "fieldType",
      name: "Tipo do Campo",
      type: "string",
      meta: {
        width: "half",
        interface: "select-dropdown",
        options: {
          choices: [
            { text: "CEP", value: "cep" },
            { text: "Logradouro / Rua", value: "rua" },
            { text: "Bairro", value: "bairro" },
            { text: "Cidade", value: "cidade" },
            { text: "UF / Estado", value: "uf" },
          ],
        },
      },
      schema: {
        default_value: "cep",
      },
    },
    {
      field: "placeholder",
      name: "Placeholder",
      type: "string",
      meta: {
        width: "half",
        interface: "input",
      },
    },

    // ── CEP only (hidden when fieldType is explicitly set to something else) ─
    {
      field: "enableAutofill",
      name: "Autopreenchimento",
      type: "boolean",
      meta: {
        width: "half",
        interface: "boolean",
        options: {
          label: "Preencher campos ao digitar CEP",
        },
        conditions: [
          {
            name: "Ocultar quando tipo não for CEP",
            rule: {
              _and: [
                { fieldType: { _nnull: true } },
                { fieldType: { _neq: "cep" } },
              ],
            },
            hidden: true,
          },
        ],
      },
      schema: {
        default_value: true,
      },
    },
    // ── UF only ──────────────────────────────────────────────────────────────
    {
      field: "ufDisplayMode",
      name: "Exibição dos Estados",
      type: "string",
      meta: {
        width: "half",
        interface: "select-dropdown",
        hidden: true,
        options: {
          choices: [
            { text: "Sigla (MG, SP, RJ...)", value: "short" },
            { text: "Nome completo (Minas Gerais, São Paulo...)", value: "full" },
          ],
        },
        conditions: [
          {
            name: "Mostrar quando tipo for UF",
            rule: { fieldType: { _eq: "uf" } },
            hidden: false,
          },
        ],
      },
      schema: {
        default_value: "short",
      },
    },
  ],
  types: ["string"],
};

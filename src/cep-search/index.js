import InterfaceComponent from "./interface.vue";

export default {
  id: "cep-search",
  name: "Autopreenchimento de endereço",
  icon: "location_on",
  description:
    "Grupo de campos de endereço com busca automática de CEP pelo ViaCEP.",
  component: InterfaceComponent,
  options: [
    {
      field: "overwriteExisting",
      name: "Sobrescrever Campos Preenchidos",
      type: "boolean",
      meta: {
        width: "full",
        interface: "boolean",
        options: {
          label: "Substituir valores existentes ao buscar CEP",
        },
      },
      schema: {
        default_value: false,
      },
    },
    {
      field: "guide",
      name: "Information",
      type: "alias",
      meta: {
        interface: "presentation-notice",
        width: "full",
        options: {
          text:
            '<strong style="text-transform: uppercase">COMO USAR ESSE CAMPO:</strong>' +
            "<br/>" +
            "<p>- Adicione esse grupo na coleção</p>" +
            "<p>- Crie campos dentro desse grupo com a interface 'Campo de Endereço'</p>" +
            "<p>- Os campos serão preenchidos automaticamente conforme o tipo definido</p>",
        },
      },
    },
  ],
  types: ["alias"],
  localTypes: ["group"],
  group: "group",
  hideLabel: true,
};

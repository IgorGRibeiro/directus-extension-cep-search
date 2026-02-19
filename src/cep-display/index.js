import DisplayComponent from "./display.vue";

export default {
  id: "cep-display",
  name: "CEP",
  icon: "pin_drop",
  description: "Exibe campo de CEP formatado (xxxxx-xxx)",
  component: DisplayComponent,
  options: null,
  types: ["string"],
};

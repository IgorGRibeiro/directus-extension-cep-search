# CEP Search Autocomplete for Directus

A Directus interface bundle for Brazilian address forms with automatic CEP (postal code) lookup via [ViaCEP](https://viacep.com.br/). Add a group field to your collection, place address child fields inside it, and the form autofills when the user types a CEP.

![Extension demo](https://raw.githubusercontent.com/IgorGRibeiro/directus-extension-cep-search/master/images/demo.gif)

> **Note:** According to Directus CRM limitations, it's impossible to provide translations for the extension. For this reason, although this documentation is in English for marketplace standards, all the interface and validations are in Portuguese (BR).

## Features

- Fetches address data automatically from ViaCEP when a valid CEP is typed
- Supports all Brazilian address fields: CEP, Logradouro, Bairro, Cidade, and UF
- Optional overwrite control — choose whether to replace already-filled fields
- UF field supports abbreviation (`MG`) or full name (`Minas Gerais`) display
- Works as a sandboxed extension (no extra permissions required)
- Three interfaces bundled together: group, input, and display

## Installation

### Via Directus Marketplace (Recommended)

1. Navigate to your Directus project
2. Go to **Settings** → **Extensions**
3. Search for "**CEP Search**"
4. Click **Install**

### Via npm

```bash
npm install @ribertec/directus-extension-cep-search
```

Then restart your Directus instance.

## Setup

This bundle provides three interfaces that work together:

### 1. CEP Search Group (`cep-search`)

The parent group field. Add it to your collection first.

| Option                          | Description                                                        |
| ------------------------------- | ------------------------------------------------------------------ |
| Sobrescrever Campos Preenchidos | When enabled, autofill overwrites fields that already have a value |

### 2. Address Field (`cep-input`)

Add these as **child fields** inside the CEP Search group. Set one field per address component.

| Option               | Description                                                                                                  |
| -------------------- | ------------------------------------------------------------------------------------------------------------ |
| Tipo do Campo        | The address component this field represents: `CEP`, `Logradouro / Rua`, `Bairro`, `Cidade`, or `UF / Estado` |
| Placeholder          | Optional placeholder text                                                                                    |
| Autopreenchimento    | _(CEP only)_ Triggers autofill when a valid CEP is entered                                                   |
| Exibição dos Estados | _(UF only)_ Display as abbreviation (`MG`) or full name (`Minas Gerais`)                                     |

### 3. CEP Display (`cep-display`)

A read-only display interface that renders a stored CEP value formatted as `xxxxx-xxx`.

## Requirements

- Directus 11.0.0+

## License

MIT License — see [LICENSE](LICENSE) file for details

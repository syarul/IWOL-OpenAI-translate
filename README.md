# IWOL-OpenAI-translate

English translation parser for "觅长生" (IWOL) using OpenAI

![Sample](/image.PNG)

Original Mod: https://steamcommunity.com/sharedfiles/filedetails/?id=2826780370

## Setup

To use this tool, you need your OpenAI API key.

1. Create an .env file in the root directory of the project.
2. Add your OpenAI API key to the .env file using the following format:
```makefile
OPENAI_API_KEY=XXXXXXXXXXXXXXXXXX
```

## Usage

To start, copy the content from SteamLibrary workshop:

`content/1189490/2826780370`

Paste the copied content into the root directory of the content folder.

To retranslate a file i.e.

`node index.js content/1189490/2826780370/plugins/Translations/etc.txt`

This will create a backup file at `content/1189490/2826780370/plugins/Translations/etc_bkp.txt`.

Edit the etc.txt file and remove the lines you want to retranslate. Keep the line positions intact.

```txt










对¤Dao of
...
```

Rerun the command: `node index.js content/1189490/2826780370/plugins/Translations/etc.txt`

For example, lines 1 to 9 will be retranslated.

If you want to revert to the original translation done by the [AMA Team](https://discord.gg/AvtuzagYfY), empty the lines you want to revert and use the following command:

`node index.js content/1189490/2826780370/plugins/Translations/etc.txt revert`

## Analogy

If you want to customize how the analogy line works, modify line 24 in index.js:

```js
// you can modify to make your own analogy to tell the AI how to deal with the translation
const analog = (text) => {
  return `Translate this "${text}" into English using analogies from Chinese web novels in the Xianxia or Xuanhuan genre use by English translators. Avoid explanations and keep it brief.`
}
```

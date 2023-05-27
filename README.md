# IWOL-OpenAI-translate
觅长生 (IWOL) English translation parse using openai

![Sample](/image.PNG)

Original Mod: https://steamcommunity.com/sharedfiles/filedetails/?id=2826780370

## Setup

You need your openai key to use this

i.e create an `.env` file and add your key here
`OPENAI_API_KEY=XXXXXXXXXXXXXXXXXX`

## Usage

To use you can initially copy the content from SteamLibrary workshop

`content/1189490/2826780370`

Copy to the root dir of `content` folder itself.

To retranslate a file i.e.

`node index.js content/1189490/2826780370/plugins/Translations/etc.txt`

Which first create a backup file at `content/1189490/2826780370/plugins/Translations/etc_bkp.txt`.

Afterwards you can start remove lines on `etc.txt` which one you want to retranslated.

```txt










对¤Dao of
...
```

and rerun `node index.js content/1189490/2826780370/plugins/Translations/etc.txt` again

> Keep the line position intact

For example here from line 1 to 9 will be retranslated.

If you wish to revert to the original lines translation, empty the lines you want to revert and you can pass 4th argument `revert` instead retranslating it will revert back to the original translation done by the [AMA Team](https://discord.gg/AvtuzagYfY).

`node index.js content/1189490/2826780370/plugins/Translations/etc.txt revert`

## Analogy

If you wish to customize how the analogy line works, modify index.js line 24.

```js
// you can modify to make your own analogy to tell the AI how to deal with the translation
const analog = (text) => {
  return `Translate this "${text}" into English using analogies from Chinese web novels in the Xianxia or Xuanhuan genre use by English translators. Avoid explanations and keep it brief.`
}
```

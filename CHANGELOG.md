# [2.5.0](https://github.com/webex/message-composer/compare/v2.4.0...v2.5.0) (2021-11-19)


### Features

* **composer:** improvements to how dislpayName and contents are set ([#81](https://github.com/webex/message-composer/issues/81)) ([df3a7d0](https://github.com/webex/message-composer/commit/df3a7d0e7ccf4231772b48fc70d4c370b99ed58b))

# [2.4.0](https://github.com/webex/message-composer/compare/v2.3.0...v2.4.0) (2021-03-22)


### Features

* **composer:** add optional sendButton prop ([5942e70](https://github.com/webex/message-composer/commit/5942e70c1c0fdf9af06a52656282483e4584f358))

# [2.3.0](https://github.com/webex/message-composer/compare/v2.2.1...v2.3.0) (2021-01-19)


### Features

* **composer:** disable copy paste rich text in composer ([f97f5ba](https://github.com/webex/message-composer/commit/f97f5ba561f0264186f60dda8c0ff41a2f393298))

## [2.2.1](https://github.com/webex/message-composer/compare/v2.2.0...v2.2.1) (2021-01-08)


### Bug Fixes

* **mentions:** use first name if available ([e4266ba](https://github.com/webex/message-composer/commit/e4266ba1713223941b3766f4c70845d0834baea8))

# [2.2.0](https://github.com/webex/message-composer/compare/v2.1.1...v2.2.0) (2020-08-31)


### Features

* **sanitize:** user can self xss ([6afbb42](https://github.com/webex/message-composer/commit/6afbb4203a6f4670f230302953bc15858db94bc6))

## [2.1.1](https://github.com/webex/message-composer/compare/v2.1.0...v2.1.1) (2020-07-15)


### Bug Fixes

* **composer:** message copy paste format bug ([7e28440](https://github.com/webex/message-composer/commit/7e2844075bbdff6c581dcfcf5e5bf8c4ead40584))

# [2.1.0](https://github.com/webex/message-composer/compare/v2.0.0...v2.1.0) (2020-06-18)


### Features

* **mention:** add mention open/close handlers ([fe0c1c3](https://github.com/webex/message-composer/commit/fe0c1c3a6c6ffff8200ac8b6830663837eddbd2f))

# [2.0.0](https://github.com/webex/message-composer/compare/v1.11.0...v2.0.0) (2020-05-19)


### Features

* **quill:** only support quill composer ([d30ec9e](https://github.com/webex/message-composer/commit/d30ec9e961e826ecd383945f0c48de63c354af8b))


### BREAKING CHANGES

* **quill:** remove support fore `composerType` and only support Quill Composer

# [1.11.0](https://github.com/webex/message-composer/compare/v1.10.0...v1.11.0) (2020-05-08)


### Bug Fixes

* **cursor:** move cursor to end of edited text ([19548ce](https://github.com/webex/message-composer/commit/19548cec74acaffe80494216ef6906e5676c0275))


### Features

* **key-bindings:** bind key bindings to component ([beeb737](https://github.com/webex/message-composer/commit/beeb737057f3a6237ef80922e3738e145bde125b))

# [1.10.0](https://github.com/webex/message-composer/compare/v1.9.7...v1.10.0) (2020-05-01)


### Features

* **mention:** add [@moderator](https://github.com/moderator) and [@here](https://github.com/here) ([d720160](https://github.com/webex/message-composer/commit/d720160432424b9f027c8eed977ca794b52f58d0))
* **mentions:** add mention type ([b276404](https://github.com/webex/message-composer/commit/b276404b62428532f231e3641a25ea667a5d0304))
* **mentions:** add space after group mentioned items ([6d75778](https://github.com/webex/message-composer/commit/6d75778fddcd336513c5057a1049c179c04ed660))
* **mentions:** sanitize items input ([cb69351](https://github.com/webex/message-composer/commit/cb69351daeb100bd2202e9f9bafe90b6d7ca9bdf))

## [1.9.7](https://github.com/webex/message-composer/compare/v1.9.6...v1.9.7) (2020-04-21)


### Bug Fixes

* **mentions:** fix [@all](https://github.com/all) group mentions ([944b96f](https://github.com/webex/message-composer/commit/944b96fd255df9a41720ef2aaf1a2c310c905b70))

## [1.9.6](https://github.com/webex/message-composer/compare/v1.9.5...v1.9.6) (2020-04-03)


### Bug Fixes

* **quill:** add fallback if selection returns null ([0182c40](https://github.com/webex/message-composer/commit/0182c40f944dcd9b17a13e4315ef53d706ac60ff))

## [1.9.5](https://github.com/webex/message-composer/compare/v1.9.4...v1.9.5) (2020-04-03)


### Bug Fixes

* **quill:** fix cursor position when inserting text ([4af4ad3](https://github.com/webex/message-composer/commit/4af4ad33893c69e41d65f4750976fede23ad7f8b))

## [1.9.4](https://github.com/webex/message-composer/compare/v1.9.3...v1.9.4) (2020-03-24)


### Bug Fixes

* **quill:** add handleClear and groupMention ([1f172ac](https://github.com/webex/message-composer/commit/1f172ac5c32faa4cb7769e421062e6268bb2bc72))

## [1.9.3](https://github.com/webex/message-composer/compare/v1.9.2...v1.9.3) (2020-03-11)


### Bug Fixes

* **markdown:** disable markdowns ([c215429](https://github.com/webex/message-composer/commit/c2154293e781b0c0533eb4f739cd7d2942b0742a))
* **quill:** add more function names to error message ([6cc8d9e](https://github.com/webex/message-composer/commit/6cc8d9e8d444369139671285f0df2494216dd996))
* **quill:** allow keybidings to be passed ([cb9883b](https://github.com/webex/message-composer/commit/cb9883b012d76fc63eef6f94e9c6d769ec216700))

## [1.9.2](https://github.com/webex/message-composer/compare/v1.9.1...v1.9.2) (2020-02-26)


### Bug Fixes

* **quill:** couple bug fixes ([86b7756](https://github.com/webex/message-composer/commit/86b77563270b801e8cd72cb0f9d61fef6a5fd91c))

## [1.9.1](https://github.com/webex/message-composer/compare/v1.9.0...v1.9.1) (2020-02-21)


### Bug Fixes

* **quill:** add focus handler ([ea88865](https://github.com/webex/message-composer/commit/ea88865f9e2f086c29b466d2714865d68c914180))
* **quill:** bug fixes ([e42dd16](https://github.com/webex/message-composer/commit/e42dd16bfd14e87a33100417f8293089cb8d7e73))
* **quill:** fix inline code carots ([3ba7252](https://github.com/webex/message-composer/commit/3ba72529814316a95af32120ae1a43135b915611))
* **quill:** inline code carrots ([06088c4](https://github.com/webex/message-composer/commit/06088c4cd84c43af708aabf183481a95f5dababc))
* **quill:** more bug fixes ([dfa89f8](https://github.com/webex/message-composer/commit/dfa89f8267d12b686a40d1dbe082e6e52017c6fe))
* **quill:** updated mentions to work properly ([bfa5ce0](https://github.com/webex/message-composer/commit/bfa5ce08b207875c9a8fd323b041404c6a163ed4))

# [1.9.0](https://github.com/webex/message-composer/compare/v1.8.1...v1.9.0) (2020-02-17)


### Bug Fixes

* **quill:** move withCrash to client ([450fddd](https://github.com/webex/message-composer/commit/450fdddfa7c7e6c4190a6594b61701a5beddefdb))
* **quill:** remove random forced crashes ([cf6231e](https://github.com/webex/message-composer/commit/cf6231edb12d19eb6b0298a339ad0c108f343e25))


### Features

* **quill:** crash handling ([a38909f](https://github.com/webex/message-composer/commit/a38909fa3e1cf6db6704b93881bdbb1aa03b2bef))

## [1.8.1](https://github.com/webex/message-composer/compare/v1.8.0...v1.8.1) (2020-02-10)


### Bug Fixes

* **quill:** safari doesn't support lookbehind, use lookahead instead ([19479ff](https://github.com/webex/message-composer/commit/19479ff386c9afd7a3f4f6851c1f5676e5804f12))

# [1.8.0](https://github.com/webex/message-composer/compare/v1.7.0...v1.8.0) (2020-02-07)


### Bug Fixes

* **quill:** add avatar alt text; use andrew's idea of carot conversion ([7d7a86b](https://github.com/webex/message-composer/commit/7d7a86b0a7dff0177982500fa1d32543bdc9b485))


### Features

* **quill:** fixed formatting and all other bugs ([78880c1](https://github.com/webex/message-composer/commit/78880c1fd8ec7ed6591cd9d00de404ea69c67bcf))

# [1.7.0](https://github.com/webex/message-composer/compare/v1.6.0...v1.7.0) (2020-02-05)


### Bug Fixes

* **mentions:** display full name; created utils file ([923c18d](https://github.com/webex/message-composer/commit/923c18d4f46cbad1f1918f2689410bb91f027776))
* **mentions:** small bugs ([f363a5c](https://github.com/webex/message-composer/commit/f363a5c731ba8718348dafc7a01054edd3fd04c8))


### Features

* **mentions:** add mentions ([df90e9d](https://github.com/webex/message-composer/commit/df90e9d738b3a66ffb434a0c93978d1c8c33aec6))
* **mentions:** maybe it'll work someday ([fd67688](https://github.com/webex/message-composer/commit/fd6768868ea6276afcf7b9c7002c16ffee7cd32d))
* **mentions:** simple avatars ([9dda99f](https://github.com/webex/message-composer/commit/9dda99f8bcc1bd508ff6345885854d826c5100c4))
* **quill:** styling touchup ([3c49eae](https://github.com/webex/message-composer/commit/3c49eae94bcd9356b9453769376f00da37858531))

# [1.6.0](https://github.com/webex/message-composer/compare/v1.5.0...v1.6.0) (2020-01-23)


### Features

* **quill:** handle drafts ([5d81c9d](https://github.com/webex/message-composer/commit/5d81c9ddb14395aa36c50497d95d774029280cf0))

# [1.5.0](https://github.com/webex/message-composer/compare/v1.4.0...v1.5.0) (2020-01-22)


### Features

* **quill:** add handling for reply and edit messages ([dd987b5](https://github.com/webex/message-composer/commit/dd987b54a9e097ca1bff309a5e76c2a96e2de07f))

# [1.4.0](https://github.com/webex/message-composer/compare/v1.3.0...v1.4.0) (2020-01-16)


### Features

* **quill:** add quill composer ([1390e87](https://github.com/webex/message-composer/commit/1390e87846a9040f9d5552d364799e9ba2abb163))

# [1.3.0](https://github.com/webex/message-composer/compare/v1.2.1...v1.3.0) (2020-01-15)


### Features

* **message-composer:** add 'clear' emitter to clear message-composer ([#27](https://github.com/webex/message-composer/issues/27)) ([1d2df46](https://github.com/webex/message-composer/commit/1d2df463c7ec2ff7e2017d29f00f745460cfd90b))

## [1.2.1](https://github.com/webex/message-composer/compare/v1.2.0...v1.2.1) (2019-12-12)


### Bug Fixes

* **composer:** remove draft from useEffect dependencies ([5e2592b](https://github.com/webex/message-composer/commit/5e2592b3a7ae2e809e170e749a8d2f876275f506))

# [1.2.0](https://github.com/webex/message-composer/compare/v1.1.2...v1.2.0) (2019-12-09)


### Features

* **send-message:** clear message if send was successful ([52baa64](https://github.com/webex/message-composer/commit/52baa648c33117055b8a61072e998118b90216a9))

## [1.1.2](https://github.com/webex/message-composer/compare/v1.1.1...v1.1.2) (2019-12-05)


### Bug Fixes

* **eslint:** fix lint errors ([fb020d3](https://github.com/webex/message-composer/commit/fb020d348543d8802cc9dab529051ed6c23d0d14))

## [1.1.1](https://github.com/webex/message-composer/compare/v1.1.0...v1.1.1) (2019-12-05)


### Bug Fixes

* **eslint:** add eslint ([1225013](https://github.com/webex/message-composer/commit/1225013c256cd6697df671cfe1e204d0481c173c))

# [1.1.0](https://github.com/webex/message-composer/compare/v1.0.2...v1.1.0) (2019-12-05)


### Features

* **css:** include separate css file ([00a68e9](https://github.com/webex/message-composer/commit/00a68e958c808325bb06abe5ab3c7e8fdabc68ed))
* **emitter:** add update emitter event ([5ccc37f](https://github.com/webex/message-composer/commit/5ccc37fad8b8e968fba0cbc28276bd0bdaeb2b25))
* **emitter:** add update emitter event ([5da0155](https://github.com/webex/message-composer/commit/5da01550f9d6526945fbaf4b8ecb0dc049f2f3ae))
* **emitter:** add update emitter event ([#21](https://github.com/webex/message-composer/issues/21)) ([2fc91c2](https://github.com/webex/message-composer/commit/2fc91c2f8c7869f2ff147b568016698c9230b3f8))


### Reverts

* Revert "chore(release): 1.0.2 [skip ci]" ([0353510](https://github.com/webex/message-composer/commit/03535102d092e944c0785f520c7fa562c69f8f64))

## [1.0.2](https://github.com/webex/message-composer/compare/v1.0.1...v1.0.2) (2019-12-04)


### Bug Fixes

* **storybook:** move example app to storybook ([dfe295c](https://github.com/webex/message-composer/commit/dfe295cf9c206fe59e0f0be59bda6892818fc690))
* **webpack:** use webpack for build step ([0728deb](https://github.com/webex/message-composer/commit/0728deb6ec883b53a5b804feffd9c20f32cb0c31))

## [1.0.1](https://github.com/webex/message-composer/compare/v1.0.0...v1.0.1) (2019-12-03)


### Bug Fixes

* **package:** fix package.json ([0f68457](https://github.com/webex/message-composer/commit/0f68457549b157245aec6de7e6f87c2ff09404c0))

# 1.0.0 (2019-12-02)


### Bug Fixes

* **composer:** add name to React profiler ([38a6dad](https://github.com/webex/message-composer/commit/38a6dad95e9e93b062952afe613ca1194f7088d1))
* **composer:** allow update of placeholder ([8340725](https://github.com/webex/message-composer/commit/8340725d4bd267fe60915218931bc7fc0119cfbf))
* **composer:** empty lines wouldn't appear ([37dbb4d](https://github.com/webex/message-composer/commit/37dbb4d46bf168b25475e6ccebe37b30c07faca6))
* **demo:** move style to component ([9bb5a99](https://github.com/webex/message-composer/commit/9bb5a99c77bf0d17184cd6ab1ae4164cf205d055))
* **markdown:** add blockquote and list ([3c83d70](https://github.com/webex/message-composer/commit/3c83d70ccca01356f5c2990c0656e3f1d9872ab5))
* **markdown:** handle markdown with [@mentions](https://github.com/mentions) ([8c28c31](https://github.com/webex/message-composer/commit/8c28c3136b1f0406f6e5d42a2ed8c17cbffe8763))
* **markdown:** hide email and urls ([68d01f1](https://github.com/webex/message-composer/commit/68d01f19757e311745d6bde043b5c46ed62f9670))
* **markdown:** ignore 'tags' ([01f2bba](https://github.com/webex/message-composer/commit/01f2bba97a5ababb408dd39030d84ffbe84ea167))
* **markdown:** ignore markdown in url/email ([8398aa3](https://github.com/webex/message-composer/commit/8398aa3d02412a3331e53132a9517b32123ea09d))
* **markdown:** marking incorrectly ([4fcddda](https://github.com/webex/message-composer/commit/4fcddda636c3db30083b91cedefb1214e09b4554))
* **markdown:** no markdown in urls or email ([5ed5355](https://github.com/webex/message-composer/commit/5ed53551bffe089874cfebfdc2826392fc79afbb))
* **markdown:** remove backticks from code ([d5e9b72](https://github.com/webex/message-composer/commit/d5e9b72b7886c45c2fa50930b26c12bb1ac22089))
* **markdown:** remove other marks within 'code' ([c84104e](https://github.com/webex/message-composer/commit/c84104ee1550a3349d558214e9dca51101a9f036))
* **markdown:** Stop markdown within code block ([ecf2a44](https://github.com/webex/message-composer/commit/ecf2a44f5dc7eb8bc5b9acaefda8094db92eaf20))
* **markdown:** support ordered list ([6c3c4da](https://github.com/webex/message-composer/commit/6c3c4dad3762994931ac0ce0548941fb49e1626b))
* **markdown:** Two markdown issues ([a529a99](https://github.com/webex/message-composer/commit/a529a99169ac130c5b83b590e7c706c2eaa7032e))
* **mc:** add custom toolbar and child ([431c99e](https://github.com/webex/message-composer/commit/431c99e3f7f1d532c959240564cbd5700f8913c2))
* **mc:** add style to insert ([5a7a996](https://github.com/webex/message-composer/commit/5a7a99614923c7e962a099e3b6dded7a8f705527))
* **mc:** address styling issues ([bcae66e](https://github.com/webex/message-composer/commit/bcae66e06facc3965283979356c497ff32ab87a8))
* **mc:** allow 'enter' to select mention ([5becc09](https://github.com/webex/message-composer/commit/5becc0931b1b13dc9f84170957f0aa5173d25059))
* **mc:** containing div should focus composer ([44f27f8](https://github.com/webex/message-composer/commit/44f27f883dfcdea931c55f08a3ec0b96e6cc0750))
* **mc:** expand composer area ([fcea49b](https://github.com/webex/message-composer/commit/fcea49befbce868195b7951d4169fe6ddffa536e))
* **mc:** move to component init instead of func ([a7a7055](https://github.com/webex/message-composer/commit/a7a7055bf960f681ad7a42ae8c41ac7cef6f40dd))
* **mc:** several fixes ([9f7f511](https://github.com/webex/message-composer/commit/9f7f5111e6db416255bf4de786b0a85911f0ddd8))
* **mc:** styles wouldn't go away ([cf497e5](https://github.com/webex/message-composer/commit/cf497e5c93db05453592f9e34a55d9726111764d))
* **mc:** Two fixes ([66d6cbe](https://github.com/webex/message-composer/commit/66d6cbe1f24484ad63018653b1e48204b60d818b))
* **mention:** add aria-current ([764933a](https://github.com/webex/message-composer/commit/764933a97ff7e58288f51a07904e69de14901fb2))
* **mention:** add classname to mention item ([787d6a5](https://github.com/webex/message-composer/commit/787d6a5f588ae076d2b8b84a5910fd5b7d8275bc))
* **mention:** add mouse selection back ([eb2eeb9](https://github.com/webex/message-composer/commit/eb2eeb93ffc548adea69dc007576b43b44350f8c))
* **mentions:** add 'active' prop to render ([4d26f34](https://github.com/webex/message-composer/commit/4d26f34c23cd4eccfadbfbe1fa3db74eb8b0679d))
* **mentions:** Allow 'tab' for selection ([a5c985c](https://github.com/webex/message-composer/commit/a5c985c3076f4ed124e2f2ec74ced7112a1aa3d3))
* **mentions:** change default to Promise ([8c8aa33](https://github.com/webex/message-composer/commit/8c8aa3387adf9808353218b8db0f44bfe12f0236))
* **mentions:** handle missing 'mentions' prop ([36b11eb](https://github.com/webex/message-composer/commit/36b11eb0a91a747f734af12d50df45065dc0ac2a))
* **mentions:** make suggestion clickable again ([166b4d6](https://github.com/webex/message-composer/commit/166b4d6dc00ff45aca89a7738a5fd1ace36ed2b0))
* **mentions:** move to event emitter ([5881dcc](https://github.com/webex/message-composer/commit/5881dcc9fc3537a4b1bcbc84d49e36ecdadd1a87))
* **mentions:** suggestion window problems ([12023c8](https://github.com/webex/message-composer/commit/12023c806b6c74dd5e7bbe713322b99e6d278454))
* **message-composer:** deconstruct parameters and memo components ([afeaac5](https://github.com/webex/message-composer/commit/afeaac539f2a390591b7f263fb4ad09a37f88df1))
* **message-composer:** move to event emitter ([8681534](https://github.com/webex/message-composer/commit/86815344452ad625d5f6a5004be86864a52ee1c3))
* **semantic-release:** fix syntax error ([cdcd632](https://github.com/webex/message-composer/commit/cdcd632b49478829d32a45b720a2393ad49b859d))
* **send:** change 'enter' default to 'send' ([57a1414](https://github.com/webex/message-composer/commit/57a141462cfc9d59769b0f70d8fe2835b4c32491))
* **send:** clear composer when sending ([cac1e67](https://github.com/webex/message-composer/commit/cac1e67fe557fee80a40ddeeeab64d69afa424b0))
* **slate:** keep slate versions the same ([bf5cd24](https://github.com/webex/message-composer/commit/bf5cd24a2cb5c12bad0b0f7af4bc33bf8a7adb34))
* **toolbar:** get styling buttons working again. ([df3e1b6](https://github.com/webex/message-composer/commit/df3e1b6dcfe28812c51ad646e6d1dcca7d554849))


### Features

* **build:** add circleci pipeline ([c6a1096](https://github.com/webex/message-composer/commit/c6a1096ab10f7246bee1eebf9237299647259d1b))
* **composer:** add 'insert text' command ([0234575](https://github.com/webex/message-composer/commit/0234575593e7bb940a5fb2bb495b161e415537fb))
* **composer:** add classname ([6a26c7c](https://github.com/webex/message-composer/commit/6a26c7cd73c05e98b184f4f4612199783f897791))
* **composer:** add key down notification ([f8fe973](https://github.com/webex/message-composer/commit/f8fe973634bb11e84defeb45f26523c2da3857bd))
* **composer:** allow button to send message ([668af26](https://github.com/webex/message-composer/commit/668af26bf61319fb282724bf28c8a1ddc93e8ab7))
* **composer:** customize placeholder ([b6f509a](https://github.com/webex/message-composer/commit/b6f509a41ef7eabf2357b93653959c79f817fd48))
* **deploy:** add deploy to circleci pipeline ([6269811](https://github.com/webex/message-composer/commit/62698110ea659c755f197b3d32d180f7546374e2))
* **deploy:** allow npm publish ([643d16c](https://github.com/webex/message-composer/commit/643d16c0a41ff07c616865a429417b4b1e627f59))
* **markdown:** add url and general fixup ([c708a4a](https://github.com/webex/message-composer/commit/c708a4a68a80dd2083022c42d2d0f748f00ae44a))
* **markdown:** allow disable of markdown ([3b58559](https://github.com/webex/message-composer/commit/3b58559e0112af9435e694a65f479881ff4f0574))
* **mc:** add draft ([03bdfec](https://github.com/webex/message-composer/commit/03bdfec1b99c93fd2b663bfef836d68de57618e4))
* **mc:** add emitter ([3da5ceb](https://github.com/webex/message-composer/commit/3da5cebfa2dc82be6aa9e5baf81d7d87fa9b5a8f))
* **mc:** add title tags and parse code markdown ([9c61beb](https://github.com/webex/message-composer/commit/9c61bebff18ad59b2fd6c9e0a427e4f14727641f))
* **mc:** allow 'disable' ([a05b449](https://github.com/webex/message-composer/commit/a05b449e9c210d2f0627cc4d83d500010b22ce64))
* **mention:** add getDisplay ([e071203](https://github.com/webex/message-composer/commit/e071203e389064eadc7523f06558e02738c54251))
* **mentions:** add render for 'insert' mention ([9c5c9ac](https://github.com/webex/message-composer/commit/9c5c9acc1d2fe5e970f2735584558e1323362e39))
* **mentions:** add scrollable window ([688dc4b](https://github.com/webex/message-composer/commit/688dc4b58530f4a45ead7baece56dffdd1dafd8c))
* mc and mentions ([a80ccc0](https://github.com/webex/message-composer/commit/a80ccc09e999c138eec50403c092f16a304db2c2))
* **mentions:** add mentions plugin ([370e07d](https://github.com/webex/message-composer/commit/370e07d378c349728a2f45446405cbd684e41b47))
* **send:** add individual and group mentions ([a280eb6](https://github.com/webex/message-composer/commit/a280eb6db15e41378f09d9f4ca62f93508e5fd4e))
* add markdown ([07e4f14](https://github.com/webex/message-composer/commit/07e4f14d97db6c9b9428175d249f83b2ceec9c85))
* start message-composer ([49f260a](https://github.com/webex/message-composer/commit/49f260adca26fb7d7d2bbc3208b63842e99d4845))

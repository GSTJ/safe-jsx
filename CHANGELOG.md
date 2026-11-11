# Changelog

Generated from conventional commit messages. Breaking changes are collected
under their own heading, from either a `!` after the type or a
`BREAKING CHANGE:` footer.

Releases up to 1.3.8 are kept as they were published, in
tools/changelog-history.md.

## [2.0.0](https://github.com/GSTJ/safe-jsx/compare/v1.3.9...v2.0.0) (2026-11-11)

### ⚠ BREAKING CHANGES

* **deps:** development requires Node.js 24 or newer and the pinned
  pnpm 12 toolchain. Published plugin Node.js and ESLint support is unchanged.

### Chores

* **ci:** update setup-node release action digest ([5911f74](https://github.com/GSTJ/safe-jsx/commit/5911f740a0c42c2fca58826adb5c9c51fbc3e372))
* **deps:** bump overridden brace-expansion and js-yaml patch releases ([#114](https://github.com/GSTJ/safe-jsx/issues/114)) ([ef98b89](https://github.com/GSTJ/safe-jsx/commit/ef98b899701a6d9b71fe32953d8d37bbfc1288cb))
* **deps:** lock file maintenance ([#104](https://github.com/GSTJ/safe-jsx/issues/104)) ([1fcba3c](https://github.com/GSTJ/safe-jsx/commit/1fcba3c5537e0880b85c156481855180812a2806))
* **deps:** lock file maintenance ([#118](https://github.com/GSTJ/safe-jsx/issues/118)) ([c32d69b](https://github.com/GSTJ/safe-jsx/commit/c32d69b3a1baa68eb8e2fe1352d26f0ed5096cf7))
* **deps:** lock file maintenance ([#120](https://github.com/GSTJ/safe-jsx/issues/120)) ([acbb37f](https://github.com/GSTJ/safe-jsx/commit/acbb37fe4907ee04bb2cbed280015418e8c177e6))
* **deps:** lock file maintenance ([#131](https://github.com/GSTJ/safe-jsx/issues/131)) ([1873693](https://github.com/GSTJ/safe-jsx/commit/1873693ff2bbb7bd9c4e4ccc76198876e085c33d))
* **deps:** lock file maintenance ([#92](https://github.com/GSTJ/safe-jsx/issues/92)) ([e460001](https://github.com/GSTJ/safe-jsx/commit/e460001c3294b40b27928e90ee65698a99e2dc74))
* **deps:** oxlint toolchain major (magic-oxlint-config v3, oxlint 1.83.0) ([#117](https://github.com/GSTJ/safe-jsx/issues/117)) ([d8be674](https://github.com/GSTJ/safe-jsx/commit/d8be674317d05dc1476432343245a7ed9d2ee979))
* **deps:** pin js-yaml past the merge-key DoS and stop denying @parcel/watcher's build ([#108](https://github.com/GSTJ/safe-jsx/issues/108)) ([08d38c6](https://github.com/GSTJ/safe-jsx/commit/08d38c619e16d3ca1b1719182d0e7b664562d606))
* **deps:** remediate tooling advisories ([bd0832e](https://github.com/GSTJ/safe-jsx/commit/bd0832e24a977cb1c9edcd7b0c98bfd4a73d5ed1))
* **deps:** routine dev tooling bumps (jest, types/node, typescript-eslint, eslint, oxfmt, pnpm) ([#116](https://github.com/GSTJ/safe-jsx/issues/116)) ([cffeda8](https://github.com/GSTJ/safe-jsx/commit/cffeda8853d9ea877805e81379e228e80f1163b6))
* **deps:** update dependency @types/node to v26.3.0 ([#95](https://github.com/GSTJ/safe-jsx/issues/95)) ([138ea55](https://github.com/GSTJ/safe-jsx/commit/138ea55af7b02249bdca2eade8fb7171454281bb))
* **deps:** update dependency @types/node to v26.4.0 ([#101](https://github.com/GSTJ/safe-jsx/issues/101)) ([0382a18](https://github.com/GSTJ/safe-jsx/commit/0382a181a9ec1c2cb22c267bea3f57bbea486e50))
* **deps:** update dependency @types/node to v26.4.1 ([#106](https://github.com/GSTJ/safe-jsx/issues/106)) ([08a9c12](https://github.com/GSTJ/safe-jsx/commit/08a9c128e367f8ecbc4cf5c9919aa4626ce0368f))
* **deps:** update dependency @types/node to v26.6.3 ([#130](https://github.com/GSTJ/safe-jsx/issues/130)) ([2ee1fa3](https://github.com/GSTJ/safe-jsx/commit/2ee1fa3fc963b8b5f9667499781759a91d37fef1))
* **deps:** update dependency @types/node to v26.6.4 ([#138](https://github.com/GSTJ/safe-jsx/issues/138)) ([383ab68](https://github.com/GSTJ/safe-jsx/commit/383ab685012affe21e1ddb2d66180ac4d50600ee))
* **deps:** update dependency @types/node to v26.6.5 ([#152](https://github.com/GSTJ/safe-jsx/issues/152)) ([19b9a6b](https://github.com/GSTJ/safe-jsx/commit/19b9a6b55d5c943c5f03bfe6831171c4aea1515f))
* **deps:** update dependency @typescript-eslint/parser to v8.68.0 ([#96](https://github.com/GSTJ/safe-jsx/issues/96)) ([4210b1a](https://github.com/GSTJ/safe-jsx/commit/4210b1abf03635cf36dc082730728386d294caeb))
* **deps:** update dependency @typescript-eslint/parser to v8.69.0 ([#105](https://github.com/GSTJ/safe-jsx/issues/105)) ([9ed7db8](https://github.com/GSTJ/safe-jsx/commit/9ed7db8dc6fca07a65ae49db0bb77811c2cc1d8f))
* **deps:** update dependency @typescript-eslint/parser to v8.70.1 ([#121](https://github.com/GSTJ/safe-jsx/issues/121)) ([7df6ca1](https://github.com/GSTJ/safe-jsx/commit/7df6ca1b88144f4aed99b9dbc446bdbeae1ada4a))
* **deps:** update dependency @typescript-eslint/parser to v8.71.0 ([#136](https://github.com/GSTJ/safe-jsx/issues/136)) ([1c16a03](https://github.com/GSTJ/safe-jsx/commit/1c16a035d1a7d69b5c65ce42e038dba6a138fc7e))
* **deps:** update dependency @typescript-eslint/parser to v8.71.1 ([#144](https://github.com/GSTJ/safe-jsx/issues/144)) ([aa609a3](https://github.com/GSTJ/safe-jsx/commit/aa609a3979d26e8daa11f851831acae4992e847b))
* **deps:** update dependency @typescript-eslint/parser to v8.71.2 ([#156](https://github.com/GSTJ/safe-jsx/issues/156)) ([71fc0e3](https://github.com/GSTJ/safe-jsx/commit/71fc0e36969e6961831e1bd0fd8cb00cf278b8b0))
* **deps:** update dependency @typescript-eslint/parser to v8.72.0 ([#165](https://github.com/GSTJ/safe-jsx/issues/165)) ([9a8da7c](https://github.com/GSTJ/safe-jsx/commit/9a8da7c4ec49cf95d74aba85ed28759abeefca97))
* **deps:** update dependency @typescript-eslint/parser to v8.72.1 ([#171](https://github.com/GSTJ/safe-jsx/issues/171)) ([dc399d7](https://github.com/GSTJ/safe-jsx/commit/dc399d7060f08948c6051b68e75a005205f8f5fb))
* **deps:** update dependency conventional-changelog to v8.1.3 ([#84](https://github.com/GSTJ/safe-jsx/issues/84)) ([48046ae](https://github.com/GSTJ/safe-jsx/commit/48046ae324a05a42acbf6275653adee823007397))
* **deps:** update dependency conventional-changelog-conventionalcommits to v10.4.0 ([#89](https://github.com/GSTJ/safe-jsx/issues/89)) ([dd1918a](https://github.com/GSTJ/safe-jsx/commit/dd1918aff30f41a1b72483e47cee565d6b6d28cb))
* **deps:** update dependency conventional-changelog-conventionalcommits to v10.4.1 ([#145](https://github.com/GSTJ/safe-jsx/issues/145)) ([02a7488](https://github.com/GSTJ/safe-jsx/commit/02a74883dba8aaedf59d10996020d5de0ba7b8e0))
* **deps:** update dependency eslint to v10.10.0 ([#107](https://github.com/GSTJ/safe-jsx/issues/107)) ([f411542](https://github.com/GSTJ/safe-jsx/commit/f41154228abe345d1e06f294d70a8a946eb810e4))
* **deps:** update dependency eslint to v10.12.0 ([#139](https://github.com/GSTJ/safe-jsx/issues/139)) ([b1d36a1](https://github.com/GSTJ/safe-jsx/commit/b1d36a189ee98a06090878c36a6f3bc545cfefef))
* **deps:** update dependency eslint to v10.13.0 ([#163](https://github.com/GSTJ/safe-jsx/issues/163)) ([556cb3d](https://github.com/GSTJ/safe-jsx/commit/556cb3d3d2e0525bd4c00aa55f4e8fa80d12660f))
* **deps:** update dependency eslint to v10.9.0 ([#90](https://github.com/GSTJ/safe-jsx/issues/90)) ([0061236](https://github.com/GSTJ/safe-jsx/commit/006123670592bb25822dbd3e1c0cc7185f0cb96d))
* **deps:** update dependency eslint to v10.9.1 ([#93](https://github.com/GSTJ/safe-jsx/issues/93)) ([eb8bfbc](https://github.com/GSTJ/safe-jsx/commit/eb8bfbc8b8a7cdaa3662f62142069dc7f211b3fd))
* **deps:** update dependency glob@>=10 <14 to v14.0.3 ([#176](https://github.com/GSTJ/safe-jsx/issues/176)) ([d97d919](https://github.com/GSTJ/safe-jsx/commit/d97d919293ae9a98f5119d45ce3cc1b923bf43c7))
* **deps:** update dependency jest to v30.5.1 ([#102](https://github.com/GSTJ/safe-jsx/issues/102)) ([a7c93bc](https://github.com/GSTJ/safe-jsx/commit/a7c93bc2400dccc75df93f660f3fd7f06f6ed20b))
* **deps:** update dependency js-yaml@3.15.1 to v5 ([#110](https://github.com/GSTJ/safe-jsx/issues/110)) ([1bf0c4e](https://github.com/GSTJ/safe-jsx/commit/1bf0c4e5d36081b7327fe49496fb85dc287cccea))
* **deps:** update dependency js-yaml@3.15.1 to v5.4.3 ([#146](https://github.com/GSTJ/safe-jsx/issues/146)) ([80759dc](https://github.com/GSTJ/safe-jsx/commit/80759dc776986c9748aa94b9dc9713d9214bb62b))
* **deps:** update dependency js-yaml@3.15.1 to v5.5.0 ([#162](https://github.com/GSTJ/safe-jsx/issues/162)) ([c7636bd](https://github.com/GSTJ/safe-jsx/commit/c7636bdf473b8fd8785b2f91754b90720aa8117c))
* **deps:** update dependency minimatch@>=9 <11 to v11.0.2 ([#177](https://github.com/GSTJ/safe-jsx/issues/177)) ([93f4acc](https://github.com/GSTJ/safe-jsx/commit/93f4acc4309cf54faed0d1037cacc6e631b590be))
* **deps:** update dependency oxfmt to v0.64.0 ([#87](https://github.com/GSTJ/safe-jsx/issues/87)) ([3f2ff41](https://github.com/GSTJ/safe-jsx/commit/3f2ff41a7e49db8769500d892ad5e6605e1d51e1))
* **deps:** update dependency oxfmt to v0.66.0 ([#97](https://github.com/GSTJ/safe-jsx/issues/97)) ([6b5d737](https://github.com/GSTJ/safe-jsx/commit/6b5d737944a6092aa9644d53dbd5739a0a376e92))
* **deps:** update dependency oxfmt to v0.70.0 ([#122](https://github.com/GSTJ/safe-jsx/issues/122)) ([9ca30f2](https://github.com/GSTJ/safe-jsx/commit/9ca30f2e8b8ce0fe5b591b0b72e9f06396f01a03))
* **deps:** update dependency oxfmt to v0.71.0 ([#133](https://github.com/GSTJ/safe-jsx/issues/133)) ([25dd153](https://github.com/GSTJ/safe-jsx/commit/25dd153f64ce6e12ad75592353fb33ce5ac7dad3))
* **deps:** update dependency oxfmt to v0.75.0 ([#173](https://github.com/GSTJ/safe-jsx/issues/173)) ([5d337b0](https://github.com/GSTJ/safe-jsx/commit/5d337b06340ff77893ce60b75ef1f1f1db00feaa))
* **deps:** update dependency oxlint to v1.79.0 ([#88](https://github.com/GSTJ/safe-jsx/issues/88)) ([101b4fc](https://github.com/GSTJ/safe-jsx/commit/101b4fc9d17e5bb47297b7deb7435c1474f3c1ed))
* **deps:** update dependency oxlint to v1.81.0 ([#98](https://github.com/GSTJ/safe-jsx/issues/98)) ([03cee5b](https://github.com/GSTJ/safe-jsx/commit/03cee5b8ef1341a0577f83191ab45708f410a66c))
* **deps:** update dependency oxlint to v1.85.0 ([#123](https://github.com/GSTJ/safe-jsx/issues/123)) ([809c10c](https://github.com/GSTJ/safe-jsx/commit/809c10c8860960d4e4cc3694907fc3688fc345a7))
* **deps:** update dependency oxlint to v1.86.0 ([#134](https://github.com/GSTJ/safe-jsx/issues/134)) ([6ee3e36](https://github.com/GSTJ/safe-jsx/commit/6ee3e367bbcbbda1d69861b17733068393dcea0a))
* **deps:** update dependency oxlint to v1.90.0 ([#174](https://github.com/GSTJ/safe-jsx/issues/174)) ([17c08b3](https://github.com/GSTJ/safe-jsx/commit/17c08b39e52d066417607fc6c55be5f18d070908))
* **deps:** update dependency ts-jest to v29.4.13 ([#126](https://github.com/GSTJ/safe-jsx/issues/126)) ([1450ab2](https://github.com/GSTJ/safe-jsx/commit/1450ab2b36719c97c7756208603da808323dc758))
* **deps:** update dependency ts-jest to v29.4.14 ([#128](https://github.com/GSTJ/safe-jsx/issues/128)) ([08b2760](https://github.com/GSTJ/safe-jsx/commit/08b2760d08dcdaa57ec16b7eb31a8db933850bdc))
* **deps:** update dependency ts-jest to v29.4.15 ([#160](https://github.com/GSTJ/safe-jsx/issues/160)) ([aea925f](https://github.com/GSTJ/safe-jsx/commit/aea925f56d5343b66eb16b15ddc60f1fd3730182))
* **deps:** update github actions ([#149](https://github.com/GSTJ/safe-jsx/issues/149)) ([2acfc24](https://github.com/GSTJ/safe-jsx/commit/2acfc2408e356dd6d5d2d54e04667d9c353cc168))
* **deps:** update github/codeql-action digest to 1c5b675 ([#115](https://github.com/GSTJ/safe-jsx/issues/115)) ([66064e0](https://github.com/GSTJ/safe-jsx/commit/66064e01e826227264824d16a4d2ea5d84626214))
* **deps:** update gstj/magic action to v1.19.6 ([#85](https://github.com/GSTJ/safe-jsx/issues/85)) ([5683b08](https://github.com/GSTJ/safe-jsx/commit/5683b08d79b2950559f2ee8fd08721d73f8282d0))
* **deps:** update gstj/magic action to v1.19.7 ([#94](https://github.com/GSTJ/safe-jsx/issues/94)) ([e08a569](https://github.com/GSTJ/safe-jsx/commit/e08a569594c628e063cfaa7ea1b9001a83ede945))
* **deps:** update gstj/magic action to v1.19.8 ([#109](https://github.com/GSTJ/safe-jsx/issues/109)) ([87a61f0](https://github.com/GSTJ/safe-jsx/commit/87a61f0859db9844f8f30a16c98e8b3f77665ab7))
* **deps:** update gstj/magic action to v1.19.9 ([#112](https://github.com/GSTJ/safe-jsx/issues/112)) ([d794399](https://github.com/GSTJ/safe-jsx/commit/d794399fb50938f1f08885ed0ce4edfc3c70609e))
* **deps:** update gstj/magic action to v2 ([#113](https://github.com/GSTJ/safe-jsx/issues/113)) ([fab79b4](https://github.com/GSTJ/safe-jsx/commit/fab79b4eb896205ced08a840c8fcbb593d9ef894))
* **deps:** update gstj/magic action to v2.0.3 ([#127](https://github.com/GSTJ/safe-jsx/issues/127)) ([aba7882](https://github.com/GSTJ/safe-jsx/commit/aba7882d97f9f28fe937b2a829f7215a0356e9ea))
* **deps:** update gstj/magic action to v2.0.4 ([#147](https://github.com/GSTJ/safe-jsx/issues/147)) ([650820d](https://github.com/GSTJ/safe-jsx/commit/650820db8a2ca2da924ed2797b9604c53ecc8ddc))
* **deps:** update gstj/magic action to v2.0.5 ([#164](https://github.com/GSTJ/safe-jsx/issues/164)) ([07be5de](https://github.com/GSTJ/safe-jsx/commit/07be5de719b3239ca86eb2abd13358b1550dd98d))
* **deps:** update oxfmt to v0.73.0 ([0df19f2](https://github.com/GSTJ/safe-jsx/commit/0df19f26a72312c3eb068d6d5c0ae4f2239e8d01))
* **deps:** update oxfmt to v0.74.0 ([e01471a](https://github.com/GSTJ/safe-jsx/commit/e01471a7fa6874c1a1f92cd11dd496f00130b8f1))
* **deps:** update oxlint to v1.88.0 ([defb63e](https://github.com/GSTJ/safe-jsx/commit/defb63e4486cf1702dbb62e3319c87ed721e1f3a))
* **deps:** update oxlint to v1.89.0 ([ce7054c](https://github.com/GSTJ/safe-jsx/commit/ce7054c5458cdce725cf8c44ec136a890da4ff12))
* **deps:** update pnpm to v11.22.0 ([#86](https://github.com/GSTJ/safe-jsx/issues/86)) ([4d54e72](https://github.com/GSTJ/safe-jsx/commit/4d54e72cab97d7b4c209f04f43f90b3f68d199e4))
* **deps:** update pnpm to v11.23.0 ([#91](https://github.com/GSTJ/safe-jsx/issues/91)) ([f3cd8f1](https://github.com/GSTJ/safe-jsx/commit/f3cd8f1b52bff5e7eb94d4c241e611a0d39f9079))
* **deps:** update pnpm to v11.24.0 ([#99](https://github.com/GSTJ/safe-jsx/issues/99)) ([6f12d86](https://github.com/GSTJ/safe-jsx/commit/6f12d86c88f87d38fd70f949eff5ce6027edba9c))
* **deps:** update pnpm to v11.25.0 ([#103](https://github.com/GSTJ/safe-jsx/issues/103)) ([46cac6d](https://github.com/GSTJ/safe-jsx/commit/46cac6d7e468f43cd917441a6e4015211e0a5028))
* **deps:** update pnpm to v12 ([#100](https://github.com/GSTJ/safe-jsx/issues/100)) ([126deca](https://github.com/GSTJ/safe-jsx/commit/126deca5c75602fe60a175c9f60b6ee166deeeb0))
* **deps:** update pnpm to v12.10.1 ([#148](https://github.com/GSTJ/safe-jsx/issues/148)) ([79389b6](https://github.com/GSTJ/safe-jsx/commit/79389b63f65a00f1ba0094a4140244c359f11c94))
* **deps:** update pnpm to v12.11.2 ([#151](https://github.com/GSTJ/safe-jsx/issues/151)) ([794caad](https://github.com/GSTJ/safe-jsx/commit/794caade2795ddce7e8bb73abb0f3c19bc639084))
* **deps:** update pnpm to v12.12.0 ([#153](https://github.com/GSTJ/safe-jsx/issues/153)) ([fe9c5d2](https://github.com/GSTJ/safe-jsx/commit/fe9c5d2269186d08130cdb806e8c73bb211b636c))
* **deps:** update pnpm to v12.12.1 ([#154](https://github.com/GSTJ/safe-jsx/issues/154)) ([63741a0](https://github.com/GSTJ/safe-jsx/commit/63741a0b0353324aa830e6f3105a7371d09a64ea))
* **deps:** update pnpm to v12.13.0 ([#157](https://github.com/GSTJ/safe-jsx/issues/157)) ([0e1d517](https://github.com/GSTJ/safe-jsx/commit/0e1d517baae0df8156f9997d99b35885817afde4))
* **deps:** update pnpm to v12.14.0 ([#161](https://github.com/GSTJ/safe-jsx/issues/161)) ([60b6c02](https://github.com/GSTJ/safe-jsx/commit/60b6c025c1bc39edbab3c17585be54e0185d5bc8))
* **deps:** update pnpm to v12.15.0 ([7503e97](https://github.com/GSTJ/safe-jsx/commit/7503e97475945b08045faa9baba05754612522e0))
* **deps:** update pnpm to v12.16.0 ([#172](https://github.com/GSTJ/safe-jsx/issues/172)) ([70f55b7](https://github.com/GSTJ/safe-jsx/commit/70f55b7260896a630c21e0dcc6c9c389bd73aee8))
* **deps:** update pnpm to v12.16.1 ([#175](https://github.com/GSTJ/safe-jsx/issues/175)) ([8416fd0](https://github.com/GSTJ/safe-jsx/commit/8416fd09504abe021c6664a595e8ffa344713767))
* **deps:** update pnpm to v12.6.0 ([#125](https://github.com/GSTJ/safe-jsx/issues/125)) ([57e7169](https://github.com/GSTJ/safe-jsx/commit/57e716902214ecaa85d70d6ab065396e986630ba))
* **deps:** update pnpm to v12.7.0 ([#129](https://github.com/GSTJ/safe-jsx/issues/129)) ([d15cf72](https://github.com/GSTJ/safe-jsx/commit/d15cf72ea435ba13925cd0198bba1b2fa0c9a8ae))
* **deps:** update pnpm to v12.8.0 ([#132](https://github.com/GSTJ/safe-jsx/issues/132)) ([ecd224e](https://github.com/GSTJ/safe-jsx/commit/ecd224ef58c7d6ecde09beea8045fdfaf8422ba7))
* **deps:** update pnpm to v12.8.1 ([#135](https://github.com/GSTJ/safe-jsx/issues/135)) ([72897b6](https://github.com/GSTJ/safe-jsx/commit/72897b6d85e484e205a70c0ae7beb496a33f18fa))
* **deps:** update pnpm to v12.8.2 ([#137](https://github.com/GSTJ/safe-jsx/issues/137)) ([01a97b6](https://github.com/GSTJ/safe-jsx/commit/01a97b63b1fca570bba8bb1b0a38a1d65d46c509))
* **deps:** update pnpm to v12.9.0 ([#140](https://github.com/GSTJ/safe-jsx/issues/140)) ([cf6ccbf](https://github.com/GSTJ/safe-jsx/commit/cf6ccbf04891d42833760de83cc6ed991ccd1895))
* **deps:** update pnpm to v12.9.1 ([#141](https://github.com/GSTJ/safe-jsx/issues/141)) ([0aa576a](https://github.com/GSTJ/safe-jsx/commit/0aa576a730807c7af237f3c61ac728b3f24586f6))
* restore pnpm-workspace.yaml comments dropped by renovate's override bump ([#111](https://github.com/GSTJ/safe-jsx/issues/111)) ([e88a550](https://github.com/GSTJ/safe-jsx/commit/e88a550f88014dcc6e2cb6abe4466bc8e6e053a6)), references [#110](https://github.com/GSTJ/safe-jsx/issues/110)

### Documentation

* link the author's apps at the end of the README ([#158](https://github.com/GSTJ/safe-jsx/issues/158)) ([f8b2518](https://github.com/GSTJ/safe-jsx/commit/f8b2518ceb3c2d2b9b9d6f2040af0ada2cb40d21))

## [1.3.9](https://github.com/GSTJ/safe-jsx/compare/v1.3.8...v1.3.9) (2026-08-31)

### Bug Fixes

* **release:** fail closed on local tooling ([#77](https://github.com/GSTJ/safe-jsx/issues/77)) ([13b117b](https://github.com/GSTJ/safe-jsx/commit/13b117b450adf374602143b2afbfb015e4a5a8b0))
* **release:** isolate npm publish credentials ([#82](https://github.com/GSTJ/safe-jsx/issues/82)) ([b10d395](https://github.com/GSTJ/safe-jsx/commit/b10d3958c44d9a137f94c0a5d9e72a8eaae94f4d))
* **rule:** close mutable boolean bypasses ([#81](https://github.com/GSTJ/safe-jsx/issues/81)) ([481ccdc](https://github.com/GSTJ/safe-jsx/commit/481ccdc3d15c91e6aff073e98808842a0fd73f40))

### Chores

* **deps:** refresh eligible tooling ([#79](https://github.com/GSTJ/safe-jsx/issues/79)) ([49d33f1](https://github.com/GSTJ/safe-jsx/commit/49d33f1c5d36609348d61c7526fff6c0c7ecd2e2))
* **deps:** update magic tooling ([#74](https://github.com/GSTJ/safe-jsx/issues/74)) ([3bfe8d0](https://github.com/GSTJ/safe-jsx/commit/3bfe8d05a928bc8dc472da6ebd9b7356e8a6e524))
* **deps:** update magic tooling ([#78](https://github.com/GSTJ/safe-jsx/issues/78)) ([c0a6cbf](https://github.com/GSTJ/safe-jsx/commit/c0a6cbf292f18c84760a0ada68ec79ae2d86b0cf))
* **deps:** update magic tooling ([#80](https://github.com/GSTJ/safe-jsx/issues/80)) ([cbc0f64](https://github.com/GSTJ/safe-jsx/commit/cbc0f64bd779c8cdd021b83fc69ff2b9160ec5c1))

## [1.3.8](https://github.com/GSTJ/safe-jsx/compare/v1.3.7...v1.3.8) (2026-08-05)

### Bug Fixes

* **package:** correct the Node engine floor ([#72](https://github.com/GSTJ/safe-jsx/issues/72)) ([fe09789](https://github.com/GSTJ/safe-jsx/commit/fe0978959e9b3f1b92bb66dae5fe7fb28ab3fd99))

### Chores

* **deps:** lock file maintenance ([#70](https://github.com/GSTJ/safe-jsx/issues/70)) ([59d86c3](https://github.com/GSTJ/safe-jsx/commit/59d86c32e328879be750750ac02035d76be03bda))
* **deps:** quarantine new releases for 14 days ([#71](https://github.com/GSTJ/safe-jsx/issues/71)) ([93dfff1](https://github.com/GSTJ/safe-jsx/commit/93dfff1a3191815877089beb7e838fac1b3a5cdb))
* **deps:** update dependency @typescript-eslint/parser to v8.66.0 ([#67](https://github.com/GSTJ/safe-jsx/issues/67)) ([e58969d](https://github.com/GSTJ/safe-jsx/commit/e58969d2567103aa91a38363521606e494dd5605))
* **deps:** update github actions ([#65](https://github.com/GSTJ/safe-jsx/issues/65)) ([d5fe3b1](https://github.com/GSTJ/safe-jsx/commit/d5fe3b1504fad966ffdf2d8b4cb7fde8c11f0068))
* **deps:** update magic tooling ([#66](https://github.com/GSTJ/safe-jsx/issues/66)) ([35be0bd](https://github.com/GSTJ/safe-jsx/commit/35be0bd931c3e437aad1110fc7836c8cb42d63a7))
* **deps:** update oxc toolchain ([#68](https://github.com/GSTJ/safe-jsx/issues/68)) ([c61ec9e](https://github.com/GSTJ/safe-jsx/commit/c61ec9e0e6f8b04c0055057c4378e5c3ec284449))
* **deps:** update pnpm to v11.20.0 ([#69](https://github.com/GSTJ/safe-jsx/issues/69)) ([3bb5ce0](https://github.com/GSTJ/safe-jsx/commit/3bb5ce09f197d36c34924342b7580f0da967eb47))

## [1.3.7](https://github.com/GSTJ/safe-jsx/compare/v1.3.6...v1.3.7) (2026-08-04)

### Bug Fixes

* **jsx-explicit-boolean:** bound boolean evidence traversal ([#61](https://github.com/GSTJ/safe-jsx/issues/61)) ([4fc3c98](https://github.com/GSTJ/safe-jsx/commit/4fc3c984e23837a36ffd6e48e017808d60c3d124))

### Chores

* **deps:** lock file maintenance ([#58](https://github.com/GSTJ/safe-jsx/issues/58)) ([1c557ca](https://github.com/GSTJ/safe-jsx/commit/1c557cae041e540a9113cb39cd6595dbf324e1ae))
* **deps:** patch brace-expansion ([#54](https://github.com/GSTJ/safe-jsx/issues/54)) ([523cb0b](https://github.com/GSTJ/safe-jsx/commit/523cb0b9694092a407845977fc6c0db12e7b7629))
* **deps:** update dependency @types/node to v26.1.2 ([#50](https://github.com/GSTJ/safe-jsx/issues/50)) ([51d1658](https://github.com/GSTJ/safe-jsx/commit/51d165866e32d95dd4ee54877181a845fb757adc))
* **deps:** update dependency magic-oxlint-config to v2 ([#52](https://github.com/GSTJ/safe-jsx/issues/52)) ([e267289](https://github.com/GSTJ/safe-jsx/commit/e26728997b64a47d17ed059c5e9cfb6e975404fe))
* **deps:** update oxc toolchain ([#51](https://github.com/GSTJ/safe-jsx/issues/51)) ([c663647](https://github.com/GSTJ/safe-jsx/commit/c663647626e6f97c7c61f6245120ac5190a6fd1a))
* **deps:** update pnpm to v11.18.0 ([#53](https://github.com/GSTJ/safe-jsx/issues/53)) ([af4d497](https://github.com/GSTJ/safe-jsx/commit/af4d4979bcb37e43b21a19f1cbde95d245c021f7))
* **deps:** update pnpm to v11.19.0 ([#59](https://github.com/GSTJ/safe-jsx/issues/59)) ([6e0b5e1](https://github.com/GSTJ/safe-jsx/commit/6e0b5e1dfe18aefdccf62c615a6546f7dbc374af))
* **deps:** update pnpm/action-setup action to v6 ([#62](https://github.com/GSTJ/safe-jsx/issues/62)) ([2780bc7](https://github.com/GSTJ/safe-jsx/commit/2780bc7ee3c735b8a4bdb40dad8a2128a14ef4fe))
* **renovate:** keep overrides within major ([#57](https://github.com/GSTJ/safe-jsx/issues/57)) ([a7620f7](https://github.com/GSTJ/safe-jsx/commit/a7620f7a1229ef96abbf36819ab63133608db275))

## [1.3.6](https://github.com/GSTJ/safe-jsx/compare/v1.3.5...v1.3.6) (2026-07-28)

### Bug Fixes

* **jsx-explicit-boolean:** stop trusting a shadowed Boolean ([#49](https://github.com/GSTJ/safe-jsx/issues/49)) ([d140eb5](https://github.com/GSTJ/safe-jsx/commit/d140eb5de0f02c99aa766c6713090c9d57bbde92))

## [1.3.5](https://github.com/GSTJ/safe-jsx/compare/v1.3.4...v1.3.5) (2026-07-28)

### Build System

* rewrite the security policy and ship it in the tarball ([#47](https://github.com/GSTJ/safe-jsx/issues/47)) ([78bc88f](https://github.com/GSTJ/safe-jsx/commit/78bc88f7791cda50b63fd6e2ce84aaa13accb8ff))

### Chores

* drop the npmignore leftovers from [#44](https://github.com/GSTJ/safe-jsx/issues/44) ([#46](https://github.com/GSTJ/safe-jsx/issues/46)) ([00cc4d9](https://github.com/GSTJ/safe-jsx/commit/00cc4d904ab8a900221a1d2e16b91439bcc47df1))

## [1.3.4](https://github.com/GSTJ/safe-jsx/compare/v1.3.3...v1.3.4) (2026-07-28)

### Build System

* keep CHANGELOG.md in the published tarball ([#45](https://github.com/GSTJ/safe-jsx/issues/45)) ([487f5ef](https://github.com/GSTJ/safe-jsx/commit/487f5ef40ddec413d22a647930a6c95bf6e41439)), references [#44](https://github.com/GSTJ/safe-jsx/issues/44)

## [1.3.3](https://github.com/GSTJ/safe-jsx/compare/v1.3.2...v1.3.3) (2026-07-28)

### Build System

* make the eslint peer optional ([b0c36cb](https://github.com/GSTJ/safe-jsx/commit/b0c36cba0c2b47cc1b529aae2ac50e95f0961a69))
* publish with npm's files field instead of npmignore ([b49634e](https://github.com/GSTJ/safe-jsx/commit/b49634e4848350548ad3847e77462d68eb8303fd))

## [1.3.2](https://github.com/GSTJ/safe-jsx/compare/v1.3.1...v1.3.2) (2026-07-28)

### Bug Fixes

* **deps:** make the eslint peer optional ([0f89f8a](https://github.com/GSTJ/safe-jsx/commit/0f89f8a986749f8c3e46a95b62f2559dc1b849ce))

### Chores

* **changelog:** render the types that can change the tarball ([8303da9](https://github.com/GSTJ/safe-jsx/commit/8303da983839255670aa76a74d5eecff846db00f))

### Documentation

* **contributing:** say which commit types reach the changelog ([32ca7f9](https://github.com/GSTJ/safe-jsx/commit/32ca7f99e0feeb83fa803d75d9e78ff518970862))

## [1.3.1](https://github.com/GSTJ/safe-jsx/compare/v1.3.0...v1.3.1) (2026-07-28)

### Bug Fixes

* **release:** stop running oxfmt over the generated CHANGELOG ([0abd1fe](https://github.com/GSTJ/safe-jsx/commit/0abd1fe55f6e883e09a8474dc5eb99d37e086c84))

### Build System

* drop the dev tsconfig from the tarball ([4c41336](https://github.com/GSTJ/safe-jsx/commit/4c413366e289183aca0cb525071aac656f7eeb18))
* drop the incremental workaround ([b47fc38](https://github.com/GSTJ/safe-jsx/commit/b47fc38afe36b2e59d2ba16b636c127a5863e990))
* keep dev config out of the tarball and fix the incremental build ([4c4b2a0](https://github.com/GSTJ/safe-jsx/commit/4c4b2a0c543e6b6b99f4266da717ee25dcefa6f3))

### Code Refactoring

* **rules:** make LegacyRuleContext a type alias ([4255fe3](https://github.com/GSTJ/safe-jsx/commit/4255fe3b951a81e66b83fa18c4d61bd9c7cb2e75))
* type the plugin sources against the strict shared tsconfig ([0bc750f](https://github.com/GSTJ/safe-jsx/commit/0bc750f73b521dda2e4eb644a3e0523fe6a3aba2))

### Chores

* **changelog:** rebuild in the generator's own bullet style ([0f15905](https://github.com/GSTJ/safe-jsx/commit/0f15905c891d68ce524646877263b4a904db7c5e))
* **config:** adopt the magic oxlint, oxfmt and tsconfig presets ([9423539](https://github.com/GSTJ/safe-jsx/commit/9423539818b9d53d20f82e6e86958997fc4378b7))
* **config:** build the lint config with extendConfig ([df8f17f](https://github.com/GSTJ/safe-jsx/commit/df8f17f644787744fd714018a5de786b08cbc92e))
* **deps:** move the magic stack to 1.1.0 ([55f8751](https://github.com/GSTJ/safe-jsx/commit/55f87518849789dde154fc55c2b119e144399a8e))
* **deps:** move the magic stack to 1.2.0 ([008b298](https://github.com/GSTJ/safe-jsx/commit/008b298024171fae03e1ef2f6da38ed2abd11f6d))
* **deps:** move to pnpm and swap eslint/prettier tooling for the magic stack ([faceee1](https://github.com/GSTJ/safe-jsx/commit/faceee1310e32e5f4bf91ec3b6122c4e3db0adee))
* **deps:** replace the deprecated conventional-changelog-cli ([27f1e1e](https://github.com/GSTJ/safe-jsx/commit/27f1e1edb5ccaf1f6436e680ea37044eb56754fa)), references [#33](https://github.com/GSTJ/safe-jsx/issues/33)
* **renovate:** say what actually sets the typescript ceiling ([11a0f20](https://github.com/GSTJ/safe-jsx/commit/11a0f20f90cc1b4706e3542b99d82c73120dd9c6))

### Documentation

* **config:** correct why this config uses extendConfig ([2fc12b3](https://github.com/GSTJ/safe-jsx/commit/2fc12b383bc9d92ac3c4169dc42b20d5c2fa5410))
* **config:** say why the eslint-plugin meta rules are not wired up ([9cef61c](https://github.com/GSTJ/safe-jsx/commit/9cef61c8d6c185e555362a94b97872f9c68966fe))

## [1.3.0](https://github.com/GSTJ/safe-jsx/compare/v1.2.0...v1.3.0) (2026-07-27)

### Bug Fixes

* **changelog:** generate from conventional commits and backfill the history ([#37](https://github.com/GSTJ/safe-jsx/issues/37)) ([7d15caf](https://github.com/GSTJ/safe-jsx/commit/7d15cafc495d0867820a3c0a6548b0016c868b06))
* **jsx-explicit-boolean:** five soundness bugs in the boolean check ([#36](https://github.com/GSTJ/safe-jsx/issues/36)) ([7f0ba25](https://github.com/GSTJ/safe-jsx/commit/7f0ba25a535d2c74f2ef8331cdd1511df2c0647c))

## [1.2.0](https://github.com/GSTJ/safe-jsx/compare/v1.1.0...v1.2.0) (2026-07-25)

## [1.1.0](https://github.com/GSTJ/safe-jsx/compare/v1.0.5...v1.1.0) (2023-05-13)

### Features

* don't give false positives when dealing with BinaryExpressions on an && operator ([a19fe02](https://github.com/GSTJ/safe-jsx/commit/a19fe027ae81e4e78c1fd8fa644490261a85c91b))
* make it faster, more reliable and mantainable by refactoring and removing code duplication ([3f4eefd](https://github.com/GSTJ/safe-jsx/commit/3f4eefdb56cb2e2faf7674aa096e51e6e124f678))
* purge false-positives ([104d3ab](https://github.com/GSTJ/safe-jsx/commit/104d3ab1a98a320009944f4d5adf634e65908f74))
* purge more tiny edge-cases and add tests to ensure they don't break ([d091787](https://github.com/GSTJ/safe-jsx/commit/d091787937ab2a4f1ee60ce3eda5d6e010654bfd))

### Bug Fixes

* add recursiviness to checkBooleanValidity to account for more than two variables ([d35a9a9](https://github.com/GSTJ/safe-jsx/commit/d35a9a93f5f0ab6326f173260386d73733810b59))
* understand single negation ! boolean conversion ([c991668](https://github.com/GSTJ/safe-jsx/commit/c991668fe8a20fa7aeade4563bc9a8df11ea17de))
* use module.exports to fix eslint plugin usage ([0d879e9](https://github.com/GSTJ/safe-jsx/commit/0d879e9827391b124b4ce4d221aa37abf6b323e8))

## [1.0.5](https://github.com/GSTJ/safe-jsx/compare/v1.0.3...v1.0.5) (2023-05-12)

### Features

* support new boolean constructor, support !! operator as a valid boolean conversion ([06dfa64](https://github.com/GSTJ/safe-jsx/commit/06dfa649cdf8d44118ea5cde1d0f83d6faed253e))

## [1.0.3](https://github.com/GSTJ/safe-jsx/compare/v1.0.1...v1.0.3) (2023-05-12)

### Features

* make it faster with early returns ⚡️ ([d86a810](https://github.com/GSTJ/safe-jsx/commit/d86a81054d8974970358b29113658a577a7d5725))

## [1.0.1](https://github.com/GSTJ/safe-jsx/compare/b63886caa8a02664177a6c0e71181e1300f6c5be...v1.0.1) (2023-05-12)

### Bug Fixes

* make it usable ([b63886c](https://github.com/GSTJ/safe-jsx/commit/b63886caa8a02664177a6c0e71181e1300f6c5be))

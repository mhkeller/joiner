Changelog
===

# 2.1.2

> 2017-03-14

Slight reorganization, add `module` field to package.json. Skipped 2.1.2 because of error in version number in dist file comments. Functionally identical.

* See above
  * [eccfa17eba838b9358831a603f8cfb22055f6ac0](https://github.com/mhkeller/joiner/commit/eccfa17eba838b9358831a603f8cfb22055f6ac0)

# 2.1.0

> 2017-02-25

Move to rollup build process, export browser version and some small cleanup

* Rollup
  * [dddf7719845013930fab1c06b36ca4e216f44f38](https://github.com/mhkeller/joiner/commit/dddf7719845013930fab1c06b36ca4e216f44f38)
  * [51b590f0f42abfbbc10246fe89fae13339addd0e](https://github.com/mhkeller/joiner/commit/51b590f0f42abfbbc10246fe89fae13339addd0e)
  * [6d5b0b056a7d63281ccd9bdf667685b94d91585a](https://github.com/mhkeller/joiner/commit/6d5b0b056a7d63281ccd9bdf667685b94d91585a)
* Browser version
  * [a61d3a19f688af9543dfc10752212275fd48e092](https://github.com/mhkeller/joiner/commit/a61d3a19f688af9543dfc10752212275fd48e092)
  * Some extra tests for sort order on object props now that we're using Object.assign shim and not underscore's extend
  * [f861d072c27691b6dc7b9ac9c7e37d77af490733](https://github.com/mhkeller/joiner/commit/f861d072c27691b6dc7b9ac9c7e37d77af490733)
  * [a9ac8b157bef43f94d321e4e20ba7896747d99db](https://github.com/mhkeller/joiner/commit/a9ac8b157bef43f94d321e4e20ba7896747d99db)
  * [a9ac8b157bef43f94d321e4e20ba7896747d99db](https://github.com/mhkeller/joiner/commit/a9ac8b157bef43f94d321e4e20ba7896747d99db)
* Sort keys in example comments
  * [14b2b64060fd280e03da3b75f5d007eb675bf58b](https://github.com/mhkeller/joiner/commit/14b2b64060fd280e03da3b75f5d007eb675bf58b)

# 2.0.0

> 2017-02-14

Another rework of the API focused on clarity between json, geojson and nested variables. Much better and clearer support for targeting nested keys and adding results to a nested key through lodash's `get` and `set`. Started maintaining changelog. Remove indian-ocean dependency and include browser-safe portions.

* Add many more test cases and some bug fixes to dbf reading and writing
  * [0fac3167d9e226925ccadb86a7735b33bda9afb2](https://github.com/mhkeller/joiner/commit/0fac3167d9e226925ccadb86a7735b33bda9afb2)
  * [09a5b07964be04fcad5230cabb102f7d507cdb0a](https://github.com/mhkeller/joiner/commit/09a5b07964be04fcad5230cabb102f7d507cdb0a)
  * [0cce72ef36b142ab654ef469c69853e7c6de8080](https://github.com/mhkeller/joiner/commit/0cce72ef36b142ab654ef469c69853e7c6de8080)
  * [629f7b4e8ece8c05f2be967565e936626163607d](https://github.com/mhkeller/joiner/commit/629f7b4e8ece8c05f2be967565e936626163607d)
  * [e278ba88e033d9b9682f36a19d62082198a3b206](https://github.com/mhkeller/joiner/commit/e278ba88e033d9b9682f36a19d62082198a3b206)
* Remove dependency on indian-ocean for easier browser-compatibility and lighter-weight.
  * [d246c7cacbf74caf58b8b28bcbbe66734d65df27](https://github.com/mhkeller/joiner/commit/d246c7cacbf74caf58b8b28bcbbe66734d65df27)
  * [d246c7cacbf74caf58b8b28bcbbe66734d65df27](https://github.com/mhkeller/joiner/commit/d246c7cacbf74caf58b8b28bcbbe66734d65df27)
  * [104a89ee72e3024743845594b36356c44f91cf7b](https://github.com/mhkeller/joiner/commit/104a89ee72e3024743845594b36356c44f91cf7b)
  * [632b99c77aeba47ccaf7cad593a8a7708ffa57d4](https://github.com/mhkeller/joiner/commit/632b99c77aeba47ccaf7cad593a8a7708ffa57d4)
  * [590f7b85c78ccaf89a30ddb2c234c51d45b6b692](https://github.com/mhkeller/joiner/commit/590f7b85c78ccaf89a30ddb2c234c51d45b6b692)
* Sort keys in the report
  * [f80344a4eb8b3a6f29861969b6f712c8108ae16b](https://github.com/mhkeller/joiner/commit/f80344a4eb8b3a6f29861969b6f712c8108ae16b)
* Drop support for node 2 and below
  * [765f094c691e53c32ca26db5c51e99e0c3c6eaa1](https://github.com/mhkeller/joiner/commit/765f094c691e53c32ca26db5c51e99e0c3c6eaa1)
  * [558d972824b08d9733a134b8d5fa1ba73c9af760](https://github.com/mhkeller/joiner/commit/558d972824b08d9733a134b8d5fa1ba73c9af760)
  * [0c21638ff5c61b4ed28858259818da797763e6e1](https://github.com/mhkeller/joiner/commit/0c21638ff5c61b4ed28858259818da797763e6e1)

# 1.0.1

> 2017-01-08

Minor fixes

* Fix dependencies and test command in package.json
  * [43671fe3489f9271fc976e6563ebe7ebd0973640](https://github.com/mhkeller/joiner/commit/43671fe3489f9271fc976e6563ebe7ebd0973640)
* SEO
  * [482bb3fb572a3b79c20d362828d1ffc801cdb739](https://github.com/mhkeller/joiner/commit/482bb3fb572a3b79c20d362828d1ffc801cdb739)


# 1.0.0

> 2017-01-08

Major overhaul of API including adding tests.

* Switch to a config-based API
  * [ba7b7f413b70cd508bf539dc6d3fe6f9bdd483fc](https://github.com/mhkeller/joiner/commit/ba7b7f413b70cd508bf539dc6d3fe6f9bdd483fc)
  * [9255f1328f4999db4df671a584fe49cb76cf13ac](https://github.com/mhkeller/joiner/commit/9255f1328f4999db4df671a584fe49cb76cf13ac)
* Deep clone passed in objects
  * [397d34ff22ee148d613fdc9b47bcc567a532e375](https://github.com/mhkeller/joiner/commit/397d34ff22ee148d613fdc9b47bcc567a532e375)
* Dbf support
  * [421864889fde07a17693e1c27c86cd13478635f8](https://github.com/mhkeller/joiner/commit/421864889fde07a17693e1c27c86cd13478635f8)
  * [2e2b1572c12135d05097066bf0872ae1dd120973](https://github.com/mhkeller/joiner/commit/2e2b1572c12135d05097066bf0872ae1dd120973)
* Tests and CI
  * [397d34ff22ee148d613fdc9b47bcc567a532e375](https://github.com/mhkeller/joiner/commit/397d34ff22ee148d613fdc9b47bcc567a532e375)
  * [2cc9230f60a3a21386aef2cb4f55aedd135f8d5d](https://github.com/mhkeller/joiner/commit/2cc9230f60a3a21386aef2cb4f55aedd135f8d5d)


# 0.4.2

> 2015-01-11

Initial commit. We'll start from here

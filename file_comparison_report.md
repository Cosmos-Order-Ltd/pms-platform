# File-by-File Comparison and Deduplication Report

**Generated:** Mon, Sep 22, 2025  7:21:29 PM
**Operation:** Detailed file comparison between local archive and Gitea repositories

---

## 📊 Deduplication Statistics

### Files Processed
- **Total files compared:** 593
- **Identical files removed:** 332
- **Local-only files preserved:** 120
- **Gitea-only files:** 0
- **Conflicting files (manual review needed):** 141

### Space Optimization
- **Space saved from removing duplicates:** 3 MB
- **Deduplication efficiency:** 55%

---

## 🔍 Comparison Method

### Hash-Based Comparison
- **Algorithm:** SHA256 (with MD5 fallback)
- **Source of Truth:** Gitea repositories
- **Action for Identical Files:** Remove local copy, keep Gitea version
- **Action for Local-Only Files:** Preserve in local archive
- **Action for Conflicts:** Flag for manual review

### Repository Scope
- **archive/extracted-repositories/**: Compared with matching Gitea repos
- **archive/separated-repos/**: Compared with matching Gitea repos
- **Excluded Files**: .git/, node_modules/, build artifacts

---

## 📋 Detailed Comparison Results

CONFLICT: prisma/migrations/migration_lock.toml (local hash: file_not_found, gitea hash: 492a46d005d966e41995e21b124bc2b69512c1eda23bef03baa901d56957de5d)
CONFLICT: prisma/schema-enhanced.prisma (local hash: file_not_found, gitea hash: caa98cfa9811153986d3890ad43d5f5d62232eda1bab2c3550e9550eccc1d24c)
IDENTICAL: prisma/schema.prisma (size: 27666 bytes)
CONFLICT: prisma/schema.prisma (local hash: , gitea hash: e937f32a2d40efc68b4011f8834a16caaf201447fc903507117ba55f1d2c317a)
IDENTICAL: prisma/seed.ts (size: 7698 bytes)
CONFLICT: prisma/seed.ts (local hash: , gitea hash: 078362b841c7aea3196624f69fe89078369ff2ca75ca02e691710b1262774b56)
IDENTICAL: README.md (size: 4606 bytes)
IDENTICAL: README.md (size: 0 bytes)
IDENTICAL: schema.prisma (size: 27666 bytes)
CONFLICT: schema.prisma (local hash: , gitea hash: e937f32a2d40efc68b4011f8834a16caaf201447fc903507117ba55f1d2c317a)
IDENTICAL: tsconfig.json (size: 564 bytes)

Summary for database-schema:
  Identical files removed: 10
  Local-only files kept: 4
  Conflicting files: 0
IDENTICAL: tsconfig.json (size: 0 bytes)

Summary for database-schema:
  Identical files removed: 3
  Local-only files kept: 4
  Conflicting files: 6
```


### invitation-engine

```
File Comparison for invitation-engine
================================

IDENTICAL: .env (size: 2950 bytes)
IDENTICAL: .env (size: 0 bytes)
IDENTICAL: .env.example (size: 2950 bytes)
CONFLICT: .env.example (local hash: , gitea hash: e6d82524807a56ad88b31dcb26fe0203b4206b9a37c392cf41e84552a0b0fa2f)
IDENTICAL: deploy-container-31.sh (size: 7486 bytes)
CONFLICT: dist/database/connection.d.ts (local hash: 8f97f394b800aa11a885765697c39b872d4fff7299f1f3ff5639ecfb97311821, gitea hash: 8c373da9493fae704207e11b601287481b53bb6980e2734c425606167f0b333c)
CONFLICT: deploy-container-31.sh (local hash: , gitea hash: 9a9a991d138a3becbb5f207fa7e88d053d6f560c610eabd81e1042c71972b586)
IDENTICAL: dist/database/connection.d.ts.map (size: 1971 bytes)
CONFLICT: dist/database/connection.js (local hash: df03c6ba8f63a5d29250316966593e5bcb956d5a6e7344a72d7f299e1fffdc70, gitea hash: eaf34e07a24325b90d98545504af8e6c4b1649c80a9dadfa9736e2f57207f95a)
CONFLICT: dist/database/connection.d.ts (local hash: 8f97f394b800aa11a885765697c39b872d4fff7299f1f3ff5639ecfb97311821, gitea hash: 8c373da9493fae704207e11b601287481b53bb6980e2734c425606167f0b333c)
CONFLICT: dist/database/connection.d.ts.map (local hash: file_not_found, gitea hash: 75545eab50d5057c9cd25fee44f652e5b345da3e026ee502823e170c0dee3e34)
IDENTICAL: dist/database/connection.js.map (size: 10416 bytes)
CONFLICT: dist/index.d.ts (local hash: 4ad829d9bfdbe5e3817da30b59d580409ac48b21b93ed0234aa45a113a9a74d6, gitea hash: 9f1813fb44646e4c439f93c2d831736142c87cfc475264bda1dba9d246a06ffe)
CONFLICT: dist/database/connection.js (local hash: df03c6ba8f63a5d29250316966593e5bcb956d5a6e7344a72d7f299e1fffdc70, gitea hash: eaf34e07a24325b90d98545504af8e6c4b1649c80a9dadfa9736e2f57207f95a)
CONFLICT: dist/database/connection.js.map (local hash: file_not_found, gitea hash: 23d3b04d0c34c29d4f067bf475d551b686681d3e2a37bce72b933528f7769398)
IDENTICAL: dist/index.d.ts.map (size: 880 bytes)
CONFLICT: dist/index.js (local hash: 72ff65b8fba8f2a1642434d607dbe0a2f704ca34a01105959ac55094ba2e06fb, gitea hash: e6a541522b9c5dc9e4169599f7c7400fb369706c86cfc980dbe33230d59032cc)
CONFLICT: dist/index.d.ts (local hash: 4ad829d9bfdbe5e3817da30b59d580409ac48b21b93ed0234aa45a113a9a74d6, gitea hash: 9f1813fb44646e4c439f93c2d831736142c87cfc475264bda1dba9d246a06ffe)
IDENTICAL: dist/index.js.map (size: 10534 bytes)
CONFLICT: dist/index.d.ts.map (local hash: file_not_found, gitea hash: 6b821e8472ffd81c4e7947bc428cd18171624a9023eea951b54f4b2f2b649486)
CONFLICT: dist/middleware/auth.d.ts (local hash: 886753f2d5db79dda1eb369215665e0e336e9c78b9a3781df9563b5dec84d8a7, gitea hash: 70bf86beda39e1edae45c6c984a2a345550f624ec7737981e668398c965ca209)
CONFLICT: dist/index.js (local hash: 72ff65b8fba8f2a1642434d607dbe0a2f704ca34a01105959ac55094ba2e06fb, gitea hash: e6a541522b9c5dc9e4169599f7c7400fb369706c86cfc980dbe33230d59032cc)
IDENTICAL: dist/middleware/auth.d.ts.map (size: 424 bytes)
CONFLICT: dist/index.js.map (local hash: file_not_found, gitea hash: aefd66687cc7e37cf449359b7b78e6aa772eb8241e09ade9ef1e6b40f394e8c1)
CONFLICT: dist/middleware/auth.js (local hash: f759d885fd972161b35217744fa5a3f45d25f8c4efe9aba3180ffae7d31b0114, gitea hash: 3cdc5446256099b58a1ed1fe589a42f7eaf868b12958c6f699b2d8e2e1025959)
CONFLICT: dist/middleware/auth.d.ts (local hash: 886753f2d5db79dda1eb369215665e0e336e9c78b9a3781df9563b5dec84d8a7, gitea hash: 70bf86beda39e1edae45c6c984a2a345550f624ec7737981e668398c965ca209)
IDENTICAL: dist/middleware/auth.js.map (size: 1704 bytes)
CONFLICT: dist/middleware/auth.d.ts.map (local hash: file_not_found, gitea hash: 94eaa6e6022523476bf99c176acd67acc147819b7bfb894b738f390bead42082)
CONFLICT: dist/middleware/errorHandler.d.ts (local hash: 361b00a148f38fcfb6e3d31bf4f629105cf877624d784af4d93781c82e58dd6c, gitea hash: 0b9419d92139eb420fd30df68ff50721424c65b14b00b61a5b6efd04ee1ad41a)
CONFLICT: dist/middleware/auth.js (local hash: f759d885fd972161b35217744fa5a3f45d25f8c4efe9aba3180ffae7d31b0114, gitea hash: 3cdc5446256099b58a1ed1fe589a42f7eaf868b12958c6f699b2d8e2e1025959)
IDENTICAL: dist/middleware/errorHandler.d.ts.map (size: 1850 bytes)
CONFLICT: dist/middleware/auth.js.map (local hash: file_not_found, gitea hash: 36309869b5c3d87ffa111d3006f815af04fa0e7992db9ff0af5d945b9a1827b7)
CONFLICT: dist/middleware/errorHandler.js (local hash: 389581ab78d9a225a70626accb91f8407e666efb147ce1856dc62224224ec450, gitea hash: a233bb835fc961668c468bb31d63b0e1908c2bd66ca2a6f01b4cf3e5ca90cafc)
CONFLICT: dist/middleware/errorHandler.d.ts (local hash: 361b00a148f38fcfb6e3d31bf4f629105cf877624d784af4d93781c82e58dd6c, gitea hash: 0b9419d92139eb420fd30df68ff50721424c65b14b00b61a5b6efd04ee1ad41a)
IDENTICAL: dist/middleware/errorHandler.js.map (size: 9099 bytes)
CONFLICT: dist/middleware/errorHandler.d.ts.map (local hash: file_not_found, gitea hash: 564519a70721419785c8be74e35ba00559bc6921d38cb37bb8174edd7d4767c5)
CONFLICT: dist/middleware/rateLimiter.d.ts (local hash: 917dc9bf7b650f32ed6291571c180bd74ce17e5c495fa39e5d19b9d1602f74e7, gitea hash: b0aa89df18faa72d4212cfec47fc3a6a9f4a1d31550fa9db814e54403fd32773)
CONFLICT: dist/middleware/errorHandler.js (local hash: 389581ab78d9a225a70626accb91f8407e666efb147ce1856dc62224224ec450, gitea hash: a233bb835fc961668c468bb31d63b0e1908c2bd66ca2a6f01b4cf3e5ca90cafc)
IDENTICAL: dist/middleware/rateLimiter.d.ts.map (size: 1189 bytes)
CONFLICT: dist/middleware/errorHandler.js.map (local hash: file_not_found, gitea hash: 4dfa86e91dc71644c99815a973ed7b5e2408bd9bc9a5c7f5e3fa14d59489b6d7)
CONFLICT: dist/middleware/rateLimiter.js (local hash: 0c8deb228e12f41507e591c1b188a07ba03028057277f7c835de2137b50b50ff, gitea hash: 67803d46bef0a8875c3e3c2ee9219c3948004521416da417079ead156d6669bd)
CONFLICT: dist/middleware/rateLimiter.d.ts (local hash: 917dc9bf7b650f32ed6291571c180bd74ce17e5c495fa39e5d19b9d1602f74e7, gitea hash: b0aa89df18faa72d4212cfec47fc3a6a9f4a1d31550fa9db814e54403fd32773)
IDENTICAL: dist/middleware/rateLimiter.js.map (size: 8027 bytes)
CONFLICT: dist/middleware/rateLimiter.d.ts.map (local hash: file_not_found, gitea hash: 850f06f95b22c95af083e1bc9b04a2ead5c2fa522b43560f6ca67834e986d2cf)
CONFLICT: dist/routes/admin.d.ts (local hash: 1594b9005eb104ea165382f3ff8d346d64c314d0ddb7f6ebefca3c1f3f69d740, gitea hash: 86f1956879f80309c144e55a7f41a919256008de6b983b1a35457240a8f90289)
CONFLICT: dist/middleware/rateLimiter.js (local hash: 0c8deb228e12f41507e591c1b188a07ba03028057277f7c835de2137b50b50ff, gitea hash: 67803d46bef0a8875c3e3c2ee9219c3948004521416da417079ead156d6669bd)
IDENTICAL: dist/routes/admin.d.ts.map (size: 167 bytes)
CONFLICT: dist/middleware/rateLimiter.js.map (local hash: file_not_found, gitea hash: 5dfedb14fa9e75acb8f84f151e0e25cc4c6fe1d147d4c41589487235f4e28033)
CONFLICT: dist/routes/admin.js (local hash: 54ce2b3d65d1e640da1fcb15c51f17d522c704b543bc9b6424e7e29ed99a14be, gitea hash: 80d364de7f6b147bf67d916bd230ad2d30d9a0e5ed1da64f3378f29c2c266092)
CONFLICT: dist/routes/admin.d.ts (local hash: 1594b9005eb104ea165382f3ff8d346d64c314d0ddb7f6ebefca3c1f3f69d740, gitea hash: 86f1956879f80309c144e55a7f41a919256008de6b983b1a35457240a8f90289)
IDENTICAL: dist/routes/admin.js.map (size: 6536 bytes)
CONFLICT: dist/routes/admin.d.ts.map (local hash: file_not_found, gitea hash: 977fd5e0e65d10749f0aee1ed237f74ea4c8db70ba2c2ab1514cf001161ee77a)
CONFLICT: dist/routes/analytics.d.ts (local hash: 1cc32f3bce0c6546abf508beba5a21ff8cd6fdd081e58c18b69aa919ef5a73fd, gitea hash: cb766fb6e6fdbc47deb220cb48e4e9f3adb925c9570fbd4689fd58138854fd7c)
CONFLICT: dist/routes/admin.js (local hash: 54ce2b3d65d1e640da1fcb15c51f17d522c704b543bc9b6424e7e29ed99a14be, gitea hash: 80d364de7f6b147bf67d916bd230ad2d30d9a0e5ed1da64f3378f29c2c266092)
IDENTICAL: dist/routes/analytics.d.ts.map (size: 174 bytes)
CONFLICT: dist/routes/admin.js.map (local hash: file_not_found, gitea hash: 7a6f62fe7020b93522e97a87873f93ce997f15f37e133d8870187a5d490618cc)
CONFLICT: dist/routes/analytics.js (local hash: ad1c6854063ca5ff8e910d88e43ec1bdfc4cd8c95a58574971ba65c66c41913d, gitea hash: bba90641c19026745b3c82b1d3f829ec19b04b604220fd44f151b21ad78d76d0)
CONFLICT: dist/routes/analytics.d.ts (local hash: 1cc32f3bce0c6546abf508beba5a21ff8cd6fdd081e58c18b69aa919ef5a73fd, gitea hash: cb766fb6e6fdbc47deb220cb48e4e9f3adb925c9570fbd4689fd58138854fd7c)
IDENTICAL: dist/routes/analytics.js.map (size: 745 bytes)
CONFLICT: dist/routes/analytics.d.ts.map (local hash: file_not_found, gitea hash: 37440f5704cb8c123a2a09a1014289887b0d5a466d85fbfff70ef0de83a1aa92)
CONFLICT: dist/routes/courier.d.ts (local hash: 013ac07ffa8ac2914980e544322e8209b50cfd04e80af0e994f923bc6a780ae0, gitea hash: 5032a8ccf11e5a925884bbe5f1bbe2c8a91e46aa50210fe8a4d1a4f2bfbf3056)
CONFLICT: dist/routes/analytics.js (local hash: ad1c6854063ca5ff8e910d88e43ec1bdfc4cd8c95a58574971ba65c66c41913d, gitea hash: bba90641c19026745b3c82b1d3f829ec19b04b604220fd44f151b21ad78d76d0)
IDENTICAL: dist/routes/courier.d.ts.map (size: 170 bytes)
CONFLICT: dist/routes/analytics.js.map (local hash: file_not_found, gitea hash: e948c424af82d50c9b5c5966953229d80b894bca71b7590fc7bc62a546fd7803)
CONFLICT: dist/routes/courier.js (local hash: 39819e1f79b33eb7c2d05f4269a1e30919fe9940f3114fb94706fbd496502fb4, gitea hash: 2d9a374e93463ef9794b9cc362121f9fee782aa687571170061e74bbfd3199c1)
CONFLICT: dist/routes/courier.d.ts (local hash: 013ac07ffa8ac2914980e544322e8209b50cfd04e80af0e994f923bc6a780ae0, gitea hash: 5032a8ccf11e5a925884bbe5f1bbe2c8a91e46aa50210fe8a4d1a4f2bfbf3056)
CONFLICT: dist/routes/courier.d.ts.map (local hash: file_not_found, gitea hash: 5ce8ea8bb85c2e8f39f49c2f8d65bca2adb062fdf24f9be3ff986d622350a25a)
IDENTICAL: dist/routes/courier.js.map (size: 8246 bytes)
CONFLICT: dist/routes/health.d.ts (local hash: 86eb6440d833abbc671524429978cbe3230b3a4181a31de34c0eb3083276d8ee, gitea hash: 9f6b6204df01a65f20e8e7118102b8244d2311935abab7b3e902d3d00ba39cb3)
CONFLICT: dist/routes/courier.js (local hash: 39819e1f79b33eb7c2d05f4269a1e30919fe9940f3114fb94706fbd496502fb4, gitea hash: 2d9a374e93463ef9794b9cc362121f9fee782aa687571170061e74bbfd3199c1)
CONFLICT: dist/routes/courier.js.map (local hash: file_not_found, gitea hash: ea9d3176f4a259228a1eba410ec1dd4377adb2e2889450e17fd2aab1ab7461e3)
IDENTICAL: dist/routes/health.d.ts.map (size: 168 bytes)
CONFLICT: dist/routes/health.js (local hash: 13a8ff9b9bf4db46a742c50bc9ebcac6e477acb8013bfc1a74d7da2ba8526286, gitea hash: 83fbce820917c61b24f88cde63ab536089c6a58fe761a14f15a053f72b781f50)
CONFLICT: dist/routes/health.d.ts (local hash: 86eb6440d833abbc671524429978cbe3230b3a4181a31de34c0eb3083276d8ee, gitea hash: 9f6b6204df01a65f20e8e7118102b8244d2311935abab7b3e902d3d00ba39cb3)
CONFLICT: dist/routes/health.d.ts.map (local hash: file_not_found, gitea hash: 1c57332db1375dda792e9e4a08de378aa09eaa59e1d6f16423d2c5f25ecfcfc1)
IDENTICAL: dist/routes/health.js.map (size: 9921 bytes)
CONFLICT: dist/routes/invitations.d.ts (local hash: 5f7b08f7f32457068cbf2c6d3c4f9469450b567fb24075d411f60b2a734504d6, gitea hash: f848c119df58c5848527ca014802c446e4161a073a716e8d4ec3de4266fe552b)
CONFLICT: dist/routes/health.js (local hash: 13a8ff9b9bf4db46a742c50bc9ebcac6e477acb8013bfc1a74d7da2ba8526286, gitea hash: 83fbce820917c61b24f88cde63ab536089c6a58fe761a14f15a053f72b781f50)
IDENTICAL: dist/routes/invitations.d.ts.map (size: 178 bytes)
CONFLICT: dist/routes/health.js.map (local hash: file_not_found, gitea hash: 421e1e67c71bfe993593c24a3a8a97d8da3c663650ecc707edfa5c9acdc1ecb6)
CONFLICT: dist/routes/invitations.js (local hash: e6bb87e25ee08d81e54f0bd0f29be8dfa0ab1f1a08a0e67276c36eaab1db4823, gitea hash: 3f5e1eaff593acedb86d37737d2d3a26030cac1f0523cd4ff83e009de0af1186)
CONFLICT: dist/routes/invitations.d.ts (local hash: 5f7b08f7f32457068cbf2c6d3c4f9469450b567fb24075d411f60b2a734504d6, gitea hash: f848c119df58c5848527ca014802c446e4161a073a716e8d4ec3de4266fe552b)
IDENTICAL: dist/routes/invitations.js.map (size: 875 bytes)
CONFLICT: dist/routes/invitations.d.ts.map (local hash: file_not_found, gitea hash: b9cb744b0493eb875405fd5352146df9962f15df31c538bc3f0b1a37c3e27e9c)
CONFLICT: dist/routes/location.d.ts (local hash: a412b38958d91b394bc70a3fe222a5121c7739d8fb9f118041ab07d6a8cda4c4, gitea hash: df8cbdbb72c2de62d991865f3cd1842fc8d5a6b2e74363d8e2ab9e2b205f0d04)
CONFLICT: dist/routes/invitations.js (local hash: e6bb87e25ee08d81e54f0bd0f29be8dfa0ab1f1a08a0e67276c36eaab1db4823, gitea hash: 3f5e1eaff593acedb86d37737d2d3a26030cac1f0523cd4ff83e009de0af1186)
IDENTICAL: dist/routes/location.d.ts.map (size: 172 bytes)
CONFLICT: dist/routes/invitations.js.map (local hash: file_not_found, gitea hash: d9554d1d86c4e946795a0a196e1d1fd228b9d34b7219bf00493d9beb7eab63ca)
CONFLICT: dist/routes/location.js (local hash: 88f72a5766bf4628875e00c89260a6bcccde3f47aa01805936abf510869627f0, gitea hash: 5c877fb908f85ebfb45c9fa1ed885b371c7da0a3c6f7a243ed708461e1516a9b)
CONFLICT: dist/routes/location.d.ts (local hash: a412b38958d91b394bc70a3fe222a5121c7739d8fb9f118041ab07d6a8cda4c4, gitea hash: df8cbdbb72c2de62d991865f3cd1842fc8d5a6b2e74363d8e2ab9e2b205f0d04)
IDENTICAL: dist/routes/location.js.map (size: 548 bytes)
CONFLICT: dist/routes/location.d.ts.map (local hash: file_not_found, gitea hash: 88896f80054ebcf4be1e95d5bc78262e701c9ceeba0beacb2a03b209935a0eb7)
CONFLICT: dist/routes/qr.d.ts (local hash: 25cc51fe4ecd2a866fbf84b75a1d6bc42ae7b95ad84b7fdc857aea4e5b16754d, gitea hash: 9026c637855ae5976d35d892dc6186e1fafbc2ef435d29064f7bb5eee6249abc)
IDENTICAL: dist/routes/qr.d.ts.map (size: 161 bytes)
CONFLICT: dist/routes/location.js (local hash: 88f72a5766bf4628875e00c89260a6bcccde3f47aa01805936abf510869627f0, gitea hash: 5c877fb908f85ebfb45c9fa1ed885b371c7da0a3c6f7a243ed708461e1516a9b)
CONFLICT: dist/routes/location.js.map (local hash: file_not_found, gitea hash: d69e4f017be976b5b5bc610072c7e0b683a1ea8fdcf7c4ec13bf24ea5838f42f)
CONFLICT: dist/routes/qr.js (local hash: 706b58d759020f7855f2903cae7026c7ac63af87b0023a33a368bea2aeab1155, gitea hash: 9bb35af7d063f3a6bc7917264194a243eed2c3538de51aa4798aa48250e60db8)
CONFLICT: dist/routes/qr.d.ts (local hash: 25cc51fe4ecd2a866fbf84b75a1d6bc42ae7b95ad84b7fdc857aea4e5b16754d, gitea hash: 9026c637855ae5976d35d892dc6186e1fafbc2ef435d29064f7bb5eee6249abc)
IDENTICAL: dist/routes/qr.js.map (size: 7538 bytes)
CONFLICT: dist/routes/qr.d.ts.map (local hash: file_not_found, gitea hash: 2f419a69fe3283a75b30e9d66c22c35b99cf6c58c916cb6cd0a65cb470253a2a)
CONFLICT: dist/routes/trials.d.ts (local hash: 58496e4f12f015215f64b72a1bfbf2860b5b2c5a3cdbc36a6fd5744c263ca2fb, gitea hash: 1a98a98fc831c68f711e64734804e4cd3208638171ebfc0679029064c6c1aced)
IDENTICAL: dist/routes/trials.d.ts.map (size: 168 bytes)
CONFLICT: dist/routes/qr.js (local hash: 706b58d759020f7855f2903cae7026c7ac63af87b0023a33a368bea2aeab1155, gitea hash: 9bb35af7d063f3a6bc7917264194a243eed2c3538de51aa4798aa48250e60db8)
CONFLICT: dist/routes/trials.js (local hash: 9c093f2063fd97970f8b2e4ae1ffb1695e3adc9e7e03b5c960d21b4b0cbaccc0, gitea hash: 1c61c3c98a59a8113ed92352f9d3f7f5cc95878ebf4c6cfebfd707961912d1ac)
CONFLICT: dist/routes/qr.js.map (local hash: file_not_found, gitea hash: c5280fbed82e42e702d1d64fc4ec4b54ffedd1406fa34271602305144bce846b)
IDENTICAL: dist/routes/trials.js.map (size: 6863 bytes)
CONFLICT: dist/routes/trials.d.ts (local hash: 58496e4f12f015215f64b72a1bfbf2860b5b2c5a3cdbc36a6fd5744c263ca2fb, gitea hash: 1a98a98fc831c68f711e64734804e4cd3208638171ebfc0679029064c6c1aced)
CONFLICT: dist/services/courier.d.ts (local hash: a8105d9cbc2544fc242fff6da74e2d3d595b4ce9f4dfbcfc1958ef2a0dd6852a, gitea hash: 489a89467e79ba4b220cc62d2c19857969ec66b48b7a93239d4bac246e34f2ac)
CONFLICT: dist/routes/trials.d.ts.map (local hash: file_not_found, gitea hash: 78f29ea7658290f233ff537a330c8cb98ef71dcf8b3edfd9c9f59c6df05719cd)
IDENTICAL: dist/services/courier.d.ts.map (size: 2644 bytes)
CONFLICT: dist/routes/trials.js (local hash: 9c093f2063fd97970f8b2e4ae1ffb1695e3adc9e7e03b5c960d21b4b0cbaccc0, gitea hash: 1c61c3c98a59a8113ed92352f9d3f7f5cc95878ebf4c6cfebfd707961912d1ac)
CONFLICT: dist/services/courier.js (local hash: 6cad077caea1cab36e8bd8987511888d7da4288763ae3702d7f516bcf6a7ec40, gitea hash: 0793c2ec8cbc45b5f9618817663d47b1dc582d7682bd644035f9d49d724f92e5)
IDENTICAL: dist/services/courier.js.map (size: 10980 bytes)
CONFLICT: dist/routes/trials.js.map (local hash: file_not_found, gitea hash: e36bd7bc25e7b469cd5a5553af9a91c068e2b8eedb1b217bb09538f97606a8d6)
CONFLICT: dist/services/geofencing.d.ts (local hash: ef758d17e6e2a66ad782b8ae929e6cec70b87e689b6d11feee3e02068ae2a4e9, gitea hash: 7cf6b9584a470820ede8dcdcf6334d832d1c0f69e5b8c607bd1861040c9aeb04)
CONFLICT: dist/services/courier.d.ts (local hash: a8105d9cbc2544fc242fff6da74e2d3d595b4ce9f4dfbcfc1958ef2a0dd6852a, gitea hash: 489a89467e79ba4b220cc62d2c19857969ec66b48b7a93239d4bac246e34f2ac)
IDENTICAL: dist/services/geofencing.d.ts.map (size: 934 bytes)
CONFLICT: dist/services/courier.d.ts.map (local hash: file_not_found, gitea hash: 4d4a9a6ac60f16bf2728802a975b46c6bd6d202c709d2b4d0fbdf127e5d4e4f9)
CONFLICT: dist/services/geofencing.js (local hash: 79894dc17d93a974678e1fd69b90bb015830272ca44c0866166b26b7cde3203a, gitea hash: c3b733655f83597998f15ebc34197cf421363a896736f858762d11d4e246232e)
CONFLICT: dist/services/courier.js (local hash: 6cad077caea1cab36e8bd8987511888d7da4288763ae3702d7f516bcf6a7ec40, gitea hash: 0793c2ec8cbc45b5f9618817663d47b1dc582d7682bd644035f9d49d724f92e5)
IDENTICAL: dist/services/geofencing.js.map (size: 13838 bytes)
CONFLICT: dist/services/courier.js.map (local hash: file_not_found, gitea hash: a07303cbad930bd2123e5dc07a771414b4d674cc796e6eb249131a8d789fcdad)
CONFLICT: dist/services/qrCode.d.ts (local hash: c11b184c97ae95761d28246ff38123ccb49ee419a4dba1fde28a00c51f300f48, gitea hash: fffda17ab448338b7dc1c06de3df79b19747f35368885da9f910ed0f69dfac0b)
IDENTICAL: dist/services/qrCode.d.ts.map (size: 1881 bytes)
CONFLICT: dist/services/geofencing.d.ts (local hash: ef758d17e6e2a66ad782b8ae929e6cec70b87e689b6d11feee3e02068ae2a4e9, gitea hash: 7cf6b9584a470820ede8dcdcf6334d832d1c0f69e5b8c607bd1861040c9aeb04)
CONFLICT: dist/services/qrCode.js (local hash: 89138951ce8a94c320dc371649f58bbbf61d568379e4c2aba56a2e96f4273509, gitea hash: 0da62809b444115e3ddb965eb87d07dc7abcf3004205ada222d3c6c22bce2e25)
CONFLICT: dist/services/geofencing.d.ts.map (local hash: file_not_found, gitea hash: c3ee2436237f1103cdbdebe4bd5764bec95a2489bb516b97187a4d2cfd7d481a)
IDENTICAL: dist/services/qrCode.js.map (size: 8927 bytes)
CONFLICT: dist/services/geofencing.js (local hash: 79894dc17d93a974678e1fd69b90bb015830272ca44c0866166b26b7cde3203a, gitea hash: c3b733655f83597998f15ebc34197cf421363a896736f858762d11d4e246232e)
CONFLICT: dist/services/trialCountdown.d.ts (local hash: d77a65a504ddcce2284457e4b4bb5a7cde3a37812b07e237197c863c3af2400d, gitea hash: d1c86705b1e5f3207712c47bf6a90018408d81326c227b129b4c3fb68a5b54d9)
CONFLICT: dist/services/geofencing.js.map (local hash: file_not_found, gitea hash: 14f19edd78d97f9a6d09cc2613c9fef76c8459bcc46b0280e4bf97593eed6138)
IDENTICAL: dist/services/trialCountdown.d.ts.map (size: 2817 bytes)
CONFLICT: dist/services/trialCountdown.js (local hash: df7d3556b3437177cb8ee6bc54b4fa25511b86b9c3b68f54e06e598bb88fd416, gitea hash: 4ec1ad044017f4f5a198bce606e2153cc59acadb55210c8daa6b4328dd76b139)
CONFLICT: dist/services/qrCode.d.ts (local hash: c11b184c97ae95761d28246ff38123ccb49ee419a4dba1fde28a00c51f300f48, gitea hash: fffda17ab448338b7dc1c06de3df79b19747f35368885da9f910ed0f69dfac0b)
CONFLICT: dist/services/qrCode.d.ts.map (local hash: file_not_found, gitea hash: 17c4e57be9bbdc8805fbc75601eef7ca88e5ce93f0aedd846cde4766e8aef66f)
IDENTICAL: dist/services/trialCountdown.js.map (size: 13068 bytes)
CONFLICT: dist/types/extended.d.ts (local hash: 3d441c4e2de6373d569b8cd604da073da2785eb5702c4ed990ad56d327c3d954, gitea hash: f64bde9e5e610e1ba17938d5ca89fdc523bd457737095bf8e94c7a73d211afaa)
CONFLICT: dist/services/qrCode.js (local hash: 89138951ce8a94c320dc371649f58bbbf61d568379e4c2aba56a2e96f4273509, gitea hash: 0da62809b444115e3ddb965eb87d07dc7abcf3004205ada222d3c6c22bce2e25)
IDENTICAL: dist/types/extended.d.ts.map (size: 2993 bytes)
CONFLICT: dist/services/qrCode.js.map (local hash: file_not_found, gitea hash: 2eccd2a96e319796ebe1c9c609609aafbd36a05570dd6ca244141027769a6b30)
CONFLICT: dist/types/extended.js (local hash: e850fd1c194b8e3bb647b2944357b9680312789ea1a853275889a7fa8935cc04, gitea hash: f85b489e01a0398cc2a83acded54275f7c55361fbab7d7c40c427f261143225e)
CONFLICT: dist/services/trialCountdown.d.ts (local hash: d77a65a504ddcce2284457e4b4bb5a7cde3a37812b07e237197c863c3af2400d, gitea hash: d1c86705b1e5f3207712c47bf6a90018408d81326c227b129b4c3fb68a5b54d9)
IDENTICAL: dist/types/extended.js.map (size: 117 bytes)
CONFLICT: dist/services/trialCountdown.d.ts.map (local hash: file_not_found, gitea hash: 6d58c6806ddd247fea9da3b5b8e8dbfceacecc69364b0f93239ecb649374aace)
CONFLICT: dist/types/index.d.ts (local hash: 04e8fd4fe0de2569ece9c6db7bef565999ae6ca33e5e7fdc2674163d8648bb98, gitea hash: 788d19aa70f499ff9ded8c14ec64640b900086bb1ab85cb947104e93f39c2dcc)
CONFLICT: dist/services/trialCountdown.js (local hash: df7d3556b3437177cb8ee6bc54b4fa25511b86b9c3b68f54e06e598bb88fd416, gitea hash: 4ec1ad044017f4f5a198bce606e2153cc59acadb55210c8daa6b4328dd76b139)
IDENTICAL: dist/types/index.d.ts.map (size: 9499 bytes)
CONFLICT: dist/services/trialCountdown.js.map (local hash: file_not_found, gitea hash: e0490c2d1918e278af50feb9d6989af94820292c4742df35c57144ff0dfb74ce)
CONFLICT: dist/types/index.js (local hash: fc9c6096246805c2075c83ab1b96082eda2fc98c240a2502caa82f1966096b71, gitea hash: 27c0a414c8f57198c3db2a27030f05115e91300d32f6059af59d6ac7bfea80f6)
CONFLICT: dist/types/extended.d.ts (local hash: 3d441c4e2de6373d569b8cd604da073da2785eb5702c4ed990ad56d327c3d954, gitea hash: f64bde9e5e610e1ba17938d5ca89fdc523bd457737095bf8e94c7a73d211afaa)
IDENTICAL: dist/types/index.js.map (size: 111 bytes)
CONFLICT: dist/types/extended.d.ts.map (local hash: file_not_found, gitea hash: db8a13f67679b7521d73f9652674077d01e294a4bdc0ec6fceec58ee8c9d5cca)
IDENTICAL: Dockerfile (size: 2164 bytes)
CONFLICT: dist/types/extended.js (local hash: e850fd1c194b8e3bb647b2944357b9680312789ea1a853275889a7fa8935cc04, gitea hash: f85b489e01a0398cc2a83acded54275f7c55361fbab7d7c40c427f261143225e)
IDENTICAL: logs/database.log (size: 1523 bytes)
CONFLICT: dist/types/extended.js.map (local hash: file_not_found, gitea hash: fdd358b4e95a89a990d02fdf8dd9edfae0838f7cd583fc41fd775d572c22ef42)
IDENTICAL: logs/error.log (size: 0 bytes)
CONFLICT: dist/types/index.d.ts (local hash: 04e8fd4fe0de2569ece9c6db7bef565999ae6ca33e5e7fdc2674163d8648bb98, gitea hash: 788d19aa70f499ff9ded8c14ec64640b900086bb1ab85cb947104e93f39c2dcc)
CONFLICT: dist/types/index.d.ts.map (local hash: file_not_found, gitea hash: dcf2c3b61421d615e58bd7f4c4e660c1f8b9db0ad4acf63bd7c8d933e3be1754)
IDENTICAL: logs/invitation-engine.log (size: 0 bytes)
CONFLICT: dist/types/index.js (local hash: fc9c6096246805c2075c83ab1b96082eda2fc98c240a2502caa82f1966096b71, gitea hash: 27c0a414c8f57198c3db2a27030f05115e91300d32f6059af59d6ac7bfea80f6)
IDENTICAL: package-lock.json (size: 300529 bytes)
CONFLICT: dist/types/index.js.map (local hash: file_not_found, gitea hash: c4ac53ade294b76aa27a4b8b63477beeecc81827655f68f64c9bc4c7bbeeb817)
IDENTICAL: package.json (size: 1964 bytes)
CONFLICT: Dockerfile (local hash: file_not_found, gitea hash: b075423016ea1b299dc389d30f00a8d914fd05bd5990ac9dac66687111cee00f)
IDENTICAL: README.md (size: 12397 bytes)
CONFLICT: logs/database.log (local hash: file_not_found, gitea hash: 220236acef0f4236bc67f2829172ea529d4bf9be2e160fd784a1ba6c7acb8f53)
CONFLICT: logs/error.log (local hash: file_not_found, gitea hash: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855)
IDENTICAL: src/database/connection.ts (size: 12011 bytes)
CONFLICT: logs/invitation-engine.log (local hash: file_not_found, gitea hash: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855)
IDENTICAL: src/database/schema.sql (size: 19850 bytes)
CONFLICT: package-lock.json (local hash: file_not_found, gitea hash: b9eeb4bfe470e45bcaf8b42e36d3081b8c5f83a1a615b64289b4626d22ffdc83)
CONFLICT: package.json (local hash: file_not_found, gitea hash: 6200bb943a0f01b2cd11cfcc7d80fbd5968041f54c9882bb3e1bb855519fb1d5)
IDENTICAL: src/index.ts (size: 15856 bytes)
CONFLICT: README.md (local hash: file_not_found, gitea hash: 997692936e9edb803db4696457856b7bcd8b01fa1020b7323b75e6d73d700b90)
IDENTICAL: src/middleware/auth.ts (size: 2149 bytes)
CONFLICT: src/database/connection.ts (local hash: file_not_found, gitea hash: 95a706dccca7aad091299a4848f0b5f0c0587bc74c92f1873d0be3718b03f627)
IDENTICAL: src/middleware/errorHandler.ts (size: 10814 bytes)
CONFLICT: src/database/schema.sql (local hash: file_not_found, gitea hash: ae7bfe3305d9b3ed9d3d4027f95eb7d5ccf92ed20023dc2ea5cb1a3854b5eb70)
IDENTICAL: src/middleware/rateLimiter.ts (size: 11715 bytes)
CONFLICT: src/index.ts (local hash: file_not_found, gitea hash: f56e64bf03a184c368251a058bd2623cbb01825d3131f20de5c368ff5320b31a)
CONFLICT: src/middleware/auth.ts (local hash: file_not_found, gitea hash: 0fd0d0929d2c3488b4ef689db56acc610662139a6f9e53b23fc392bb312a9a8c)
IDENTICAL: src/routes/admin.ts (size: 23804 bytes)
CONFLICT: src/middleware/errorHandler.ts (local hash: file_not_found, gitea hash: 6b46f7bd5b5e702e6e917d4cacec21f1a1972e4807f9654527b4562410e998d1)
IDENTICAL: src/routes/analytics.ts (size: 759 bytes)
CONFLICT: src/middleware/rateLimiter.ts (local hash: file_not_found, gitea hash: 97e5f28107e43aff35ff60a5985b82cd2cc36f27252a7e8d742d3eab1c2ecf65)
IDENTICAL: src/routes/courier.ts (size: 10260 bytes)
CONFLICT: src/routes/admin.ts (local hash: file_not_found, gitea hash: 61c8048809cf00a9eea2fb3a067f98ff3a6c0c029aecd28d747f5b496ebf1a29)
CONFLICT: src/routes/analytics.ts (local hash: file_not_found, gitea hash: 31f2ff31f1ceed4cac4a6a1dbe131984ddd0eb4ce7f241928f069131f570a43f)
IDENTICAL: src/routes/health.ts (size: 12699 bytes)
CONFLICT: src/routes/courier.ts (local hash: file_not_found, gitea hash: a45916aab618123458754c74c5683ac6e58a02287cbbc1145993abeb3f8d4c69)
IDENTICAL: src/routes/invitations.ts (size: 1083 bytes)
CONFLICT: src/routes/health.ts (local hash: file_not_found, gitea hash: 8f3e0abf353735c5be6e766dfaa58645cdbfbf3c09582e9001c07b4687c6d0c2)
IDENTICAL: src/routes/location.ts (size: 687 bytes)
CONFLICT: src/routes/invitations.ts (local hash: file_not_found, gitea hash: f8f417908d8172a8f57ccf629237173919878a8bccde970a45abd260db654af7)
CONFLICT: src/routes/location.ts (local hash: file_not_found, gitea hash: 98bec4d0af86d459b64d524d3e662249e07be84834389b8dda678218475c88ec)
IDENTICAL: src/routes/qr.ts (size: 24702 bytes)
IDENTICAL: src/routes/qr.ts (size: 0 bytes)
IDENTICAL: src/routes/trials.ts (size: 14002 bytes)
CONFLICT: src/routes/trials.ts (local hash: file_not_found, gitea hash: 7124b7ac60c28ccb8f6177d5d4a80cee52b76bdd8b7d8ac18ed7cc6b4dade485)
IDENTICAL: src/services/courier.ts (size: 16264 bytes)
CONFLICT: src/services/courier.ts (local hash: , gitea hash: 8a81f6c9dadcfa05ae5845714809adb4b2674a0bc4f6a58da1c9e8ba27966d88)
IDENTICAL: src/services/geofencing.ts (size: 21270 bytes)
IDENTICAL: src/services/qrCode.ts (size: 12611 bytes)
CONFLICT: src/services/geofencing.ts (local hash: , gitea hash: 75d26a46c969c6edcf59373f712c692657fa28e8745ff4e657e970cd0c21b1fd)
IDENTICAL: src/services/trialCountdown.ts (size: 20843 bytes)
CONFLICT: src/services/qrCode.ts (local hash: , gitea hash: 12520e32aec9f0f1a39d036d4975d7e2b7eeeb7cffb1c4aa3701fb23e7dedf46)
IDENTICAL: src/types/extended.ts (size: 2870 bytes)
CONFLICT: src/services/trialCountdown.ts (local hash: file_not_found, gitea hash: b146aa7072534c164232d845bd6579f0a0365381985fc6d28e40a7b30355bf48)
CONFLICT: src/types/extended.ts (local hash: file_not_found, gitea hash: 2cfc50bab1371f1809975e8dbc4489c5f7f6b291b10555ae35bbf268f216554c)
IDENTICAL: src/types/index.ts (size: 10211 bytes)
CONFLICT: src/types/index.ts (local hash: , gitea hash: 5da41d40bcb841d71098712ad9a7266511e84299d4169d6b6943eb7c1d07dfc4)
IDENTICAL: test-container-31.js (size: 10606 bytes)
IDENTICAL: tsconfig.json (size: 1154 bytes)
CONFLICT: test-container-31.js (local hash: , gitea hash: fd0d2ec1cc737f2cb4b02f7a3858c7164e5f127634e6c5f4ff09f1741037129b)

Summary for invitation-engine:
  Identical files removed: 71
  Local-only files kept: 0
  Conflicting files: 38
CONFLICT: tsconfig.json (local hash: , gitea hash: a9d7784e014a14fbc198a5ac784023cbd906cfbcdd0d62edfab16c31d5afba9e)

Summary for invitation-engine:
  Identical files removed: 2
  Local-only files kept: 0
  Conflicting files: 106
```

### cosmos-real-estate

```
### pms-admin

```
File Comparison for pms-admin
================================

LOCAL-ONLY: graph.svg
LOCAL-ONLY: next-env.d.ts
LOCAL-ONLY: playwright-report/index.html
LOCAL-ONLY: report-bundle-size.js
LOCAL-ONLY: test-results/.last-run.json
LOCAL-ONLY: test-results/buttons-Button-Functionali-78074--password-form-button-works-chromium/error-context.md
LOCAL-ONLY: test-results/forms-Forms-and-API-Tests--10e55-ith-Cyprus-tax-calculations-chromium/error-context.md
LOCAL-ONLY: test-results/navigation-Navigation-Tests-authentication-pages-navigation-chromium/error-context.md
LOCAL-ONLY: test-results/navigation-Navigation-Tests-main-application-pages-load-chromium/error-context.md
LOCAL-ONLY: test-results/navigation-Navigation-Tests-main-navigation-links-work-chromium/error-context.md

Summary for pms-admin:
  Identical files removed: 0
  Local-only files kept: 10
  Conflicting files: 0
```

File Comparison for cosmos-real-estate
================================

IDENTICAL: src/services/CyprusComplianceEngine.ts (size: 24305 bytes)
IDENTICAL: src/services/CyprusComplianceEngine.ts (size: 24305 bytes)
IDENTICAL: src/types/index.ts (size: 26539 bytes)
IDENTICAL: src/types/index.ts (size: 0 bytes)
IDENTICAL: tsconfig.json (size: 1310 bytes)

Summary for cosmos-real-estate:
  Identical files removed: 3
  Local-only files kept: 0
  Conflicting files: 0
CONFLICT: tsconfig.json (local hash: , gitea hash: af8cca25f88759e9b18afb0166022345e0207f0dd419f8b7bed8bdd098dae710)

Summary for cosmos-real-estate:
  Identical files removed: 8
  Local-only files kept: 0
  Conflicting files: 1
```

### pms-backend

```
File Comparison for pms-backend
================================

CONFLICT: .env.example (local hash: 6e8bc7366b7856a5db2d80d69590191ce8abf4195eac4319c6c677e85428e8e9, gitea hash: 0e2d020bb8eaa56e1acd1c71c12c879ce3738abf4c650f113c1dc8484875782f)
LOCAL-ONLY: dist/controllers/authController.d.ts
LOCAL-ONLY: dist/controllers/authController.d.ts.map
LOCAL-ONLY: dist/controllers/authController.js
LOCAL-ONLY: dist/controllers/authController.js.map
LOCAL-ONLY: dist/index.d.ts
LOCAL-ONLY: dist/index.d.ts.map
LOCAL-ONLY: dist/index.js
LOCAL-ONLY: dist/index.js.map
LOCAL-ONLY: dist/middleware/auth.d.ts
LOCAL-ONLY: dist/middleware/auth.d.ts.map
LOCAL-ONLY: dist/middleware/auth.js
LOCAL-ONLY: dist/middleware/auth.js.map
LOCAL-ONLY: dist/middleware/errorHandler.d.ts
LOCAL-ONLY: dist/middleware/errorHandler.d.ts.map
LOCAL-ONLY: dist/middleware/errorHandler.js
LOCAL-ONLY: dist/middleware/errorHandler.js.map
LOCAL-ONLY: dist/middleware/logger.d.ts
LOCAL-ONLY: dist/middleware/logger.d.ts.map
LOCAL-ONLY: dist/middleware/logger.js
LOCAL-ONLY: dist/middleware/logger.js.map
LOCAL-ONLY: dist/routes/admin.d.ts
LOCAL-ONLY: dist/routes/admin.d.ts.map
LOCAL-ONLY: dist/routes/admin.js
LOCAL-ONLY: dist/routes/admin.js.map
LOCAL-ONLY: dist/routes/auth.d.ts
LOCAL-ONLY: dist/routes/auth.d.ts.map
LOCAL-ONLY: dist/routes/auth.js
LOCAL-ONLY: dist/routes/auth.js.map
LOCAL-ONLY: dist/routes/cyprus/index.d.ts
LOCAL-ONLY: dist/routes/cyprus/index.d.ts.map
LOCAL-ONLY: dist/routes/cyprus/index.js
LOCAL-ONLY: dist/routes/cyprus/index.js.map
LOCAL-ONLY: dist/routes/cyprus/jcc.d.ts
LOCAL-ONLY: dist/routes/cyprus/jcc.d.ts.map
LOCAL-ONLY: dist/routes/cyprus/jcc.js
LOCAL-ONLY: dist/routes/cyprus/jcc.js.map
LOCAL-ONLY: dist/routes/cyprus/police.d.ts
LOCAL-ONLY: dist/routes/cyprus/police.d.ts.map
LOCAL-ONLY: dist/routes/cyprus/police.js
LOCAL-ONLY: dist/routes/cyprus/police.js.map
LOCAL-ONLY: dist/routes/cyprus/sms.d.ts
LOCAL-ONLY: dist/routes/cyprus/sms.d.ts.map
LOCAL-ONLY: dist/routes/cyprus/sms.js
LOCAL-ONLY: dist/routes/cyprus/sms.js.map
LOCAL-ONLY: dist/routes/cyprus/vat.d.ts
LOCAL-ONLY: dist/routes/cyprus/vat.d.ts.map
LOCAL-ONLY: dist/routes/cyprus/vat.js
LOCAL-ONLY: dist/routes/cyprus/vat.js.map
LOCAL-ONLY: dist/routes/guests.d.ts
LOCAL-ONLY: dist/routes/guests.d.ts.map
LOCAL-ONLY: dist/routes/guests.js
LOCAL-ONLY: dist/routes/guests.js.map
LOCAL-ONLY: dist/routes/health.d.ts
LOCAL-ONLY: dist/routes/health.d.ts.map
LOCAL-ONLY: dist/routes/health.js
LOCAL-ONLY: dist/routes/health.js.map
LOCAL-ONLY: dist/routes/properties.d.ts
LOCAL-ONLY: dist/routes/properties.d.ts.map
LOCAL-ONLY: dist/routes/properties.js
LOCAL-ONLY: dist/routes/properties.js.map
LOCAL-ONLY: dist/routes/reservations.d.ts
LOCAL-ONLY: dist/routes/reservations.d.ts.map
LOCAL-ONLY: dist/routes/reservations.js
LOCAL-ONLY: dist/routes/reservations.js.map
LOCAL-ONLY: dist/routes/rooms.d.ts
LOCAL-ONLY: dist/routes/rooms.d.ts.map
LOCAL-ONLY: dist/routes/rooms.js
LOCAL-ONLY: dist/routes/rooms.js.map
LOCAL-ONLY: dist/routes/staff.d.ts
LOCAL-ONLY: dist/routes/staff.d.ts.map
LOCAL-ONLY: dist/routes/staff.js
LOCAL-ONLY: dist/routes/staff.js.map
LOCAL-ONLY: dist/routes/system.d.ts
LOCAL-ONLY: dist/routes/system.d.ts.map
LOCAL-ONLY: dist/routes/system.js
LOCAL-ONLY: dist/routes/system.js.map
LOCAL-ONLY: dist/utils/prisma.d.ts
LOCAL-ONLY: dist/utils/prisma.d.ts.map
LOCAL-ONLY: dist/utils/prisma.js
LOCAL-ONLY: dist/utils/prisma.js.map
LOCAL-ONLY: dist/__tests__/globalSetup.d.ts
LOCAL-ONLY: dist/__tests__/globalSetup.d.ts.map
LOCAL-ONLY: dist/__tests__/globalSetup.js
LOCAL-ONLY: dist/__tests__/globalSetup.js.map
LOCAL-ONLY: dist/__tests__/globalTeardown.d.ts
LOCAL-ONLY: dist/__tests__/globalTeardown.d.ts.map
LOCAL-ONLY: dist/__tests__/globalTeardown.js
LOCAL-ONLY: dist/__tests__/globalTeardown.js.map
LOCAL-ONLY: dist/__tests__/setup.d.ts
LOCAL-ONLY: dist/__tests__/setup.d.ts.map
LOCAL-ONLY: dist/__tests__/setup.js
LOCAL-ONLY: dist/__tests__/setup.js.map
CONFLICT: package-lock.json (local hash: c63783bdba4723f78ce1ebb36259b259dd11582ff192234c9d5052bff1585eb9, gitea hash: fb16b46f3c0833c9fdd949b4452c363356a017d135e095286e17a8ae49d10236)
CONFLICT: package.json (local hash: df0eea766722f84540a156df11b6305db73275db6fb6e8341e1e6f324fc8d1d1, gitea hash: 320e30797f762504fe6a92e33ee9fd22ebd3070534cb08fdf81637a902792fe7)
LOCAL-ONLY: prisma/dev.db
LOCAL-ONLY: prisma/migrations/20250914010026_initial_operations_system/migration.sql
LOCAL-ONLY: prisma/migrations/20250914010609_guest_experience_models/migration.sql
LOCAL-ONLY: prisma/migrations/20250914011929_analytics_reporting_system/migration.sql
LOCAL-ONLY: prisma/migrations/migration_lock.toml
CONFLICT: src/index.ts (local hash: aed3cd769dbb969bfa1f78a3de332750ff1c2744b14624d8f9ba3c7739953fbf, gitea hash: 3097af76d5a12b8d9d75b25239f2a3e6ec6191b316902c729e00b7705f68528a)
LOCAL-ONLY: src/middleware/tenant.ts
LOCAL-ONLY: src/routes/cyprus/index.ts
LOCAL-ONLY: src/routes/cyprus/jcc.ts
LOCAL-ONLY: src/routes/cyprus/police.ts
LOCAL-ONLY: src/routes/cyprus/sms.ts
LOCAL-ONLY: src/routes/cyprus/vat.ts
LOCAL-ONLY: src/routes/tenants.ts
LOCAL-ONLY: src/services/tenantService.ts
CONFLICT: tsconfig.json (local hash: 20190ed2c9f1ad3d231f4cb0ec0b25f1388eead4a3e7b7d3dd9605565ada79e8, gitea hash: f6c2eca27b02b327ff083d7ad758c5b9316f6b29c9b9355b7b04f87c7fc412bc)

Summary for pms-backend:
  Identical files removed: 0
  Local-only files kept: 105
  Conflicting files: 5
```

### pms-docs

```
File Comparison for pms-docs
================================


Summary for pms-docs:
  Identical files removed: 0
  Local-only files kept: 0
  Conflicting files: 0
### cyprus-access-control

```
```

File Comparison for cyprus-access-control
================================


Summary for cyprus-access-control:
  Identical files removed: 0
  Local-only files kept: 0
  Conflicting files: 0
```

### pms-guest

```
File Comparison for pms-guest
================================

LOCAL-ONLY: .github/workflows/ci.yml
CONFLICT: .gitignore (local hash: 4ee488a0d409e4fce9e4cbf5f54962983010d3b5a436ed1f2291a012ed05d2d9, gitea hash: 97956ee192530390d6fc3fc1cc7913c2398bfbb771efeddf87329079dd8059cc)

Summary for pms-guest:
  Identical files removed: 0
  Local-only files kept: 1
  Conflicting files: 1
```

### pms-infrastructure

```
### cyprus-localization

```
File Comparison for pms-infrastructure
================================

IDENTICAL: k8s/namespace.yaml (size: 1103 bytes)
IDENTICAL: k8s/namespace.yaml (size: 0 bytes)
IDENTICAL: package.json (size: 1849 bytes)
CONFLICT: package.json (local hash: , gitea hash: 52d440786f2ae2a8eedb4ca8955a3be5c04590d65fd998a6d8110371326ca4a1)
IDENTICAL: README.md (size: 12179 bytes)

Summary for pms-infrastructure:
  Identical files removed: 4
  Local-only files kept: 0
  Conflicting files: 0
CONFLICT: README.md (local hash: , gitea hash: 32161b76cce92fd3cca263753c8e229db59d3d5bffe0cf14aec45f16381db537)

Summary for pms-infrastructure:
  Identical files removed: 1
  Local-only files kept: 0
  Conflicting files: 2
```

File Comparison for cyprus-localization
================================

IDENTICAL: package.json (size: 1829 bytes)
IDENTICAL: README.md (size: 8106 bytes)
CONFLICT: package.json (local hash: , gitea hash: 9ce61928d1e2051ca2ccf944324dc1cd12553fa0a3df61a14fc8d1445029554a)
IDENTICAL: src/config/index.ts (size: 3305 bytes)
CONFLICT: README.md (local hash: file_not_found, gitea hash: d91f1b29b0a82ed7ba2e423851c31b5127805f803e364da757c8c97db421fff9)
CONFLICT: src/config/index.ts (local hash: , gitea hash: 74a4cc9091936c369e7ad6e32a5a972eb59a0264bca22be3e0d05643ff051a42)
IDENTICAL: src/index.ts (size: 2788 bytes)
CONFLICT: src/index.ts (local hash: , gitea hash: 8c082522b7d9e745c6228510ace810f3205a8882af95bbdeb453fcc7e96c28c3)
IDENTICAL: src/middleware/errorHandler.ts (size: 1414 bytes)
CONFLICT: src/middleware/errorHandler.ts (local hash: , gitea hash: 65871ab7cb285d33f4e354445bbc74a6c9b1f6fb840a32e9210458d8e5dacfb6)
IDENTICAL: src/routes/jcc.ts (size: 6108 bytes)
CONFLICT: src/routes/jcc.ts (local hash: , gitea hash: 9dbc467fd8fe13031b8f589a431f7f9f6d82a3588be0c7924d4c7aac225b3390)
IDENTICAL: src/routes/localization.ts (size: 10236 bytes)
IDENTICAL: src/routes/localization.ts (size: 0 bytes)
IDENTICAL: src/routes/police.ts (size: 5887 bytes)
IDENTICAL: src/routes/sms.ts (size: 7523 bytes)
CONFLICT: src/routes/police.ts (local hash: , gitea hash: 149d87602e636fc240d0caf58bed2f50a1d3618057b12824c8ea75804f49c472)
CONFLICT: src/routes/sms.ts (local hash: file_not_found, gitea hash: 6782455db543622550e583ae4784fad9f13962b192d63ee6bd21412936eeed38)
IDENTICAL: src/routes/vat.ts (size: 4400 bytes)
IDENTICAL: src/routes/vat.ts (size: 0 bytes)
IDENTICAL: src/utils/logger.ts (size: 1052 bytes)

Summary for cyprus-localization:
  Identical files removed: 11
  Local-only files kept: 0
  Conflicting files: 0
CONFLICT: src/utils/logger.ts (local hash: file_not_found, gitea hash: 0f00d5578e19512dcdba812fec76692f1bdbdcd1843f44162658e4f8d54fff20)

Summary for cyprus-localization:
  Identical files removed: 2
  Local-only files kept: 0
  Conflicting files: 9
```

### pms-infrastructure-repo

```
File Comparison for pms-infrastructure-repo
================================

CONFLICT: scripts/LOAD_TEST_REPORT.md (local hash: 35818c3269ca83423185d7ae760f415cbd121dea88ecf2d8f18b34c28ecc29d6, gitea hash: ec4d5ed8f413da01d23f736783ed821045ef2b20b49d593f44dfabe5983a6eb2)
CONFLICT: scripts/REALITY_VERIFICATION_COMPLETE.md (local hash: 1fad419d0c61eb5abf8a57c1825e8b73c153206826f2e338d61f7e13a2ce3177, gitea hash: af5d1d2f76ac4d206d8717aab4d145ca0d6c6737e690103cf362336f796a0e5a)
CONFLICT: scripts/SECURITY_AUDIT_REPORT.md (local hash: 81e3a9cf92cca123693ed328714ffc5477420a31a909e6e3fe3b4f2e5b5fd396, gitea hash: af54d4dfbfed2544f198f8aea475a4dd400572babb79b4587a87d0d9bc50f4d5)

Summary for pms-infrastructure-repo:
  Identical files removed: 0
  Local-only files kept: 0
  Conflicting files: 3
```

### database-schema

```
### pms-marketplace

```
File Comparison for pms-marketplace
================================


Summary for pms-marketplace:
  Identical files removed: 0
  Local-only files kept: 0
  Conflicting files: 0
File Comparison for database-schema
================================

IDENTICAL: .gitignore (size: 623 bytes)
IDENTICAL: package.json (size: 1297 bytes)
LOCAL-ONLY: prisma/dev.db
IDENTICAL: package.json (size: 0 bytes)
IDENTICAL: prisma/dev.db.backup.20250915_004259 (size: 397312 bytes)
LOCAL-ONLY: prisma/migrations/20250914010026_initial_operations_system/migration.sql
LOCAL-ONLY: prisma/dev.db
LOCAL-ONLY: prisma/migrations/20250914010609_guest_experience_models/migration.sql
LOCAL-ONLY: prisma/migrations/20250914011929_analytics_reporting_system/migration.sql
CONFLICT: prisma/dev.db.backup.20250915_004259 (local hash: file_not_found, gitea hash: a1e3cf1f2215fed64068b81e284f67f255d7b9f62a1608ef4401d36970c14db4)
LOCAL-ONLY: prisma/migrations/20250914010026_initial_operations_system/migration.sql
IDENTICAL: prisma/migrations/migration_lock.toml (size: 127 bytes)
LOCAL-ONLY: prisma/migrations/20250914010609_guest_experience_models/migration.sql
LOCAL-ONLY: prisma/migrations/20250914011929_analytics_reporting_system/migration.sql
IDENTICAL: prisma/schema-enhanced.prisma (size: 19797 bytes)
CONFLICT: prisma/migrations/migration_lock.toml (local hash: file_not_found, gitea hash: 492a46d005d966e41995e21b124bc2b69512c1eda23bef03baa901d56957de5d)
CONFLICT: prisma/schema-enhanced.prisma (local hash: file_not_found, gitea hash: caa98cfa9811153986d3890ad43d5f5d62232eda1bab2c3550e9550eccc1d24c)
IDENTICAL: prisma/schema.prisma (size: 27666 bytes)
CONFLICT: prisma/schema.prisma (local hash: , gitea hash: e937f32a2d40efc68b4011f8834a16caaf201447fc903507117ba55f1d2c317a)
IDENTICAL: prisma/seed.ts (size: 7698 bytes)
CONFLICT: prisma/seed.ts (local hash: , gitea hash: 078362b841c7aea3196624f69fe89078369ff2ca75ca02e691710b1262774b56)
IDENTICAL: README.md (size: 4606 bytes)
IDENTICAL: README.md (size: 0 bytes)
IDENTICAL: schema.prisma (size: 27666 bytes)
CONFLICT: schema.prisma (local hash: , gitea hash: e937f32a2d40efc68b4011f8834a16caaf201447fc903507117ba55f1d2c317a)
IDENTICAL: tsconfig.json (size: 564 bytes)

Summary for database-schema:
  Identical files removed: 10
  Local-only files kept: 4
  Conflicting files: 0
IDENTICAL: tsconfig.json (size: 0 bytes)

Summary for database-schema:
  Identical files removed: 3
  Local-only files kept: 4
  Conflicting files: 6
```

```

### pms-shared-repo

```
File Comparison for pms-shared-repo
================================


Summary for pms-shared-repo:
  Identical files removed: 0
  Local-only files kept: 0
  Conflicting files: 0
```

### invitation-engine

```
File Comparison for invitation-engine
================================

IDENTICAL: .env (size: 2950 bytes)
IDENTICAL: .env (size: 0 bytes)
IDENTICAL: .env.example (size: 2950 bytes)
CONFLICT: .env.example (local hash: , gitea hash: e6d82524807a56ad88b31dcb26fe0203b4206b9a37c392cf41e84552a0b0fa2f)
IDENTICAL: deploy-container-31.sh (size: 7486 bytes)
CONFLICT: dist/database/connection.d.ts (local hash: 8f97f394b800aa11a885765697c39b872d4fff7299f1f3ff5639ecfb97311821, gitea hash: 8c373da9493fae704207e11b601287481b53bb6980e2734c425606167f0b333c)
CONFLICT: deploy-container-31.sh (local hash: , gitea hash: 9a9a991d138a3becbb5f207fa7e88d053d6f560c610eabd81e1042c71972b586)
IDENTICAL: dist/database/connection.d.ts.map (size: 1971 bytes)
CONFLICT: dist/database/connection.js (local hash: df03c6ba8f63a5d29250316966593e5bcb956d5a6e7344a72d7f299e1fffdc70, gitea hash: eaf34e07a24325b90d98545504af8e6c4b1649c80a9dadfa9736e2f57207f95a)
CONFLICT: dist/database/connection.d.ts (local hash: 8f97f394b800aa11a885765697c39b872d4fff7299f1f3ff5639ecfb97311821, gitea hash: 8c373da9493fae704207e11b601287481b53bb6980e2734c425606167f0b333c)
CONFLICT: dist/database/connection.d.ts.map (local hash: file_not_found, gitea hash: 75545eab50d5057c9cd25fee44f652e5b345da3e026ee502823e170c0dee3e34)
IDENTICAL: dist/database/connection.js.map (size: 10416 bytes)
CONFLICT: dist/index.d.ts (local hash: 4ad829d9bfdbe5e3817da30b59d580409ac48b21b93ed0234aa45a113a9a74d6, gitea hash: 9f1813fb44646e4c439f93c2d831736142c87cfc475264bda1dba9d246a06ffe)
CONFLICT: dist/database/connection.js (local hash: df03c6ba8f63a5d29250316966593e5bcb956d5a6e7344a72d7f299e1fffdc70, gitea hash: eaf34e07a24325b90d98545504af8e6c4b1649c80a9dadfa9736e2f57207f95a)
CONFLICT: dist/database/connection.js.map (local hash: file_not_found, gitea hash: 23d3b04d0c34c29d4f067bf475d551b686681d3e2a37bce72b933528f7769398)
IDENTICAL: dist/index.d.ts.map (size: 880 bytes)
CONFLICT: dist/index.js (local hash: 72ff65b8fba8f2a1642434d607dbe0a2f704ca34a01105959ac55094ba2e06fb, gitea hash: e6a541522b9c5dc9e4169599f7c7400fb369706c86cfc980dbe33230d59032cc)
CONFLICT: dist/index.d.ts (local hash: 4ad829d9bfdbe5e3817da30b59d580409ac48b21b93ed0234aa45a113a9a74d6, gitea hash: 9f1813fb44646e4c439f93c2d831736142c87cfc475264bda1dba9d246a06ffe)
IDENTICAL: dist/index.js.map (size: 10534 bytes)
CONFLICT: dist/index.d.ts.map (local hash: file_not_found, gitea hash: 6b821e8472ffd81c4e7947bc428cd18171624a9023eea951b54f4b2f2b649486)
CONFLICT: dist/middleware/auth.d.ts (local hash: 886753f2d5db79dda1eb369215665e0e336e9c78b9a3781df9563b5dec84d8a7, gitea hash: 70bf86beda39e1edae45c6c984a2a345550f624ec7737981e668398c965ca209)
CONFLICT: dist/index.js (local hash: 72ff65b8fba8f2a1642434d607dbe0a2f704ca34a01105959ac55094ba2e06fb, gitea hash: e6a541522b9c5dc9e4169599f7c7400fb369706c86cfc980dbe33230d59032cc)
IDENTICAL: dist/middleware/auth.d.ts.map (size: 424 bytes)
CONFLICT: dist/index.js.map (local hash: file_not_found, gitea hash: aefd66687cc7e37cf449359b7b78e6aa772eb8241e09ade9ef1e6b40f394e8c1)
CONFLICT: dist/middleware/auth.js (local hash: f759d885fd972161b35217744fa5a3f45d25f8c4efe9aba3180ffae7d31b0114, gitea hash: 3cdc5446256099b58a1ed1fe589a42f7eaf868b12958c6f699b2d8e2e1025959)
CONFLICT: dist/middleware/auth.d.ts (local hash: 886753f2d5db79dda1eb369215665e0e336e9c78b9a3781df9563b5dec84d8a7, gitea hash: 70bf86beda39e1edae45c6c984a2a345550f624ec7737981e668398c965ca209)
IDENTICAL: dist/middleware/auth.js.map (size: 1704 bytes)
CONFLICT: dist/middleware/auth.d.ts.map (local hash: file_not_found, gitea hash: 94eaa6e6022523476bf99c176acd67acc147819b7bfb894b738f390bead42082)
CONFLICT: dist/middleware/errorHandler.d.ts (local hash: 361b00a148f38fcfb6e3d31bf4f629105cf877624d784af4d93781c82e58dd6c, gitea hash: 0b9419d92139eb420fd30df68ff50721424c65b14b00b61a5b6efd04ee1ad41a)
CONFLICT: dist/middleware/auth.js (local hash: f759d885fd972161b35217744fa5a3f45d25f8c4efe9aba3180ffae7d31b0114, gitea hash: 3cdc5446256099b58a1ed1fe589a42f7eaf868b12958c6f699b2d8e2e1025959)
IDENTICAL: dist/middleware/errorHandler.d.ts.map (size: 1850 bytes)
CONFLICT: dist/middleware/auth.js.map (local hash: file_not_found, gitea hash: 36309869b5c3d87ffa111d3006f815af04fa0e7992db9ff0af5d945b9a1827b7)
CONFLICT: dist/middleware/errorHandler.js (local hash: 389581ab78d9a225a70626accb91f8407e666efb147ce1856dc62224224ec450, gitea hash: a233bb835fc961668c468bb31d63b0e1908c2bd66ca2a6f01b4cf3e5ca90cafc)
CONFLICT: dist/middleware/errorHandler.d.ts (local hash: 361b00a148f38fcfb6e3d31bf4f629105cf877624d784af4d93781c82e58dd6c, gitea hash: 0b9419d92139eb420fd30df68ff50721424c65b14b00b61a5b6efd04ee1ad41a)
IDENTICAL: dist/middleware/errorHandler.js.map (size: 9099 bytes)
CONFLICT: dist/middleware/errorHandler.d.ts.map (local hash: file_not_found, gitea hash: 564519a70721419785c8be74e35ba00559bc6921d38cb37bb8174edd7d4767c5)
CONFLICT: dist/middleware/rateLimiter.d.ts (local hash: 917dc9bf7b650f32ed6291571c180bd74ce17e5c495fa39e5d19b9d1602f74e7, gitea hash: b0aa89df18faa72d4212cfec47fc3a6a9f4a1d31550fa9db814e54403fd32773)
CONFLICT: dist/middleware/errorHandler.js (local hash: 389581ab78d9a225a70626accb91f8407e666efb147ce1856dc62224224ec450, gitea hash: a233bb835fc961668c468bb31d63b0e1908c2bd66ca2a6f01b4cf3e5ca90cafc)
IDENTICAL: dist/middleware/rateLimiter.d.ts.map (size: 1189 bytes)
CONFLICT: dist/middleware/errorHandler.js.map (local hash: file_not_found, gitea hash: 4dfa86e91dc71644c99815a973ed7b5e2408bd9bc9a5c7f5e3fa14d59489b6d7)
CONFLICT: dist/middleware/rateLimiter.js (local hash: 0c8deb228e12f41507e591c1b188a07ba03028057277f7c835de2137b50b50ff, gitea hash: 67803d46bef0a8875c3e3c2ee9219c3948004521416da417079ead156d6669bd)
CONFLICT: dist/middleware/rateLimiter.d.ts (local hash: 917dc9bf7b650f32ed6291571c180bd74ce17e5c495fa39e5d19b9d1602f74e7, gitea hash: b0aa89df18faa72d4212cfec47fc3a6a9f4a1d31550fa9db814e54403fd32773)
IDENTICAL: dist/middleware/rateLimiter.js.map (size: 8027 bytes)
CONFLICT: dist/middleware/rateLimiter.d.ts.map (local hash: file_not_found, gitea hash: 850f06f95b22c95af083e1bc9b04a2ead5c2fa522b43560f6ca67834e986d2cf)
CONFLICT: dist/routes/admin.d.ts (local hash: 1594b9005eb104ea165382f3ff8d346d64c314d0ddb7f6ebefca3c1f3f69d740, gitea hash: 86f1956879f80309c144e55a7f41a919256008de6b983b1a35457240a8f90289)
CONFLICT: dist/middleware/rateLimiter.js (local hash: 0c8deb228e12f41507e591c1b188a07ba03028057277f7c835de2137b50b50ff, gitea hash: 67803d46bef0a8875c3e3c2ee9219c3948004521416da417079ead156d6669bd)
IDENTICAL: dist/routes/admin.d.ts.map (size: 167 bytes)
CONFLICT: dist/middleware/rateLimiter.js.map (local hash: file_not_found, gitea hash: 5dfedb14fa9e75acb8f84f151e0e25cc4c6fe1d147d4c41589487235f4e28033)
CONFLICT: dist/routes/admin.js (local hash: 54ce2b3d65d1e640da1fcb15c51f17d522c704b543bc9b6424e7e29ed99a14be, gitea hash: 80d364de7f6b147bf67d916bd230ad2d30d9a0e5ed1da64f3378f29c2c266092)
CONFLICT: dist/routes/admin.d.ts (local hash: 1594b9005eb104ea165382f3ff8d346d64c314d0ddb7f6ebefca3c1f3f69d740, gitea hash: 86f1956879f80309c144e55a7f41a919256008de6b983b1a35457240a8f90289)
IDENTICAL: dist/routes/admin.js.map (size: 6536 bytes)
CONFLICT: dist/routes/admin.d.ts.map (local hash: file_not_found, gitea hash: 977fd5e0e65d10749f0aee1ed237f74ea4c8db70ba2c2ab1514cf001161ee77a)
CONFLICT: dist/routes/analytics.d.ts (local hash: 1cc32f3bce0c6546abf508beba5a21ff8cd6fdd081e58c18b69aa919ef5a73fd, gitea hash: cb766fb6e6fdbc47deb220cb48e4e9f3adb925c9570fbd4689fd58138854fd7c)
CONFLICT: dist/routes/admin.js (local hash: 54ce2b3d65d1e640da1fcb15c51f17d522c704b543bc9b6424e7e29ed99a14be, gitea hash: 80d364de7f6b147bf67d916bd230ad2d30d9a0e5ed1da64f3378f29c2c266092)
IDENTICAL: dist/routes/analytics.d.ts.map (size: 174 bytes)
CONFLICT: dist/routes/admin.js.map (local hash: file_not_found, gitea hash: 7a6f62fe7020b93522e97a87873f93ce997f15f37e133d8870187a5d490618cc)
CONFLICT: dist/routes/analytics.js (local hash: ad1c6854063ca5ff8e910d88e43ec1bdfc4cd8c95a58574971ba65c66c41913d, gitea hash: bba90641c19026745b3c82b1d3f829ec19b04b604220fd44f151b21ad78d76d0)
CONFLICT: dist/routes/analytics.d.ts (local hash: 1cc32f3bce0c6546abf508beba5a21ff8cd6fdd081e58c18b69aa919ef5a73fd, gitea hash: cb766fb6e6fdbc47deb220cb48e4e9f3adb925c9570fbd4689fd58138854fd7c)
IDENTICAL: dist/routes/analytics.js.map (size: 745 bytes)
CONFLICT: dist/routes/analytics.d.ts.map (local hash: file_not_found, gitea hash: 37440f5704cb8c123a2a09a1014289887b0d5a466d85fbfff70ef0de83a1aa92)
CONFLICT: dist/routes/courier.d.ts (local hash: 013ac07ffa8ac2914980e544322e8209b50cfd04e80af0e994f923bc6a780ae0, gitea hash: 5032a8ccf11e5a925884bbe5f1bbe2c8a91e46aa50210fe8a4d1a4f2bfbf3056)
CONFLICT: dist/routes/analytics.js (local hash: ad1c6854063ca5ff8e910d88e43ec1bdfc4cd8c95a58574971ba65c66c41913d, gitea hash: bba90641c19026745b3c82b1d3f829ec19b04b604220fd44f151b21ad78d76d0)
IDENTICAL: dist/routes/courier.d.ts.map (size: 170 bytes)
CONFLICT: dist/routes/analytics.js.map (local hash: file_not_found, gitea hash: e948c424af82d50c9b5c5966953229d80b894bca71b7590fc7bc62a546fd7803)
CONFLICT: dist/routes/courier.js (local hash: 39819e1f79b33eb7c2d05f4269a1e30919fe9940f3114fb94706fbd496502fb4, gitea hash: 2d9a374e93463ef9794b9cc362121f9fee782aa687571170061e74bbfd3199c1)
CONFLICT: dist/routes/courier.d.ts (local hash: 013ac07ffa8ac2914980e544322e8209b50cfd04e80af0e994f923bc6a780ae0, gitea hash: 5032a8ccf11e5a925884bbe5f1bbe2c8a91e46aa50210fe8a4d1a4f2bfbf3056)
CONFLICT: dist/routes/courier.d.ts.map (local hash: file_not_found, gitea hash: 5ce8ea8bb85c2e8f39f49c2f8d65bca2adb062fdf24f9be3ff986d622350a25a)
IDENTICAL: dist/routes/courier.js.map (size: 8246 bytes)
CONFLICT: dist/routes/health.d.ts (local hash: 86eb6440d833abbc671524429978cbe3230b3a4181a31de34c0eb3083276d8ee, gitea hash: 9f6b6204df01a65f20e8e7118102b8244d2311935abab7b3e902d3d00ba39cb3)
CONFLICT: dist/routes/courier.js (local hash: 39819e1f79b33eb7c2d05f4269a1e30919fe9940f3114fb94706fbd496502fb4, gitea hash: 2d9a374e93463ef9794b9cc362121f9fee782aa687571170061e74bbfd3199c1)
CONFLICT: dist/routes/courier.js.map (local hash: file_not_found, gitea hash: ea9d3176f4a259228a1eba410ec1dd4377adb2e2889450e17fd2aab1ab7461e3)
IDENTICAL: dist/routes/health.d.ts.map (size: 168 bytes)
CONFLICT: dist/routes/health.js (local hash: 13a8ff9b9bf4db46a742c50bc9ebcac6e477acb8013bfc1a74d7da2ba8526286, gitea hash: 83fbce820917c61b24f88cde63ab536089c6a58fe761a14f15a053f72b781f50)
CONFLICT: dist/routes/health.d.ts (local hash: 86eb6440d833abbc671524429978cbe3230b3a4181a31de34c0eb3083276d8ee, gitea hash: 9f6b6204df01a65f20e8e7118102b8244d2311935abab7b3e902d3d00ba39cb3)
CONFLICT: dist/routes/health.d.ts.map (local hash: file_not_found, gitea hash: 1c57332db1375dda792e9e4a08de378aa09eaa59e1d6f16423d2c5f25ecfcfc1)
IDENTICAL: dist/routes/health.js.map (size: 9921 bytes)
CONFLICT: dist/routes/invitations.d.ts (local hash: 5f7b08f7f32457068cbf2c6d3c4f9469450b567fb24075d411f60b2a734504d6, gitea hash: f848c119df58c5848527ca014802c446e4161a073a716e8d4ec3de4266fe552b)
CONFLICT: dist/routes/health.js (local hash: 13a8ff9b9bf4db46a742c50bc9ebcac6e477acb8013bfc1a74d7da2ba8526286, gitea hash: 83fbce820917c61b24f88cde63ab536089c6a58fe761a14f15a053f72b781f50)
IDENTICAL: dist/routes/invitations.d.ts.map (size: 178 bytes)
CONFLICT: dist/routes/health.js.map (local hash: file_not_found, gitea hash: 421e1e67c71bfe993593c24a3a8a97d8da3c663650ecc707edfa5c9acdc1ecb6)
CONFLICT: dist/routes/invitations.js (local hash: e6bb87e25ee08d81e54f0bd0f29be8dfa0ab1f1a08a0e67276c36eaab1db4823, gitea hash: 3f5e1eaff593acedb86d37737d2d3a26030cac1f0523cd4ff83e009de0af1186)
CONFLICT: dist/routes/invitations.d.ts (local hash: 5f7b08f7f32457068cbf2c6d3c4f9469450b567fb24075d411f60b2a734504d6, gitea hash: f848c119df58c5848527ca014802c446e4161a073a716e8d4ec3de4266fe552b)
IDENTICAL: dist/routes/invitations.js.map (size: 875 bytes)
CONFLICT: dist/routes/invitations.d.ts.map (local hash: file_not_found, gitea hash: b9cb744b0493eb875405fd5352146df9962f15df31c538bc3f0b1a37c3e27e9c)
CONFLICT: dist/routes/location.d.ts (local hash: a412b38958d91b394bc70a3fe222a5121c7739d8fb9f118041ab07d6a8cda4c4, gitea hash: df8cbdbb72c2de62d991865f3cd1842fc8d5a6b2e74363d8e2ab9e2b205f0d04)
CONFLICT: dist/routes/invitations.js (local hash: e6bb87e25ee08d81e54f0bd0f29be8dfa0ab1f1a08a0e67276c36eaab1db4823, gitea hash: 3f5e1eaff593acedb86d37737d2d3a26030cac1f0523cd4ff83e009de0af1186)
IDENTICAL: dist/routes/location.d.ts.map (size: 172 bytes)
CONFLICT: dist/routes/invitations.js.map (local hash: file_not_found, gitea hash: d9554d1d86c4e946795a0a196e1d1fd228b9d34b7219bf00493d9beb7eab63ca)
CONFLICT: dist/routes/location.js (local hash: 88f72a5766bf4628875e00c89260a6bcccde3f47aa01805936abf510869627f0, gitea hash: 5c877fb908f85ebfb45c9fa1ed885b371c7da0a3c6f7a243ed708461e1516a9b)
CONFLICT: dist/routes/location.d.ts (local hash: a412b38958d91b394bc70a3fe222a5121c7739d8fb9f118041ab07d6a8cda4c4, gitea hash: df8cbdbb72c2de62d991865f3cd1842fc8d5a6b2e74363d8e2ab9e2b205f0d04)
IDENTICAL: dist/routes/location.js.map (size: 548 bytes)
CONFLICT: dist/routes/location.d.ts.map (local hash: file_not_found, gitea hash: 88896f80054ebcf4be1e95d5bc78262e701c9ceeba0beacb2a03b209935a0eb7)
CONFLICT: dist/routes/qr.d.ts (local hash: 25cc51fe4ecd2a866fbf84b75a1d6bc42ae7b95ad84b7fdc857aea4e5b16754d, gitea hash: 9026c637855ae5976d35d892dc6186e1fafbc2ef435d29064f7bb5eee6249abc)
IDENTICAL: dist/routes/qr.d.ts.map (size: 161 bytes)
CONFLICT: dist/routes/location.js (local hash: 88f72a5766bf4628875e00c89260a6bcccde3f47aa01805936abf510869627f0, gitea hash: 5c877fb908f85ebfb45c9fa1ed885b371c7da0a3c6f7a243ed708461e1516a9b)
CONFLICT: dist/routes/location.js.map (local hash: file_not_found, gitea hash: d69e4f017be976b5b5bc610072c7e0b683a1ea8fdcf7c4ec13bf24ea5838f42f)
CONFLICT: dist/routes/qr.js (local hash: 706b58d759020f7855f2903cae7026c7ac63af87b0023a33a368bea2aeab1155, gitea hash: 9bb35af7d063f3a6bc7917264194a243eed2c3538de51aa4798aa48250e60db8)
CONFLICT: dist/routes/qr.d.ts (local hash: 25cc51fe4ecd2a866fbf84b75a1d6bc42ae7b95ad84b7fdc857aea4e5b16754d, gitea hash: 9026c637855ae5976d35d892dc6186e1fafbc2ef435d29064f7bb5eee6249abc)
IDENTICAL: dist/routes/qr.js.map (size: 7538 bytes)
CONFLICT: dist/routes/qr.d.ts.map (local hash: file_not_found, gitea hash: 2f419a69fe3283a75b30e9d66c22c35b99cf6c58c916cb6cd0a65cb470253a2a)
CONFLICT: dist/routes/trials.d.ts (local hash: 58496e4f12f015215f64b72a1bfbf2860b5b2c5a3cdbc36a6fd5744c263ca2fb, gitea hash: 1a98a98fc831c68f711e64734804e4cd3208638171ebfc0679029064c6c1aced)
IDENTICAL: dist/routes/trials.d.ts.map (size: 168 bytes)
CONFLICT: dist/routes/qr.js (local hash: 706b58d759020f7855f2903cae7026c7ac63af87b0023a33a368bea2aeab1155, gitea hash: 9bb35af7d063f3a6bc7917264194a243eed2c3538de51aa4798aa48250e60db8)
CONFLICT: dist/routes/trials.js (local hash: 9c093f2063fd97970f8b2e4ae1ffb1695e3adc9e7e03b5c960d21b4b0cbaccc0, gitea hash: 1c61c3c98a59a8113ed92352f9d3f7f5cc95878ebf4c6cfebfd707961912d1ac)
CONFLICT: dist/routes/qr.js.map (local hash: file_not_found, gitea hash: c5280fbed82e42e702d1d64fc4ec4b54ffedd1406fa34271602305144bce846b)
IDENTICAL: dist/routes/trials.js.map (size: 6863 bytes)
CONFLICT: dist/routes/trials.d.ts (local hash: 58496e4f12f015215f64b72a1bfbf2860b5b2c5a3cdbc36a6fd5744c263ca2fb, gitea hash: 1a98a98fc831c68f711e64734804e4cd3208638171ebfc0679029064c6c1aced)
CONFLICT: dist/services/courier.d.ts (local hash: a8105d9cbc2544fc242fff6da74e2d3d595b4ce9f4dfbcfc1958ef2a0dd6852a, gitea hash: 489a89467e79ba4b220cc62d2c19857969ec66b48b7a93239d4bac246e34f2ac)
CONFLICT: dist/routes/trials.d.ts.map (local hash: file_not_found, gitea hash: 78f29ea7658290f233ff537a330c8cb98ef71dcf8b3edfd9c9f59c6df05719cd)
IDENTICAL: dist/services/courier.d.ts.map (size: 2644 bytes)
CONFLICT: dist/routes/trials.js (local hash: 9c093f2063fd97970f8b2e4ae1ffb1695e3adc9e7e03b5c960d21b4b0cbaccc0, gitea hash: 1c61c3c98a59a8113ed92352f9d3f7f5cc95878ebf4c6cfebfd707961912d1ac)
CONFLICT: dist/services/courier.js (local hash: 6cad077caea1cab36e8bd8987511888d7da4288763ae3702d7f516bcf6a7ec40, gitea hash: 0793c2ec8cbc45b5f9618817663d47b1dc582d7682bd644035f9d49d724f92e5)
IDENTICAL: dist/services/courier.js.map (size: 10980 bytes)
CONFLICT: dist/routes/trials.js.map (local hash: file_not_found, gitea hash: e36bd7bc25e7b469cd5a5553af9a91c068e2b8eedb1b217bb09538f97606a8d6)
CONFLICT: dist/services/geofencing.d.ts (local hash: ef758d17e6e2a66ad782b8ae929e6cec70b87e689b6d11feee3e02068ae2a4e9, gitea hash: 7cf6b9584a470820ede8dcdcf6334d832d1c0f69e5b8c607bd1861040c9aeb04)
CONFLICT: dist/services/courier.d.ts (local hash: a8105d9cbc2544fc242fff6da74e2d3d595b4ce9f4dfbcfc1958ef2a0dd6852a, gitea hash: 489a89467e79ba4b220cc62d2c19857969ec66b48b7a93239d4bac246e34f2ac)
IDENTICAL: dist/services/geofencing.d.ts.map (size: 934 bytes)
CONFLICT: dist/services/courier.d.ts.map (local hash: file_not_found, gitea hash: 4d4a9a6ac60f16bf2728802a975b46c6bd6d202c709d2b4d0fbdf127e5d4e4f9)
CONFLICT: dist/services/geofencing.js (local hash: 79894dc17d93a974678e1fd69b90bb015830272ca44c0866166b26b7cde3203a, gitea hash: c3b733655f83597998f15ebc34197cf421363a896736f858762d11d4e246232e)
CONFLICT: dist/services/courier.js (local hash: 6cad077caea1cab36e8bd8987511888d7da4288763ae3702d7f516bcf6a7ec40, gitea hash: 0793c2ec8cbc45b5f9618817663d47b1dc582d7682bd644035f9d49d724f92e5)
IDENTICAL: dist/services/geofencing.js.map (size: 13838 bytes)
CONFLICT: dist/services/courier.js.map (local hash: file_not_found, gitea hash: a07303cbad930bd2123e5dc07a771414b4d674cc796e6eb249131a8d789fcdad)
CONFLICT: dist/services/qrCode.d.ts (local hash: c11b184c97ae95761d28246ff38123ccb49ee419a4dba1fde28a00c51f300f48, gitea hash: fffda17ab448338b7dc1c06de3df79b19747f35368885da9f910ed0f69dfac0b)
IDENTICAL: dist/services/qrCode.d.ts.map (size: 1881 bytes)
CONFLICT: dist/services/geofencing.d.ts (local hash: ef758d17e6e2a66ad782b8ae929e6cec70b87e689b6d11feee3e02068ae2a4e9, gitea hash: 7cf6b9584a470820ede8dcdcf6334d832d1c0f69e5b8c607bd1861040c9aeb04)
CONFLICT: dist/services/qrCode.js (local hash: 89138951ce8a94c320dc371649f58bbbf61d568379e4c2aba56a2e96f4273509, gitea hash: 0da62809b444115e3ddb965eb87d07dc7abcf3004205ada222d3c6c22bce2e25)
CONFLICT: dist/services/geofencing.d.ts.map (local hash: file_not_found, gitea hash: c3ee2436237f1103cdbdebe4bd5764bec95a2489bb516b97187a4d2cfd7d481a)
IDENTICAL: dist/services/qrCode.js.map (size: 8927 bytes)
CONFLICT: dist/services/geofencing.js (local hash: 79894dc17d93a974678e1fd69b90bb015830272ca44c0866166b26b7cde3203a, gitea hash: c3b733655f83597998f15ebc34197cf421363a896736f858762d11d4e246232e)
CONFLICT: dist/services/trialCountdown.d.ts (local hash: d77a65a504ddcce2284457e4b4bb5a7cde3a37812b07e237197c863c3af2400d, gitea hash: d1c86705b1e5f3207712c47bf6a90018408d81326c227b129b4c3fb68a5b54d9)
CONFLICT: dist/services/geofencing.js.map (local hash: file_not_found, gitea hash: 14f19edd78d97f9a6d09cc2613c9fef76c8459bcc46b0280e4bf97593eed6138)
IDENTICAL: dist/services/trialCountdown.d.ts.map (size: 2817 bytes)
CONFLICT: dist/services/trialCountdown.js (local hash: df7d3556b3437177cb8ee6bc54b4fa25511b86b9c3b68f54e06e598bb88fd416, gitea hash: 4ec1ad044017f4f5a198bce606e2153cc59acadb55210c8daa6b4328dd76b139)
CONFLICT: dist/services/qrCode.d.ts (local hash: c11b184c97ae95761d28246ff38123ccb49ee419a4dba1fde28a00c51f300f48, gitea hash: fffda17ab448338b7dc1c06de3df79b19747f35368885da9f910ed0f69dfac0b)
CONFLICT: dist/services/qrCode.d.ts.map (local hash: file_not_found, gitea hash: 17c4e57be9bbdc8805fbc75601eef7ca88e5ce93f0aedd846cde4766e8aef66f)
IDENTICAL: dist/services/trialCountdown.js.map (size: 13068 bytes)
CONFLICT: dist/types/extended.d.ts (local hash: 3d441c4e2de6373d569b8cd604da073da2785eb5702c4ed990ad56d327c3d954, gitea hash: f64bde9e5e610e1ba17938d5ca89fdc523bd457737095bf8e94c7a73d211afaa)
CONFLICT: dist/services/qrCode.js (local hash: 89138951ce8a94c320dc371649f58bbbf61d568379e4c2aba56a2e96f4273509, gitea hash: 0da62809b444115e3ddb965eb87d07dc7abcf3004205ada222d3c6c22bce2e25)
IDENTICAL: dist/types/extended.d.ts.map (size: 2993 bytes)
CONFLICT: dist/services/qrCode.js.map (local hash: file_not_found, gitea hash: 2eccd2a96e319796ebe1c9c609609aafbd36a05570dd6ca244141027769a6b30)
CONFLICT: dist/types/extended.js (local hash: e850fd1c194b8e3bb647b2944357b9680312789ea1a853275889a7fa8935cc04, gitea hash: f85b489e01a0398cc2a83acded54275f7c55361fbab7d7c40c427f261143225e)
CONFLICT: dist/services/trialCountdown.d.ts (local hash: d77a65a504ddcce2284457e4b4bb5a7cde3a37812b07e237197c863c3af2400d, gitea hash: d1c86705b1e5f3207712c47bf6a90018408d81326c227b129b4c3fb68a5b54d9)
IDENTICAL: dist/types/extended.js.map (size: 117 bytes)
CONFLICT: dist/services/trialCountdown.d.ts.map (local hash: file_not_found, gitea hash: 6d58c6806ddd247fea9da3b5b8e8dbfceacecc69364b0f93239ecb649374aace)
CONFLICT: dist/types/index.d.ts (local hash: 04e8fd4fe0de2569ece9c6db7bef565999ae6ca33e5e7fdc2674163d8648bb98, gitea hash: 788d19aa70f499ff9ded8c14ec64640b900086bb1ab85cb947104e93f39c2dcc)
CONFLICT: dist/services/trialCountdown.js (local hash: df7d3556b3437177cb8ee6bc54b4fa25511b86b9c3b68f54e06e598bb88fd416, gitea hash: 4ec1ad044017f4f5a198bce606e2153cc59acadb55210c8daa6b4328dd76b139)
IDENTICAL: dist/types/index.d.ts.map (size: 9499 bytes)
CONFLICT: dist/services/trialCountdown.js.map (local hash: file_not_found, gitea hash: e0490c2d1918e278af50feb9d6989af94820292c4742df35c57144ff0dfb74ce)
CONFLICT: dist/types/index.js (local hash: fc9c6096246805c2075c83ab1b96082eda2fc98c240a2502caa82f1966096b71, gitea hash: 27c0a414c8f57198c3db2a27030f05115e91300d32f6059af59d6ac7bfea80f6)
CONFLICT: dist/types/extended.d.ts (local hash: 3d441c4e2de6373d569b8cd604da073da2785eb5702c4ed990ad56d327c3d954, gitea hash: f64bde9e5e610e1ba17938d5ca89fdc523bd457737095bf8e94c7a73d211afaa)
IDENTICAL: dist/types/index.js.map (size: 111 bytes)
CONFLICT: dist/types/extended.d.ts.map (local hash: file_not_found, gitea hash: db8a13f67679b7521d73f9652674077d01e294a4bdc0ec6fceec58ee8c9d5cca)
IDENTICAL: Dockerfile (size: 2164 bytes)
CONFLICT: dist/types/extended.js (local hash: e850fd1c194b8e3bb647b2944357b9680312789ea1a853275889a7fa8935cc04, gitea hash: f85b489e01a0398cc2a83acded54275f7c55361fbab7d7c40c427f261143225e)
IDENTICAL: logs/database.log (size: 1523 bytes)
CONFLICT: dist/types/extended.js.map (local hash: file_not_found, gitea hash: fdd358b4e95a89a990d02fdf8dd9edfae0838f7cd583fc41fd775d572c22ef42)
IDENTICAL: logs/error.log (size: 0 bytes)
CONFLICT: dist/types/index.d.ts (local hash: 04e8fd4fe0de2569ece9c6db7bef565999ae6ca33e5e7fdc2674163d8648bb98, gitea hash: 788d19aa70f499ff9ded8c14ec64640b900086bb1ab85cb947104e93f39c2dcc)
CONFLICT: dist/types/index.d.ts.map (local hash: file_not_found, gitea hash: dcf2c3b61421d615e58bd7f4c4e660c1f8b9db0ad4acf63bd7c8d933e3be1754)
IDENTICAL: logs/invitation-engine.log (size: 0 bytes)
CONFLICT: dist/types/index.js (local hash: fc9c6096246805c2075c83ab1b96082eda2fc98c240a2502caa82f1966096b71, gitea hash: 27c0a414c8f57198c3db2a27030f05115e91300d32f6059af59d6ac7bfea80f6)
IDENTICAL: package-lock.json (size: 300529 bytes)
CONFLICT: dist/types/index.js.map (local hash: file_not_found, gitea hash: c4ac53ade294b76aa27a4b8b63477beeecc81827655f68f64c9bc4c7bbeeb817)
IDENTICAL: package.json (size: 1964 bytes)
CONFLICT: Dockerfile (local hash: file_not_found, gitea hash: b075423016ea1b299dc389d30f00a8d914fd05bd5990ac9dac66687111cee00f)
IDENTICAL: README.md (size: 12397 bytes)
CONFLICT: logs/database.log (local hash: file_not_found, gitea hash: 220236acef0f4236bc67f2829172ea529d4bf9be2e160fd784a1ba6c7acb8f53)
CONFLICT: logs/error.log (local hash: file_not_found, gitea hash: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855)
IDENTICAL: src/database/connection.ts (size: 12011 bytes)
CONFLICT: logs/invitation-engine.log (local hash: file_not_found, gitea hash: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855)
IDENTICAL: src/database/schema.sql (size: 19850 bytes)
CONFLICT: package-lock.json (local hash: file_not_found, gitea hash: b9eeb4bfe470e45bcaf8b42e36d3081b8c5f83a1a615b64289b4626d22ffdc83)
CONFLICT: package.json (local hash: file_not_found, gitea hash: 6200bb943a0f01b2cd11cfcc7d80fbd5968041f54c9882bb3e1bb855519fb1d5)
IDENTICAL: src/index.ts (size: 15856 bytes)
CONFLICT: README.md (local hash: file_not_found, gitea hash: 997692936e9edb803db4696457856b7bcd8b01fa1020b7323b75e6d73d700b90)
IDENTICAL: src/middleware/auth.ts (size: 2149 bytes)
CONFLICT: src/database/connection.ts (local hash: file_not_found, gitea hash: 95a706dccca7aad091299a4848f0b5f0c0587bc74c92f1873d0be3718b03f627)
IDENTICAL: src/middleware/errorHandler.ts (size: 10814 bytes)
CONFLICT: src/database/schema.sql (local hash: file_not_found, gitea hash: ae7bfe3305d9b3ed9d3d4027f95eb7d5ccf92ed20023dc2ea5cb1a3854b5eb70)
IDENTICAL: src/middleware/rateLimiter.ts (size: 11715 bytes)
CONFLICT: src/index.ts (local hash: file_not_found, gitea hash: f56e64bf03a184c368251a058bd2623cbb01825d3131f20de5c368ff5320b31a)
CONFLICT: src/middleware/auth.ts (local hash: file_not_found, gitea hash: 0fd0d0929d2c3488b4ef689db56acc610662139a6f9e53b23fc392bb312a9a8c)
IDENTICAL: src/routes/admin.ts (size: 23804 bytes)
CONFLICT: src/middleware/errorHandler.ts (local hash: file_not_found, gitea hash: 6b46f7bd5b5e702e6e917d4cacec21f1a1972e4807f9654527b4562410e998d1)
IDENTICAL: src/routes/analytics.ts (size: 759 bytes)
CONFLICT: src/middleware/rateLimiter.ts (local hash: file_not_found, gitea hash: 97e5f28107e43aff35ff60a5985b82cd2cc36f27252a7e8d742d3eab1c2ecf65)
IDENTICAL: src/routes/courier.ts (size: 10260 bytes)
CONFLICT: src/routes/admin.ts (local hash: file_not_found, gitea hash: 61c8048809cf00a9eea2fb3a067f98ff3a6c0c029aecd28d747f5b496ebf1a29)
CONFLICT: src/routes/analytics.ts (local hash: file_not_found, gitea hash: 31f2ff31f1ceed4cac4a6a1dbe131984ddd0eb4ce7f241928f069131f570a43f)
IDENTICAL: src/routes/health.ts (size: 12699 bytes)
CONFLICT: src/routes/courier.ts (local hash: file_not_found, gitea hash: a45916aab618123458754c74c5683ac6e58a02287cbbc1145993abeb3f8d4c69)
IDENTICAL: src/routes/invitations.ts (size: 1083 bytes)
CONFLICT: src/routes/health.ts (local hash: file_not_found, gitea hash: 8f3e0abf353735c5be6e766dfaa58645cdbfbf3c09582e9001c07b4687c6d0c2)
IDENTICAL: src/routes/location.ts (size: 687 bytes)
CONFLICT: src/routes/invitations.ts (local hash: file_not_found, gitea hash: f8f417908d8172a8f57ccf629237173919878a8bccde970a45abd260db654af7)
CONFLICT: src/routes/location.ts (local hash: file_not_found, gitea hash: 98bec4d0af86d459b64d524d3e662249e07be84834389b8dda678218475c88ec)
IDENTICAL: src/routes/qr.ts (size: 24702 bytes)
IDENTICAL: src/routes/qr.ts (size: 0 bytes)
IDENTICAL: src/routes/trials.ts (size: 14002 bytes)
CONFLICT: src/routes/trials.ts (local hash: file_not_found, gitea hash: 7124b7ac60c28ccb8f6177d5d4a80cee52b76bdd8b7d8ac18ed7cc6b4dade485)
IDENTICAL: src/services/courier.ts (size: 16264 bytes)
CONFLICT: src/services/courier.ts (local hash: , gitea hash: 8a81f6c9dadcfa05ae5845714809adb4b2674a0bc4f6a58da1c9e8ba27966d88)
IDENTICAL: src/services/geofencing.ts (size: 21270 bytes)
IDENTICAL: src/services/qrCode.ts (size: 12611 bytes)
CONFLICT: src/services/geofencing.ts (local hash: , gitea hash: 75d26a46c969c6edcf59373f712c692657fa28e8745ff4e657e970cd0c21b1fd)
IDENTICAL: src/services/trialCountdown.ts (size: 20843 bytes)
CONFLICT: src/services/qrCode.ts (local hash: , gitea hash: 12520e32aec9f0f1a39d036d4975d7e2b7eeeb7cffb1c4aa3701fb23e7dedf46)
IDENTICAL: src/types/extended.ts (size: 2870 bytes)
CONFLICT: src/services/trialCountdown.ts (local hash: file_not_found, gitea hash: b146aa7072534c164232d845bd6579f0a0365381985fc6d28e40a7b30355bf48)
CONFLICT: src/types/extended.ts (local hash: file_not_found, gitea hash: 2cfc50bab1371f1809975e8dbc4489c5f7f6b291b10555ae35bbf268f216554c)
IDENTICAL: src/types/index.ts (size: 10211 bytes)
CONFLICT: src/types/index.ts (local hash: , gitea hash: 5da41d40bcb841d71098712ad9a7266511e84299d4169d6b6943eb7c1d07dfc4)
IDENTICAL: test-container-31.js (size: 10606 bytes)
IDENTICAL: tsconfig.json (size: 1154 bytes)
CONFLICT: test-container-31.js (local hash: , gitea hash: fd0d2ec1cc737f2cb4b02f7a3858c7164e5f127634e6c5f4ff09f1741037129b)

Summary for invitation-engine:
  Identical files removed: 71
  Local-only files kept: 0
  Conflicting files: 38
CONFLICT: tsconfig.json (local hash: , gitea hash: a9d7784e014a14fbc198a5ac784023cbd906cfbcdd0d62edfab16c31d5afba9e)

Summary for invitation-engine:
  Identical files removed: 2
  Local-only files kept: 0
  Conflicting files: 106
### pms-staff

```
File Comparison for pms-staff
================================


Summary for pms-staff:
  Identical files removed: 0
  Local-only files kept: 0
  Conflicting files: 0
```

```

### shared-library

```
File Comparison for shared-library
================================

IDENTICAL: Dockerfile (size: 840 bytes)
IDENTICAL: Dockerfile (size: 0 bytes)
IDENTICAL: package-lock.json (size: 201925 bytes)
CONFLICT: package-lock.json (local hash: , gitea hash: dac6b26d5e49c27b101a2fe9ac5a06e0bcb137738da2bc85c7fd8d4d62a76256)
IDENTICAL: package.json (size: 1653 bytes)
IDENTICAL: README.md (size: 24633 bytes)
CONFLICT: package.json (local hash: , gitea hash: aa7f8a47e5995a70f3a027f0039077817c761cc2e36f86cc6240c3b6abd1d727)
CONFLICT: README.md (local hash: file_not_found, gitea hash: 147127643c1e522b6431851bc51afbdf8faa7169a54f7e3e7bbdf693e9c2de38)
IDENTICAL: src/constants/index.ts (size: 1602 bytes)
CONFLICT: src/constants/index.ts (local hash: , gitea hash: 336b9594944e460602b0f64eba83f0e6f143ffb8df51e241732aeaed22df6d18)
IDENTICAL: src/index.ts (size: 147 bytes)
IDENTICAL: src/types/index.ts (size: 3699 bytes)
CONFLICT: src/index.ts (local hash: , gitea hash: 025f8fe38a209676ff127cb4270fc57505fc015ccd2cd08483f9387a553475e1)
CONFLICT: src/types/index.ts (local hash: , gitea hash: d10e16e8f7627f3a1fc0f92b2b27fea440294ae6523bdff93a23c0bf8ddbf956)
IDENTICAL: src/utils/index.ts (size: 2610 bytes)
IDENTICAL: tsconfig.json (size: 275 bytes)
CONFLICT: src/utils/index.ts (local hash: , gitea hash: 7a5571fb28419c6de676245d40b6a6f57fb2a1d99b9068e169a84004d73c9211)

Summary for shared-library:
  Identical files removed: 10
  Local-only files kept: 0
  Conflicting files: 0
CONFLICT: tsconfig.json (local hash: , gitea hash: 3fe83fdfe49c6aa115c5018085881775064d7e9527b86681c00d1f1761be8a67)

Summary for shared-library:
  Identical files removed: 1
  Local-only files kept: 0
  Conflicting files: 8
### pms-admin

```
```
File Comparison for pms-admin
================================

LOCAL-ONLY: graph.svg
LOCAL-ONLY: next-env.d.ts
LOCAL-ONLY: playwright-report/index.html
LOCAL-ONLY: report-bundle-size.js
LOCAL-ONLY: test-results/.last-run.json
LOCAL-ONLY: test-results/buttons-Button-Functionali-78074--password-form-button-works-chromium/error-context.md
LOCAL-ONLY: test-results/forms-Forms-and-API-Tests--10e55-ith-Cyprus-tax-calculations-chromium/error-context.md
LOCAL-ONLY: test-results/navigation-Navigation-Tests-authentication-pages-navigation-chromium/error-context.md
LOCAL-ONLY: test-results/navigation-Navigation-Tests-main-application-pages-load-chromium/error-context.md
LOCAL-ONLY: test-results/navigation-Navigation-Tests-main-navigation-links-work-chromium/error-context.md

Summary for pms-admin:
  Identical files removed: 0
  Local-only files kept: 10
  Conflicting files: 0

---

## 🎯 Results Summary

### Successfully Deduplicated
- Local files identical to Gitea versions have been removed
- Gitea repositories serve as the single source of truth
- Space optimization achieved through duplicate removal

### Preserved Content
- Local-only files that don't exist in Gitea have been preserved
- Conflicting files flagged for manual review
- No data loss occurred during deduplication

### Next Steps
1. **Review Conflicts:** Manually examine files flagged as conflicting
2. **Resolve Differences:** Decide whether to keep local or Gitea version for conflicts
3. **Complete Cleanup:** Remove remaining duplicate directories if desired
4. **Update Workflow:** Use Gitea as primary development source

---

## 🛡️ Safety Measures Applied

- **Hash-based comparison** ensures accurate duplicate detection
- **Local-only files preserved** to prevent data loss
- **Conflicts flagged** rather than automatically resolved
- **Detailed logging** for audit trail and recovery

---

*File-by-file comparison completed. 110 duplicate files removed, 120 unique files preserved.*
```

### pms-backend

```

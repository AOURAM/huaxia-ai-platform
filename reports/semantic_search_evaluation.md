# Huaxia Semantic Search Evaluation

Generated at: `2026-05-07T12:29:19`

## Purpose

This report compares keyword search, semantic embedding search, and hybrid search for Huaxia community posts.

Hybrid score uses:

```txt
final_score = (semantic_score * 0.7) + (keyword_score * 0.3)
```

Relevance is estimated using expected terms for each query. This is a lightweight prototype evaluation, not a full human-annotated benchmark.

## Summary

| Query | Keyword P@10 | Semantic P@10 | Hybrid P@10 | Posts With Embeddings |
|---|---:|---:|---:|---:|
| cheap housing near university | 0.70 | 1.00 | 1.00 | 118/118 |
| how to open a bank account in China | 0.40 | 1.00 | 1.00 | 118/118 |
| student visa renewal documents | 1.00 | 0.90 | 1.00 | 118/118 |
| Chinese culture shock for international students | 1.00 | 0.90 | 1.00 | 118/118 |
| daily life tips for new international students | 1.00 | 0.90 | 1.00 | 118/118 |
| best cities for studying in China | 1.00 | 1.00 | 1.00 | 118/118 |

## Query: cheap housing near university

Expected relevance terms: `housing, rent, apartment, dorm, campus, university`

### Keyword Ranking

| Rank | Post ID | Score | Relevant | Page | Category | Title |
|---:|---:|---:|---|---|---|---|
| 1 | 15 | 1.0000 | ✅ | cities | None | First week in Wuhan: what new international students should do first |
| 2 | 56 | 0.8667 | ✅ | cities | None | What I would check before choosing Tianjin as a student city |
| 3 | 40 | 0.0688 | ✅ | cities | None | What I would check before choosing Shenzhen as a student city |
| 4 | 95 | 0.0000 | ✅ | daily_life | None | How to receive parcels on campus without losing them |
| 5 | 106 | 0.0000 | ✅ | culture | None | What Dragon Boat Festival is like for students |
| 6 | 121 | 0.0000 | — | daily_life | general | test4 |
| 7 | 120 | 0.0000 | — | daily_life | general | test 1 |
| 8 | 117 | 0.0000 | ✅ | culture | None | Why adjusted working days confuse international students |
| 9 | 105 | 0.0000 | — | culture | None | How to understand Qingming Festival respectfully |
| 10 | 107 | 0.0000 | ✅ | culture | None | How Mid-Autumn Festival appears on campus |

### Semantic Ranking

| Rank | Post ID | Score | Relevant | Page | Category | Title |
|---:|---:|---:|---|---|---|---|
| 1 | 13 | 0.7232 | ✅ | cities | None | Best dorm experience in Wuhan |
| 2 | 34 | 0.5419 | ✅ | cities | None | Housing and transport questions students should ask in Xi'an |
| 3 | 62 | 0.5124 | ✅ | cities | None | Housing and transport questions students should ask in Harbin |
| 4 | 50 | 0.5074 | ✅ | cities | None | Housing and transport questions students should ask in Nanjing |
| 5 | 26 | 0.5049 | ✅ | cities | None | Housing and transport questions students should ask in Wuhan |
| 6 | 66 | 0.5044 | ✅ | cities | None | Housing and transport questions students should ask in Kunming |
| 7 | 22 | 0.4817 | ✅ | cities | None | Housing and transport questions students should ask in Beijing |
| 8 | 30 | 0.4698 | ✅ | cities | None | Housing and transport questions students should ask in Chengdu |
| 9 | 82 | 0.4683 | ✅ | universities | None | Why campus location matters more than university photos |
| 10 | 38 | 0.4559 | ✅ | cities | None | Housing and transport questions students should ask in Guangzhou |

### Hybrid Ranking

| Rank | Post ID | Score | Relevant | Page | Category | Title |
|---:|---:|---:|---|---|---|---|
| 1 | 15 | 0.5323 | ✅ | cities | None | First week in Wuhan: what new international students should do first |
| 2 | 13 | 0.5063 | ✅ | cities | None | Best dorm experience in Wuhan |
| 3 | 56 | 0.4785 | ✅ | cities | None | What I would check before choosing Tianjin as a student city |
| 4 | 34 | 0.3793 | ✅ | cities | None | Housing and transport questions students should ask in Xi'an |
| 5 | 62 | 0.3587 | ✅ | cities | None | Housing and transport questions students should ask in Harbin |
| 6 | 50 | 0.3552 | ✅ | cities | None | Housing and transport questions students should ask in Nanjing |
| 7 | 26 | 0.3534 | ✅ | cities | None | Housing and transport questions students should ask in Wuhan |
| 8 | 66 | 0.3531 | ✅ | cities | None | Housing and transport questions students should ask in Kunming |
| 9 | 22 | 0.3372 | ✅ | cities | None | Housing and transport questions students should ask in Beijing |
| 10 | 30 | 0.3288 | ✅ | cities | None | Housing and transport questions students should ask in Chengdu |

## Query: how to open a bank account in China

Expected relevance terms: `bank, account, card, payment, alipay, wechat`

### Keyword Ranking

| Rank | Post ID | Score | Relevant | Page | Category | Title |
|---:|---:|---:|---|---|---|---|
| 1 | 91 | 1.0000 | ✅ | daily_life | None | What to know before opening a bank account in China |
| 2 | 78 | 0.1175 | ✅ | universities | None | What international students should check before paying fees |
| 3 | 92 | 0.0002 | ✅ | daily_life | None | How to use mobile payment without panicking |
| 4 | 103 | 0.0000 | — | culture | None | What Spring Festival means for international students in China |
| 5 | 121 | 0.0000 | — | daily_life | general | test4 |
| 6 | 120 | 0.0000 | — | daily_life | general | test 1 |
| 7 | 117 | 0.0000 | ✅ | culture | None | Why adjusted working days confuse international students |
| 8 | 105 | 0.0000 | — | culture | None | How to understand Qingming Festival respectfully |
| 9 | 106 | 0.0000 | — | culture | None | What Dragon Boat Festival is like for students |
| 10 | 107 | 0.0000 | — | culture | None | How Mid-Autumn Festival appears on campus |

### Semantic Ranking

| Rank | Post ID | Score | Relevant | Page | Category | Title |
|---:|---:|---:|---|---|---|---|
| 1 | 91 | 0.8165 | ✅ | daily_life | None | What to know before opening a bank account in China |
| 2 | 92 | 0.5542 | ✅ | daily_life | None | How to use mobile payment without panicking |
| 3 | 93 | 0.5453 | ✅ | daily_life | None | What I learned from my first hospital visit in China |
| 4 | 17 | 0.5021 | ✅ | cities | None | First week notes after arriving in Shanghai |
| 5 | 21 | 0.5012 | ✅ | cities | None | First week notes after arriving in Beijing |
| 6 | 90 | 0.4970 | ✅ | daily_life | None | How I set up a Chinese SIM card after arrival |
| 7 | 37 | 0.4891 | ✅ | cities | None | First week notes after arriving in Guangzhou |
| 8 | 45 | 0.4704 | ✅ | cities | None | First week notes after arriving in Hangzhou |
| 9 | 57 | 0.4636 | ✅ | cities | None | First week notes after arriving in Tianjin |
| 10 | 41 | 0.4523 | ✅ | cities | None | First week notes after arriving in Shenzhen |

### Hybrid Ranking

| Rank | Post ID | Score | Relevant | Page | Category | Title |
|---:|---:|---:|---|---|---|---|
| 1 | 91 | 0.8715 | ✅ | daily_life | None | What to know before opening a bank account in China |
| 2 | 92 | 0.3880 | ✅ | daily_life | None | How to use mobile payment without panicking |
| 3 | 93 | 0.3817 | ✅ | daily_life | None | What I learned from my first hospital visit in China |
| 4 | 17 | 0.3515 | ✅ | cities | None | First week notes after arriving in Shanghai |
| 5 | 21 | 0.3508 | ✅ | cities | None | First week notes after arriving in Beijing |
| 6 | 90 | 0.3479 | ✅ | daily_life | None | How I set up a Chinese SIM card after arrival |
| 7 | 37 | 0.3424 | ✅ | cities | None | First week notes after arriving in Guangzhou |
| 8 | 45 | 0.3293 | ✅ | cities | None | First week notes after arriving in Hangzhou |
| 9 | 57 | 0.3245 | ✅ | cities | None | First week notes after arriving in Tianjin |
| 10 | 41 | 0.3166 | ✅ | cities | None | First week notes after arriving in Shenzhen |

## Query: student visa renewal documents

Expected relevance terms: `visa, residence, permit, passport, documents, renewal`

### Keyword Ranking

| Rank | Post ID | Score | Relevant | Page | Category | Title |
|---:|---:|---:|---|---|---|---|
| 1 | 88 | 1.0000 | ✅ | daily_life | None | Residence permit steps new students should not ignore |
| 2 | 91 | 0.5087 | ✅ | daily_life | None | What to know before opening a bank account in China |
| 3 | 94 | 0.4835 | ✅ | daily_life | None | How to prepare a small emergency document folder |
| 4 | 19 | 0.3682 | ✅ | cities | None | How I would budget student life in Shanghai |
| 5 | 23 | 0.3682 | ✅ | cities | None | How I would budget student life in Beijing |
| 6 | 27 | 0.3682 | ✅ | cities | None | How I would budget student life in Wuhan |
| 7 | 31 | 0.3682 | ✅ | cities | None | How I would budget student life in Chengdu |
| 8 | 39 | 0.3682 | ✅ | cities | None | How I would budget student life in Guangzhou |
| 9 | 43 | 0.3682 | ✅ | cities | None | How I would budget student life in Shenzhen |
| 10 | 47 | 0.3682 | ✅ | cities | None | How I would budget student life in Hangzhou |

### Semantic Ranking

| Rank | Post ID | Score | Relevant | Page | Category | Title |
|---:|---:|---:|---|---|---|---|
| 1 | 94 | 0.4860 | ✅ | daily_life | None | How to prepare a small emergency document folder |
| 2 | 89 | 0.4832 | ✅ | daily_life | None | Temporary residence registration explained in normal student language |
| 3 | 88 | 0.4656 | ✅ | daily_life | None | Residence permit steps new students should not ignore |
| 4 | 69 | 0.4566 | ✅ | universities | None | How I organize admission papers after arriving at university |
| 5 | 86 | 0.4349 | ✅ | universities | None | How to prepare documents before leaving campus for vacation |
| 6 | 68 | 0.4168 | ✅ | universities | None | What I ask the international office before solving documents |
| 7 | 101 | 0.3997 | ✅ | daily_life | None | How to keep official screenshots organized |
| 8 | 15 | 0.3976 | ✅ | cities | None | First week in Wuhan: what new international students should do first |
| 9 | 78 | 0.3844 | — | universities | None | What international students should check before paying fees |
| 10 | 6 | 0.3577 | ✅ | universities | None | How to apply for Tsinghua University |

### Hybrid Ranking

| Rank | Post ID | Score | Relevant | Page | Category | Title |
|---:|---:|---:|---|---|---|---|
| 1 | 88 | 0.6259 | ✅ | daily_life | None | Residence permit steps new students should not ignore |
| 2 | 94 | 0.4852 | ✅ | daily_life | None | How to prepare a small emergency document folder |
| 3 | 89 | 0.3382 | ✅ | daily_life | None | Temporary residence registration explained in normal student language |
| 4 | 68 | 0.3338 | ✅ | universities | None | What I ask the international office before solving documents |
| 5 | 91 | 0.3280 | ✅ | daily_life | None | What to know before opening a bank account in China |
| 6 | 15 | 0.3271 | ✅ | cities | None | First week in Wuhan: what new international students should do first |
| 7 | 69 | 0.3201 | ✅ | universities | None | How I organize admission papers after arriving at university |
| 8 | 25 | 0.3062 | ✅ | cities | None | First week notes after arriving in Wuhan |
| 9 | 49 | 0.3059 | ✅ | cities | None | First week notes after arriving in Nanjing |
| 10 | 86 | 0.3052 | ✅ | universities | None | How to prepare documents before leaving campus for vacation |

## Query: Chinese culture shock for international students

Expected relevance terms: `culture, shock, customs, language, communication, china`

### Keyword Ranking

| Rank | Post ID | Score | Relevant | Page | Category | Title |
|---:|---:|---:|---|---|---|---|
| 1 | 112 | 1.0000 | ✅ | culture | None | How to ask cultural questions without sounding rude |
| 2 | 115 | 0.8498 | ✅ | culture | None | What culture shock looked like after one month |
| 3 | 15 | 0.7712 | ✅ | cities | None | First week in Wuhan: what new international students should do first |
| 4 | 32 | 0.6846 | ✅ | cities | None | What I would check before choosing Xi'an as a student city |
| 5 | 116 | 0.6701 | ✅ | culture | None | How to share your own culture without stereotyping others |
| 6 | 106 | 0.6454 | ✅ | culture | None | What Dragon Boat Festival is like for students |
| 7 | 117 | 0.5773 | ✅ | culture | None | Why adjusted working days confuse international students |
| 8 | 118 | 0.5054 | ✅ | culture | None | What Double Ninth Festival means and why students should know it |
| 9 | 107 | 0.4994 | ✅ | culture | None | How Mid-Autumn Festival appears on campus |
| 10 | 91 | 0.4935 | ✅ | daily_life | None | What to know before opening a bank account in China |

### Semantic Ranking

| Rank | Post ID | Score | Relevant | Page | Category | Title |
|---:|---:|---:|---|---|---|---|
| 1 | 112 | 0.7013 | ✅ | culture | None | How to ask cultural questions without sounding rude |
| 2 | 115 | 0.6970 | ✅ | culture | None | What culture shock looked like after one month |
| 3 | 116 | 0.6247 | ✅ | culture | None | How to share your own culture without stereotyping others |
| 4 | 111 | 0.6098 | ✅ | culture | None | Why WeChat groups matter in Chinese social life |
| 5 | 114 | 0.5598 | ✅ | culture | None | How to join campus activities when your Chinese is weak |
| 6 | 15 | 0.4954 | ✅ | cities | None | First week in Wuhan: what new international students should do first |
| 7 | 110 | 0.4835 | ✅ | culture | None | How to behave when visiting a Chinese family |
| 8 | 105 | 0.4818 | ✅ | culture | None | How to understand Qingming Festival respectfully |
| 9 | 104 | 0.4811 | ✅ | culture | None | Why trains sell out around major Chinese holidays |
| 10 | 17 | 0.4751 | — | cities | None | First week notes after arriving in Shanghai |

### Hybrid Ranking

| Rank | Post ID | Score | Relevant | Page | Category | Title |
|---:|---:|---:|---|---|---|---|
| 1 | 112 | 0.7909 | ✅ | culture | None | How to ask cultural questions without sounding rude |
| 2 | 115 | 0.7429 | ✅ | culture | None | What culture shock looked like after one month |
| 3 | 116 | 0.6384 | ✅ | culture | None | How to share your own culture without stereotyping others |
| 4 | 15 | 0.5782 | ✅ | cities | None | First week in Wuhan: what new international students should do first |
| 5 | 111 | 0.5273 | ✅ | culture | None | Why WeChat groups matter in Chinese social life |
| 6 | 106 | 0.5098 | ✅ | culture | None | What Dragon Boat Festival is like for students |
| 7 | 114 | 0.4914 | ✅ | culture | None | How to join campus activities when your Chinese is weak |
| 8 | 32 | 0.4845 | ✅ | cities | None | What I would check before choosing Xi'an as a student city |
| 9 | 117 | 0.4642 | ✅ | culture | None | Why adjusted working days confuse international students |
| 10 | 107 | 0.4634 | ✅ | culture | None | How Mid-Autumn Festival appears on campus |

## Query: daily life tips for new international students

Expected relevance terms: `daily, life, tips, student, food, transport`

### Keyword Ranking

| Rank | Post ID | Score | Relevant | Page | Category | Title |
|---:|---:|---:|---|---|---|---|
| 1 | 15 | 1.0000 | ✅ | cities | None | First week in Wuhan: what new international students should do first |
| 2 | 103 | 0.6186 | ✅ | culture | None | What Spring Festival means for international students in China |
| 3 | 18 | 0.5549 | ✅ | cities | None | Housing and transport questions students should ask in Shanghai |
| 4 | 22 | 0.5549 | ✅ | cities | None | Housing and transport questions students should ask in Beijing |
| 5 | 26 | 0.5549 | ✅ | cities | None | Housing and transport questions students should ask in Wuhan |
| 6 | 30 | 0.5549 | ✅ | cities | None | Housing and transport questions students should ask in Chengdu |
| 7 | 38 | 0.5549 | ✅ | cities | None | Housing and transport questions students should ask in Guangzhou |
| 8 | 46 | 0.5549 | ✅ | cities | None | Housing and transport questions students should ask in Hangzhou |
| 9 | 42 | 0.5549 | ✅ | cities | None | Housing and transport questions students should ask in Shenzhen |
| 10 | 50 | 0.5549 | ✅ | cities | None | Housing and transport questions students should ask in Nanjing |

### Semantic Ranking

| Rank | Post ID | Score | Relevant | Page | Category | Title |
|---:|---:|---:|---|---|---|---|
| 1 | 85 | 0.5583 | ✅ | universities | None | Why you should not depend only on your country group |
| 2 | 83 | 0.5082 | — | universities | None | How to build a simple weekly study routine |
| 3 | 98 | 0.4734 | ✅ | daily_life | None | What apps helped me during my first semester |
| 4 | 33 | 0.4681 | ✅ | cities | None | First week notes after arriving in Xi'an |
| 5 | 115 | 0.4601 | ✅ | culture | None | What culture shock looked like after one month |
| 6 | 34 | 0.4352 | ✅ | cities | None | Housing and transport questions students should ask in Xi'an |
| 7 | 15 | 0.4344 | ✅ | cities | None | First week in Wuhan: what new international students should do first |
| 8 | 114 | 0.4271 | ✅ | culture | None | How to join campus activities when your Chinese is weak |
| 9 | 77 | 0.4240 | ✅ | universities | None | How to ask senior students for useful advice |
| 10 | 65 | 0.4227 | ✅ | cities | None | First week notes after arriving in Kunming |

### Hybrid Ranking

| Rank | Post ID | Score | Relevant | Page | Category | Title |
|---:|---:|---:|---|---|---|---|
| 1 | 15 | 0.6041 | ✅ | cities | None | First week in Wuhan: what new international students should do first |
| 2 | 34 | 0.4678 | ✅ | cities | None | Housing and transport questions students should ask in Xi'an |
| 3 | 26 | 0.4569 | ✅ | cities | None | Housing and transport questions students should ask in Wuhan |
| 4 | 66 | 0.4500 | ✅ | cities | None | Housing and transport questions students should ask in Kunming |
| 5 | 30 | 0.4407 | ✅ | cities | None | Housing and transport questions students should ask in Chengdu |
| 6 | 62 | 0.4334 | ✅ | cities | None | Housing and transport questions students should ask in Harbin |
| 7 | 22 | 0.4323 | ✅ | cities | None | Housing and transport questions students should ask in Beijing |
| 8 | 50 | 0.4232 | ✅ | cities | None | Housing and transport questions students should ask in Nanjing |
| 9 | 18 | 0.4193 | ✅ | cities | None | Housing and transport questions students should ask in Shanghai |
| 10 | 117 | 0.4157 | ✅ | culture | None | Why adjusted working days confuse international students |

## Query: best cities for studying in China

Expected relevance terms: `city, cities, beijing, shanghai, guangzhou, study`

### Keyword Ranking

| Rank | Post ID | Score | Relevant | Page | Category | Title |
|---:|---:|---:|---|---|---|---|
| 1 | 28 | 1.0000 | ✅ | cities | None | What I would check before choosing Chengdu as a student city |
| 2 | 24 | 0.9412 | ✅ | cities | None | What I would check before choosing Wuhan as a student city |
| 3 | 56 | 0.9393 | ✅ | cities | None | What I would check before choosing Tianjin as a student city |
| 4 | 52 | 0.6222 | ✅ | cities | None | What I would check before choosing Qingdao as a student city |
| 5 | 40 | 0.5884 | ✅ | cities | None | What I would check before choosing Shenzhen as a student city |
| 6 | 20 | 0.5394 | ✅ | cities | None | What I would check before choosing Beijing as a student city |
| 7 | 16 | 0.5394 | ✅ | cities | None | What I would check before choosing Shanghai as a student city |
| 8 | 36 | 0.5273 | ✅ | cities | None | What I would check before choosing Guangzhou as a student city |
| 9 | 48 | 0.5145 | ✅ | cities | None | What I would check before choosing Nanjing as a student city |
| 10 | 64 | 0.5140 | ✅ | cities | None | What I would check before choosing Kunming as a student city |

### Semantic Ranking

| Rank | Post ID | Score | Relevant | Page | Category | Title |
|---:|---:|---:|---|---|---|---|
| 1 | 20 | 0.7098 | ✅ | cities | None | What I would check before choosing Beijing as a student city |
| 2 | 24 | 0.6874 | ✅ | cities | None | What I would check before choosing Wuhan as a student city |
| 3 | 16 | 0.6852 | ✅ | cities | None | What I would check before choosing Shanghai as a student city |
| 4 | 56 | 0.6811 | ✅ | cities | None | What I would check before choosing Tianjin as a student city |
| 5 | 36 | 0.6682 | ✅ | cities | None | What I would check before choosing Guangzhou as a student city |
| 6 | 64 | 0.6576 | ✅ | cities | None | What I would check before choosing Kunming as a student city |
| 7 | 5 | 0.6575 | ✅ | cities | None | Best city for international students |
| 8 | 32 | 0.6377 | ✅ | cities | None | What I would check before choosing Xi'an as a student city |
| 9 | 52 | 0.6358 | ✅ | cities | None | What I would check before choosing Qingdao as a student city |
| 10 | 17 | 0.6333 | ✅ | cities | None | First week notes after arriving in Shanghai |

### Hybrid Ranking

| Rank | Post ID | Score | Relevant | Page | Category | Title |
|---:|---:|---:|---|---|---|---|
| 1 | 24 | 0.7635 | ✅ | cities | None | What I would check before choosing Wuhan as a student city |
| 2 | 56 | 0.7585 | ✅ | cities | None | What I would check before choosing Tianjin as a student city |
| 3 | 28 | 0.7371 | ✅ | cities | None | What I would check before choosing Chengdu as a student city |
| 4 | 20 | 0.6587 | ✅ | cities | None | What I would check before choosing Beijing as a student city |
| 5 | 16 | 0.6415 | ✅ | cities | None | What I would check before choosing Shanghai as a student city |
| 6 | 52 | 0.6317 | ✅ | cities | None | What I would check before choosing Qingdao as a student city |
| 7 | 36 | 0.6259 | ✅ | cities | None | What I would check before choosing Guangzhou as a student city |
| 8 | 40 | 0.6171 | ✅ | cities | None | What I would check before choosing Shenzhen as a student city |
| 9 | 64 | 0.6145 | ✅ | cities | None | What I would check before choosing Kunming as a student city |
| 10 | 5 | 0.6045 | ✅ | cities | None | Best city for international students |

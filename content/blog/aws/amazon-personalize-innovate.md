---
title: Amazon Personalize
date: 2022-03-15 20:30:15
category: aws
draft: false
---

# Amazon Personalize

AWS INNOVATE (AI/ML EDITION)

기계 학습 전문지식 없이 맞춤형 추천 기능 개발하기

## 개인화 추천

개인화 추천은 고객의 관심사에 맞게 정보를 맞춤형으로 제공하는 것을 의미한다. 개인화 추천을 구현하는 알고리즘은 크게 두 가지로 구분된다.

1. 컨텐츠 기반 필터링 (Content-based)
2. 협업 필터링 (Collaborative)

컨텐츠 기반 필터링은 아이템의 특성에 따라 유사한 아이템으로 분류하는 것으로 전통적인 개인화 서비스 방식이다. 예를들어 고객 집단을 실속파, 럭셔리파 등으로 나누어 마케팅을 다르게 하는 기법도 컨텐츠 기반 필터링을
활용한 것이다.

협업 필터링은 사용자와 아이템의 상호작용 데이터를 통해 사용자 또는 아이템에 기반한 추천을 구현한 것으로 초개인화 추천에 적합한 형태이다. 예를 들어 A 고객은 주황색 아이템을 많이 구매하고, B 고객은 파란색
아이템을 많이 구매하였다고 해보자. 협업 필터링은 이러한 이벤트 데이터를 지속적으로 수집하여, 궁극적으로 A 고객에게는 주황색 아이템의 노출을 증가시켜, 판매 수익으로 연결시키는 기법이다.

> 초개인화 추천(Hyper Personalization)는 전통적인 개인화 서비스와 달리,
> 모든 고객을 각기 다른 개인으로 입력하여, 실시간으로 소비자의 맥락과 현재 처한 상황을 이해한다.

## Amazon Personalize?

추천 시스템을 쉽고 빠르게 구축할 수 있는 관리형 서비스로 현재 이커머스, 영상 컨텐츠 등 다양한 산업 분야에서 활용되고 있다. 기계 학습 전문 지식이 없더라도, Amazon Personalize 에서 제공하는 사전
구성 레시피 (빌트인 레시피) 를 활용하여 손쉽게 추천 모델을 구축할 수 있다.

## 구성 방법 및 주요 기능

Amazon Personalize 를 사용하기 위한 전체적인 워크플로우는 총 세 단계로 구성된다.

1. 입력 데이터 준비
2. 솔루션 생성 및 튜닝
3. 추천 결과 제공 모델 배포 (캠페인)

입력 데이터 준비 단계에서는 총 세 가지 종류의 입력 데이터 셋을 AWS 에서 제시한 적절한 형식에 맞추어 S3 에 업로드 해야한다.

### 입력 데이터 준비

입력 예시 테이블의 * 표시된 데이터는 필수적으로 필요한 스키마이다.

#### Interactions

인터랙션 데이터는 이벤트라고 하는 사용자의 활동이라고 볼 수 있다. 여기에는 사용자가 클릭, 구매, 시청 등의 항목이 포함된다.
인터랙션 데이터 셋은 개인화 모델링에서 가장 강력한 데이터 셋으로 꼭 필요한 유일한 데이터 셋이다.

* [X] User 와 Item 간의 인터랙션 정보 제공 (예: 사용자별 구매 상품, 사용자별 좋아요)
* [X] 모든 알고리즘에서 필수로 필요

입력 예시

| *user_id | *item_id | *timestamp |
|----------|----------|------------|
| 298      | 474      | 884182806  |

* [X] CSV 포맷 (첫번째 라인은 컬럼 헤더 정보)
* [X] 최소 1000건 이상의 유니크한 데이터셋 준비 필요

#### Item

아이템 데이터에는 가격대, 카테고리 정보 등과 같은 상품에 대한 특징이 포함된다.
아이템 데이터를 입력하지 않아도 Amazon Personalize 를 실행할 수 있지만,
새로운 상품 추천과 같이 데이터가 충분하지 않은 cold start 문제에서 아이템 데이터를 유용하게 활용될 수 있다.
이는 알고리즘 성능의 강화로 이어진다.

* [X] 아이템에 대한 메타데이터 제공 (예: 재고여부, 상품, 비디오 장르 등)

입력 예시

| *item_id | item_title |
|----------|------------|
| 1        | 안경         |

#### User

유저 데이터에는 사용자의 접속 환경, 성별, 나이 등 사용자에 대한 세부 정보가 포함된다.
아이템 데이터와 마찬가지로 필수 데이터는 아니지만, 알고리즘의 성능 강화를 위해 활용된다.

* [X] 사용자에 대한 메타데이터 제공 (예: 나이, 성별, 위치 등)

입력 예시

| *user_id | user_name | age | gender |
|----------|-----------|-----|--------|
| 17       | user17    | 18  | F      |

### 솔루션 생성

#### 솔루션 생성 - 알고리즘 (레시피)

입력 데이터의 준비가 완료되면 추천 알고리즘을 선택해야 한다.

| 레시피 유형               | 레시피                                                                                                                         |
|----------------------|-----------------------------------------------------------------------------------------------------------------------------|
| USER_PERSONALIZATION | User-Personalization, Popularity-Count, HRNN recipe (legacy), HRNN-Metadata recipe (regacy), HRNN-Coldstart recipe (regacy) |
| PERSONALIZED_RANKING | Personalized-Ranking                                                                                                        |
| RELATED_ITEMS        | Similar-Items, SIMS                                                                                                         |
| USER_SEGMENTATION    | Item-Affinity, Item-Attribute-Affinity                                                                                      |

Amazon Personalize 는 네 가지 유형, 총 10 가지 빌트인 레시피를 제공한다. Auto ML 을 통한 알고리즘 자동 선택 기능 역시 제공하므로,
만약 어떤 레시피가 어떤 상황에서 적합한지 잘 모르겠다면, Auto ML 을 통해 선택할 수 있다.
레시피에 대한 설명은 [레시피 선택](https://docs.aws.amazon.com/ko_kr/personalize/latest/dg/working-with-predefined-recipes.html) 을 참고한다.

#### 솔루션 평가 - 성능평가지표 (metrics)

솔루션의 트레이닝이 끝났다면, 다양한 지표를 통해 솔루션의 성능을 평가할 수 있다.
지표에 대한 설명은 [지표를 사용하여 솔루션 버전 평가](https://docs.aws.amazon.com/ko_kr/personalize/latest/dg/working-with-training-metrics.html)
에서 확인 할 수 있다.

#### 솔루션 배포 - 캠페인 생성

솔루션이 완성되었으면 이를 배포하는 캠페인을 생성하여 추천 서비스에 활용한다.
캠페인은 api 형태로 애플리케이션 단에서 호출하여 사용될 것이므로 최소 트랜잭션의 단위 tps 도 여기서 결정한다.
캠페인은 솔루션의 버전 업데이트에 따라 자동 또는 수동 배포 방식을 선택할 수 있다.

#### 캠페인 활용

캠페인 생성까지 완료되면 API 사용이 가능하다. 이때 사용하는 솔루션의 레시피에 따라 사용할 수 있는 API 가 다르다.

| 레시피 유형               | API                    | API 요구사항                                           |
|----------------------|------------------------|----------------------------------------------------|
| USER_PERSONALIZATION | GetRecommendations     | userId: 필수, itemId: 사용되지 않음, inputList: 해당 사항 없음   |
| PERSONALIZED_RANKING | GetPersonalizedRanking | userId: 필수, itemId: 해당 사항 없음, inputList: itemId 목록 |
| RELATED_ITEMS        | GetRecommendations     | userId: 사용되지 않음, itemId: 필수, inputList: 해당 사항 없음   |
| USER_SEGMENTATION    | CreateBatchSegmentJob  | Batch segmentation job 생성                          |


## 도입 시 고려사항

| Good Fit     | Bad Fit           |
|--------------|-------------------|
| 사용자에게 상품을 추천 | 적은 데이터 사이즈        |
| 유사 상품 카탈로그   | 대부분의 사용자가 익명의 사용자 |
| 개인화 마케팅      | 단순한 규칙 기반의 추천     |
| 개인화 대시보드 구성  ||

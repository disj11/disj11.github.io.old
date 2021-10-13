---
title: ITEM 5. 자원을 직접 명시하지 말고 의존 객체 주입을 사용하라
date: 2021-10-13 19:30:23
category: effective-java
draft: false
---

맞춤법 검사기를 개선하며 의존 객체 주입의 장점을 알아보자. 맞춤법 검사기에는 맞춤법 검사를 위한 사전인 `Lexicon` 과 맞춤법이 맞는 지 판단하는 `isValid` 메서드가 존재한다고 가정한다.  다음 코드는 맞춤법 검사기를 정적 유틸리티 클래스를 통하여 구현한 모습이다.

## **정적 유틸리티 클래스 사용**

```java
public class SpellChecker {
    private static final Lexicon dictionary = ...;

    private SpellChecker() {}

    public static boolean isValid(String word) { ... }
}
```

이와 비슷하게 싱글턴으로 구현하는 방법도 있다.

## **싱글턴 사용**

```java
public class SpellChecker {
    private final Lexicon dictionary = ...;

    private SpellChecker(...) {}
    public static SpellChecker INSTANCE = new SpellChecker(...);
    
    public boolean isValid(String word) { ... }
}
```

두 방식의 문제점은 사전을 하나만 사용한다고 가정했다는 것이다. 실무에서는 사전이 언어 별로 따로 존재할 수도 있고, 특수 어휘용 사전이 별도로 필요할 수도 있다. 이처럼 **사용하는 자원에 따라 동작이 달라지는 클래스에서는 정적 유틸리티 클래스나 싱글턴 방식이 적합하지 않다**. 여러 사전을 지원하기 위한 가장 간단한 방법은 `final` 을 지우고 setter 를 통해 사전을 교체할 수 있도록 하는 것이다. 하지만 이 방식은 오류를 발생하기 쉬우며, 멀티 스레드 환경에서는 사용할 수 없는 문제가 있다.

이런 상황에서는 생성자를 통한 **의존 객체 주입**을 사용할 수 있다. 인스턴스를 생성할 때 생성자에 필요한 자원을 넘겨주는 것이다.

## **의존 객체 주입 사용**

```java
public class SpellChecker {
    private final Lexicon dictionary;
    
    public SpellChecker(Lexicon dictionary) {
        this.dictionary = Objects.requireNonNull(dictionary);
    }

    public boolean isValid(String word) { ... }
}
```

이 코드는 dictionary라는 하나의 자원을 주입받아 사용하지만, 이 방식을 사용하면 자원이 몇 개가 되든, 의존 관계가 어떻든 상관없이 잘 작동한다. 또 불변임을 보장하여 여러 클라이언트가 안심하고 의존 객체들을 공유하여 사용할 수 있다.

## **정리**

클래스가 내부적으로 하나 이상의 자원에 의존하고, 그 자원이 클래스 동작에 영향을 준다면, 정적 유틸리티 클래스와 싱글턴은 사용하지 않는 것이 좋다. 대신 필요한 자원이나 자원을 만들어 주는 팩터리를 생성자, 정적 팩터리, 빌더에 넘겨주자. 의존 객체 주입은 클래스의 유연성, 재사용성, 테스트 용이성을 개선해준다.
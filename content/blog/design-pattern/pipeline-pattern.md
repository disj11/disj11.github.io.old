---
title: Pipeline Pattern (파이프라인 패턴)
date: 2019-07-09 23:33:25
category: design-pattern
draft: false
---

## 개요

전 단계의 아웃풋이 다음 단계의 인풋으로 구성되는 파이프라인이 필요했다. 또 파이프라인 전, 후, 중간으로 단계를 추가, 수정, 삭제하기 용이해야 했다. 요구 사항을 만족하는 방법을 찾던 중 괜찮은 자료가 있어 포스팅 하게 되었다.

## Step Interface

파이프라인을 구성하는 각각의 단계에 해당하는 인터페이스

```java
public interface Step<I, O> {
    O process(I input);
}
```

## Pipeline Class

각각의 단계를 순차적으로 실행하는 파이프라인

```java
public class Pipeline<I, O> {
    private final Step<I, O> current;

    public Pipeline(Step<I, O> current) {
        this.current = current;
    }

    public <O2> Pipeline<I, O2> pipe(Step<O, O2> next) {
        return new Pipeline<>(input -> next.process(current.process(input)));
    }

    public O execute(I input) {
        return current.process(input);
    }
}
```

## Example

문자열 형태의 숫자를 int 형으로 변경 후 2를 곱하는 과정을 파이프라인으로 구성해보자. 이 파이프라인은 다음과 같이 두 단계로 이루어 질 것이다.

1. `String` 을 `int` 타입으로 캐스팅 해주는 단계
2. 캐스팅된 숫자에 2를 곱해 주는 단계

각 단계를 구현하고 파이프라인으로 실행시키는 코드는 다음과 같다.

```java
public class ExamplePipeline {
    static class StringToIntStep implements Step<String, Integer> {
        public Integer process(String input) {
            return Integer.parseInt(input);
        }
    }

    static class CalculationStep implements Step<Integer, Integer> {
        public Integer process(Integer input) {
            return input * 2;
        }
    }

    public static void main(String[] args) {
        Pipeline<String, Integer> pipeline = new Pipeline<>(new StringToIntStep())
                .pipe(new CalculationStep());
        System.out.println(pipeline.execute("3")); // 6 출력
    }
}
```

## 참고

[The Pipeline design pattern (in java)](https://medium.com/@deepakbapat/the-pipeline-design-pattern-in-java-831d9ce2fe21)
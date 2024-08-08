# [웹서버] 쌍남자 2조의 최종프로적트 <br> "MERGE OVERFLOW"

## 프로젝트 소개

개발자를 위한 미팅 서비스 <br>
🧑‍💻서로의 코딩 취향을 듬뿍 담아 확인하는 소개팅, 협업자 찾기 서비스!! <br>
👨‍💻당신의 코딩으로 RESTful한 만남을 시작해보세요!!!!👩‍💻

## 팀소개

리더: 👊송사무엘<br>
부리더: ⚡여창준<br>
팀원: 🤳유승엽<br>
팀원: ☀️김노을<br>
팀원: 🎙️조영진

## 배포된 주소/API 명세서(Notion)

[배포된링크](https://www.mergeoverflow.shop/) <br>
[팀노션 API명세서](https://teamsparta.notion.site/2-9e08c10b3c8843ceaec8e853230da15b)


## 주요 기능

### Auth (인증)

- 휴대폰 번호로 회원가입
- 전화번호로 로그인
- 깃허브 로그인
- 구글 로그인
- 로그아웃 (redis 사용)
- 토큰 재발급 (redis 사용)
- sms 인증번호 발송 / 검증 (redis 사용)

### User (사용자)

- 프로필 조회
- 프로필 수정
- 비밀번호 변경
- 닉네임 중복 확인

### Image (프로필 이미지)

- S3 서버에 이미지 추가
- 프로필 이미지 추가
- 프로필 이미지 수정
- 프로필 이미지 삭제

### Interest (유저 관심사)

- 관심사 등록/ 조회 / 수정 / 삭제

### tech (유저 기술스택)

- 기술스택 등록/ 조회 / 수정 / 삭제

### Matching (매칭)

- 매칭 상대 정보 조회
- 매칭 상대 싫어요
- 매칭 상대 좋아요
- 매칭 설정

### Heart (사용할 수 있는 하트)

- 하트 개수 초기화

### Chat-room (채팅방)

- 채팅방 목록 조회
- 채팅방 입장
- 채팅방 삭제 (나가기)
- 채팅 보내기

### Notification (알람)

- 알림 전체 목록 조회
- 알림 최신 목록 조회
- 알림 전체 읽기

## 와이어 프레임

[와이어프레임](https://miro.com/welcomeonboard/RWNMaVM5bUxnZzNuVnp3ZUkxMUk4QXVNekNiWlBMVWFsOERmbE9nS2tsS2VwTUtjSzV6ZFNkeUY3WGlxbW8wbnwzNDU4NzY0NTk0NDE2MzU4MjkwfDI=?share_link_id=473591469080)


## ERD

![mergeOverflowERD](https://github.com/user-attachments/assets/58bf3e47-252a-4003-a675-8a8d76bd0fe8)


## 기능 도식화

## 기술 스택

### Programming Languages & Frameworks

![alt text](https://ziadoua.github.io/m3-Markdown-Badges/badges/NodeJS/nodejs1.svg)
![alt text](https://ziadoua.github.io/m3-Markdown-Badges/badges/NestJS/nestjs1.svg)
![alt text](https://ziadoua.github.io/m3-Markdown-Badges/badges/TypeORM/typeorm1.svg)
![alt text](https://ziadoua.github.io/m3-Markdown-Badges/badges/TypeScript/typescript1.svg)
<img src="https://ziadoua.github.io/m3-Markdown-Badges/badges/Yarn/yarn1.svg"/>

### Editor & Tester

![alt text](https://ziadoua.github.io/m3-Markdown-Badges/badges/Git/git1.svg)
![alt text](https://ziadoua.github.io/m3-Markdown-Badges/badges/Github/github1.svg)
![alt text](https://ziadoua.github.io/m3-Markdown-Badges/badges/Jest/jest1.svg)
![alt text](https://ziadoua.github.io/m3-Markdown-Badges/badges/VisualStudioCode/visualstudiocode1.svg)
<img src="https://img.shields.io/badge/Insomnia-5849BE?style=flat-square&logo=insomnia&logoColor=white" width="120"/>

### Infrastructure / Add-On / Database

![alt text](https://ziadoua.github.io/m3-Markdown-Badges/badges/MySQL/mysql1.svg)
<img src="https://img.shields.io/badge/Amazon%20S3-232F3E?style=flat-square&logo=amazonaws&logoColor=white" width="110"/>
<img src="https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=redis&logoColor=white" width="87"/>
<img src="https://ziadoua.github.io/m3-Markdown-Badges/badges/SocketIO/socketio1.svg"/>
<img src="https://img.shields.io/badge/githubactions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white">


### Communication

![alt text](https://ziadoua.github.io/m3-Markdown-Badges/badges/Notion/notion1.svg)
<img src="https://img.shields.io/badge/Slack-4A154B?style=flat-square&logo=slack&logoColor=white" width="86"/>
<img src ="https://ziadoua.github.io/m3-Markdown-Badges/badges/Trello/trello1.svg" />


## 패키지 설치

```bash
$ yarn install
```

## 실행 방법

```bash
# 서버 실행(배포)
$ yarn run start

# 서버 실행(개발)
$ yarn run start:dev

```

## Test

```bash
# 테스트 실행
$ yarn run test

# 테스트 커버리지 확인
$ yarn run test:cov
```

# [웹서버] 쌍(2)남자 2조의 최종프로적트 <br> "MERGE OVERFLOW"

## 프로젝트 소개
- 서비스명 : MERGE OVERFLOW
- 프로젝트 소개 : 개발자를 위한 미팅 서비스 <br>
🧑‍💻서로의 코딩 취향을 듬뿍 담아 확인하는 소개팅, 협업자 찾기 서비스!! <br>
👨‍💻당신의 코딩으로 RESTful한 만남을 시작해보세요!!!!👩‍💻
- 서비스 기획 의도 : "사이드 프로젝트를 하고 싶은데 동료가 없어" <br>
"개발도 좋은데 나는 사랑을 찾아 낭만을 찾아 떠나고 싶어" <br>
"나는 백엔드만 할 줄 아는데 프론트엔드 사람은 어떻게 구하지?"
- 서비스 배포 URL : https://mergeoverflow.shop/
- 팀 노션 URL : https://teamsparta.notion.site/2-9e08c10b3c8843ceaec8e853230da15b
- GitHub URL : https://github.com/SaintSSong/SP-last-Project

## 팀원 구성

리더: 👊송사무엘<br>
부리더: ⚡여창준<br>
팀원: 🤳유승엽<br>
팀원: ☀️김노을<br>
팀원: 🎙️조영진

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

## 파일 구조 
```
📦 
├─ .env.example
├─ .eslintrc.js
├─ .gitignore
├─ .prettierrc
├─ .vscode
│  └─ settings.json
├─ README.md
├─ nest-cli.json
├─ package.json
├─ src
│  ├─ app.controller.spec.ts
│  ├─ app.controller.ts
│  ├─ app.module.ts
│  ├─ app.service.ts
│  ├─ auth
│  │  ├─ auth.controller.spec.ts
│  │  ├─ auth.controller.ts
│  │  ├─ auth.module.ts
│  │  ├─ auth.service.spec.ts
│  │  ├─ auth.service.ts
│  │  ├─ dto
│  │  │  ├─ create-auth.dto.ts
│  │  │  └─ update-auth.dto.ts
│  │  ├─ entities
│  │  │  └─ account.entity.ts
│  │  └─ types
│  │     └─ role.type.ts
│  ├─ chat-rooms
│  │  ├─ chat-rooms.controller.spec.ts
│  │  ├─ chat-rooms.controller.ts
│  │  ├─ chat-rooms.module.ts
│  │  ├─ chat-rooms.service.spec.ts
│  │  ├─ chat-rooms.service.ts
│  │  ├─ dto
│  │  │  ├─ create-chat-room.dto.ts
│  │  │  └─ update-chat-room.dto.ts
│  │  └─ entities
│  │     ├─ chat-message.entity.ts
│  │     └─ chat-room.entity.ts
│  ├─ configs
│  │  ├─ database.config.ts
│  │  ├─ mailer.config.ts
│  │  └─ validation.config.ts
│  ├─ main.ts
│  ├─ matchings
│  │  ├─ dto
│  │  │  ├─ create-matching.dto.ts
│  │  │  └─ update-matching.dto.ts
│  │  ├─ entities
│  │  │  ├─ heart.entity.ts
│  │  │  └─ matching.entity.ts
│  │  ├─ matchings.controller.spec.ts
│  │  ├─ matchings.controller.ts
│  │  ├─ matchings.module.ts
│  │  ├─ matchings.service.spec.ts
│  │  ├─ matchings.service.ts
│  │  └─ types
│  │     └─ interaction-type.type.ts
│  ├─ notifications
│  │  ├─ dto
│  │  │  ├─ create-notification.dto.ts
│  │  │  └─ update-notification.dto.ts
│  │  ├─ entities
│  │  │  └─ notification.entity.ts
│  │  ├─ notifications.controller.spec.ts
│  │  ├─ notifications.controller.ts
│  │  ├─ notifications.module.ts
│  │  ├─ notifications.service.spec.ts
│  │  ├─ notifications.service.ts
│  │  └─ types
│  │     └─ notification-type.type.ts
│  └─ users
│     ├─ dto
│     │  ├─ create-user.dto.ts
│     │  └─ update-user.dto.ts
│     ├─ entities
│     │  ├─ interest.entity.ts
│     │  ├─ profile-image.entity.ts
│     │  ├─ tech.entity.ts
│     │  ├─ user-to-interest.entity.ts
│     │  ├─ user-to-tech.entity.ts
│     │  └─ user.entity.ts
│     ├─ types
│     │  ├─ bodyshape.type.ts
│     │  ├─ frequency.type.ts
│     │  ├─ gender.type.ts
│     │  ├─ mbti.type.ts
│     │  ├─ pet.type.ts
│     │  ├─ region.type.ts
│     │  └─ religion.type.ts
│     ├─ users.controller.spec.ts
│     ├─ users.controller.ts
│     ├─ users.module.ts
│     ├─ users.service.spec.ts
│     └─ users.service.ts
├─ test
│  ├─ app.e2e-spec.ts
│  └─ jest-e2e.json
├─ tsconfig.build.json
├─ tsconfig.json
└─ yarn.lock
```
©generated by [Project Tree Generator](https://woochanleee.github.io/project-tree-generator)

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

## 주요 기능
- **1. 인증**
- 1-1 인증문자발송 , 발송문자인증 
https://github.com/SaintSSong/SP-last-Project/blob/9f5ebad42df2c2a1437e5183008ec823d1c764f1/src/auth/auth.service.ts#L66-L87
![사이즈축소](https://github.com/user-attachments/assets/ce76d90f-2de6-4dd1-9350-43eb8dfe4390)
- 1-2 회원가입
https://github.com/SaintSSong/SP-last-Project/blob/9f5ebad42df2c2a1437e5183008ec823d1c764f1/src/auth/auth.service.ts#L89-L201
![회원가입2](https://github.com/user-attachments/assets/e9d53635-66d0-4cf8-9962-5d3ba55ce4f7)
- 1-2-1 소셜회원가입
https://github.com/SaintSSong/SP-last-Project/blob/9f5ebad42df2c2a1437e5183008ec823d1c764f1/src/auth/auth.service.ts#L281-L352
![구글로그인](https://github.com/user-attachments/assets/5ad24f06-a2bf-4fbd-a385-32a2f9f1efa0)
- 1-3 로그인
https://github.com/SaintSSong/SP-last-Project/blob/9f5ebad42df2c2a1437e5183008ec823d1c764f1/src/auth/auth.service.ts#L203-L279
![회원가입로그인1](https://github.com/user-attachments/assets/12eb6461-063e-4058-8e77-a2d6ce429dea)
- **2. 유저**
- 1-1 인증문자발송 , 발송문자인증
- 1-1 인증문자발송 , 발송문자인증
- 1-1 인증문자발송 , 발송문자인증
- 1-1 인증문자발송 , 발송문자인증 
- **3. 매칭**
- **4. 알림**
- **5. 채팅룸**
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

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


## 와이어 프레임
![와이어프레임](https://github.com/user-attachments/assets/1aed0bc8-47a9-44bd-9a56-a1bbe65c143d)
[와이어프레임URL](https://miro.com/welcomeonboard/RWNMaVM5bUxnZzNuVnp3ZUkxMUk4QXVNekNiWlBMVWFsOERmbE9nS2tsS2VwTUtjSzV6ZFNkeUY3WGlxbW8wbnwzNDU4NzY0NTk0NDE2MzU4MjkwfDI=?share_link_id=473591469080)


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

### Auth (인증)

- 인증문자발송 , 발송문자인증
- 회원가입
- 소셜회원가입
- 로그인
  
<details>
<summary>상세보기</summary>
  
- 인증문자발송 , 발송문자인증
https://github.com/SaintSSong/SP-last-Project/blob/fd7ca832d36800dfbf82ae083f8f711cc1d0e604/src/sms/sms.service.ts#L42-L69
![사이즈축소](https://github.com/user-attachments/assets/6501621e-1a30-43db-bb15-2ab3e0fbe06a)
  
- 회원가입
https://github.com/SaintSSong/SP-last-Project/blob/9f5ebad42df2c2a1437e5183008ec823d1c764f1/src/auth/auth.service.ts#L89-L201
![회원가입2](https://github.com/user-attachments/assets/e9d53635-66d0-4cf8-9962-5d3ba55ce4f7)

- 소셜회원가입
https://github.com/SaintSSong/SP-last-Project/blob/9f5ebad42df2c2a1437e5183008ec823d1c764f1/src/auth/auth.service.ts#L281-L352
![구글로그인](https://github.com/user-attachments/assets/5ad24f06-a2bf-4fbd-a385-32a2f9f1efa0)

- 로그인
https://github.com/SaintSSong/SP-last-Project/blob/9f5ebad42df2c2a1437e5183008ec823d1c764f1/src/auth/auth.service.ts#L203-L279
![회원가입로그인1](https://github.com/user-attachments/assets/12eb6461-063e-4058-8e77-a2d6ce429dea)

</details>

### User (유저)

- 내 정보 조회
- 프로필 수정
- 비밀번호 수정

<details>
  
<summary>상세보기</summary>
  
- 내 정보 조회
https://github.com/SaintSSong/SP-last-Project/blob/fd7ca832d36800dfbf82ae083f8f711cc1d0e604/src/users/user.service.ts#L36-L57
![유저화면1](https://github.com/user-attachments/assets/9d1b2eb1-3f83-48a3-8bcf-508523f548f0)

- 프로필 수정
https://github.com/SaintSSong/SP-last-Project/blob/fd7ca832d36800dfbf82ae083f8f711cc1d0e604/src/users/user.service.ts#L65-L75
![프로필수정](https://github.com/user-attachments/assets/1050a02d-1182-40bd-8736-9817db0ba8fb)

- 비밀번호 수정
https://github.com/SaintSSong/SP-last-Project/blob/fd7ca832d36800dfbf82ae083f8f711cc1d0e604/src/users/user.service.ts#L83-L95
![비밀번호수정](https://github.com/user-attachments/assets/81e2f401-0ac1-49a7-ada5-33fac0f76ae2)

</details>

### tech (유저 기술스택)
- 기술스택 등록/ 조회 / 수정 / 삭제

<details>
<summary>상세보기</summary>
  
- 기술스택 등록/ 조회 / 수정 / 삭제
https://github.com/SaintSSong/SP-last-Project/blob/fd7ca832d36800dfbf82ae083f8f711cc1d0e604/src/techs/tech.service.ts#L20-L108
![기술스택설정](https://github.com/user-attachments/assets/2917db19-a0ab-45f2-96b3-1d7352c05336)

</details>

### Interest (유저 관심사)
- 관심사 등록/ 조회 / 수정 / 삭제

<details>
<summary>상세보기</summary>
  
- 관심사 등록/ 조회 / 수정 / 삭제
https://github.com/SaintSSong/SP-last-Project/blob/fd7ca832d36800dfbf82ae083f8f711cc1d0e604/src/interests/interest.service.ts#L20-L108
![관심사설정](https://github.com/user-attachments/assets/1ac73a89-1fe7-4cdb-be14-7fd20e9025d4)

</details>

### Image (프로필 이미지)
- S3 서버에 이미지 추가
- 프로필 이미지 추가
- 프로필 이미지 수정
- 프로필 이미지 삭제
<details>
<summary>상세보기</summary>
  
- S3 서버 이미지 업로드,저장,삭제
https://github.com/SaintSSong/SP-last-Project/blob/759f53914a495e9491a828866098281f2f7fbbc5/src/s3/s3.service.ts#L27-L54
https://github.com/SaintSSong/SP-last-Project/blob/759f53914a495e9491a828866098281f2f7fbbc5/src/images/image.service.ts#L18-L93
![이미지](https://github.com/user-attachments/assets/c55070d0-e5c6-41a6-b354-e3b7e3cf0b1e)

</details>

### Matching (매칭)
- 매칭 선호도 필터링
- 매칭 상호작용(싫어요/좋아요)
<details>
  
<summary>상세보기</summary>

- 매칭 선호도 필터링 성별/나이/키/체형/흡연/음주/거리/기술
https://github.com/SaintSSong/SP-last-Project/blob/aacb6a3357c6474e3f36592327061573333fc3ab/src/matchings/matching.service.ts#L54-L237
![매칭선호도설정](https://github.com/user-attachments/assets/96cb74db-da5f-4861-aced-da2b81357de1)

- 매칭 상호작용(싫어요/좋아요)
https://github.com/SaintSSong/SP-last-Project/blob/aacb6a3357c6474e3f36592327061573333fc3ab/src/matchings/matching.service.ts#L324-L348
![메인](https://github.com/user-attachments/assets/8016e819-5bf0-48f3-bca1-bb3bc7aaa3c2)

</details> 

### Location (거리)
- 위치정보 업데이트
<details>
<summary>상세보기</summary>
  
- 위치정보 업데이트 , 서버에 전송 
https://github.com/SaintSSong/SP-last-Project/blob/aacb6a3357c6474e3f36592327061573333fc3ab/src/locations/location.service.ts#L19-L60
https://github.com/SaintSSong/SP-last-Project/blob/aacb6a3357c6474e3f36592327061573333fc3ab/static/location.html#L9-L39
![유저서비스2](https://github.com/user-attachments/assets/75e1dbed-c140-453b-b54c-c22ba176be36)

</details> 

### Heart (하트)
- 하트 초기화
<details>
  
<summary>상세보기</summary>

- 하트 초기화 (시간별 초기화, 수동 초기화) 
https://github.com/SaintSSong/SP-last-Project/blob/aacb6a3357c6474e3f36592327061573333fc3ab/src/hearts/heart.service.ts#L17-L27
![하트테이블](https://github.com/user-attachments/assets/7d31100b-2b71-4e19-b45d-8df974ab811b)
</details> 

### Notification (알람)
- 소켓 연결
- 알림 전체 목록 조회
- 알림 최신 목록 조회
- 알림 전체 읽기
- 이벤트 알람 전송 
<details>
  
<summary>상세보기</summary>

- 소켓 연결 (서버측, 클라이언트측)
https://github.com/SaintSSong/SP-last-Project/blob/042c281539ad2b0d56154bbe723229f96dde597c/src/notifications/notification.gateway.ts#L17-L42
https://github.com/SaintSSong/SP-last-Project/blob/042c281539ad2b0d56154bbe723229f96dde597c/static/index1.html#L47-L51
  
- 알림 전체 목록 조회
https://github.com/SaintSSong/SP-last-Project/blob/042c281539ad2b0d56154bbe723229f96dde597c/src/notifications/notification.service.ts#L15-L18
![알림1](https://github.com/user-attachments/assets/5f257dd5-5a5e-4d6d-984d-b42158518e7d)

- 알림 최신 목록 조회
https://github.com/SaintSSong/SP-last-Project/blob/042c281539ad2b0d56154bbe723229f96dde597c/src/notifications/notification.service.ts#L20-L27

- 알림 전체 읽기
https://github.com/SaintSSong/SP-last-Project/blob/042c281539ad2b0d56154bbe723229f96dde597c/src/notifications/notification.service.ts#L29-L32
![전체알림읽기](https://github.com/user-attachments/assets/61db05fe-9c8b-4a20-acb3-5e4a74a60909)

- 이벤트 알람 전송 (좋아요 시, merge 시, 채팅룸 퇴장 시)
https://github.com/SaintSSong/SP-last-Project/blob/042c281539ad2b0d56154bbe723229f96dde597c/src/notifications/notification.gateway.ts#L53-L62
https://github.com/SaintSSong/SP-last-Project/blob/042c281539ad2b0d56154bbe723229f96dde597c/src/notifications/notification.gateway.ts#L44-L51
https://github.com/SaintSSong/SP-last-Project/blob/042c281539ad2b0d56154bbe723229f96dde597c/src/notifications/notification.gateway.ts#L64-L72
![머지알람](https://github.com/user-attachments/assets/93d590bb-e466-4e86-93cf-1969265e9bee)

</details> 

### ChatRooms (채팅)
- 소켓 연결
- 채팅방 목록 조회
- 채팅방 입장
- 채팅방 삭제 (나가기)
- 채팅 보내기
<details>
  
<summary>상세보기</summary>

- 소켓 연결 (서버측, 클라이언트측)
https://github.com/SaintSSong/SP-last-Project/blob/042c281539ad2b0d56154bbe723229f96dde597c/src/chat-rooms/chat-room.gateway.ts#L18-L40
https://github.com/SaintSSong/SP-last-Project/blob/042c281539ad2b0d56154bbe723229f96dde597c/static/index1.html#L41-L45

- 채팅방 목록 조회
https://github.com/SaintSSong/SP-last-Project/blob/042c281539ad2b0d56154bbe723229f96dde597c/src/chat-rooms/chat-room.service.ts#L127-L180
![채팅방목록](https://github.com/user-attachments/assets/570fc271-ab28-49dc-a02c-caeab4a0dc49)

- 채팅방 입장
https://github.com/SaintSSong/SP-last-Project/blob/042c281539ad2b0d56154bbe723229f96dde597c/src/chat-rooms/chat-room.gateway.ts#L42-L55

- 채팅방 삭제 (나가기)
https://github.com/SaintSSong/SP-last-Project/blob/042c281539ad2b0d56154bbe723229f96dde597c/src/chat-rooms/chat-room.service.ts#L37-L70
![채팅방나가기](https://github.com/user-attachments/assets/b2772dd6-2355-43e6-bc34-2f45c7ccebc6)

- 채팅 보내기
https://github.com/SaintSSong/SP-last-Project/blob/042c281539ad2b0d56154bbe723229f96dde597c/src/chat-rooms/chat-room.gateway.ts#L71-L82
![실시간 채팅 기능 대화창 ](https://github.com/user-attachments/assets/575671f7-124b-4e04-b848-7bacb4bd96cd)

</details> 

## 패키지 설치

<details>
<summary>상세보기</summary>

```bash
$ git clone https://github.com/SaintSSong/SP-last-Project.git
$ yarn install
```
</details>


## 실행 방법

<details>
<summary>상세보기</summary>

```bash
# 서버 실행(배포)
$ yarn run start

# 서버 실행(개발)
$ yarn run start:dev

```
</details>

---
![asdasdasdasdasdasd](https://github.com/user-attachments/assets/a9793d26-a837-4c95-b70c-a3cd3275d770)
---

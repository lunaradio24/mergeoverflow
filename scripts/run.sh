#!/bin/bash

# node, npm, yarn 명령어 사용을 위한 설정 (.bashrc 파일에 추가되어 있는 내용)
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

# yarn global 설치 한 pm2 명령을 위한 설정 (npm 사용 시 불필요)
export PATH="$(yarn global bin):$PATH"

# PM2로 실행 중인 서버 중지 및 삭제 
pm2 delete SP-last-Project

# 서버를 PM2로 실행
pm2 --name SP-last-Project start dist/src/main.js

# PM2 설정 저장 (선택사항, startup 설정을 해놨다면)
pm2 save
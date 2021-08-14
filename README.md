# Rondo

听歌，聊天，摸鱼

暂时移除了 lint 检查

```json
  "lint-staged": {
    "*.{js,ts,tsx}": "eslint --cache --fix",
    "*.css": "stylelint --fix",
    "*.{html,js,ts,tsx,css,md,json}": "prettier --write"
  },
```

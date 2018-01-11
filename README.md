# disney-etl

## 迪士尼数据清洗和Api

### 乐园信息获取

乐园开放时间查询
```
GET /info 
{
  method: opentime
  st: 20180101
}

GET /info 
{
  method: opentime/search
  st: 20180101
  et: 20180105
}
```

项目等待时间查询
```
GET /info 
{
  method: att
  indicators: attAdventuresWinniePooh // 项目名称
  st: 20180101
}


GET /info 
{
  method: att/search
  indicators: attAdventuresWinniePooh // 项目名称
  st: 20180101
  et: 20180105
}
```

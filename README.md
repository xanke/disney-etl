# Disney-ETL

Disney数据清洗和Api服务

### 乐园信息处理

```shell
node start

-f 方法
-d 日期
-l 位置

```

### 乐园信息获取
GET /info

#### 乐园开放时间查询

**单天查询**
```json
{
  method: opentime
  st: 20180101
}
```

**多天查询**
```json
{
  method: opentime/search
  st: 20180101
  et: 20180105
}
```


### 项目等待时间查询
GET /wait 

**单个项目单天获取**
```
{
  method: att/smaill
  indicators: attAdventuresWinniePooh // 项目名称
  st: 20180101
}
```

**单个项目多天获取**
```
{
  method: att/search
  indicators: attAdventuresWinniePooh // 项目名称
  st: 20180101
  et: 20180105
}
```

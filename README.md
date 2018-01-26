# Disney-ETL

Disney数据清洗和Api服务

### 乐园信息处理

```shell
# node start

# -m 模式
# -l 地区，不填则处理所有
# -s 开始时间
# -e 结束时间

#实时信息处理，实时预测
-m 'realtime' -l 'shanghai'

#每日信息处理，日预测，日统计，乐园整体统计
-m 'day' -l 'shanghai'

#信息维护/重置数据/预测数据
-m 'etl' -l 'shanghai' -s '20170101' -e '20171231'

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

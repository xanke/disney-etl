# Disney-ETL

Disney 数据清洗服务，用于从迪士尼实时排队信息统计乐园整体情况

### 乐园信息处理

```shell
node

-f #方法
-d #日期/日期范围 (YYYY-DD-MM/YYYY-DD-MM,YYYY-DD-MM)
-l #位置 (shanghai)
-o #方法 (仅wait-times方法有效，push / update：push插入数据，update覆盖)
```

```cron
# Disney-Etl

*/2 * * * * sudo node /data/node/disney-etl -f wait-times -l shanghai -o push
*/5 * * * * sudo node /data/node/disney-etl -f wait-count -l shanghai
*/10 * * * * sudo node /data/node/disney-etl -f park-count -l shanghai

0 */2 * * * sudo node /data/node/disney-etl -f attractions -l shanghai
0 */2 * * * sudo node /data/node/disney-etl -f destinations -l shanghai
```

### 数据下载
现分享自2017年4月起至2018年2月上海迪士尼乐园实时排队数据，欢迎大家学习交流。

**请联系WeChat xank88 获取**

### 数据表名称

|名称|说明|
|----|-----------|
|ds_park|清洗后的乐园整体信息|
|ds_attractions|清洗后的游乐项目信息|
|scan_destinations|乐园信息字典|
|scan_schedules|乐园开放时间表|
|scan_calendars|乐园演出信息|
|scan_waits|原始游乐项目等待时间信息|

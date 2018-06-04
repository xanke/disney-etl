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

### 数据表名称

|名称|说明|
|----|-----------|
|ds_park|清洗后的乐园整体信息|
|ds_attractions|清洗后的游乐项目信息|
|scan_destinations|乐园信息字典|
|scan_schedules|乐园开放时间表|
|scan_calendars|乐园演出信息|
|scan_waits|原始游乐项目等待时间信息|


### 完成进度

- [x] 上海迪士尼乐园
- [x] 香港迪士尼乐园
- [ ] 巴黎迪士尼乐园
- [ ] 加州迪士尼乐园
- [ ] 奥兰多迪士尼乐园
- [ ] 东京迪士尼乐园

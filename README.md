# Disney-ETL

Disney 数据清洗服务

### 乐园信息处理

```shell
node

-f 方法
-d 日期
-l 位置
```

```cron
#Disney-Etl

*/2 * * * * sudo node /data/node/disney-etl -f wait-times -l shanghai -o push
*/5 * * * * sudo node /data/node/disney-etl -f wait-count -l shanghai
*/10 * * * * sudo node /data/node/disney-etl -f park-count -l shanghai

0 */2 * * * sudo node /data/node/disney-etl -f attractions -l shanghai
```

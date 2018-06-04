docker stop disney-etl \
; docker rm disney-etl \
; cd /data/jenkins/workspace/disney-etl \
&& docker build -t disney-etl . \
&& docker run -d --name disney-etl \
--mount type=bind,source=/data/config/disney-etl,target=/app/config \
disney-etl node index -f all

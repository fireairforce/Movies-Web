#!/bin/sh
echo "开始检测mongod是否启动..."
echo 
echo 

pgrep mongo -l
if [ $? -eq 1 ];then
 echo "mongod 启动中..."
 sudo service mongod start
fi